import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import EmobiqModal, { ButtonVariant } from "../../helper/EmobiqModal";

type AddDynamicParamModalProps = {
    show: boolean;
    title?: string;

    handleClose: () => void;
    handleConfirm: (value: string) => void;
};

const AddDynamicParamModal = ({
    show,
    title,
    handleClose,
    handleConfirm,
}: AddDynamicParamModalProps) => {
    const { t } = useTranslation();

    const [name, setName] = useState("");

    const handleAddButton = () => {
        // reset name
        setName("");

        // Pass the name
        if (handleConfirm) {
            handleConfirm(name);
        }
    };

    const handleCloseButton = () => {
        // reset name
        setName("");

        if (handleClose) {
            handleClose();
        }
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={
                title || t("eventFlow.tabs.action.modal.addDynamicParam.title")
            }
            handleClose={handleCloseButton}
            modalFooterButton={[
                {
                    name: "common.button.close",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: handleCloseButton,
                },
                {
                    name: "common.button.add",
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: handleAddButton,
                },
            ]}
        >
            <Form.Group controlId="name">
                <Row className="align-items-center">
                    <Col xs={12} sm={3}>
                        <Form.Label className="text-rg m-0 text-philippine-gray">
                            {t(
                                "eventFlow.tabs.action.modal.addDynamicParam.form.label.name"
                            )}
                        </Form.Label>
                    </Col>
                    <Col xs={12} sm={9}>
                        <Form.Control
                            className="text-rg"
                            placeholder={t(
                                "eventFlow.tabs.action.modal.addDynamicParam.form.label.name"
                            )}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            onKeyUp={(e) =>
                                e.key === "Enter" && handleAddButton()
                            }
                            value={name}
                        />
                    </Col>
                </Row>
            </Form.Group>
        </EmobiqModal>
    );
};

export default AddDynamicParamModal;
