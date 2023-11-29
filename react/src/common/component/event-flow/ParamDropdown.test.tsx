import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ParamDropdown from "./ParamDropdown";

describe("Component: ParamDropdown", () => {
    const mockFunction = jest.fn();

    beforeEach(() =>
        render(<ParamDropdown options="integer" onChange={mockFunction} />)
    );

    it("should have display text when options are available", () => {
        const displayText = "(Integer - e.g. 1)";

        act(() => {
            userEvent.click(screen.getByRole("button", { expanded: false }));
        });
        expect(screen.getByText(displayText)).toBeInTheDocument();
    });
});
