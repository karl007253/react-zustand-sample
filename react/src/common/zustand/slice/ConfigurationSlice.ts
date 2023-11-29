import { StateCreator } from "zustand";
import ConfigurationSlice, {
    Configuration,
} from "../interface/ConfigurationInterface";
import FolderSlice from "../interface/FolderInterface";
import ApiSlice from "../interface/ApiInterface";

const createConfigurationSlice: StateCreator<
    ConfigurationSlice & ApiSlice & FolderSlice,
    [["zustand/devtools", never]],
    [],
    ConfigurationSlice
> = (setState, getState) => ({
    configuration: [],

    updateConfiguration: (newConfig: Configuration) => {
        const { configuration } = getState();
        // Update Config List
        const newConfigList = configuration.map((el) =>
            el.uuid === newConfig.uuid ? newConfig : el
        );

        setState(
            {
                configuration: newConfigList,
            },
            false,
            "updateConfiguration"
        );
    },

    addNewConfiguration: (data) => {
        const { configuration } = getState();

        setState(
            {
                // New data will be placed on top
                configuration: [data, ...configuration],
            },
            false,
            "addNewConfiguration"
        );
    },

    deleteConfiguration: (configUUID: string) => {
        const { configuration, api, folder } = getState();

        // If configuration is selected in Api or Folder, set to undefined
        const newApiArray = api.map((el) =>
            el.configuration_uuid === configUUID
                ? { ...el, configuration_uuid: undefined }
                : el
        );
        const newFolderArray = folder.map((el) =>
            el.configuration_uuid === configUUID
                ? { ...el, configuration_uuid: undefined }
                : el
        );

        setState(
            {
                configuration: configuration.filter((config) => {
                    return config.uuid !== configUUID;
                }),
                api: newApiArray,
                folder: newFolderArray,
            },
            false,
            "deleteConfiguration"
        );
    },
});

export default createConfigurationSlice;
