import { useEffect, useState } from "react";
import useStore from "../zustand/Store";
import { Api } from "../zustand/interface/ApiInterface";
import { Folder } from "../zustand/interface/FolderInterface";
import {
    Configuration,
    ConfigurationType,
} from "../zustand/interface/ConfigurationInterface";
import { Scheduler } from "../zustand/interface/SchedulerInterface";

/**
 * Find the active configuration of a selected Api, database or scheduler
 * @param {ConfigurationType} type configuration type to find
 *
 * TODO: Update the implementation for Database & Scheduler, especially the switch case below
 */
const useActiveConfiguration = (type: ConfigurationType) => {
    const {
        configuration,
        folder,
        selectedApi,
        selectedApiFolder,
        selectedScheduler,
        selectedSchedulerFolder,
    } = useStore((state) => ({
        configuration: state.configuration,
        folder: state.folder,

        selectedApi: state.api.find((a) => a.uuid === state.selectedApiUuid),
        selectedApiFolder: state.folder.find(
            (f) => f.uuid === state.selectedApiFolderUuid
        ),
        selectedScheduler: state.scheduler.find(
            (s) => s.uuid === state.selectedSchedulerUuid
        ),
        selectedSchedulerFolder: state.folder.find(
            (f) => f.uuid === state.selectedSchedulerFolderUuid
        ),
    }));

    const [activeConfiguration, setActiveConfiguration] =
        useState<Configuration>();

    /**
     * Find the active configuration of a selected Api, database or scheduler
     * @param {Api | Folder | Database | Scheduler | undefined} element element to find for its active configuration
     */
    const findActiveConfiguration = (element?: Api | Scheduler | Folder) => {
        // Set element's configuration as the activeConfiguration if it is found, and quit this function
        if (element?.configuration_uuid) {
            const activeConfig = configuration.find(
                (c) => c.uuid === element.configuration_uuid
            );
            setActiveConfiguration(activeConfig);
            return;
        }

        // Find the parent's active configuration with a recursion if a parent's folder is found
        if (element?.folder_uuid) {
            const parentElement = folder.find(
                (f) => f.uuid === element.folder_uuid
            );
            findActiveConfiguration(parentElement);
            return;
        }

        // By default, set undefined as activeConfiguration
        setActiveConfiguration(undefined);
    };

    // Listen to the selected Api, Database, Scheduler and look for its corresponding active configuration
    useEffect(() => {
        switch (type) {
            case ConfigurationType.API: {
                // Get the selectedApi or selectedApiFolder
                const element = selectedApi || selectedApiFolder;

                findActiveConfiguration(element);
                break;
            }

            case ConfigurationType.DATABASE:
                break;

            case ConfigurationType.SCHEDULER: {
                // Get the selectedScheduler or selectedSchedulerFolder
                const element = selectedScheduler || selectedSchedulerFolder;

                findActiveConfiguration(element);
                break;
            }
            default:
                break;
        }
    }, [
        selectedApi,
        selectedApiFolder,
        configuration,
        selectedScheduler,
        selectedSchedulerFolder,
    ]);

    return activeConfiguration;
};

export default useActiveConfiguration;
