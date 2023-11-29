import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import EmobiqModal, { ButtonVariant } from "../../helper/EmobiqModal";

type ObjectEditorModalProps = {
    show: boolean;
    title?: string;
    value: string;

    handleClose: () => void;
    handleConfirm: (value: string) => void;
};

const ObjectEditorModal = ({
    show,
    title,
    value,
    handleClose,
    handleConfirm,
}: ObjectEditorModalProps) => {
    const { t } = useTranslation();

    const [editorValue, setEditorValue] = useState(value);

    // re-set editorValue when value are changed
    useEffect(() => {
        setEditorValue(value);
    }, [value]);

    const handleOkButton = () => {
        // reset editorValue
        setEditorValue(value);

        // Pass the editorValue
        if (handleConfirm) {
            handleConfirm(editorValue);
        }
    };

    const handleCloseButton = () => {
        // reset editorValue
        setEditorValue(value);

        if (handleClose) {
            handleClose();
        }
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={
                title || t("eventFlow.tabs.action.modal.objectEditor.title")
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
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: handleOkButton,
                },
            ]}
        >
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Control
                            as="textarea"
                            rows={8}
                            value={editorValue}
                            onChange={(e) => setEditorValue(e.target.value)}
                        />
                    </Col>
                </Row>
            </Form.Group>
        </EmobiqModal>
    );
};

export default ObjectEditorModal;
