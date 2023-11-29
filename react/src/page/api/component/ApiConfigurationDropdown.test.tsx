import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ApiConfigurationDropdown from "./ApiConfigurationDropdown";

import { ConfigurationType } from "../../../common/zustand/interface/ConfigurationInterface";
import useStore from "../../../common/zustand/Store";
import { FolderType } from "../../../common/zustand/interface/FolderInterface";

// Prepare mock data
const mockConfiguration = [
    {
        id: 1,
        uuid: "config-1",
        type: ConfigurationType.API,
        name: "Configuration 1",
        title: "Configuration 1",
        order: 0,
    },
    {
        id: 2,
        uuid: "config-2",
        type: ConfigurationType.API,
        name: "Configuration 2",
        title: "Configuration 2",
        order: 0,
    },
    {
        id: 3,
        uuid: "config-3",
        type: ConfigurationType.DATABASE,
        name: "Configuration 3",
        title: "Configuration 3",
        order: 0,
    },
];

const mockSelectedApiFolder = {
    uuid: "api-folder-root",
    id: 0,
    name: "Root",
    title: "Root",
    type: FolderType.API,
    order: 0,
};

const selectedConfiguration = mockConfiguration[0];

/**
 * Render ApiConfigurationDropdown Component
 * @param {boolean} isApiConfiguration indicate if configuration uuid is present in selected Api folder
 * @param {boolean} isEmptyConfiguration indicate is configuration list is empty
 */
const renderApiConfigurationDropdown = async (
    isApiConfiguration: boolean,
    isEmptyConfiguration: boolean
) => {
    const selectedApiFolder = isApiConfiguration
        ? {
              ...mockSelectedApiFolder,
              configuration_uuid: selectedConfiguration.uuid,
          }
        : mockSelectedApiFolder;

    const configuration = isEmptyConfiguration ? [] : mockConfiguration;

    useStore.setState({
        configuration,
        folder: [selectedApiFolder],
        selectedApiFolderUuid: selectedApiFolder.uuid,
    });

    render(<ApiConfigurationDropdown />);

    // Ensure the dropdown is opened
    await waitFor(() =>
        userEvent.click(screen.getByRole("combobox", { name: "auth-dropdown" }))
    );
};

describe("Api: ApiConfigurationDropdown", () => {
    it("should have an edit button to open an edit modal", async () => {
        await renderApiConfigurationDropdown(false, false);

        userEvent.click(
            screen.getByRole("button", {
                name: "api.dashboard.header.dropdown.edit",
            })
        );

        // Ensure a modal to edit configuration is shown
        expect(screen.getByRole("dialog")).toContainElement(
            screen.getByText("api.dashboard.modalConfig.title")
        );
    });

    it("should have a list of Api Configuration, which is retrieved from global state store", async () => {
        await renderApiConfigurationDropdown(false, false);

        mockConfiguration.forEach(({ type, name }) => {
            if (type === ConfigurationType.API) {
                // Ensure all configuration with the type of API is present
                expect(
                    screen.getByRole("button", { name })
                ).toBeInTheDocument();
            } else {
                // Ensure all other configuration which is not the type of API, is absent
                expect(
                    screen.queryByRole("button", { name })
                ).not.toBeInTheDocument();
            }
        });
    });

    it("should show the placeholder if the selected Api or selected APi folder does not have a configuration", async () => {
        await renderApiConfigurationDropdown(false, false);

        // Ensure "select" is shown when the selected api action or folder does not have a configuration
        expect(
            screen.getByDisplayValue("api.dashboard.header.dropdown.select")
        );
    });

    it("should trigger configuration changes if a button of Api configuration is clicked", async () => {
        await renderApiConfigurationDropdown(false, false);

        // Ensure the selected configuration name is absent initially
        expect(
            screen.queryByDisplayValue(selectedConfiguration.name)
        ).not.toBeInTheDocument();

        // Change the selected configuration
        userEvent.click(
            screen.getByRole("button", { name: selectedConfiguration.name })
        );

        // Ensure the newly selected configuration name is present upon a successful button click
        expect(
            screen.getByDisplayValue(selectedConfiguration.name)
        ).toBeInTheDocument();
    });

    it("should have a clear button to clear the selected configuration", async () => {
        // Render ApiConfigurationDropdown with {isApiConfiguration = true}
        await renderApiConfigurationDropdown(true, false);

        const clearButton = () =>
            screen.queryByRole("button", {
                name: "api.dashboard.header.dropdown.clear",
            });

        // Ensure the selected configuration is present initially
        expect(
            screen.getByDisplayValue(selectedConfiguration.name)
        ).toBeInTheDocument();

        // Ensure the clear button is present
        expect(clearButton()).toBeInTheDocument();

        // Clear the selected configuration
        userEvent.click(
            screen.getByRole("button", {
                name: "api.dashboard.header.dropdown.clear",
            })
        );

        // Ensure the selected configuration is absent upon a successful clear
        expect(
            screen.getByDisplayValue("api.dashboard.header.dropdown.select")
        ).toBeInTheDocument();

        // Ensure the clear button is not shown
        expect(clearButton()).not.toBeInTheDocument();
    });

    it("should have a separator line if configuration list is not empty", async () => {
        await renderApiConfigurationDropdown(false, false);

        // Ensure separator is present
        expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("should not have a separator line if configuration list is empty", async () => {
        await renderApiConfigurationDropdown(false, true);

        // Ensure separator is absent
        expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });

    it("should only show a selectable configuration from the list (i.e., excluding the currently selected authentication options)", async () => {
        await renderApiConfigurationDropdown(true, false);

        // Ensure the currently selected configuration is not shown.
        expect(
            screen.queryByRole("button", { name: selectedConfiguration.name })
        ).not.toBeInTheDocument();

        // Ensure that any other configurations is shown.
        mockConfiguration
            .filter((config) => config.type === ConfigurationType.API)
            .filter((config) => config.uuid !== selectedConfiguration.uuid)
            .forEach((config) => {
                expect(
                    screen.getByRole("button", { name: config.name })
                ).toBeInTheDocument();
            });

        // Pick another new configuration (the second options) from the list
        const newSelectedConfiguration = mockConfiguration[1];

        userEvent.click(
            screen.getByRole("button", {
                name: newSelectedConfiguration.name,
            })
        );

        // Ensure the newly selected configuration is not shown.
        expect(
            screen.queryByRole("button", {
                name: newSelectedConfiguration.name,
            })
        ).not.toBeInTheDocument();

        // Ensure that any other configurations is shown.
        mockConfiguration
            .filter((config) => config.type === ConfigurationType.API)
            .filter((config) => config.uuid !== newSelectedConfiguration.uuid)
            .forEach((config) => {
                expect(
                    screen.getByRole("button", { name: config.name })
                ).toBeInTheDocument();
            });
    });
});
