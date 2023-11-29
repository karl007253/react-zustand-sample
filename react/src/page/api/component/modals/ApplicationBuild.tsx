import { capitalize, lowerCase } from "lodash";
import { useState } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import useToast from "../../../../common/hooks/Toast";
import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";

import {
    ApplicationBuildMode,
    ApplicationVersionType,
} from "../../../../common/zustand/interface/ApplicationInterface";
import useStore from "../../../../common/zustand/Store";

interface ApiModuleDeleteProps {
    show: boolean;
    handleClose: () => void;
}

/**
 * TODO: Temporary Log History
 */
const LogHistory = ({ data }: { data: string[] }) => {
    return (
        <div>
            <div className="text-spanish-gray py-30">Log History</div>
            <div
                style={{
                    minHeight: 190,
                    backgroundColor: "#535353",
                    borderRadius: 10,
                    padding: 15,
                    display: "flex",
                    flexDirection: "column",
                    color: "white",
                }}
            >
                {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data.map((log: any, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={idx} className="row">
                            <span className="col-md-5">{log.logDateTime}</span>
                            <span className="col-md-7">{log.msg}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

const ApplicationBuild = ({ show, handleClose }: ApiModuleDeleteProps) => {
    const { t } = useTranslation();

    const { appid } = useParams();

    const toastMessage = useToast(true);

    const [building, setBuilding] = useState<boolean>(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [buildMode, setBuildMode] = useState<string>("");
    const [versionType, setVersionType] = useState<string>("");

    const { buildApplication, getApplicationLog } = useStore((state) => ({
        buildApplication: state.buildApplication,
        getApplicationLog: state.getApplicationLog,
    }));

    const onCloseModal = () => {
        // close the modal
        handleClose();

        // reset the state
        setLogs([]);
    };

    // TODO: Temporary fetch logging, please update once ready
    const getLogHistory = async () => {
        if (appid) {
            const res = await getApplicationLog(appid || "");

            if (res.success) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const useData: any = res.data;

                // Parse the log history
                const logHistory = useData.records.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (record: any, index: number) => {
                        const logDateTime = new Date(record.created_at)
                            .toLocaleString("sv-SE", {
                                timeZone: "Asia/Singapore",
                            })
                            .replace(/,/g, "")
                            .replace(/\//g, "-");

                        let message = "";

                        try {
                            const status = JSON.parse(record.new_values);
                            if (status.build_status === "failed") {
                                if (
                                    typeof useData.records[index - 1] !==
                                    "undefined"
                                ) {
                                    if (
                                        useData.records[index - 1].event ===
                                        "compile"
                                    ) {
                                        message =
                                            "Failed in compiling the application.";
                                    } else {
                                        message =
                                            "Failed in building the application.";
                                    }
                                } else {
                                    message = "failed";
                                }
                            } else {
                                message = "Build Complete.";
                            }
                        } catch (e) {
                            message = record.new_values;
                        }

                        return {
                            logDateTime,
                            msg: message,
                        };
                    }
                );

                // merge the log history
                setLogs([...logs, ...logHistory]);
            }
        }

        return true;
    };

    const handleBuild = () => {
        if (!buildMode) {
            // show error message for empty build mode
            toastMessage(
                t(`api.dashboard.modal.build.form.message.error.mode`),
                toast.TYPE.ERROR
            );
        } else if (!versionType && buildMode === ApplicationBuildMode.RELEASE) {
            // show error message for empty build version while the mode is release
            toastMessage(
                t(`api.dashboard.modal.build.form.message.error.version`),
                toast.TYPE.ERROR
            );
        } else {
            // show start message
            toastMessage(
                t(`api.dashboard.modal.build.form.message.start`),
                toast.TYPE.SUCCESS
            );

            // Set the building state
            setBuilding(true);

            // Prepare the build complete state
            let buildComplete = false;

            // Build the application
            buildApplication(
                appid || "",
                buildMode as ApplicationBuildMode,
                versionType
            )
                .then(() => {
                    // Set the build complete state
                    buildComplete = true;

                    // Fetch the log history once the build is done
                    getLogHistory();
                })
                .catch(() => {
                    toastMessage(
                        t(`api.dashboard.modal.build.form.message.error.build`),
                        toast.TYPE.ERROR
                    );
                })
                .finally(() => {
                    setBuilding(false);

                    if (buildComplete) {
                        toastMessage(
                            t(
                                `api.dashboard.modal.build.form.message.building`
                            ),
                            toast.TYPE.SUCCESS
                        );
                    }
                });
        }
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("api.dashboard.modal.build.title")}
            handleClose={onCloseModal}
        >
            <div>
                <Container>
                    <Row
                        className={`align-items-center pb-20 ${
                            buildMode === ApplicationBuildMode.RELEASE
                                ? ""
                                : "border-bottom"
                        }`}
                    >
                        <Col xs={12} sm={3}>
                            <Form.Label
                                htmlFor="build-mode"
                                className="text-rg m-0 text-philippine-gray"
                            >
                                {t("api.dashboard.modal.build.form.label.mode")}
                            </Form.Label>
                        </Col>
                        <Col xs={12} sm={9}>
                            <Form.Select
                                className="text-rg"
                                onChange={(val) => {
                                    // revert version type when the selected option is not release
                                    if (
                                        val.target.value ===
                                            ApplicationBuildMode.DEBUG ||
                                        val.target.value ===
                                            ApplicationBuildMode.DEVELOPMENT
                                    ) {
                                        setVersionType("");
                                    }
                                    setBuildMode(
                                        val.target.value as ApplicationBuildMode
                                    );
                                }}
                                aria-label="build-mode"
                                value={buildMode}
                            >
                                <option value="" hidden>
                                    {t(
                                        "api.dashboard.modal.build.form.placeholder.mode"
                                    )}
                                </option>

                                {Object.keys(ApplicationBuildMode).map(
                                    (mode) => (
                                        <option
                                            key={mode}
                                            value={lowerCase(mode)}
                                        >
                                            {capitalize(mode)}
                                        </option>
                                    )
                                )}
                            </Form.Select>
                        </Col>
                    </Row>
                    {buildMode === ApplicationBuildMode.RELEASE && (
                        <>
                            <Row className="align-items-center">
                                <Col xs={12} sm={3}>
                                    <Form.Label
                                        htmlFor="build-version"
                                        className="text-rg m-0 text-philippine-gray"
                                    >
                                        {t(
                                            "api.dashboard.modal.build.form.label.version"
                                        )}
                                    </Form.Label>
                                </Col>
                                <Col xs={12} sm={9}>
                                    <Form.Select
                                        className="text-rg"
                                        onChange={(val) =>
                                            setVersionType(val.target.value)
                                        }
                                        aria-label="build-version"
                                        value={versionType}
                                    >
                                        <option value="" hidden>
                                            {t(
                                                "api.dashboard.modal.build.form.placeholder.mode"
                                            )}
                                        </option>
                                        {Object.keys(
                                            ApplicationVersionType
                                        ).map((type) => (
                                            <option
                                                key={type}
                                                value={lowerCase(type)}
                                            >
                                                {capitalize(type)}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>

                            <Row className="align-items-center border-bottom pb-20">
                                <Col xs={12} sm={3} />
                                <Col xs={12} sm={9}>
                                    <Row className="text-spanish-gray text-sm pt-16">
                                        {t("header.text.versionExample")}
                                    </Row>
                                    <Row className="text-spanish-gray text-sm pt-10">
                                        {t("header.text.buildVersionDesc")}
                                    </Row>
                                </Col>
                            </Row>
                        </>
                    )}
                    <Row className="align-items-center border-bottom py-30">
                        <Col xs={12} className="text-end px-2">
                            <Button
                                className="text-rg px-4 py-2 rounded-3-px mx-3"
                                variant={ButtonVariant.OUTLINE_EMOBIQ_BRAND}
                                onClick={onCloseModal}
                            >
                                {t("common.button.close")}
                            </Button>
                            <Button
                                className="text-rg px-4 py-2 rounded-3-px"
                                variant={ButtonVariant.EMOBIQ_BRAND}
                                onClick={handleBuild}
                                disabled={building}
                            >
                                {t(
                                    `api.dashboard.modal.build.form.button.${
                                        building ? "build" : "start"
                                    }`
                                )}
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <LogHistory data={logs} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </EmobiqModal>
    );
};

export default ApplicationBuild;
