import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SyntheticEvent, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { ButtonVariant } from "../../../common/component/helper/EmobiqModal";

import TabMenu, { TabItem } from "../../../common/component/TabMenu";
import useStore from "../../../common/zustand/Store";
import useToast from "../../../common/hooks/Toast";

import { socketInstance } from "../../../common/helper/Socket";
import { HttpResponse } from "../../../common/helper/HttpRequest";
import { getCookies } from "../../../common/helper/Cookies";
import { API_TOKEN } from "../../../common/data/Constant";
import TestLogList from "../../../common/component/TestLogList";

const SchedulerTest = () => {
    const { appid } = useParams();

    const { t } = useTranslation();

    // Prepare toast hook
    const toastMessage = useToast(true);

    const {
        selectedSchedulerUuid,
        currentSchedulerSocketChannelName,
        updateSchedulerSocketChannelName,
        runSchedulerTest,
    } = useStore((state) => ({
        selectedSchedulerUuid: state.selectedSchedulerUuid,
        currentSchedulerSocketChannelName:
            state.currentSchedulerSocketChannelName,
        updateSchedulerSocketChannelName:
            state.updateSchedulerSocketChannelName,
        runSchedulerTest: state.runSchedulerTest,
    }));

    const [testPrimaryActiveTab, setTestPrimaryActiveTab] = useState("");
    const [testLogData, setTestLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleRunTest = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (!selectedSchedulerUuid) {
            return;
        }

        // set loading
        setLoading(true);

        const existingSocketChannelName =
            currentSchedulerSocketChannelName[selectedSchedulerUuid];

        // Close previously-opened socket
        if (existingSocketChannelName) {
            socketInstance.close(existingSocketChannelName);
        }

        // reset output log for this tab
        let logs: string[];
        setTestLogs((logs = []));

        // Get the token from cookie
        const token = getCookies(API_TOKEN);

        // start connecting and listening to socket
        const { channelName } = socketInstance.listen({
            onReceive: (message) => {
                setTestLogs((logs = [...logs, message]));
            },
            protocols: token,
        });

        // Store current socket channel name (so that we can close it later)
        updateSchedulerSocketChannelName(selectedSchedulerUuid, channelName);

        // call api test. this api will also feed the socket channel name for broadcast
        runSchedulerTest(channelName, appid)
            .then((res) => {
                const { message } = res.data;

                toastMessage(message, toast.TYPE.SUCCESS);
            })
            .catch((error: Error) => {
                let errorMessage: string | undefined;
                let errorDetail: string | undefined;

                if (error instanceof AxiosError<HttpResponse<string>>) {
                    // Error comes from API.
                    // Error message will likely be inside "data"
                    const { message, data } =
                        (error as AxiosError<HttpResponse<string>>).response
                            ?.data ?? {};
                    errorMessage = message;
                    errorDetail = data;
                } else {
                    // Error caused by other internal errors
                    // Use a generic JavaScript error message
                    errorDetail = error.message;
                }
                // Something goes wrong, add error message to Log tab.
                // There might be a condition where socket will still output messages even if the testing is already finished with error.
                // Thus, let socket finish updating itself first for a while.
                if (errorDetail) {
                    setTimeout(() => {
                        setTestLogs((logs = [...logs, errorDetail ?? ""]));
                    }, 500);
                }
                toastMessage(
                    errorMessage ?? t(`scheduler.dashboard.test.run.error`),
                    toast.TYPE.ERROR
                );
            })
            .finally(() => {
                // set loading
                setLoading(false);
            });
    };

    // Prepare primary tabs list
    const testPrimaryTabs: TabItem[] = [
        {
            title: "scheduler.dashboard.menu.tabs.primary.log",
            component: <TestLogList logs={testLogData} />,
        },
    ];

    return (
        <>
            {/* will check if the action or scheduler has changed but the user haven't saved the project yet */}
            <>
                <Row>
                    <Col
                        xs={12}
                        sm={12}
                        className="d-flex align-items-center text-philippine-gray"
                    >
                        <Button
                            variant={ButtonVariant.OUTLINE_LIGHT_EMOBIQ_BRAND}
                            className="text-sm"
                            onClick={handleRunTest}
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faPlay} />
                            <span className="ms-2 d-none d-sm-inline">
                                {t("scheduler.dashboard.menu.tabs.button.run")}
                            </span>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col
                        xs={12}
                        sm={12}
                        className="align-items-center pt-2 h-400"
                    >
                        <TabMenu
                            scrollable
                            primary={{
                                tabs: testPrimaryTabs,
                                activeTab: testPrimaryActiveTab,
                                onTabChange: setTestPrimaryActiveTab,
                                className: "test-menu",
                            }}
                        />
                    </Col>
                </Row>
            </>
        </>
    );
};

export default SchedulerTest;
