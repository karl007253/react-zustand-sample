import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AddDynamicParamModal from "./AddDynamicParamModal";

const addButton = () => {
    return screen.getByRole("button", {
        name: "common.button.add",
    });
};

describe("Component: AddDynamicParamModal", () => {
    const mockFunction = jest.fn();
    beforeEach(() =>
        render(
            <AddDynamicParamModal
                show
                handleClose={mockFunction}
                handleConfirm={mockFunction}
            />
        )
    );

    it("should have a modal title", () => {
        const linkElement = screen.getByText(
            "eventFlow.tabs.action.modal.addDynamicParam.title"
        );
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a close button", () => {
        const linkElement = screen.getByRole("button", {
            name: "common.button.close",
        });
        expect(linkElement).toBeInTheDocument();
    });

    it("should have an add button", () => {
        const linkElement = screen.getByRole("button", {
            name: "common.button.add",
        });
        expect(linkElement).toBeInTheDocument();
    });

    it("should trigger handleConfirm when ok button is clicked", () => {
        userEvent.click(addButton());

        // ensure handleConfirm is triggered
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });
});
