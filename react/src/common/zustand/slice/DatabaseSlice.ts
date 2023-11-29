import produce from "immer";
import { StateCreator } from "zustand";
import { Sort } from "../../data/Type";
import DatabaseSlice, {
    Database,
    DatabaseData,
} from "../interface/DatabaseInterface";
import DatabaseTableSlice from "../interface/DatabaseTableInterface";
import { DATABASE_PARENT } from "../../data/Constant";

const createDatabaseSlice: StateCreator<
    DatabaseSlice & DatabaseTableSlice,
    [["zustand/devtools", never]],
    [],
    DatabaseSlice
> = (setState, getState) => ({
    database: [],
    selectedDatabaseUuid: DATABASE_PARENT,

    addNewDatabase: (newDatabase: Database) => {
        const { database } = getState();

        setState(
            {
                database: [...database, newDatabase],
            },
            false,
            "addNewDatabase"
        );
    },

    setSelectedDatabaseUuid: (uuid: string | null) => {
        // set selected Database uuid
        setState(
            {
                selectedDatabaseUuid: uuid,
                selectedDatabaseTableUuid: null, // Ensure no table is selected when database is selected
            },
            false,
            "setSelectedDatabaseUuid"
        );
    },

    updateDatabaseConfiguration: (data: DatabaseData) => {
        const { database, selectedDatabaseUuid } = getState();

        if (selectedDatabaseUuid) {
            setState(
                {
                    database: produce(database, (draft) => {
                        const index = draft.findIndex(
                            ({ uuid }) => uuid === selectedDatabaseUuid
                        );

                        const selectedDatabase = draft[index];

                        draft[index] = {
                            ...selectedDatabase,
                            data,
                        };
                    }),
                },
                false,
                "updateDatabaseConfiguration"
            );
        }
    },

    updateDatabaseName: (name, title) => {
        const { database, selectedDatabaseUuid } = getState();

        if (selectedDatabaseUuid) {
            setState(
                {
                    database: produce(database, (draft) => {
                        const index = draft.findIndex(
                            (d) => d.uuid === selectedDatabaseUuid
                        );

                        const selectedDatabase = draft[index];

                        draft[index] = {
                            ...selectedDatabase,
                            name,
                            title: title || name,
                        };
                    }),
                },
                false,
                "updateDatabaseName"
            );
        }
    },

    updateDatabaseSort: (data: Sort[]) => {
        const { database } = getState();

        const newDatabaseArray = database.map((el) => {
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
                database: newDatabaseArray,
            },
            false,
            "updateDatabaseSort"
        );
    },

    deleteDatabase: () => {
        const { database, databaseTable, selectedDatabaseUuid } = getState();

        // Make sure there is a selected database
        if (selectedDatabaseUuid) {
            // Select all except for the selected database
            const updatedDatabase = database.filter(
                (item) => item.uuid !== selectedDatabaseUuid
            );

            // Select all tables except for the tables of selected database
            const updatedDatabaseTable = databaseTable.filter(
                (item) => item.database_uuid !== selectedDatabaseUuid
            );

            setState(
                {
                    database: updatedDatabase,
                    databaseTable: updatedDatabaseTable,
                    selectedDatabaseUuid: null,
                },
                false,
                "deleteDatabase"
            );
        }
    },
});

export default createDatabaseSlice;
