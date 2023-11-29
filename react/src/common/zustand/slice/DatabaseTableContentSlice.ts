import produce from "immer";
import { StateCreator } from "zustand";
import httpRequest, { HttpResponse } from "../../helper/HttpRequest";
import DatabaseTableContentSlice, {
    DatabaseTableContentContentResponse,
    DatabaseTableContentCreateUpdateResponse,
} from "../interface/DatabaseTableContentInterface";

const createDatabaseTableContentFieldSlice: StateCreator<
    DatabaseTableContentSlice,
    [["zustand/devtools", never]],
    [],
    DatabaseTableContentSlice
> = (setState, getState) => ({
    databaseTableContentFields: [],
    databaseTableContentContents: [],

    clearDatabaseTableContents: () => {
        setState(
            {
                databaseTableContentFields: [],
                databaseTableContentContents: [],
            },
            false,
            "clearDatabaseTableContents"
        );
    },

    getApplicationDatabaseTableContents: async (
        applicationCode,
        databaseId,
        tableId
    ) => {
        const result = await httpRequest.get<
            void,
            HttpResponse<DatabaseTableContentContentResponse>
        >(
            `/v1/applications/${applicationCode}/databases/${databaseId}/tables/${tableId}/contents`
        );

        if (result.success && result.data) {
            setState(
                {
                    databaseTableContentFields: result.data?.fields ?? [],
                    databaseTableContentContents: result.data?.contents ?? [],
                },
                false,
                "getApplicationDatabaseTableContents"
            );
        }

        return result;
    },

    postApplicationDatabaseTableContents: async (
        applicationCode,
        databaseId,
        tableId,
        data
    ) => {
        const result = await httpRequest.post<
            void,
            HttpResponse<DatabaseTableContentCreateUpdateResponse>
        >(
            `/v1/applications/${applicationCode}/databases/${databaseId}/tables/${tableId}/contents`,
            data
        );

        const { databaseTableContentContents } = getState();

        if (result.success && result.data) {
            setState(
                {
                    databaseTableContentContents: [
                        ...databaseTableContentContents,
                        result.data,
                    ],
                },
                false,
                "postApplicationDatabaseTableContents"
            );
        }

        return result;
    },

    patchApplicationDatabaseTableContent: async (
        applicationCode,
        databaseId,
        tableId,
        recordId,
        data
    ) => {
        const result = await httpRequest.patch<
            void,
            HttpResponse<DatabaseTableContentCreateUpdateResponse>
        >(
            `/v1/applications/${applicationCode}/databases/${databaseId}/tables/${tableId}/contents/${recordId}`,
            data
        );

        const { databaseTableContentContents } = getState();

        if (result.success && result.data) {
            setState(
                {
                    databaseTableContentContents: produce(
                        databaseTableContentContents,
                        (draft) => {
                            const index = draft.findIndex(
                                ({ record }) => record.id === recordId
                            );

                            draft[index].values = result.data?.values;
                        }
                    ),
                },
                false,
                "patchApplicationDatabaseTableContent"
            );
        }

        return result;
    },

    deleteApplicationDatabaseTableContent: async (
        applicationCode,
        databaseId,
        tableId,
        recordId
    ) => {
        const result = await httpRequest.delete<void, HttpResponse<null>>(
            `/v1/applications/${applicationCode}/databases/${databaseId}/tables/${tableId}/contents/${recordId}`
        );

        const { databaseTableContentContents } = getState();

        if (result.success) {
            const deletedDatabaseTableContent =
                databaseTableContentContents.filter(
                    (item) => item.record.id !== recordId
                );

            setState(
                {
                    databaseTableContentContents: deletedDatabaseTableContent,
                },
                false,
                "deleteApplicationDatabaseTableContent"
            );
        }

        return result;
    },

    addTableRecord: (data) => {
        const { databaseTableContentContents } = getState();

        setState(
            {
                databaseTableContentContents: [
                    ...databaseTableContentContents,
                    data,
                ],
            },
            false,
            "addTableRecord"
        );
    },
});

export default createDatabaseTableContentFieldSlice;
