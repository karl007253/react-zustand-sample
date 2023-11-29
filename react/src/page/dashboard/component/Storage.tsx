import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import useStore from "../../../common/zustand/Store";
import useToast from "../../../common/hooks/Toast";

import CardStorage from "./CardStorage";
import { byteToMB } from "../../../common/helper/Memory";

const Storage = () => {
    const toastMessage = useToast(true);
    const { t } = useTranslation();

    // Get the query string
    const segments = useParams();

    // Get necessary data from state
    const { getStorageInfoByApplicationCode, storageInfo } = useStore(
        (state) => ({
            getStorageInfoByApplicationCode:
                state.getStorageInfoByApplicationCode,
            storageInfo: state.storageInfo,
        })
    );

    // Display "There is a problem fetching Storage" error message in toast
    const showStorageErrorMessage = () => {
        toastMessage(
            t("common.error.application.storage.error"),
            toast.TYPE.ERROR
        );
    };

    useEffect(() => {
        // Get the application_code / app
        const appCode = segments.appid;

        // If app code is provided, fetch the storage info
        if (appCode) {
            getStorageInfoByApplicationCode(appCode).catch(() => {
                showStorageErrorMessage();
            });
        }
    }, []);

    // Initial used storage and remaining storage
    let maxStorage: number | undefined;
    let usedStorage: number | undefined;
    let remainingStorage: number | undefined;

    // If storage info is available, calculate the used storage and remaining storage
    if (storageInfo && storageInfo.memory) {
        // get storage data and convert into MB
        maxStorage = byteToMB(storageInfo.memory.max);
        usedStorage = byteToMB(storageInfo.memory.used);
        remainingStorage = byteToMB(storageInfo.memory.free);
    }

    return (
        <>
            <Row>
                <Col
                    md={12}
                    className="dashboard-card-title text-uppercase text-xxxl mb-2"
                >
                    <h4>{t("dashboard.title.storage")}</h4>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col lg={4}>
                    <CardStorage
                        title="dashboard.storage.current"
                        memory={maxStorage}
                    />
                </Col>
                <Col lg={4}>
                    <CardStorage
                        title="dashboard.storage.used"
                        memory={usedStorage}
                    />
                </Col>
                <Col lg={4}>
                    <CardStorage
                        title="dashboard.storage.remaining"
                        memory={remainingStorage}
                    />
                </Col>
            </Row>
        </>
    );
};

export default Storage;
