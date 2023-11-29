import { MemoryRouter } from "react-router-dom";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";

import ApplicationDownload from "./ApplicationDownload";
import {
    Built,
    BuiltFilePlatforms,
} from "../../../../common/zustand/interface/ApplicationInterface";

const applicationCodeMock = "0899989998999";

const buildModesMock = ["debug", "development"];

const builtFilesMock: BuiltFilePlatforms = {
    debug: {
        file: "debug/SampleApp3-1.1.0.jar",
        size: 54289055,
        modified_date: "2023-03-29T14:21:46+07:00",
    },
    development: {
        file: "development/SampleApp3-1.1.0.jar",
        size: 54289055,
        modified_date: "2023-03-29T14:21:46+07:00",
    },
};

const builtMock: Built = {
    files: {
        java_spring_boot: builtFilesMock,
    },
    modes: buildModesMock,
    platforms: ["java-spring-boot"],
};

const getButtonByName = (name: string) => {
    return screen.getByRole("button", { name });
};

describe("Component: Modal - ApplicationDownload", () => {
    const mockHandleClose = jest.fn();

    beforeEach(async () => {
        await waitFor(() => {
            // Initial state
            const state = useStore.getState();

            useStore.setState(
                {
                    ...state,
                    built: builtMock,
                },
                true
            );

            render(
                <MemoryRouter>
                    <ApplicationDownload
                        builtFiles={builtFilesMock}
                        buildModes={buildModesMock}
                        applicationCode={applicationCodeMock}
                        show
                        handleClose={mockHandleClose}
                    />
                </MemoryRouter>
            );
        });
    });

    it("should have a modal title", () => {
        const linkElement = screen.getByText("dashboard.modal.download.title");
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

    it("should have a download button", () => {
        // Get the download button
        const downloadBtn = getButtonByName(
            "dashboard.modal.download.form.button.download"
        );

        // Ensure that the download button exists
        expect(downloadBtn).toBeInTheDocument();

        // Trigger the download button
        userEvent.click(downloadBtn);

        // The button should be disabled since the mode hasn't been selected
        expect(downloadBtn).toBeDisabled();
    });

    it("should have a mode selection", async () => {
        const selections = screen.getByRole("combobox", {
            name: "build-mode",
        });

        // Ensure that the selections exists
        expect(selections).toBeInTheDocument();

        // Select an option "Debug"
        userEvent.selectOptions(selections, "Debug");

        expect(selections).toHaveValue("debug");

        // Select an option "Development"
        userEvent.selectOptions(selections, "Development");

        expect(selections).toHaveValue("development");
    });

    it("should be linked to download file url based from the mode selection", async () => {
        const selections = screen.getByRole("combobox", {
            name: "build-mode",
        });

        // Get the download button
        const downloadBtn = getButtonByName(
            "dashboard.modal.download.form.button.download"
        );

        // Ensure that the selections exists
        expect(selections).toBeInTheDocument();

        // The button should be disabled since the mode hasn't been selected
        expect(downloadBtn).toBeDisabled();

        // Select an option "Debug"
        userEvent.selectOptions(selections, "Debug");

        expect(selections).toHaveValue("debug");

        // The button should be enabled since the mode has already been selected
        expect(downloadBtn).toBeEnabled();

        // TODO need to add file downloading testing
    });
});
