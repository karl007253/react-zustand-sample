import userEvent from "@testing-library/user-event";
import produce from "immer";

import { act } from "react-dom/test-utils";
import { render, screen, waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";

import useStore from "../../../../common/zustand/Store";
import DatabaseContent from "./DatabaseContent";

import {
    DatabaseTable,
    DatabaseTableDataType,
    Field,
} from "../../../../common/zustand/interface/DatabaseTableInterface";
import { DatabaseTableContentCreateUpdateResponse } from "../../../../common/zustand/interface/DatabaseTableContentInterface";
import { mockedHttpRequest } from "../../../../common/helper/HttpRequest";

// Mock databaseTableContentFields
const databaseTableContentFields: Field[] = [
    {
        primary: false,
        uuid: "name",
        name: "name",
        type: DatabaseTableDataType.VARCHAR,
        length: "5",
        optional: true,
        default: "default name",
    },
    {
        primary: false,
        uuid: "note",
        name: "note",
        type: DatabaseTableDataType.VARCHAR,
        length: "5",
        optional: true,
        default: "default note",
    },
    {
        primary: false,
        uuid: "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
        name: "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
        type: DatabaseTableDataType.VARCHAR,
        length: "100",
        optional: false,
        default: "default zzz",
    },
    {
        primary: false,
        uuid: "blob",
        name: "blob",
        type: DatabaseTableDataType.BLOB,
        length: "5000",
        optional: true,
        default: "default blob",
    },
    {
        primary: false,
        uuid: "date",
        name: "date",
        type: DatabaseTableDataType.DATE,
        length: "100",
        optional: true,
        default: "default date",
    },
    {
        primary: false,
        uuid: "datetime",
        name: "datetime",
        type: DatabaseTableDataType.DATETIME,
        length: "100",
        optional: true,
        default: "default datetime",
    },
    {
        primary: false,
        uuid: "time",
        name: "time",
        type: DatabaseTableDataType.TIME,
        length: "100",
        optional: true,
        default: "default time",
    },
    {
        primary: false,
        uuid: "timestamp",
        name: "timestamp",
        type: DatabaseTableDataType.TIMESTAMP,
        length: "100",
        optional: true,
        default: "default timestamp",
    },
    {
        primary: false,
        uuid: "int",
        name: "int",
        type: DatabaseTableDataType.INT,
        length: "5",
        optional: false,
        default: "1",
    },
    {
        primary: false,
        uuid: "DECIMAL",
        name: "DECIMAL",
        type: DatabaseTableDataType.DECIMAL,
        length: "5",
        optional: false,
        default: "1",
    },
    {
        primary: false,
        uuid: "boolean",
        name: "boolean",
        type: DatabaseTableDataType.BOOLEAN,
        length: "10",
        optional: true,
        default: "true",
    },
];

// Mock databaseTableContentContents
const databaseTableContentContents: DatabaseTableContentCreateUpdateResponse[] =
    [
        {
            record: {
                database_table_id: 1,
                id: 2,
            },
            values: {
                DECIMAL: "1",
                blob: "data:image/png;base64",
                boolean: "0",
                date: "default date",
                datetime: "default datetime",
                int: 1,
                name: "default name",
                note: "default note",
                time: "20:15",
                timestamp: "default timestamp",
                zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz: "default zzz",
            },
        },
        {
            record: {
                database_table_id: 1,
                id: 3,
            },
            values: {
                DECIMAL: "1",
                blob: "data:image/png;base64",
                boolean: "0",
                date: "default date",
                datetime: "default datetime",
                int: 1,
                name: "default name",
                note: "default note",
                time: "default time",
                timestamp: "default timestamp",
                zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz: "default zzz",
            },
        },
    ];

// Mock databaseTables
const databaseTables: DatabaseTable[] = [
    {
        id: 1,
        database_id: 1,
        name: "table1",
        title: "table1",
        data: {
            relations: [],
            structure: databaseTableContentFields,
        },
        order: 1,
        uuid: "TABLE-DupxzqA2yzoOOlTiEwgCH",
        database_uuid: "DATABASE-G9nk8-b3wYlm3uWTcf9eF",
    },
    {
        id: 2,
        database_id: 1,
        name: "table2",
        title: "table2",
        data: {
            relations: [],
            structure: databaseTableContentFields,
        },
        order: 2,
        uuid: "TABLE-dejWs3EJmMuX563_q75bK",
        database_uuid: "DATABASE-G9nk8-b3wYlm3uWTcf9eF",
    },
];

// Mock selectedDatabaseTableUuid
const selectedDatabaseTableUuid: string | null = "TABLE-DupxzqA2yzoOOlTiEwgCH";

const mockRender = async () => {
    useStore.setState({
        databaseTableContentContents,
        databaseTableContentFields,
        databaseTable: databaseTables,
        selectedDatabaseTableUuid,
        clearDatabaseTableContents: jest
            .fn()
            .mockImplementationOnce(() => undefined),
        getApplicationDatabaseTableContents: jest
            .fn()
            .mockImplementationOnce(() => Promise.resolve()),
        postApplicationDatabaseTableContents: jest
            .fn()
            .mockImplementationOnce(() => Promise.resolve()),
        patchApplicationDatabaseTableContent: jest
            .fn()
            .mockImplementationOnce(() => Promise.resolve()),
        deleteApplicationDatabaseTableContent: jest
            .fn()
            .mockImplementationOnce(() => Promise.resolve()),
    });

    await act(async () => {
        render(<DatabaseContent />);
    });
};

const inputTextbox = (
    type: string,
    recordId: number,
    structureIndex: number
) => {
    return screen.getByRole("textbox", {
        name: `database-content-input-${type}-${recordId}-${structureIndex}`,
    });
};

const inputCombobox = (recordId: number, structureIndex: number) => {
    return screen.getByRole("combobox", {
        name: `database-content-input-boolean-${recordId}-${structureIndex}`,
    });
};

const inputSpinbutton = (
    type: string,
    recordId: number,
    structureIndex: number
) => {
    return screen.getByRole("spinbutton", {
        name: `database-content-input-${type}-${recordId}-${structureIndex}`,
    });
};

const buttonDelete = (recordId: number) => {
    return screen.getByRole("button", {
        name: `database-content-delete-button-${recordId}`,
    });
};

describe("Database: DatabaseContent", () => {
    beforeEach(() => mockRender());

    const clearDatabaseTableContents: jest.Mock = jest
        .fn()
        .mockImplementationOnce(() => {
            act(() => {
                useStore.setState(
                    {
                        databaseTableContentContents: [],
                        databaseTableContentFields: [],
                        clearDatabaseTableContents,
                    },
                    true,
                    "clearDatabaseTableContents"
                );
            });
            return undefined;
        });

    const getApplicationDatabaseTableContents: jest.Mock = jest
        .fn()
        .mockImplementationOnce(() => {
            act(() => {
                useStore.setState(
                    {
                        databaseTableContentContents,
                        databaseTableContentFields,
                        databaseTable: databaseTables,
                        selectedDatabaseTableUuid,
                        getApplicationDatabaseTableContents,
                    },
                    true,
                    "getApplicationDatabaseTableContents"
                );
            });
            return Promise.resolve();
        });

    // Make the mock return the custom axios response
    expect(clearDatabaseTableContents).not.toHaveBeenCalled();
    expect(getApplicationDatabaseTableContents).not.toHaveBeenCalled();
    clearDatabaseTableContents();
    getApplicationDatabaseTableContents();
    expect(clearDatabaseTableContents).toHaveBeenCalled();
    expect(getApplicationDatabaseTableContents).toHaveBeenCalled();

    it("should show the table", () => {
        const table = screen.getByRole("table", {
            name: `database-content-table-container`,
        });
        expect(table).toBeInTheDocument();
    });

    it("should show the textbox input fields", () => {
        const inputFields = screen.queryAllByRole("textbox");
        expect(inputFields.length).toEqual(10);
    });

    it("should show the textbox input fields", () => {
        const inputFields = screen.queryAllByRole("combobox");
        expect(inputFields.length).toEqual(2);
    });

    it("should show the spinbutton input fields", () => {
        const inputFields = screen.queryAllByRole("spinbutton");
        expect(inputFields.length).toEqual(4);
    });

    it("should show the correct number of table head items depending on the number of fields", () => {
        const tableHeads = screen.queryAllByTestId("table-head");
        expect(tableHeads.length).toEqual(databaseTableContentFields.length);
    });

    it("should create a new record and triggering postApplicationDatabaseTableContents when the add button getting pressed", async () => {
        const mockedData = {
            record: {
                database_table_id: 1,
                id: 4,
            },
            values: {
                DECIMAL: "1",
                blob: "data:image/png;base64",
                boolean: "0",
                date: "default date",
                datetime: "default datetime",
                int: 1,
                name: "default name",
                note: "default note",
                time: "20:15",
                timestamp: "default timestamp",
                zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz: "default zzz",
            },
        };

        // Prepare the response we want to get from axios
        const mockedResponse: AxiosResponse = {
            data: mockedData,
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        const mockedFinalData = [...databaseTableContentContents, mockedData];

        const postApplicationDatabaseTableContents: jest.Mock = jest.fn(() => {
            act(() => {
                useStore.setState(
                    {
                        databaseTableContentContents: mockedFinalData,
                        databaseTableContentFields,
                        databaseTable: databaseTables,
                        selectedDatabaseTableUuid,
                        postApplicationDatabaseTableContents,
                    },
                    true,
                    "postApplicationDatabaseTableContents"
                );
            });
            return Promise.resolve(mockedResponse);
        });

        // Click Add button
        userEvent.click(
            screen.getByRole("button", {
                name: "database-content-add-button",
            })
        );

        // Make the mock return the custom axios response
        mockedHttpRequest.post.mockResolvedValueOnce(mockedResponse);
        expect(postApplicationDatabaseTableContents).not.toHaveBeenCalled();
        const data = await postApplicationDatabaseTableContents();

        // Find the newly added record and field
        await waitFor(() => {
            expect(postApplicationDatabaseTableContents).toHaveBeenCalledTimes(
                1
            );

            expect(data).toEqual(mockedResponse);

            mockedFinalData.forEach((item) => {
                // Ensure input field of varchar type is shown with the expected value
                expect(inputTextbox("varchar", item.record.id, 0)).toHaveValue(
                    item.values.name
                );

                // Ensure input field of boolean type is shown with the expected value
                expect(inputCombobox(item.record.id, 10)).toHaveValue(
                    item.values.boolean
                );

                // Ensure input field of int type is shown with the expected value
                expect(inputSpinbutton("int", item.record.id, 8)).toHaveValue(
                    item.values.int
                );

                // Ensure delete button is shown
                expect(buttonDelete(item.record.id)).toBeInTheDocument();
            });
        });
    });

    it("should edit the record and triggering patchApplicationDatabaseTableContent when a field getting edited", async () => {
        const mockedId = 3;
        const mockedIndex = 1;
        const mockedData = {
            record: {
                database_table_id: 1,
                id: mockedId,
            },
            values: {
                DECIMAL: "1",
                blob: "data:image/png;base64",
                boolean: "0",
                date: "default date",
                datetime: "default datetime",
                int: 1,
                name: "default name-new",
                note: "default note",
                time: "20:15",
                timestamp: "default timestamp",
                zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz: "default zzz",
            },
        };

        const mockedFinalData = [...databaseTableContentContents];
        mockedFinalData[mockedIndex] = mockedData;

        // Prepare the response we want to get from axios
        const mockedResponse: AxiosResponse = {
            data: mockedData,
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        const patchApplicationDatabaseTableContent: jest.Mock = jest.fn(() => {
            act(() => {
                useStore.setState(
                    {
                        databaseTableContentFields,
                        databaseTableContentContents: produce(
                            databaseTableContentContents,
                            (draft) => {
                                const index = draft.findIndex(
                                    ({ record }) => record.id === mockedId
                                );

                                draft[index] = mockedData;
                            }
                        ),
                        databaseTable: databaseTables,
                        selectedDatabaseTableUuid,
                        patchApplicationDatabaseTableContent,
                    },
                    true,
                    "patchApplicationDatabaseTableContent"
                );
            });
            return Promise.resolve(mockedResponse);
        });

        // Input anything to the input field of name
        userEvent.type(inputTextbox("varchar", mockedId, 0), "-new");

        // Make the mock return the custom axios response
        mockedHttpRequest.patch.mockResolvedValueOnce(mockedResponse);
        // Ensure patchApplicationDatabaseTableContent is not called immediately
        expect(patchApplicationDatabaseTableContent).toHaveBeenCalledTimes(0);
        const data = await patchApplicationDatabaseTableContent();

        // Ensure patchApplicationDatabaseTableContent is called upon completion of user typing
        await waitFor(() => {
            expect(patchApplicationDatabaseTableContent).toHaveBeenCalledTimes(
                1
            );
            expect(data).toEqual(mockedResponse);

            // Ensure the input field of name is updated after user input
            expect(inputTextbox("varchar", mockedId, 0)).toHaveValue(
                `${databaseTableContentContents[mockedIndex].values.name}-new`
            );

            mockedFinalData.forEach((item) => {
                // Ensure input field of varchar type is shown with the expected value
                expect(inputTextbox("varchar", item.record.id, 0)).toHaveValue(
                    item.values.name
                );

                // Ensure input field of boolean type is shown with the expected value
                expect(inputCombobox(item.record.id, 10)).toHaveValue(
                    item.values.boolean
                );

                // Ensure input field of int type is shown with the expected value
                expect(inputSpinbutton("int", item.record.id, 8)).toHaveValue(
                    item.values.int
                );

                // Ensure delete button is shown
                expect(buttonDelete(item.record.id)).toBeInTheDocument();
            });
        });
    });

    it("should delete a record and triggering deleteApplicationDatabaseTableContent when the delete button getting pressed", async () => {
        const mockedId = 3;
        const mockedFinalData = [
            {
                record: {
                    database_table_id: 1,
                    id: 2,
                },
                values: {
                    DECIMAL: "1",
                    blob: "data:image/png;base64",
                    boolean: "0",
                    date: "default date",
                    datetime: "default datetime",
                    int: 1,
                    name: "default name",
                    note: "default note",
                    time: "20:15",
                    timestamp: "default timestamp",
                    zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz:
                        "default zzz",
                },
            },
        ];

        // Prepare the response we want to get from axios
        const mockedResponse: AxiosResponse = {
            data: null,
            status: 200,
            statusText: "OK",
            headers: {},
            config: {},
        };

        const deleteApplicationDatabaseTableContent: jest.Mock = jest.fn(() => {
            act(() => {
                const deletedDatabaseTableContent =
                    databaseTableContentContents.filter(
                        (item) => item.record.id !== mockedId
                    );

                useStore.setState(
                    {
                        databaseTableContentFields,
                        databaseTableContentContents:
                            deletedDatabaseTableContent,
                        databaseTable: databaseTables,
                        selectedDatabaseTableUuid,
                        deleteApplicationDatabaseTableContent,
                    },
                    true,
                    "deleteApplicationDatabaseTableContent"
                );
            });
            return Promise.resolve(mockedResponse);
        });

        // Click delete button
        userEvent.click(
            screen.getByRole("button", {
                name: `database-content-delete-button-${mockedId}`,
            })
        );

        // Make the mock return the custom axios response
        mockedHttpRequest.delete.mockResolvedValueOnce(mockedResponse);
        // Ensure deleteApplicationDatabaseTableContent is not called immediately
        expect(deleteApplicationDatabaseTableContent).toHaveBeenCalledTimes(0);
        const data = await deleteApplicationDatabaseTableContent();

        // Ensure deleteApplicationDatabaseTableContent will delete the record
        await waitFor(() => {
            expect(deleteApplicationDatabaseTableContent).toHaveBeenCalledTimes(
                1
            );

            expect(data).toEqual(mockedResponse);

            // Ensure the deleted record delete button is not there
            expect(
                screen.queryByText(`database-content-delete-button-${mockedId}`)
            ).not.toBeInTheDocument();

            // Ensure the not deleted fields still there
            mockedFinalData.forEach((item) => {
                // Ensure input field of varchar type is shown with the expected value
                expect(inputTextbox("varchar", item.record.id, 0)).toHaveValue(
                    item.values.name
                );

                // Ensure input field of boolean type is shown with the expected value
                expect(inputCombobox(item.record.id, 10)).toHaveValue(
                    item.values.boolean
                );

                // Ensure input field of int type is shown with the expected value
                expect(inputSpinbutton("int", item.record.id, 8)).toHaveValue(
                    item.values.int
                );

                // Ensure delete button is shown
                expect(buttonDelete(item.record.id)).toBeInTheDocument();
            });
        });
    });
});
