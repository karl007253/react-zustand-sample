import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

enum ModalVariant {
    EMOBIQ_BRAND = "emobiq-brand",
}

enum ButtonVariant {
    EMOBIQ_BRAND = "emobiq-brand",
    OUTLINE_EMOBIQ_BRAND = "outline-emobiq-brand",
    OUTLINE_EMOBIQ_BRAND_SHADED = "outline-emobiq-brand-shaded",
    OUTLINE_LIGHT_EMOBIQ_BRAND = "outline-light-emobiq-brand",
    OUTLINE_CHINESE_SILVER_PHILIPPINE_GRAY = "outline-chinese-silver-philippine-gray",
    OUTLINE_CHINESE_SILVER = "outline-chinese-silver",
    PHILIPPINE_GRAY_EMOBIQ_BRAND = "philippine-gray-emobiq-brand",
    DARK_PLATINUM_OSLO_GRAY = "dark-platinum-oslo-gray",
}

type ModalFooterButton = {
    name: string;
    variant: ButtonVariant;
    handleClick: () => void;
};

enum EmobiqModalSize {
    sm = "sm",
    lg = "lg",
    xl = "xl",
}

type EmobiqModalProps = {
    show: boolean;
    handleClose: () => void;
    modalVariant?: ModalVariant;
    modalHeaderTitle?: string;
    children: JSX.Element | JSX.Element[];
    modalFooterButton?: ModalFooterButton[];
    size?: EmobiqModalSize;
};

/**
 * A reusable pop-up modal
 * @param {boolean} show indicate if the modal is showing
 * @param {() => void} handleClose close the modal
 * @param {ModalVariant} modalVariant set the root css class for the modal. By default, the css class is "modal-emobiq-brand"
 * @param {string} modalHeaderTitle set the title of modal if provided
 * @param {JSX.Element | JSX.Element[]} children set the component for the modal body
 * @param {ModalFooterButton[]} modalFooterButton set the buttons in modal footer if provided
 * @param {EmobiqModalSize} size set a size for this modal. Default is medium ("md").
 *
 * Eg:
 * <EmobiqModal
 *      show={true || false}
 *      handleClose={() => setShowModal(false)}
 *      modalHeaderTitle="modal.title"
 *      modalFooterButton={[
 *          {
 *              name: "button.cancel"
 *              variant: ButtonVariant.EMOBIQ_BRAND
 *              handleClick: () => setShowModal(false)
 *          }
 *      ]}
 * >
 *      <div>Modal Body</div>
 * <EmobiqModal/>
 */
const EmobiqModal = ({
    show,
    handleClose,
    modalVariant = ModalVariant.EMOBIQ_BRAND,
    modalHeaderTitle,
    children,
    modalFooterButton,
    size,
}: EmobiqModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            className={`modal-${modalVariant}`}
            size={size && EmobiqModalSize[size]}
        >
            {/* Modal Header */}
            {modalHeaderTitle && (
                <Modal.Header
                    closeButton
                    closeVariant="white"
                    className="border-0"
                    aria-label="modal-header"
                >
                    <Modal.Title>{t(modalHeaderTitle)}</Modal.Title>
                </Modal.Header>
            )}

            {/* Modal Body */}
            <Modal.Body className="text-rg" aria-label="modal-body">
                {children}
            </Modal.Body>

            {/* Modal Footer */}
            {modalFooterButton && modalFooterButton.length > 0 && (
                <Modal.Footer
                    className="border-0 gap-3"
                    aria-label="modal-footer"
                >
                    {modalFooterButton.map(({ name, variant, handleClick }) => (
                        <Button
                            className="text-rg px-4 py-2 rounded-3-px"
                            variant={variant}
                            onClick={handleClick}
                            key={name}
                        >
                            {t(name)}
                        </Button>
                    ))}
                </Modal.Footer>
            )}
        </Modal>
    );
};

export { ModalVariant, ButtonVariant, EmobiqModalSize };
export type { ModalFooterButton };
export default EmobiqModal;
