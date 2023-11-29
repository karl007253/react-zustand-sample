import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FunctionModal from "./FunctionModal";

const okButton = () => {
    return screen.getByRole("button", {
        name: "common.button.ok",
    });
};

describe("Component: FunctionModal", () => {
    const mockFunction = jest.fn();
    const mockOptions = [
        { value: "yes", text: "YES" },
        { value: "no", text: "NO" },
    ];
    beforeEach(() =>
        render(
            <FunctionModal
                show
                handleClose={mockFunction}
                handleConfirm={mockFunction}
                options={mockOptions}
            />
        )
    );

    it("should have a modal title", () => {
        const linkElement = screen.getByText(
            "eventFlow.tabs.action.modal.function.title"
        );
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a modal message", () => {
        const linkElement = screen.getByText(
            "eventFlow.tabs.action.modal.function.message"
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
