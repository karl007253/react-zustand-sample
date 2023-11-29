import { StateCreator } from "zustand";

import produce from "immer";

import { Sort } from "../../data/Type";

import ApiSlice, {
    ApiTestRequestPayload,
    DataType,
    ParameterType,
} from "../interface/ApiInterface";
import FolderSlice from "../interface/FolderInterface";
import ServiceSlice from "../interface/ServiceInterface";
import mergeObjects from "../../helper/ObjectUtils";
import { javaTesterHttpRequest } from "../../helper/HttpRequest";

const createApiSlice: StateCreator<
    ApiSlice & FolderSlice & ServiceSlice,
    [["zustand/devtools", never]],
    [],
    ApiSlice
> = (setState, getState) => ({
    api: [],
    selectedApiUuid: null,
    runtimeValue: {},

    setSelectedConfiguration: (newConfigUUID?: string) => {
        const { api, selectedApiUuid, folder, selectedApiFolderUuid } =
            getState();

        if (selectedApiUuid) {
            // Update Api List
            const newApiArray = api.map((el) =>
                // Update Selected Api inside Api List
                el.uuid === selectedApiUuid
                    ? { ...el, configuration_uuid: newConfigUUID }
                    : el
            );

            setState(
                {
                    api: newApiArray,
                },
                false,
                "setSelectedApiConfiguration"
            );
        } else if (selectedApiFolderUuid) {
            // Update Folder List
            const newFolderArray = folder.map((el) =>
                // Update Selected Api inside Api List
                el.uuid === selectedApiFolderUuid
                    ? { ...el, configuration_uuid: newConfigUUID }
                    : el
            );

            setState(
                {
                    folder: newFolderArray,
                },
                false,
                "setSelectedApiFolderConfiguration"
            );
        }
    },

    addNewApi: (data) => {
        const { api } = getState();

        setState(
            {
                api: [...api, data],
            },
            false,
            "addNewApi"
        );
    },

    updateApiParameter: (requestMethod, newParameter) => {
        const { api, selectedApiUuid } = getState();

        if (selectedApiUuid) {
            // Update Selected Api inside Api List
            const newApiArray = produce(api, (draft) => {
                // Get the index of selectedApi in Api list
                const index = draft.findIndex(
                    (d) => d.uuid === selectedApiUuid
                );

                // Get the selectedApi
                const selectedApi = draft[index];

                // Construct new API
                draft[index] = {
                    ...selectedApi,
                    data: {
                        ...selectedApi.data,
                        [requestMethod]: {
                            ...selectedApi?.data?.[requestMethod],
                            parameter: {
                                ...selectedApi?.data?.[requestMethod]
                                    ?.parameter,
                                ...newParameter,
                            },
                        },
                    },
                };
            });

            // Set new state
            setState(
                {
                    api: newApiArray,
                },
                false,
                "updateApiParameter"
            );
        }
    },

    setSelectedApiUuid: (uuid) => {
        // set selected API
        setState(
            {
                selectedApiUuid: uuid,
                selectedApiFolderUuid: null, // Ensure no API folder is selected when an API is selected
            },
            false,
            "setSelectedApi"
        );
    },

    updateApiSort: (data: Sort[]) => {
        const { api } = getState();

        const newApiArray = api.map((el) => {
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
                api: newApiArray,
            },
            false,
            "updateApiSort"
        );
    },

    updateApiHeader: (requestMethod, header) => {
        const { api, selectedApiUuid } = getState();

        if (selectedApiUuid) {
            setState(
                {
                    api: produce(api, (draft) => {
                        // Get the index of selectedApi in Api list
                        const index = draft.findIndex(
                            (d) => d.uuid === selectedApiUuid
                        );

                        // Get the selectedApi
                        const selectedApi = draft[index];

                        // Replace the selectedApi in api list with a new API data with new header data
                        draft[index] = {
                            ...selectedApi,
                            data: {
                                ...selectedApi.data,
                                [requestMethod]: {
                                    ...selectedApi.data?.[requestMethod],
                                    header,
                                },
                            },
                        };
                    }),
                },
                false,
                "updateApiHeader"
            );
        }
    },

    deleteApi: () => {
        const { api, selectedApiUuid } = getState();

        // Make sure there is a selected api
        if (selectedApiUuid) {
            // Get all apis except for the selected one
            const newApiArray = api.filter(
                (item) => item.uuid !== selectedApiUuid
            );

            // Find the parent folder_uuid of the selected api
            const parentFolderUuid = api.find(
                ({ uuid }) => uuid === selectedApiUuid
            )?.folder_uuid;

            setState(
                {
                    api: newApiArray,
                    selectedApiUuid: null,
                    selectedApiFolderUuid: parentFolderUuid ?? null,
                },
                false,
                "deleteApi"
            );
        }
    },

    updateApiName: (name, title) => {
        const { api, selectedApiUuid } = getState();

        setState(
            {
                api: produce(api, (draft) => {
                    // Get the selected api
                    const index = draft.findIndex(
                        (a) => a.uuid === selectedApiUuid
                    );

                    const selectedApi = draft[index];

                    // Update the name and title
                    draft[index] = {
                        ...selectedApi,
                        name,
                        title: title || name,
                    };
                }),
            },
            false,
            "updateApiName"
        );
    },

    updateApiResult: (requestMethod, result) => {
        const { api, selectedApiUuid } = getState();

        if (selectedApiUuid) {
            setState(
                {
                    api: produce(api, (draft) => {
                        // Get the index of selectedApi in Api list
                        const index = draft.findIndex(
                            (d) => d.uuid === selectedApiUuid
                        );

                        // Get the selectedApi
                        const selectedApi = draft[index];

                        // Replace the selectedApi in api list with a new API data with new result data
                        draft[index] = {
                            ...selectedApi,
                            data: {
                                ...selectedApi.data,
                                [requestMethod]: {
                                    ...selectedApi.data?.[requestMethod],
                                    result,
                                },
                            },
                        };
                    }),
                },
                false,
                "updateApiResult"
            );
        }
    },
    updateApiAction: (requestMethod, action) => {
        const { api, selectedApiUuid } = getState();

        if (selectedApiUuid) {
            setState(
                {
                    api: produce(api, (draft) => {
                        // Get the index of selectedApi in Api list
                        const index = draft.findIndex(
                            (d) => d.uuid === selectedApiUuid
                        );

                        // Get the selectedApi
                        const selectedApi = draft[index];

                        // Replace the selectedApi in api list with a new API data with new action data
                        draft[index] = {
                            ...selectedApi,
                            data: {
                                ...selectedApi.data,
                                [requestMethod]: {
                                    ...selectedApi.data?.[requestMethod],
                                    action,
                                },
                            },
                        };
                    }),
                },
                false,
                "updateApiAction"
            );
        }
    },
    updateApiSocketChannelName: (requestMethod, channelName) => {
        const { runtimeValue, selectedApiUuid } = getState();

        if (selectedApiUuid) {
            setState(
                {
                    runtimeValue: produce(runtimeValue, (draft) => {
                        const currentRuntimeValue = draft[selectedApiUuid];

                        // update latest result to state, overwriting the older ones.
                        draft[selectedApiUuid] = {
                            ...currentRuntimeValue,
                            [requestMethod]: {
                                ...currentRuntimeValue?.[requestMethod],
                                socketChannelName: channelName,
                            },
                        };
                    }),
                },
                false,
                "updateApiSocketChannelName"
            );
        }
    },
    runApiTest: async (requestMethod, socketChannelName, applicationCode) => {
        const { runtimeValue, selectedApiUuid, api, service } = getState();

        if (selectedApiUuid) {
            // Obtain currently opened API data
            const apiData = api.find((item) => item.uuid === selectedApiUuid)
                ?.data?.[requestMethod];

            const currentRuntimeValue =
                runtimeValue[selectedApiUuid]?.[requestMethod] ?? {};

            const bodyType =
                apiData?.parameter?.body?.type ?? ParameterType.TEXT;

            // Prepare payload
            const payload: ApiTestRequestPayload = {
                application: {
                    code: applicationCode ?? "",
                },
                socket: {
                    channelName: socketChannelName,
                },
                header: {
                    value: mergeObjects(
                        apiData?.header?.map((e) => {
                            return {
                                [e.type]: e.value,
                            };
                        })
                    ) as { [key: string]: unknown },
                },
                query: {
                    value: currentRuntimeValue.parameterQueryValue ?? {},
                },
                body: {
                    type: bodyType,
                    value:
                        currentRuntimeValue.parameterBodyValue ??
                        (bodyType === ParameterType.TEXT ? "" : {}),
                },
                result: {
                    type: apiData?.result?.type ?? ParameterType.JSON,
                    fields: mergeObjects(
                        apiData?.result?.parameter?.map((e) => {
                            return {
                                [e.field]: e.type,
                            };
                        })
                    ) as { [key: string]: DataType },
                },
                // Use action from UI
                action: apiData?.action ?? [],
                service,
            };

            // call test endpoint with the payload
            return javaTesterHttpRequest.post("test/api", payload);
        }
        throw new Error("No API is selected");
    },
    updateOutputLog: (requestMethod, message) => {
        const { runtimeValue, selectedApiUuid } = getState();

        if (selectedApiUuid) {
            setState(
                {
                    runtimeValue: produce(runtimeValue, (draft) => {
                        const currentRuntimeValue = draft[selectedApiUuid];
                        const previousLog =
                            currentRuntimeValue?.[requestMethod]?.outputLog ??
                            [];

                        // add latest log content to state, while keeping the older ones intact.
                        draft[selectedApiUuid] = {
                            ...currentRuntimeValue,
                            [requestMethod]: {
                                ...currentRuntimeValue?.[requestMethod],
                                outputLog: [...previousLog, message],
                            },
                        };
                    }),
                },
                false,
                "updateOutputLog"
            );
        }
    },
    updateOutputResult: (requestMethod, result) => {
        const { runtimeValue, selectedApiUuid } = getState();

        if (selectedApiUuid) {
            setState(
                {
                    runtimeValue: produce(runtimeValue, (draft) => {
                        const currentRuntimeValue = draft[selectedApiUuid];

                        // update latest result to state, overwriting the older ones.
                        draft[selectedApiUuid] = {
                            ...currentRuntimeValue,
                            [requestMethod]: {
                                ...currentRuntimeValue?.[requestMethod],
                                outputResult: result,
                            },
                        };
                    }),
                },
                false,
                "updateOutputResult"
            );
        }
    },
    clearOutput: (requestMethod) => {
        const { runtimeValue, selectedApiUuid } = getState();

        if (selectedApiUuid) {
            setState(
                {
                    runtimeValue: produce(runtimeValue, (draft) => {
                        if (!draft[selectedApiUuid]) {
                            draft[selectedApiUuid] = {};
                        }
                        const currentRuntimeValue = draft[selectedApiUuid];

                        draft[selectedApiUuid] = {
                            ...currentRuntimeValue,
                            [requestMethod]: {
                                // only reset the output values, keeping the other properties intact
                                ...currentRuntimeValue?.[requestMethod],
                                outputLog: undefined,
                                outputResult: undefined,
                            },
                        };
                    }),
                },
                false,
                "clearOutput"
            );
        }
    },
    updateParameterValues: (requestMethod, parameterType, data) => {
        const { runtimeValue, selectedApiUuid } = getState();

        if (selectedApiUuid) {
            setState(
                {
                    runtimeValue: produce(runtimeValue, (draft) => {
                        // If the API doesn't have its runtime value yet, create an empty one
                        if (!draft[selectedApiUuid]) {
                            draft[selectedApiUuid] = {};
                        }

                        // Obtain current values, if available
                        const currentRuntimeValue = draft[selectedApiUuid];

                        let currentQueryValue =
                            currentRuntimeValue?.[requestMethod]
                                ?.parameterQueryValue;
                        let currentBodyValue =
                            currentRuntimeValue?.[requestMethod]
                                ?.parameterBodyValue;

                        if (parameterType === "query") {
                            if (typeof data === "string") {
                                // Impossible for query to have string values. Should not happen.
                                currentBodyValue = {};
                            } else {
                                currentQueryValue = {
                                    ...currentQueryValue,
                                    ...data,
                                };
                            }
                        } else if (parameterType === "body") {
                            if (
                                typeof currentBodyValue !== "string" &&
                                typeof data !== "string"
                            ) {
                                // If both current and new values are "json", assign with as an object.
                                currentBodyValue = {
                                    ...currentBodyValue,
                                    ...data,
                                };
                            } else {
                                // 1. Current type is "text" but new type is "json"
                                // 2. Current type is "json" but new type is "text"
                                // 3. Both current and new values are "text"
                                // Directly assign new value, discarding old value.
                                currentBodyValue = data;
                            }
                        }

                        // update latest output to state
                        draft[selectedApiUuid] = {
                            ...currentRuntimeValue,
                            [requestMethod]: {
                                ...currentRuntimeValue?.[requestMethod],
                                parameterQueryValue: currentQueryValue,
                                parameterBodyValue: currentBodyValue,
                            },
                        };
                    }),
                },
                false,
                "updateParameterValues"
            );
        }
    },
});

export default createApiSlice;
