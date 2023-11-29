import produce from "immer";
import { StateCreator } from "zustand";

import httpRequest, { HttpResponse } from "../../helper/HttpRequest";
import ApplicationSlice, {
    ApplicationResponseModel,
    StorageInfo,
} from "../interface/ApplicationInterface";
import FolderSlice, { FolderType } from "../interface/FolderInterface";
import ActionSlice from "../interface/ActionInterface";
import ApiSlice, { ApiData } from "../interface/ApiInterface";
import SchedulerSlice from "../interface/SchedulerInterface";
import ConfigurationSlice from "../interface/ConfigurationInterface";
import DatabaseSlice from "../interface/DatabaseInterface";
import DatabaseTableSlice from "../interface/DatabaseTableInterface";
import DatabaseTableContentSlice from "../interface/DatabaseTableContentInterface";
import ServiceSlice from "../interface/ServiceInterface";

import generateUniqueId from "../../helper/UniqueId";
import {
    API_PREFIX,
    CONFIGURATION_PREFIX,
    DATABASE_PREFIX,
    FOLDER_PREFIX,
    SCHEDULER_PREFIX,
    TABLE_PREFIX,
    DATABASE_PARENT,
    ACTION_PREFIX,
    SERVICE_PREFIX,
    TABLE_FIELD_PREFIX,
} from "../../data/Constant";
import { generateUUIDtoFunction } from "../../component/helper/Function";
import ActionFormat from "../../component/event-flow/data/Functions";
import mergeObjects from "../../helper/ObjectUtils";
import { iterateModifyFunctions } from "../../component/event-flow/helper/Function";

const createApplicationSlice: StateCreator<
    ApplicationSlice &
        ConfigurationSlice &
        FolderSlice &
        ApiSlice &
        DatabaseSlice &
        DatabaseTableSlice &
        DatabaseTableContentSlice &
        ActionSlice &
        SchedulerSlice &
        ServiceSlice,
    [["zustand/devtools", never]],
    [],
    ApplicationSlice
