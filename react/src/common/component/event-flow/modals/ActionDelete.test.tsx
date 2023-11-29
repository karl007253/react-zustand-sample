import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTranslation } from "react-i18next";

import ActionDelete from "./ActionDelete";

const deleteButton = () => {
    return screen.getByRole("button", {
        name: "common.button.delete",
    });
};

describe("Component: ActionDelete", () => {
    const { t } = useTranslation();
    const mockHandleClose = jest.fn();
    const mockOnConfirm = jest.fn();
    const mockName = "console function?";
    beforeEach(() =>
        render(
            <ActionDelete
                show
                handleClose={mockHandleClose}
                onConfirm={mockOnConfirm}
                name={mockName}
            />
        )
    );

    it("should have a modal title", () => {
        const linkElement = screen.getByText(t("eventFlow.modal.delete.title"));
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a modal name", () => {
        const linkElement = screen.getByText(
            t("eventFlow.modal.delete.form.message.confirm", {
                mockName,
            })
        );
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a cancel button", () => {
        const linkElement = screen.getByRole("button", {
            name: "common.button.cancel",
        });
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a delete button", () => {
        const linkElement = screen.getByRole("button", {
            name: "common.button.delete",
        });
        expect(linkElement).toBeInTheDocument();
    });

    it("should trigger onConfirm and handleClose when delete button is clicked", () => {
        userEvent.click(deleteButton());

        // ensure onConfirm and handleClose are triggered
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
});
