import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forIn } from "lodash";
import EmobiqModal, {
    ButtonVariant,
    EmobiqModalSize,
    ModalFooterButton,
    ModalVariant,
} from "./EmobiqModal";

// Prepare constants
const emobiqModal = () => screen.getByRole("dialog");
const modalHeaderTitle = "Modal Title";
const mockHandleClose = jest.fn();
const modalFooterButton = [
    {
        name: "cancel",
        variant: ButtonVariant.EMOBIQ_BRAND,
        handleClick: jest.fn(),
    },
];

/**
 * Render EmobiqModal
 * @param {{modalHeaderTitle?: string; modalFooterButton?: ModalFooterButton[]; size?: EmobiqModalSize;}} props input optional header title, footer buttons, and modal size
 */
const renderEmobiqModal = (props?: {
    modalHeaderTitle?: string;
    modalFooterButton?: ModalFooterButton[];
    size?: EmobiqModalSize;
}) => {
    render(
        <EmobiqModal
            show
            handleClose={mockHandleClose}
            modalHeaderTitle={props?.modalHeaderTitle}
            modalFooterButton={props?.modalFooterButton}
            size={props?.size}
        >
            <div aria-label="modal-body-content">Modal Body</div>
        </EmobiqModal>
    );
};

describe("Component: Helper - Emobiq Modal", () => {
    describe("Modal without title and footer", () => {
        beforeEach(() => {
            renderEmobiqModal();
        });

        it("should trigger close action when clicking outside the modal", () => {
            // Ensure close action is not triggerred upon completion of modal rendering
            expect(mockHandleClose).toHaveBeenCalledTimes(0);

            // Click outside the modal
            userEvent.click(emobiqModal());

            // Ensure close action is triggerred after clicking
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
        });

        it("should have a correct default modal variant if no modal variant is provided", () => {
            // Ensure default CSS class is present
            expect(emobiqModal()).toHaveClass(
                `modal-${ModalVariant.EMOBIQ_BRAND}`
            );
        });

        it("should not have a header if modal title is not provided", () => {
            // Ensure modal header is absent
            expect(
                screen.queryByLabelText("modal-header")
            ).not.toBeInTheDocument();
        });

        it("should show the provided body content", () => {
            // Ensure children component is shown within modal body
            expect(screen.getByLabelText("modal-body")).toContainElement(
                screen.getByLabelText("modal-body-content")
            );
        });

        it("should not have a footer if modal footer button is not provided", () => {
            // Ensure modal footer is absent
            expect(
                screen.queryByLabelText("modal-footer")
            ).not.toBeInTheDocument();
        });
    });

    describe("Modal with title", () => {
        beforeEach(() => {
            renderEmobiqModal({ modalHeaderTitle });
        });

        it("should show a title on header of the modal", () => {
            // Ensure provided title is shown within modal header
            expect(screen.getByLabelText("modal-header")).toHaveTextContent(
                modalHeaderTitle
            );
        });

        it("should have a close button that trigger close action", () => {
            // Ensure close action is not triggered before clicking close button
            expect(mockHandleClose).toHaveBeenCalledTimes(0);

            // Click close button shown in modal header
            userEvent.click(
                within(screen.getByLabelText("modal-header")).getByRole(
                    "button",
                    { name: /close/i }
                )
            );

            // Ensure close action is triggerred after clicking
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
        });
    });

    describe("Modal with footer button", () => {
        beforeEach(() => {
            renderEmobiqModal({ modalFooterButton });
        });

        it("should have buttons on footer of the modal", () => {
            modalFooterButton.forEach((button) => {
                // Click button shown in modal footer
                userEvent.click(
                    within(screen.getByLabelText("modal-footer")).getByRole(
                        "button",
                        { name: button.name }
                    )
                );

                // Ensure action of the button is triggerred after clicking on it
                expect(button.handleClick).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Modal with non-standard size", () => {
        it("should render non-standard sizes correctly if size attribute is provided", () => {
            // forIn function is provided by lodash
            forIn(EmobiqModalSize, (size) => {
                // Renderr modal with available provided size
                renderEmobiqModal({ size });

                // We use firstChild here to retrieve the outer layer (element) of the modal,
                // which will contain the size class
                expect(emobiqModal().firstChild).toHaveClass(`modal-${size}`);

                // Clean up rendered screen for next iteration
                cleanup();
            });
        });

        it("should have a default size if size attribute is not provided", () => {
            // Render modal with no size.
            renderEmobiqModal();

            // We use firstChild here to retrieve the outer layer (element) of the modal,
            // which will contain the size class
            // We will ensure the class list to not have any size-related classes (E.g. modal-xl etc.)
            forIn(EmobiqModalSize, (size) => {
                expect(emobiqModal().firstChild).not.toHaveClass(
                    `modal-${size}`
                );
            });
        });
    });
});