> = (setState, getState) => ({
    applicationData: null,
    storageInfo: null,

    // TODO: Update this to false once the SaveApplication is successful
    dataHasChanged: false,
    built: null,

    // TODO: Complete the initial state upon successful in retrieving application data
    // Get an Application data by application_code
    getApplicationByApplicationCode: async (applicationCode) => {
        const result = await httpRequest.get<
            void,
            HttpResponse<ApplicationResponseModel>
        >(`/v1/applications/${applicationCode}`);

        // Make sure that all are arrays
        result.data.configuration = result.data.configuration || [];
        result.data.folder = result.data.folder || [];
        result.data.api = result.data.api || [];
        result.data.database = result.data.database || [];
        result.data.database_table = result.data.database_table || [];
        result.data.action = result.data.action || [];
        result.data.scheduler = result.data.scheduler || [];
        result.data.service = result.data.service || [];

        // Prepare service state
        result.data.service = result.data.service.map((service) =>
            produce(service, (draft) => {
                // Set service's uuid
                draft.uuid = generateUniqueId(SERVICE_PREFIX);
            })
        );

        // Prepare action state
        result.data.action = result.data.action?.map((action) =>
            produce(action, (draft) => {
                // Set action's uuid. Reuse existing uuid from API response, if exists
                draft.uuid =
                    draft.data?.uuid ?? generateUniqueId(ACTION_PREFIX);

                // If the data has no uuid then get the uuid from draft.uuid
                if (draft.data !== undefined && draft.data.uuid === undefined) {
                    draft.data.uuid = draft.uuid;
                }

                // Add uuid to function
                draft.data?.process?.forEach((process) => {
                    generateUUIDtoFunction(process);
                });
            })
        );

        // Prepare configuration state
        result.data.configuration = result.data.configuration?.map(
            (configuration) =>
                produce(configuration, (draft) => {
                    // Set configuration's uuid
                    draft.uuid = generateUniqueId(CONFIGURATION_PREFIX);
                })
        );

        // Prepare folder state
        result.data.folder = result.data.folder?.map((folder) =>
            produce(folder, (draft) => {
                // Set folder's uuid
                draft.uuid = generateUniqueId(FOLDER_PREFIX);

                // Set folder's configuration uuid if applicable
                if (draft.configuration_id) {
                    draft.configuration_uuid = result.data.configuration?.find(
                        (c) => draft.configuration_id === c.id
                    )?.uuid;
                }
            })
        );

        result.data.folder = result.data.folder?.map((folder) =>
            // Set parent folder's uuid if applicable, after all folder has been assigned a uuid
            produce(folder, (draft) => {
                if (draft.folder_id) {
                    draft.folder_uuid = result.data.folder?.find(
                        (f) => draft.folder_id === f.id
                    )?.uuid;
                }
            })
        );

        // Prepare API state
        result.data.api = result.data.api?.map((api) =>
            produce(api, (draft) => {
                // Set API's uuid
                draft.uuid = generateUniqueId(API_PREFIX);

                // Set parent folder's uuid if applicable
                if (draft.folder_id) {
                    draft.folder_uuid = result.data.folder?.find(
                        (f) => draft.folder_id === f.id
                    )?.uuid;
                }

                // Set API's configuration uuid if applicable
                if (draft.configuration_id) {
                    draft.configuration_uuid = result.data.configuration?.find(
                        (c) => draft.configuration_id === c.id
                    )?.uuid;
                }

                // Add uuid to function
                const requestMethodKeys = Object.keys(draft.data as ApiData);
                requestMethodKeys.forEach((key) => {
                    draft.data?.[key as keyof ApiData]?.action?.forEach(
                        (action) => {
                            generateUUIDtoFunction(action);
                        }
                    );
                });
            })
        );

        // Prepare database state
        result.data.database = result.data.database?.map((database) =>
            produce(database, (draft) => {
                // Set database's uuid
                draft.uuid = generateUniqueId(DATABASE_PREFIX);
            })
        );

        // Prepare database table state
        result.data.database_table = result.data.database_table?.map((table) =>
            produce(table, (draft) => {
                // Set database's uuid
                draft.uuid = generateUniqueId(TABLE_PREFIX);

                // Set database table's database_id uuid if applicable
                if (draft.database_id) {
                    draft.database_uuid = result.data.database?.find(
                        (c) => draft.database_id === c.id
                    )?.uuid;
                }

                // Set fields uuid if applicable
                if (draft.data?.structure) {
                    draft.data.structure = draft.data.structure.map(
                        (field) => ({
                            ...field,
                            uuid: generateUniqueId(TABLE_FIELD_PREFIX),
                        })
                    );
                }
            })
        );

        // Prepare Scheduler state
        result.data.scheduler = result.data.scheduler?.map((scheduler) =>
            produce(scheduler, (draft) => {
                // Set Scheduler's uuid
                draft.uuid = generateUniqueId(SCHEDULER_PREFIX);

                // Set parent folder's uuid if applicable
                if (draft.folder_id) {
                    draft.folder_uuid = result.data.folder?.find(
                        (f) => draft.folder_id === f.id
                    )?.uuid;
                }

                // Set API's configuration uuid if applicable
                if (draft.configuration_id) {
                    draft.configuration_uuid = result.data.configuration?.find(
                        (c) => draft.configuration_id === c.id
                    )?.uuid;
                }

                // Add uuid to function
                draft.data?.action?.forEach((action) => {
                    generateUUIDtoFunction(action);
                });
            })
        );

        // set application data
        setState(
            {
                configuration: result.data.configuration ?? [],
                folder: result.data.folder ?? [],
                api: result.data.api ?? [],
                database: result.data.database ?? [],
                databaseTable: result.data.database_table ?? [],
                scheduler: result.data.scheduler ?? [],
                action: result.data.action ?? [],
                service: result.data.service ?? [],
                applicationData: result.data.app,
                built: result.data.built,
            },
            false,
            "getApplicationByApplicationCode"
        );

        // Find the root folder of api, which is the first folder with the API folder type and without a parent's folder
        const rootSelectedApiFolder = result.data.folder.find(
            (f) => f.type === FolderType.API && !f.folder_id
        );

        // Find the root folder of scheduler, which is the first folder with the SCHEDULER folder type and without a parent's folder
        const rootSelectedSchedulerFolder = result.data.folder.find(
            (f) => f.type === FolderType.SCHEDULER && !f.folder_id
        );

        const {
            setSelectedApiFolderUuid,
            setSelectedDatabaseUuid,
            setSelectedSchedulerFolderUuid,
        } = getState();

        if (rootSelectedApiFolder) {
            // Set the root folder of api as the default selected api folder
            setSelectedApiFolderUuid(rootSelectedApiFolder.uuid);
        }

        if (rootSelectedSchedulerFolder) {
            // Set the root folder of scheduler as the default selected scheduler folder
            setSelectedSchedulerFolderUuid(rootSelectedSchedulerFolder.uuid);
        }

        // Set the selected root database
        setSelectedDatabaseUuid(DATABASE_PARENT);

        return result;
    },

    // TODO: Prepare object for all foreign field before submit data to backend
    saveApplication: async () => {
        // get states
        const { folder, api, database, scheduler } = getState();

        // merge data
        const payload = { folder, api, database, scheduler };

        // TODO: update endpoint once backend is implemented
        // call save endpoint with merged web data
        return httpRequest.post("save-data-endpoint", payload);
    },

    // Get Storage Info by application_code
    getStorageInfoByApplicationCode: async (applicationCode: string) => {
        const result = await httpRequest.get<void, HttpResponse<StorageInfo>>(
            `/v1/applications/${applicationCode}/storage-info`
        );

        if (result.success && result.data) {
            setState(
                {
                    storageInfo: result.data ?? [],
                },
                false,
                "getApplicationStorageInfo"
            );
        }

        return result;
    },

    // TODO: Prepare object for all foreign field before submit data to backend
    patchApplication: async (applicationCode) => {
        // get states
        const {
            folder,
            api,
            configuration,
            action,
            database,
            databaseTable,
            scheduler,
            service,
            selectedDatabaseTableUuid,
            databaseTableContentContents,
        } = getState();

        const result = await httpRequest.patch<
            void,
            HttpResponse<ApplicationResponseModel>
        >(`/v1/applications/${applicationCode}`, {
            api,
            configuration,
            action,
            folder,
            database,
            database_table: databaseTable,
            scheduler,
            service,
        });

        // Make sure that all are arrays
        result.data.configuration = result.data.configuration || configuration;
        result.data.folder = result.data.folder || folder;
        result.data.api = result.data.api || api;
        result.data.action = result.data.action || action;
        result.data.database = result.data.database || database;
        result.data.database_table =
            result.data.database_table || databaseTable;
        result.data.scheduler = result.data.scheduler || scheduler;
        result.data.service = result.data.service || service;

        // Get structure from the selected database table
        // Use this structure to update the list of fields
        const selectedDatabaseTable = result.data.database_table.find(
            (item) => item.uuid === selectedDatabaseTableUuid
        );

        // add uuid to functions of api, action, scheduler
        // api
        result.data.api = result.data.api?.map((currentApi) =>
            produce(currentApi, (draft) => {
                const requestMethodKeys = Object.keys(draft.data as ApiData);
                requestMethodKeys.forEach((key) => {
                    draft.data?.[key as keyof ApiData]?.action?.forEach(
                        (currentAction) => {
                            generateUUIDtoFunction(currentAction);
                        }
                    );
                });
            })
        );

        // action
        result.data.action = result.data.action?.map((currentAction) =>
            produce(currentAction, (draft) => {
                if (draft.data !== undefined) {
                    // Get the uuid from main
                    draft.data.uuid = draft.uuid;
                }

                draft.data?.process?.forEach((process) => {
                    generateUUIDtoFunction(process);
                });
            })
        );

        // scheduler
        result.data.scheduler = result.data.scheduler?.map((currentScheduler) =>
            produce(currentScheduler, (draft) => {
                draft.data?.action?.forEach((currentAction) => {
                    generateUUIDtoFunction(currentAction);
                });
            })
        );

        // set application data
        setState(
            {
                configuration: result.data.configuration ?? [],
                folder: result.data.folder ?? [],
                api: result.data.api ?? [],
                action: result.data.action ?? [],
                scheduler: result.data.scheduler ?? [],
                database: result.data.database ?? [],
                databaseTable: result.data.database_table ?? [],
                service: result.data.service ?? [],
                databaseTableContentFields:
                    selectedDatabaseTable?.data?.structure ?? [],
                databaseTableContentContents:
                    selectedDatabaseTable?.data?.structure &&
                    selectedDatabaseTable.data.structure.length > 0
                        ? databaseTableContentContents
                        : [],
                dataHasChanged: true,
            },
            false,
            "patchApplication"
        );

        return result;
    },

    buildApplication: async (
        applicationCode,
        buildMode,
        versionType = "minor"
    ) => {
        // prepare payload
        const payload = {
            extra: "",
            compiler_type: "java-spring-boot",
            version_type: versionType || "minor",

            // set build mode
            mode_type: buildMode,
        };

        // call save endpoint with merged web data
        return httpRequest.post(
            `v1/applications/${applicationCode}/build`,
            payload
        );
    },

    getApplicationLog: async (applicationCode) => {
        // TODO: Call fetch log endpoint and return the result once backend is implemented,
        // for now return dummy data

        return httpRequest.get(`v1/logs/${applicationCode}`);
    },

    uploadAppIcon: async (applicationCode, iconFile) => {
        const payload = new FormData();
        payload.append("file", iconFile);
        return httpRequest.post(
            `/v1/applications/${applicationCode}/icon`,
            payload
        );
    },

    cleanupActionFlow: () => {
        // Do a final cleanup on event flow action list (API and scheduler).
        // Includes: removing unused parameters for any global functions used inside action list, if any
        const { api, action, scheduler } = getState();

        const removeUnusedGlobalParam = (
            actionItem: ActionFormat
        ): ActionFormat => {
            const targetGlobalFunc = action.find(
                (a) => a.name === actionItem.function
            );
            // If function is a global user-defined function, attempt to do the cleanup
            if (targetGlobalFunc) {
                // Obtain its current parameter list
                const globalParamList = targetGlobalFunc.data?.parameter;

                if (globalParamList) {
                    // Compare it with global parameter list, and only includes the specified parameter, discarding the dangling ones
                    // Example, global parameter has "a", "b", and  "c", but event flow has extra parameter "d", then we discard the "d"
                    const actionParameter = actionItem.parameter;
                    const actionParameterType = actionItem.parameter_type;
                    return {
                        ...actionItem,
                        parameter: actionParameter
                            ? mergeObjects(
                                  Object.keys(globalParamList).map((p) => ({
                                      [p]: actionParameter[p],
                                  }))
                              )
                            : undefined,
                        parameter_type: actionParameterType
                            ? mergeObjects(
                                  Object.keys(globalParamList).map((p) => ({
                                      [p]: actionParameterType[p],
                                  }))
                              )
                            : undefined,
                    };
                }
            }
            return actionItem;
        };

        // Do cleanup on all API event flow
        const cleanedApi = produce(api, (draft) => {
            draft.forEach((apiItem) => {
                if (!apiItem.data) {
                    return;
                }
                Object.keys(apiItem.data).forEach((method) => {
                    const request = apiItem.data?.[method as keyof ApiData];
                    if (request?.action) {
                        request.action = iterateModifyFunctions(
                            request.action,
                            removeUnusedGlobalParam
                        );
                    }
                });
            });
        });

        // Do cleanup on all scheduler event flow
        const cleanedScheduler = produce(scheduler, (draft) => {
            draft.forEach((schedulerItem) => {
                const schedulerData = schedulerItem?.data;
                if (!schedulerData) {
                    return;
                }
                const schedulerAction = schedulerData.action;
                if (!schedulerAction) {
                    return;
                }
                schedulerData.action = iterateModifyFunctions(
                    schedulerAction,
                    removeUnusedGlobalParam
                );
            });
        });

        setState(
            {
                api: cleanedApi,
                scheduler: cleanedScheduler,
            },
            false,
            "cleanupApi"
        );
    },

    setDataHasChanged: async (dataHasChanged: boolean) => {
        setState(
            {
                dataHasChanged,
            },
            false,
            "setDataHasChanged"
        );
    },
});

export default createApplicationSlice;
