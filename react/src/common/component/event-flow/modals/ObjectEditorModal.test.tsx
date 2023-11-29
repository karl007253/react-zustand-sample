import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ObjectEditorModal from "./ObjectEditorModal";

const okButton = () => {
    return screen.getByRole("button", {
        name: "common.button.ok",
    });
};

describe("Component: ObjectEditorModal", () => {
    const mockFunction = jest.fn();

    beforeEach(() =>
        render(
            <ObjectEditorModal
                show
                handleClose={mockFunction}
                handleConfirm={mockFunction}
                value=""
            />
        )
    );

    it("should have a modal title", () => {
        const linkElement = screen.getByText(
            "eventFlow.tabs.action.modal.objectEditor.title"
        );
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a close button", () => {
        const linkElement = screen.getByRole("button", {
            name: "common.button.close",
        });
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a ok button", () => {
        const linkElement = screen.getByRole("button", {
            name: "common.button.ok",
        });
        expect(linkElement).toBeInTheDocument();
    });

    it("should trigger handleConfirm when ok button is clicked", () => {
        userEvent.click(okButton());

        // ensure handleConfirm is triggered
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });
});
