import { Col, Container, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useToast from "../../../../common/hooks/Toast";
import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";

import { Service } from "../../../../common/zustand/interface/ServiceInterface";

interface ServiceDuplicateModalProps {
    show: boolean;
    handleClose: () => void;
    onCopy: (uuid: string) => void;
    service: Service;
}

const ServiceDuplicateModal = ({
    show,
    handleClose,
    onCopy,
    service,
}: ServiceDuplicateModalProps) => {
    const { t } = useTranslation();

    const toastMessage = useToast(true);

    // modal close handler
    const onCloseModal = () => {
        // close modal
        handleClose();
    };

    const onCopyPressed = () => {
        onCopy(service?.uuid);

        // show success message
        toastMessage(
            t("service.modal.copy.message.success.action"),
            toast.TYPE.SUCCESS
        );

        // close modal
        handleClose();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("service.modal.copy.title")}
            handleClose={onCloseModal}
            modalFooterButton={[
                {
                    name: "common.button.cancel",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: onCloseModal,
                },
                {
                    name: "common.button.copy",
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: onCopyPressed,
                },
            ]}
        >
            <Form>
                <Container>
                    <Row>
                        <Col xs={12}>
                            <Form.Label>
                                {t("service.modal.copy.message.confirm", {
                                    name: `"${service?.name}"`,
                                })}
                            </Form.Label>
                        </Col>
                    </Row>
                </Container>
            </Form>
        </EmobiqModal>
    );
};

export default ServiceDuplicateModal;
