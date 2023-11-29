import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTranslation } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import GlobalAdd from "./GlobalAdd";

const okButton = () => {
    return screen.getByRole("button", {
        name: "common.button.add",
    });
};

describe("Component: GlobalAdd", () => {
    const { t } = useTranslation();
    const mockFunction = jest.fn();

    beforeEach(() =>
        render(
            <MemoryRouter>
                <GlobalAdd
                    show
                    handleClose={mockFunction}
                    handleConfirm={mockFunction}
                />
                <ToastContainer />
            </MemoryRouter>
        )
    );

    it("should have a modal title", () => {
        const linkElement = screen.getByText(
            t("eventFlow.tabs.global.add.modal.title")
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
        userEvent.click(okButton());

        // ensure handleConfirm is triggered
        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    it("should fail validation when input has special characters", async () => {
        const nameInput = screen.getByLabelText(
            t("eventFlow.tabs.global.add.form.name")
        );

        // enter special characters into name input
        userEvent.type(nameInput, "test-name-@#$%^&*()");

        // click ok button
        userEvent.click(okButton());

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "common.error.specialCharactersDetectedSpecific"
            );

            // updateConfiguration should not be called at all
            expect(mockFunction).toHaveBeenCalledTimes(0);
        });
    });
});
