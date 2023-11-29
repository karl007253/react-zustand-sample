import { Button, Col, OverlayTrigger, Popover, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ButtonVariant } from "../../../../../common/component/helper/EmobiqModal";

type EditConfigurationDeletePopoverProps = {
    isUsed: string;
    isFolder: string;
    deleteConfig: () => void;
    deleteConfigPopover: () => void;
};

const EditConfigurationDeletePopover = ({
    isUsed,
    isFolder,
    deleteConfig,
    deleteConfigPopover,
}: EditConfigurationDeletePopoverProps) => {
    const { t } = useTranslation();

    return (
        <OverlayTrigger
            trigger="focus"
            placement="top"
            overlay={
                <Popover id="config-delete-top">
                    <Popover.Header as="h3" />
                    <Popover.Body className="py-32">
                        <Row>
                            <Col
                                xs={12}
                                className="text-center text-philippine-gray mb-12"
                            >
                                {t(
                                    `scheduler.dashboard.modalConfig.confirm.${isUsed}`,
                                    { type: `"${isFolder}"` }
                                )}
                            </Col>
                            <Col xs={6} className="text-end">
                                <Button
                                    aria-label="delete-config-no"
                                    name="delete-config-no"
                                    className="w-60"
                                    variant={ButtonVariant.OUTLINE_EMOBIQ_BRAND}
                                >
                                    {t(
                                        "scheduler.dashboard.modalConfig.form.button.no"
                                    )}
                                </Button>
                            </Col>
                            <Col xs={6} className="text-left">
                                <Button
                                    aria-label="delete-config-yes"
                                    name="delete-config-yes"
                                    onClick={() => {
                                        deleteConfig();
                                    }}
                                    className="w-60"
                                    variant={ButtonVariant.OUTLINE_EMOBIQ_BRAND}
                                >
                                    {t(
                                        "scheduler.dashboard.modalConfig.form.button.yes"
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Popover.Body>
                </Popover>
            }
        >
            <Button
                aria-label="delete-config"
                name="delete-config"
                className="px-3 px-md-4 py-2 rounded-3-px text-sm"
                onClick={() => {
                    deleteConfigPopover();
                }}
                variant={ButtonVariant.OUTLINE_CHINESE_SILVER_PHILIPPINE_GRAY}
            >
                {t("scheduler.dashboard.modalConfig.form.button.delete")}
            </Button>
        </OverlayTrigger>
    );
};

export default EditConfigurationDeletePopover;
