import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import { Api } from "../../../../common/zustand/interface/ApiInterface";

import ApplicationBuild from "./ApplicationBuild";

const mockApiList: Api[] = [
    {
        uuid: "id-endpoint-1",
        folder_uuid: "id-folder-1",
        name: "endpoint-1",
        title: "endpoint-1",
        data: {},
        order: 0,
        id: 1,
    },
    {
        uuid: "id-endpoint-2",
        folder_uuid: "id-folder-1",
        name: "endpoint-2",
        title: "endpoint-2",
        data: {},
        order: 0,
        id: 2,
    },
];

const getButtonByName = (name: string) => {
    return screen.getByRole("button", { name });
};

describe("Component: Modal - ApplicationBuild", () => {
    const mockHandleClose = jest.fn();

    beforeEach(async () => {
        await waitFor(() => {
            // Initial state
            const state = useStore.getState();

            useStore.setState(
                {
                    ...state,
                    api: mockApiList,
                },
                true
            );

            render(
                <MemoryRouter>
                    <ApplicationBuild show handleClose={mockHandleClose} />
                    <ToastContainer />
                </MemoryRouter>
            );
        });
    });

    it("should have a modal title", () => {
        const linkElement = screen.getByText("api.dashboard.modal.build.title");
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a close button", () => {
        // Get the close button
        const closeBtn = getButtonByName("common.button.close");

        // Ensure that the close button exists
        expect(closeBtn).toBeInTheDocument();

        // Trigger the close button
        userEvent.click(closeBtn);

        // Ensure that the close button works
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it("should have a start button", async () => {
        // Get the start button
        const startBtn = getButtonByName(
            "api.dashboard.modal.build.form.button.start"
        );

        // Ensure that the start button exists
        expect(startBtn).toBeInTheDocument();

        // Trigger the start button
        userEvent.click(startBtn);

        // Ensure that alert message is displayed since there is no mode is selected
        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "api.dashboard.modal.build.form.message.error.mode"
            );
        });
    });

    it("should have the mode options", async () => {
        // Get the combobox
        const combobox = screen.getByRole("combobox", { name: "build-mode" });

        // Ensure that the combobox exists
        expect(combobox).toBeInTheDocument();

        expect(
            screen.getByRole("combobox", {
                name: "build-mode",
            })
        ).toHaveValue("");

        userEvent.selectOptions(
            // Find the combobox
            screen.getByRole("combobox"),
            // Find and select the other option
            screen.getByRole("option", { name: "Debug" })
        );
        expect(screen.getByRole("option", { name: "Debug" }).textContent).toBe(
            "Debug"
        );
    });

    it("should have the version options after selecting release mode", async () => {
        // Get the combobox
        const combobox = screen.getByRole("combobox", { name: "build-mode" });

        // Ensure that the combobox exists
        expect(combobox).toBeInTheDocument();

        expect(
            screen.getByRole("combobox", {
                name: "build-mode",
            })
        ).toHaveValue("");

        userEvent.selectOptions(
            // Find the combobox
            screen.getByRole("combobox"),
            // Find and select the other option
            screen.getByRole("option", { name: "Release" })
        );
        expect(
            screen.getByRole("option", { name: "Release" }).textContent
        ).toBe("Release");

        // Get the version combobox
        const comboboxVersion = screen.getByRole("combobox", {
            name: "build-version",
        });

        // Ensure that the comboboxVersion exists
        expect(comboboxVersion).toBeInTheDocument();

        expect(
            screen.getByRole("combobox", {
                name: "build-version",
            })
        ).toHaveValue("");

        userEvent.selectOptions(
            // Find the comboboxVersion
            screen.getByRole("combobox", {
                name: "build-version",
            }),
            // Find and select the other option
            screen.getByRole("option", { name: "Build" })
        );
        expect(screen.getByRole("option", { name: "Build" }).textContent).toBe(
            "Build"
        );
    });

    // TODO: Add more test cases once finalized
});
