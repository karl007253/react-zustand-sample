import { capitalize, lowerCase } from "lodash";
import { useState } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";

import {
    ApplicationBuildMode,
    BuiltFilePlatforms,
} from "../../../../common/zustand/interface/ApplicationInterface";

interface ApplicationDownloadProps {
    show: boolean;
    applicationCode: string;
    buildModes: string[] | null;
    builtFiles: BuiltFilePlatforms | null | undefined;
    handleClose: () => void;
}

/**
 * Generates the url for built file
 *
 * @param {string} applicationCode
 * @param {string} appFile
 * @returns {string}
 */
export const generateUrlForBuiltFile = (
    applicationCode: string,
    appFile: string
) => {
    const baseUrl = process.env.REACT_APP_STORAGE_URL;

    if (appFile?.length === 0) {
        return "";
    }

    const url = `${baseUrl}/app/${applicationCode}/result/${appFile}`;

    return url;
};

const ApplicationDownload = ({
    show,
    applicationCode,
    buildModes,
    builtFiles,
    handleClose,
}: ApplicationDownloadProps) => {
    const { t } = useTranslation();

    const [buildMode, setBuildMode] = useState<string>("");

    const onCloseModal = () => {
        // close the modal
        handleClose();
    };

    const handleDownload = () => {
        if (buildMode?.length === 0) {
            return;
        }

        const buildFile =
            builtFiles?.[buildMode as unknown as keyof BuiltFilePlatforms]
                ?.file;

        // Get the url of the built file
        const url = generateUrlForBuiltFile(applicationCode, buildFile ?? "");

        // If no url then ignore
        if (!url) {
            return;
        }

        window.location.href = url;
        handleClose();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("dashboard.modal.download.title")}
            handleClose={onCloseModal}
        >
            <div>
                <Container>
                    <Row className="align-items-center border-bottom pb-30">
                        <Col xs={12} sm={3}>
                            <Form.Label
                                htmlFor="build-mode"
                                className="text-rg m-0 text-philippine-gray"
                            >
                                {t("dashboard.modal.download.form.label.mode")}
                            </Form.Label>
                        </Col>
                        <Col xs={12} sm={9}>
                            <Form.Select
                                className="text-rg"
                                onChange={(val) =>
                                    setBuildMode(
                                        val.target.value as ApplicationBuildMode
                                    )
                                }
                                aria-label="build-mode"
                                value={buildMode}
                            >
                                <option value="" hidden>
                                    {t(
                                        "dashboard.modal.download.form.placeholder.mode"
                                    )}
                                </option>

                                {buildModes?.map((mode) => (
                                    <option key={mode} value={lowerCase(mode)}>
                                        {capitalize(mode)}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="align-items-center py-30">
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
                                onClick={handleDownload}
                                disabled={buildMode?.length === 0}
                            >
                                {t(
                                    "dashboard.modal.download.form.button.download"
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </EmobiqModal>
    );
};

export default ApplicationDownload;
