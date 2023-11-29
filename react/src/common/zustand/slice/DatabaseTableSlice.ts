import produce from "immer";
import { StateCreator } from "zustand";

import { Sort } from "../../data/Type";

import DatabaseTableSlice, {
    DatabaseTable,
} from "../interface/DatabaseTableInterface";
import DatabaseSlice from "../interface/DatabaseInterface";

const createDatabaseTableSlice: StateCreator<
    DatabaseTableSlice & DatabaseSlice,
    [["zustand/devtools", never]],
    [],
    DatabaseTableSlice
> = (setState, getState) => ({
    databaseTable: [],
    selectedDatabaseTableUuid: null,

    addNewDatabaseTable: (newTable: DatabaseTable) => {
        const { databaseTable } = getState();

        setState(
            {
                databaseTable: [...databaseTable, newTable],
            },
            false,
            "addNewDatabaseTable"
        );
    },

    setSelectedDatabaseTableUuid: (uuid: string | null) => {
        setState(
            {
                selectedDatabaseTableUuid: uuid,
                selectedDatabaseUuid: null, // Ensure no database is selected when table is selected
            },
            false,
            "setSelectedDatabaseTableUuid"
        );
    },

    updateDatabaseTableStructure: (field) => {
        const { databaseTable, selectedDatabaseTableUuid } = getState();

        if (selectedDatabaseTableUuid) {
            setState(
                {
                    databaseTable: produce(databaseTable, (draft) => {
                        const index = draft.findIndex(
                            (d) => d.uuid === selectedDatabaseTableUuid
                        );

                        const selectedDatabaseTable = draft[index];

                        draft[index] = {
                            ...selectedDatabaseTable,
                            data: {
                                ...selectedDatabaseTable.data,
                                structure: field,
                            },
                        };
                    }),
                },
                false,
                "updateDatabaseTableStructure"
            );
        }
    },

    updateDatabaseTableName: (name, title) => {
        const { databaseTable, selectedDatabaseTableUuid } = getState();

        if (selectedDatabaseTableUuid) {
            setState(
                {
                    databaseTable: produce(databaseTable, (draft) => {
                        const index = draft.findIndex(
                            (d) => d.uuid === selectedDatabaseTableUuid
                        );

                        const selectedDatabaseTable = draft[index];

                        draft[index] = {
                            ...selectedDatabaseTable,
                            name,
                            title: title || name,
                        };
                    }),
                },
                false,
                "updateDatabaseTableName"
            );
        }
    },

    updateDatabaseTableSort: (data: Sort[]) => {
        const { databaseTable } = getState();

        const newDatabaseTableArray = databaseTable.map((el) => {
            const newData = data.find((item) => item.uuid === el.uuid);

            return newData
                ? {
                      ...el,
                      order: newData.order,
                  }
                : el;
        });

        setState(
            {
                databaseTable: newDatabaseTableArray,
            },
            false,
            "updateDatabaseTableSort"
        );
    },

    updateDatabaseTableRelation: (relation) => {
        const { databaseTable, selectedDatabaseTableUuid } = getState();

        if (selectedDatabaseTableUuid) {
            setState(
                {
                    databaseTable: produce(databaseTable, (draft) => {
                        const index = draft.findIndex(
                            (d) => d.uuid === selectedDatabaseTableUuid
                        );

                        const selectedDatabaseTable = draft[index];

                        draft[index] = {
                            ...selectedDatabaseTable,
                            data: {
                                ...selectedDatabaseTable.data,
                                relations: relation,
                            },
                        };
                    }),
                },
                false,
                "updateDatabaseTableRelation"
            );
        }
    },

    deleteDatabaseTable: () => {
        const { databaseTable, selectedDatabaseTableUuid } = getState();

        // Make sure there is a selected database table
        if (selectedDatabaseTableUuid) {
            // Select all except for the selected one
            const updatedDatabaseTable = databaseTable.filter(
                (item) => item.uuid !== selectedDatabaseTableUuid
            );

            setState(
                {
                    databaseTable: updatedDatabaseTable,
                    selectedDatabaseTableUuid: null,
                },
                false,
                "deleteDatabaseTable"
            );
        }
    },
});

export default createDatabaseTableSlice;
