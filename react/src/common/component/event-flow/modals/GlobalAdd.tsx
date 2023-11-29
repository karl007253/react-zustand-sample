import { useState } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import EmobiqModal, { ButtonVariant } from "../../helper/EmobiqModal";
import { GlobalForm } from "../data/Functions";
import useToast from "../../../hooks/Toast";
import { validateSpecialCharacters } from "../../../helper/Function";

type GlobalAddProps = {
    show: boolean;
    handleClose: () => void;
    handleConfirm: (data: GlobalForm) => void;
};

const GlobalAdd = ({ show, handleClose, handleConfirm }: GlobalAddProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const [name, setName] = useState("");
    const [result, setResult] = useState("");

    const validateAndToastSpecialCharacters = (
        field: string,
        value: string
    ) => {
        if (validateSpecialCharacters(value) && value !== "") {
            toastMessage(
                t("common.error.specialCharactersDetectedSpecific", { field }),
                toast.TYPE.ERROR
            );
            return true;
        }

        return false;
    };

    const handleAddButton = () => {
        if (
            validateAndToastSpecialCharacters("Name", name) ||
            validateAndToastSpecialCharacters("Result", result)
        ) {
            // Stop execution if special characters are detected
            return;
        }

        // Pass the selected option
        if (handleConfirm) {
            handleConfirm({
                name,
                result,
            });
        }

        // reset form
        setName("");
        setResult("");
    };

    const handleCloseButton = () => {
        // reset form
        setName("");
        setResult("");

        if (handleClose) {
            handleClose();
        }
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("eventFlow.tabs.global.add.modal.title")}
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
            <Stack gap={4}>
                <Form.Group controlId="name">
                    <Row>
                        <Col xs={12} sm={3}>
                            <Form.Label>
                                {t("eventFlow.tabs.global.add.form.name")}
                            </Form.Label>
                        </Col>
                        <Col xs={12} sm={9}>
                            <Form.Control
                                className="text-rg"
                                placeholder={t(
                                    "eventFlow.tabs.global.add.form.name"
                                )}
                                onChange={(e) => setName(e.target.value)}
                                onKeyUp={(e) =>
                                    e.key === "Enter" && handleAddButton()
                                }
                                value={name}
                            />
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group controlId="result">
                    <Row>
                        <Col xs={12} sm={3}>
                            <Form.Label>
                                {t("eventFlow.tabs.global.add.form.result")}
                            </Form.Label>
                        </Col>
                        <Col xs={12} sm={9}>
                            <Form.Control
                                className="text-rg"
                                placeholder={t(
                                    "eventFlow.tabs.global.add.form.result"
                                )}
                                onChange={(e) => setResult(e.target.value)}
                                onKeyUp={(e) =>
                                    e.key === "Enter" && handleAddButton()
                                }
                                value={result}
                            />
                        </Col>
                    </Row>
                </Form.Group>
            </Stack>
        </EmobiqModal>
    );
};

export default GlobalAdd;
