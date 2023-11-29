import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EventFlowFunctionLists from "./EventFlowFunctionLists";
import { Functions as functionLists } from "../../../data/Functions";

const functionDiv = () => {
    return screen.getByRole("button", { name: "Log.write" });
};

describe("Component: EventFlowFunctionLists", () => {
    const mockHandleClose = jest.fn();
    const mockHandleClick = jest.fn();
    beforeEach(() =>
        render(
            <EventFlowFunctionLists
                show
                handleClose={mockHandleClose}
                functionLists={functionLists}
                onClick={mockHandleClick}
            />
        )
    );

    it("should have a modal title", () => {
        const linkElement = screen.getByText(
            "eventFlow.tabs.action.modal.functions.title"
        );
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a cancel button", () => {
        const linkElement = screen.getByRole("button", {
            name: "common.button.cancel",
        });
        expect(linkElement).toBeInTheDocument();
    });

    it("should trigger onClick when function is clicked", () => {
        userEvent.click(functionDiv());

        // ensure onClick is triggered
        expect(mockHandleClick).toHaveBeenCalledTimes(1);
    });
});
