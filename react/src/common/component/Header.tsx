import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import logo from "../assets/images/emobiq.png";
import useStore from "../zustand/Store";
import useToast from "../hooks/Toast";
import ApplicationBuild from "../../page/api/component/modals/ApplicationBuild";
import ApplicationDownload from "../../page/api/component/modals/ApplicationDownload";

const Header = () => {
    const toastMessage = useToast(true);
    const { t } = useTranslation();

    const [buildModalVisible, setBuildVisibility] = useState<boolean>(false);
    const [downloadModalVisible, setDownloadVisibility] =
        useState<boolean>(false);

    const baseUrl = process.env.REACT_APP_MAIN_FRONTEND_URL
        ? process.env.REACT_APP_MAIN_FRONTEND_URL
        : "/";
    // Get the query string
    const segments = useParams();
    const {
        appData,
        patchApplication,
        built,
        getStorageInfoByApplicationCode,
        cleanupActionFlow,
    } = useStore((state) => ({
        appData: state.applicationData,
        patchApplication: state.patchApplication,
        built: state.built,
        getStorageInfoByApplicationCode: state.getStorageInfoByApplicationCode,
        cleanupActionFlow: state.cleanupActionFlow,
    }));

    // Display "Storage Limit Exceeded" error message in toast
    const showStorageExceededtMessage = () => {
        toastMessage(
            t("common.error.application.storage.exceeded"),
            toast.TYPE.ERROR
        );
    };

    const checkBuildFiles = () => {
        if (
            built?.files?.java_spring_boot?.debug?.file ||
            built?.files?.java_spring_boot?.development?.file ||
            built?.files?.java_spring_boot?.release?.file
        ) {
            return false;
        }

        return true;
    };

    // Display "App Not Found" error message in toast
    const showAppNotFoundMessage = () => {
        toastMessage(t("common.error.application.not.found"), toast.TYPE.ERROR);
    };

    const onSave = () => {
        // Get the application_code / app
        const appCode = segments.appid;

        // if app code is not provided or an invalid app code is provided, display error in a toast
        if (appCode) {
            cleanupActionFlow();

            patchApplication(appCode)
                .then((data) => {
                    if (!data.success) {
                        if (data.message && Array.isArray(data.message)) {
                            toastMessage(
                                data.message.join(","),
                                toast.TYPE.ERROR
                            );
                        } else {
                            toastMessage(data.message, toast.TYPE.ERROR);
                        }
                    } else {
                        toastMessage(
                            t("common.success.save"),
                            toast.TYPE.SUCCESS
                        );
                    }
                })
                .catch((e: string | string[] | undefined) => {
                    if (e) {
                        if (Array.isArray(e)) {
                            toastMessage(e.join(","), toast.TYPE.ERROR);
                        } else {
                            toastMessage(e, toast.TYPE.ERROR);
                        }
                    } else {
                        toastMessage(
                            t("common.error.generic"),
                            toast.TYPE.ERROR
                        );
                    }
                })
                .finally(() => {
                    // Do the validation of used storage memory upon saving
                    getStorageInfoByApplicationCode(appCode)
                        .then((res) => {
                            // If there is no more free storage (used > max), display error in a toast
                            if (res.data.memory.free < 0) {
                                showStorageExceededtMessage();
                            }
                        })
                        .catch(() => {
                            showAppNotFoundMessage();
                        });
                });
        } else {
            showAppNotFoundMessage();
        }
    };

    // TODO: Complete the implementation of help feature
    const onHelp = () => {
        // eslint-disable-next-line no-alert
        alert("Help button is clicked");
    };

    return (
        <section id="header">
            <Container fluid>
                <Row className="align-items-center">
                    <Col xs={6} md={4}>
                        <Stack
                            direction="horizontal"
                            gap={2}
                            className="gap-md-3"
                        >
                            {/* Emobiq logo with a homepage link */}
                            <a href={baseUrl}>
                                <img
                                    src={logo}
                                    alt={t("common.logo.icon.alt")}
                                    className="pb-1"
                                    height="35px"
                                />
                            </a>

                            {/* Vertical divider line */}
                            <div className="d-flex me-md-n1">
                                <div className="vr bg-white opacity-100 fs-3" />
                            </div>

                            {/* Application name & version */}
                            <Stack
                                direction="horizontal"
                                gap={5}
                                className="d-md-flex d-inline"
                            >
                                <div className="text-truncate mw-125 mw-md-200">
                                    {appData?.appname}
                                </div>
                                <div className="text-truncate mw-125 mw-md-200">
                                    {t("header.version.label", {
                                        version: appData?.version,
                                    })}
                                </div>
                            </Stack>
                        </Stack>
                    </Col>

                    {/* Save button and Build button */}
                    <Col xs={4} md={4} className="px-1">
                        <Stack
                            direction="horizontal"
                            gap={2}
                            className="justify-content-md-center"
                        >
                            <Button
                                variant="emobiq-brand-outline-mahogany"
                                className="text-rg py-1 px-md-4"
                                onClick={onSave}
                            >
                                {t("header.button.save")}
                            </Button>
                            <Button
                                variant="emobiq-brand-outline-mahogany"
                                className="text-rg py-1 px-md-4"
                                onClick={() => setBuildVisibility(true)}
                            >
                                {t("header.button.build")}
                            </Button>
                        </Stack>
                    </Col>

                    {/* Download and Help button */}
                    <Col xs={2} md={4} className="position-relative">
                        <Stack
                            direction="horizontal"
                            gap={2}
                            className="float-end"
                        >
                            <Button
                                variant="emobiq-brand-outline-mahogany"
                                className="text-sm px-md-4 d-flex align-items-center download-button"
                                onClick={() => setDownloadVisibility(true)}
                                disabled={checkBuildFiles()}
                            >
                                {t("header.button.download")}
                            </Button>
                            <Button
                                variant="text-white"
                                className="text-sm d-flex align-items-center"
                                onClick={onHelp}
                            >
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <span className="ms-1">
                                    {t("header.button.help")}
                                </span>
                            </Button>
                        </Stack>
                    </Col>
                </Row>
            </Container>

            <ApplicationBuild
                show={buildModalVisible}
                handleClose={() => setBuildVisibility(false)}
            />

            <ApplicationDownload
                applicationCode={segments.appid ?? ""}
                builtFiles={built?.files?.java_spring_boot}
                buildModes={built?.modes ?? []}
                show={downloadModalVisible}
                handleClose={() => setDownloadVisibility(false)}
            />
        </section>
    );
};

export default Header;
