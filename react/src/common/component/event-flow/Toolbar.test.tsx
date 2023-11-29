import { render, screen } from "@testing-library/react";

import Toolbar from "./Toolbar";

describe("Component: Toolbar", () => {
    const mockFunction = jest.fn();
    const mockButtonState = {
        copy: true,
        paste: true,
        delete: true,
    };

    beforeEach(() =>
        render(
            <Toolbar
                selectedFunction={null}
                onUpdate={mockFunction}
                selectedParentFunction={null}
                buttonState={mockButtonState}
            />
        )
    );

    it("should have Copy button", () => {
        expect(
            screen.getByRole("button", {
                name: "common.button.copy",
            })
        ).toBeInTheDocument();
    });

    it("should have Paste button", () => {
        expect(
            screen.getByRole("button", {
                name: "common.button.paste",
            })
        ).toBeInTheDocument();
    });

    it("should have Delete button", () => {
        expect(
            screen.getByRole("button", {
                name: "common.button.delete",
            })
        ).toBeInTheDocument();
    });
});
