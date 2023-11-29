import { useEffect, useState } from "react";
import { isArray } from "lodash";
import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import EmobiqModal, { ButtonVariant } from "../../helper/EmobiqModal";
import { OptionProps } from "../data/Functions";

type FunctionModalProps = {
    show: boolean;
    options: OptionProps[];
    title?: string;
    message?: string;

    handleClose: () => void;
    handleConfirm: (connectionName: string) => void;
};

const FunctionModal = ({
    show,
    options,
    title,
    message,
    handleClose,
    handleConfirm,
}: FunctionModalProps) => {
    const { t } = useTranslation();
    // Get the initial selection from the options
    const initialOption =
        isArray(options) && options[0] ? options[0].value : "";

    const [selectedOption, setSelectedOption] = useState(initialOption);

    // re-set selectedOption when options are changed
    useEffect(() => {
        const currentInitialOption =
            isArray(options) && options[0] ? options[0].value : "";

        setSelectedOption(currentInitialOption);
    }, [options]);

    const handleOkButton = () => {
        // reset selected option
        setSelectedOption(initialOption);

        // Pass the selected option
        if (handleConfirm) {
            handleConfirm(selectedOption);
        }
    };

    const handleCloseButton = () => {
        // reset selected option
        setSelectedOption(initialOption);

        if (handleClose) {
            handleClose();
        }
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={
                title || t("eventFlow.tabs.action.modal.function.title")
            }
            handleClose={handleCloseButton}
            modalFooterButton={[
                {
                    name: "common.button.close",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: handleCloseButton,
                },
                {
                    name: "common.button.ok",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: handleOkButton,
                },
            ]}
        >
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label>
                            {message ||
                                t(
                                    "eventFlow.tabs.action.modal.function.message"
                                )}
                        </Form.Label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Select
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                        >
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.text}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </Form.Group>
        </EmobiqModal>
    );
};

export default FunctionModal;
