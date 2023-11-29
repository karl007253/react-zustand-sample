import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Scheduler configuration dropdown component
import SchedulerConfigurationDropdown from "./SchedulerConfigurationDropdown";

import { ConfigurationType } from "../../../common/zustand/interface/ConfigurationInterface";
import useStore from "../../../common/zustand/Store";
import { FolderType } from "../../../common/zustand/interface/FolderInterface";

// Prepare mock data for the configuration
const mockConfiguration = [
    {
        id: 1,
        uuid: "config-1",
        type: ConfigurationType.SCHEDULER,
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
];

// Prepare mock data for the scheduler data
const mockSelectedSchedulerFolder = {
    uuid: "FOLDER-1",
    id: 1,
    name: "cardealer",
    title: "cardealer",
    type: FolderType.SCHEDULER,
    order: 1,
};

const selectedConfiguration = mockConfiguration[0];

/**
 * Render SchedulerConfigurationDropdown Component
 * @param {boolean} isSchedulerConfiguration indicate if configuration uuid is present in selected Scheduler folder
 * @param {boolean} isEmptyConfiguration indicate is configuration list is empty
 */
const renderSchedulerConfigurationDropdown = async (
    isSchedulerConfiguration: boolean,
    isEmptyConfiguration: boolean
) => {
    const selectedSchedulerFolder = isSchedulerConfiguration
        ? {
              ...mockSelectedSchedulerFolder,
              configuration_uuid: selectedConfiguration.uuid,
          }
        : mockSelectedSchedulerFolder;

    const configuration = isEmptyConfiguration ? [] : mockConfiguration;

    useStore.setState({
        configuration,
        folder: [selectedSchedulerFolder],
        // set selectedSchedulerFolderUuid to be updated with the new choosed configuration
        selectedSchedulerFolderUuid: selectedSchedulerFolder.uuid,
    });

    render(<SchedulerConfigurationDropdown />);

    // Ensure the dropdown is opened by click the config dropdown toggle
    await waitFor(() =>
        userEvent.click(
            screen.getByRole("combobox", { name: "config-dropdown" })
        )
    );
};

describe("Scheduler: SchedulerConfigurationDropdown", () => {
    it("should have an edit button to open an edit modal", async () => {
        await renderSchedulerConfigurationDropdown(false, false);

        expect(
            screen.getByRole("button", {
                name: "scheduler.dashboard.header.dropdown.edit",
            })
        ).toBeInTheDocument();
    });

    it("should have only a list of Scheduler Configuration", async () => {
        await renderSchedulerConfigurationDropdown(false, false);

        mockConfiguration.forEach(({ type, name }) => {
            if (type === ConfigurationType.SCHEDULER) {
                // Ensure all configuration with the type of SCHEDULER is present
                expect(
                    screen.getByRole("button", { name })
                ).toBeInTheDocument();
            } else {
                // Ensure all other configuration which is not the type of SCHEDULER, is absent
                expect(
                    screen.queryByRole("button", { name })
                ).not.toBeInTheDocument();
            }
        });
    });

    it("should show the placeholder if the selected Scheduler or selected Scheduler folder does not have a configuration", async () => {
        await renderSchedulerConfigurationDropdown(false, false);

        // showing the "select" text if configuration unavailable
        expect(
            screen.getByDisplayValue(
                "scheduler.dashboard.header.dropdown.select"
            )
        );
    });

    it("should trigger configuration changes if a button of Scheduler configuration is clicked", async () => {
        await renderSchedulerConfigurationDropdown(false, false);

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
        // Render SchedulerConfigurationDropdown with {isSchedulerConfiguration = true}
        await renderSchedulerConfigurationDropdown(true, false);

        // Ensure the selected configuration is present initially
        expect(
            screen.getByDisplayValue(selectedConfiguration.name)
        ).toBeInTheDocument();

        // Clear the selected configuration
        userEvent.click(
            screen.getByRole("button", {
                name: "scheduler.dashboard.header.dropdown.clear",
            })
        );

        // Ensure the selected configuration is absent upon a successful clear
        expect(
            screen.getByDisplayValue(
                "scheduler.dashboard.header.dropdown.select"
            )
        ).toBeInTheDocument();
    });

    it("should have a separator line if configuration list is not empty", async () => {
        await renderSchedulerConfigurationDropdown(false, false);

        // Ensure separator is present
        expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("should not have a separator line if configuration list is empty", async () => {
        await renderSchedulerConfigurationDropdown(false, true);

        // Ensure separator is absent
        expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });
});
