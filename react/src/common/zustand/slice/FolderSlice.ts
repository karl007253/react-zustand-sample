import { StateCreator } from "zustand";
import produce from "immer";

import { Sort } from "../../data/Type";

import SchedulerSlice, { Scheduler } from "../interface/SchedulerInterface";
import ApiSlice, { Api } from "../interface/ApiInterface";
import FolderSlice, { Folder, FolderType } from "../interface/FolderInterface";

const createFolderSlice: StateCreator<
    FolderSlice & ApiSlice & SchedulerSlice,
    [["zustand/devtools", never]],
    [],
    FolderSlice
> = (setState, getState) => ({
    folder: [],
    selectedApiFolderUuid: null,
    selectedSchedulerFolderUuid: null,

    // TODO: This is just a testing data. Remove this later.
    /*
    folder: [
        {
            uuid: "api-folder-root",
            id: 0,
            name: "Root",
            title: "Root",
            type: FolderType.API,
            order: 0,
        },
    ],
    selectedApiFolderUuid: "api-folder-root",
     */

    addNewFolder: (data) => {
        const { folder } = getState();

        setState(
            {
                folder: [...folder, data],
            },
            false,
            "addNewFolder"
        );
    },

    setSelectedApiFolderUuid: (uuid) => {
        setState(
            {
                selectedApiFolderUuid: uuid,
                selectedApiUuid: null, // Ensure no api is selected when an API folder is selected
            },
            false,
            "setSelectedApiFolder"
        );
    },

    setSelectedSchedulerFolderUuid: (uuid) => {
        setState(
            {
                selectedSchedulerFolderUuid: uuid,
                selectedSchedulerUuid: null, // Ensure no Scheduler is selected when an Scheduler folder is selected
            },
            false,
            "setSelectedSchedulerFolder"
        );
    },

    deleteFolder: (type) => {
        const {
            api,
            scheduler,
            folder,
            selectedApiFolderUuid,
            selectedSchedulerFolderUuid,
        } = getState();

        // TODO : filterFolderList - enhance this function to support apis and schedulers
        // Make sure there's a selected folder
        if (type === FolderType.API) {
            type ApiFolder = Api & Folder;
            const filterFolderList = (
                folders: ApiFolder[],
                apis: ApiFolder[],
                parent: string | null
            ) => {
                const result: { [name: string]: ApiFolder[] } = {
                    api: [],
                    folder: [],
                };

                // Get all except for the selected folder and its children
                result.folder = folders.filter(
                    (item) =>
                        item.uuid !== parent && item.folder_uuid !== parent
                );

                // Get all apis that are not children of the selected folder
                result.api = apis.filter((item) => item.folder_uuid !== parent);

                // Get all that are to be removed
                const foldersToRemove = folders.filter(
                    (item) =>
                        item.uuid !== parent && item.folder_uuid === parent
                );

                // Loop through the folders that are to be removed and find its children
                for (let i = 0; i < foldersToRemove.length; i++) {
                    const filterResult = filterFolderList(
                        result.folder,
                        result.api,
                        foldersToRemove[i].uuid
                    );

                    result.folder = filterResult.folder;
                    result.api = filterResult.api;
                }

                return result;
            };

            // Filter folders and apis
            const result = filterFolderList(folder, api, selectedApiFolderUuid);

            // Find the parent_folder uuid of the selected folder
            const parentFolderUuid = folder.find(
                ({ uuid }) => uuid === selectedApiFolderUuid
            )?.folder_uuid;

            setState(
                {
                    api: result.api,
                    folder: result.folder,
                    selectedApiFolderUuid: parentFolderUuid ?? null,
                },
                false,
                "deleteFolder"
            );
        }
        if (type === FolderType.SCHEDULER) {
            // type SchedulerFolder = Scheduler & Folder;

            const filterFolderList = (
                folders: Folder[],
                parent: string | null
            ) => {
                const result: { [name: string]: Folder[] } = {
                    folder: [],
                };

                // Get all except for the selected folder and its children
                result.folder = folders.filter(
                    (item) =>
                        item.uuid !== parent && item.folder_uuid !== parent
                );

                // Get all that are to be removed
                const foldersToRemove = folders.filter(
                    (item) =>
                        item.uuid !== parent && item.folder_uuid === parent
                );

                // Loop through the folders that are to be removed and find its children
                for (let i = 0; i < foldersToRemove.length; i++) {
                    const filterResult = filterFolderList(
                        result.folder,
                        foldersToRemove[i].uuid
                    );

                    result.folder = filterResult.folder;
                }

                return result;
            };

            const filterSchedulerList = (
                folders: Folder[],
                schedulers: Scheduler[],
                parent: string | null
            ) => {
                const result: { [name: string]: Scheduler[] } = {
                    scheduler: [],
                };

                // Get all schedulers that are not children of the selected folder
                result.scheduler = schedulers.filter(
                    (item) => item.folder_uuid !== parent
                );

                // Get all that are to be removed
                const foldersToRemove = folders.filter(
                    (item) =>
                        item.uuid !== parent && item.folder_uuid === parent
                );

                // Loop through the folders that are to be removed and find its children
                for (let i = 0; i < foldersToRemove.length; i++) {
                    const filterResult = filterSchedulerList(
                        folders,
                        result.scheduler,
                        foldersToRemove[i].uuid
                    );

                    result.scheduler = filterResult.scheduler;
                }

                return result;
            };
            // Filter folders and schedulers
            const resultFolder = filterFolderList(
                folder,
                selectedSchedulerFolderUuid
            );

            const resultScheduler = filterSchedulerList(
                folder,
                scheduler,
                selectedSchedulerFolderUuid
            );

            // Find the parent_folder uuid of the selected folder
            const parentFolderUuid = folder.find(
                ({ uuid }) => uuid === selectedSchedulerFolderUuid
            )?.folder_uuid;

            setState(
                {
                    scheduler: resultScheduler.scheduler,
                    folder: resultFolder.folder,
                    selectedSchedulerFolderUuid: parentFolderUuid ?? null,
                },
                false,
                "deleteFolder"
            );
        }
    },

    updateFolderName: (uuid, name, title) => {
        const { folder } = getState();

        setState(
            {
                folder: produce(folder, (draft) => {
                    // Find the index of the selected folder
                    const index = draft.findIndex((f) => f.uuid === uuid);

                    const selectedFolder = draft[index];

                    // Update only the folder that have parent
                    if (selectedFolder.folder_uuid) {
                        // Update the name and title
                        draft[index] = {
                            ...selectedFolder,
                            name,
                            title: title || name,
                        };
                    }
                }),
            },
            false,
            "updateFolderName"
        );
    },

    updateFolderSort(data: Sort[]) {
        const { folder } = getState();

        const newFolderArray = folder.map((el) => {
            const newData = data.find((item) => item.uuid === el.uuid);

            return newData
                ? {
                      ...el,
                      order: newData.order,
                      folder_uuid: newData.parent,
                  }
                : el;
        });

        setState(
            {
                folder: newFolderArray,
            },
            false,
            "updateFolderSort"
        );
    },

    updateFolderStatus: (status) => {
        const { folder, selectedSchedulerFolderUuid } = getState();

        setState(
            {
                folder: produce(folder, (draft) => {
                    // Get the selected scheduler folder
                    const index = draft.findIndex(
                        (a) => a.uuid === selectedSchedulerFolderUuid
                    );

                    const selectedFolder = draft[index];

                    // Update the data status
                    draft[index] = {
                        ...selectedFolder,
                        data: {
                            ...selectedFolder.data,
                            status,
                        },
                    };
                }),
            },
            false,
            "updateFolderStatus"
        );
    },
});

export default createFolderSlice;
