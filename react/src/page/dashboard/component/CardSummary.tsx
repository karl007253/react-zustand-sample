import { useTranslation } from "react-i18next";
import { Stack } from "react-bootstrap";

import { Link } from "react-router-dom";
import imgApi from "../../../common/assets/images/icons/api.svg";
import imgApiActive from "../../../common/assets/images/icons/api-active.svg";
import imgDb from "../../../common/assets/images/icons/database.svg";
import imgDbActive from "../../../common/assets/images/icons/database-active.svg";
import imgScheduler from "../../../common/assets/images/icons/scheduler.svg";
import imgSchedulerActive from "../../../common/assets/images/icons/scheduler-active.svg";
import { Api } from "../../../common/zustand/interface/ApiInterface";
import { Database } from "../../../common/zustand/interface/DatabaseInterface";
import { Scheduler } from "../../../common/zustand/interface/SchedulerInterface";

type CardSummaryProps = {
    title: string;
    img: string;
    url: string;
    dataArray: Api[] | Database[] | Scheduler[];
};

const icons: { [key: string]: string[] } = {
    api: [imgApi, imgApiActive],
    database: [imgDb, imgDbActive],
    scheduler: [imgScheduler, imgSchedulerActive],
};

const CardSummary = ({ title, img, url, dataArray }: CardSummaryProps) => {
    const { t } = useTranslation();

    // get the latest updated module
    const result = dataArray.sort(
        (a, b) =>
            new Date(b.updated_at ?? "").getTime() -
            new Date(a.updated_at ?? "").getTime()
    )[0];

    return (
        <Link to={url}>
            <Stack direction="horizontal" className="summary text-sm py-2">
                <div className="image">
                    <img src={icons[img][0]} alt={t(title)} />
                    <img src={icons[img][1]} alt={t(title)} />
                </div>
                <div>
                    <h4 className="text-uppercase text-xxl title">
                        {t(title)}
                    </h4>
                    <div data-testid={`data-open-recent-${title}`}>
                        {t("dashboard.summary.openRecent")}{" "}
                        <span>{result && result.name ? result.name : ""}</span>
                    </div>
                </div>
                <div className="ms-auto p-2">
                    <div className="total text-center lh-1 w-auto">
                        <div
                            className="value p-2"
                            data-testid={`data-length-${title}`}
                        >
                            {dataArray.length}
                        </div>
                        <span>{t("dashboard.summary.total")}</span>
                    </div>
                </div>
            </Stack>
        </Link>
    );
};

export default CardSummary;
