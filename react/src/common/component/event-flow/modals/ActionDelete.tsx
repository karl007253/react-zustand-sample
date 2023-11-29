import { Container, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import EmobiqModal, { ButtonVariant } from "../../helper/EmobiqModal";

type ActionModuleDeleteProps = {
    show: boolean;
    handleClose: () => void;
    onConfirm: () => void;
    name: string;
};

const ActionDelete = ({
    show,
    handleClose,
    onConfirm,
    name,
}: ActionModuleDeleteProps) => {
    const { t } = useTranslation();

    const handleOkButton = () => {
        if (onConfirm) {
            onConfirm();
        }

        handleClose();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("eventFlow.modal.delete.title")}
            handleClose={handleClose}
            modalFooterButton={[
                {
                    name: "common.button.cancel",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: handleClose,
                },
                {
                    name: "common.button.delete",
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: handleOkButton,
                },
            ]}
        >
            <div>
                <Form>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <Form.Label>
                                    {t(
                                        "eventFlow.modal.delete.form.message.confirm",
                                        { name }
                                    )}
                                </Form.Label>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </div>
        </EmobiqModal>
    );
};

export default ActionDelete;
