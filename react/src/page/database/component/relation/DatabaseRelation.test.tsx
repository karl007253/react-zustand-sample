import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import DatabaseRelation from "./DatabaseRelation";

import useStore from "../../../../common/zustand/Store";
import { DatabaseTableDataType } from "../../../../common/zustand/interface/DatabaseTableInterface";

const firstInputName = "database-table-relation-input-name-0";
const firstInputField = "database-table-relation-input-field-0";
const firstInputForeignTable = "database-table-relation-input-foreigntable-0";
const firstInputForeignField = "database-table-relation-input-foreignfield-0";
const firstDeleteButton = "database-table-relation-button-delete-0";

const mockStructureTable3 = [
    {
        primary: true,
        uuid: "order_ID",
        name: "order_ID",
        type: DatabaseTableDataType.INT,
        length: "11",
        optional: true,
        default: "null",
    },
    {
        primary: false,
        uuid: "customer_ID",
        name: "customer_ID",
        type: DatabaseTableDataType.INT,
        length: "11",
        optional: true,
        default: "null",
    },
    {
        primary: false,
        uuid: "total",
        name: "total",
        type: DatabaseTableDataType.INT,
        length: "11",
        optional: true,
        default: "null",
    },
];

const mockDatabaseTable3 = {
    uuid: "TABLE-3",
    name: "orders",
    title: "orders",
    order: 1,
    database_uuid: "DATABASE-1",
    data: {
        structure: mockStructureTable3,
    },
};

const mockStructureTable2 = [
    {
        primary: false,
        uuid: "customer_ID",
        name: "customer_ID",
        type: DatabaseTableDataType.INT,
        length: "11",
        optional: true,
        default: "null",
    },
    {
        primary: false,
        uuid: "full_name",
        name: "full_name",
        type: DatabaseTableDataType.VARCHAR,
        length: "50",
        optional: true,
        default: "null",
    },
];

const mockDatabaseTable2 = {
    uuid: "TABLE-2",
    name: "customers",
    title: "customers",
    order: 1,
    database_uuid: "DATABASE-1",
    data: {
        structure: mockStructureTable2,
    },
};

const mockStructureTable1 = [
    {
        primary: true,
        uuid: "user_ID",
        name: "user_ID",
        type: DatabaseTableDataType.INT,
        length: "11",
        optional: true,
        default: "null",
    },
    {
        primary: false,
        uuid: "user_name",
        name: "user_name",
        type: DatabaseTableDataType.VARCHAR,
        length: "50",
        optional: true,
        default: "null",
    },
];

const mockRelationsTable1 = [
    {
        name: "customersrelation",
        field: "user_ID",
        foreign_table: "customers",
        foreign_field: "customer_ID",
    },
    {
        name: "ordersrelation",
        field: "user_ID",
        foreign_table: "orders",
        foreign_field: "customer_ID",
    },
];

const mockDatabaseTable1 = {
    uuid: "TABLE-1",
    name: "users",
    title: "users",
    order: 1,
    database_uuid: "DATABASE-1",
    data: {
        structure: mockStructureTable1,
        relations: mockRelationsTable1,
    },
};

const mockDatabaseTable = [
    mockDatabaseTable1,
    mockDatabaseTable2,
    mockDatabaseTable3,
];

describe("Database: DatabaseRelation", () => {
    beforeEach(() =>
        render(
            <MemoryRouter>
                <DatabaseRelation />
                <ToastContainer />
            </MemoryRouter>
        )
    );

    it("should show no input fields before having any data", () => {
        const inputFieldsTextbox = screen.queryAllByRole("textbox");
        expect(inputFieldsTextbox.length).toEqual(0);

        const inputFieldsCombobox = screen.queryAllByRole("combobox");
        expect(inputFieldsCombobox.length).toEqual(0);
    });

    it("should add a new first relation data after clicking Add button", async () => {
        // Click Add button
        userEvent.click(
            screen.getByRole("button", {
                name: "common.button.add",
            })
        );

        // ensure a new record is added
        expect(
            screen.getByRole("textbox", { name: firstInputName })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: firstInputField })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: firstInputForeignTable })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: firstInputForeignField })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: firstDeleteButton })
        ).toBeInTheDocument();
    });

    describe("with relations data in databasetable data field", () => {
        let mockUpdateDatabaseTableRelation: jest.Mock;

        // render module with data
        beforeEach(() => {
            // Ensure mockUpdateDatabaseTableRelation is reset to 0 call, by assigning a new jest.fn() in each test
            mockUpdateDatabaseTableRelation = jest.fn();
            act(() => {
                useStore.setState(
                    {
                        databaseTable: mockDatabaseTable,
                        selectedDatabaseTableUuid: "TABLE-1",
                        updateDatabaseTableRelation:
                            mockUpdateDatabaseTableRelation,
                    },
                    true
                );
            });
        });

        it("should display all fields data", () => {
            mockRelationsTable1.forEach((item, index) => {
                // Ensure input field of name is shown with the expected value
                expect(
                    screen.getByRole("textbox", {
                        name: `database-table-relation-input-name-${index}`,
                    })
                ).toHaveValue(item.name);

                // Ensure input field of field is shown with the expected value
                expect(
                    screen.getByRole("combobox", {
                        name: `database-table-relation-input-field-${index}`,
                    })
                ).toHaveValue(item.field);

                // Ensure input field of foreign table is shown with the expected value
                expect(
                    screen.getByRole("combobox", {
                        name: `database-table-relation-input-foreigntable-${index}`,
                    })
                ).toHaveValue(item.foreign_table);

                // Ensure input field of foreign field is shown with the expected value
                expect(
                    screen.getByRole("combobox", {
                        name: `database-table-relation-input-foreignfield-${index}`,
                    })
                ).toHaveValue(item.foreign_field);

                // Ensure delete button is shown
                expect(
                    screen.getByRole("button", {
                        name: `database-table-relation-button-delete-${index}`,
                    })
                ).toBeInTheDocument();
            });
        });

        it("should update relation data in global state when an existing value of input field is changed", async () => {
            const changedRelation = mockRelationsTable1[0];

            // Input new value to the input field of name
            userEvent.type(
                screen.getByRole("textbox", { name: firstInputName }),
                "-new"
            );

            // Ensure the input field of name is updated after user input
            expect(
                screen.getByRole("textbox", { name: firstInputName })
            ).toHaveValue(`${changedRelation.name}-new`);

            // Ensure mockUpdateDatabaseTableRelation is not called immediately
            expect(mockUpdateDatabaseTableRelation).toHaveBeenCalledTimes(0);

            // Ensure mockUpdateDatabaseTableRelation is called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateDatabaseTableRelation).toHaveBeenCalledTimes(
                    1
                );
            });

            // Ensure the select input field of field is updated after user selected new field
            const selectField = screen.getByRole("combobox", {
                name: firstInputField,
            });

            userEvent.selectOptions(selectField, "user_name");
            expect(selectField).toHaveValue("user_name");

            // Ensure mockUpdateDatabaseTableRelation is called after user selected new value of field
            await waitFor(() => {
                expect(mockUpdateDatabaseTableRelation).toHaveBeenCalledTimes(
                    2
                );
            });

            // Ensure the input field of foreign table is updated after user selected new foreign table
            const selectForeignTable = screen.getByRole("combobox", {
                name: firstInputForeignTable,
            });

            userEvent.selectOptions(selectForeignTable, "orders");
            expect(selectForeignTable).toHaveValue("orders");

            // Ensure mockUpdateDatabaseTableRelation is called after user selected new value of foreign table
            await waitFor(() => {
                expect(mockUpdateDatabaseTableRelation).toHaveBeenCalledTimes(
                    3
                );
            });

            // Ensure the select input field of foreign field is updated after user selected new foreign field
            const selectForeignField = screen.getByRole("combobox", {
                name: firstInputForeignField,
            });

            userEvent.selectOptions(selectForeignField, "order_ID");
            expect(selectForeignField).toHaveValue("order_ID");

            // Ensure mockUpdateDatabaseTableRelation is called after user selected new value of foreign field
            await waitFor(() => {
                expect(mockUpdateDatabaseTableRelation).toHaveBeenCalledTimes(
                    4
                );
            });
        });

        it("should remove the record after clicking the delete button", async () => {
            // Click Delete button to remove all fields
            userEvent.click(
                screen.getByRole("button", {
                    name: firstDeleteButton,
                })
            );
            userEvent.click(
                screen.getByRole("button", {
                    name: firstDeleteButton,
                })
            );

            // Check if the data is already deleted
            expect(
                screen.queryByRole("textbox", { name: firstInputName })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("combobox", { name: firstInputField })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("combobox", { name: firstInputForeignTable })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("combobox", { name: firstInputForeignField })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: firstDeleteButton })
            ).not.toBeInTheDocument();

            // Ensure mockUpdateDatabaseTableRelation is not called immediately
            expect(mockUpdateDatabaseTableRelation).toHaveBeenCalledTimes(0);

            // Ensure mockUpdateDatabaseTableRelation is called upon completion of deletion
            await waitFor(() => {
                expect(mockUpdateDatabaseTableRelation).toHaveBeenCalledTimes(
                    1
                );
            });
        });

        it("should validate the foreign key relation unsuccessfully", async () => {
            const foreignTable = screen.getByRole("combobox", {
                name: "database-table-relation-input-foreigntable-0",
            });

            // Change this foreign table to "orders" so that it will be the same as the second record
            userEvent.selectOptions(foreignTable, "orders");

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "database.dashboard.action.relations.error.relationExist"
                );
            });
        });

        it("should not have a class is-invalid if fields have value", async () => {
            expect(
                screen.getByRole("textbox", { name: firstInputName })
            ).not.toHaveClass("is-invalid");

            expect(
                screen.getByRole("combobox", { name: firstInputField })
            ).not.toHaveClass("is-invalid");

            expect(
                screen.getByRole("combobox", { name: firstInputForeignTable })
            ).not.toHaveClass("is-invalid");

            // always is-invalid at first
            expect(
                screen.getByRole("combobox", { name: firstInputForeignField })
            ).toHaveClass("is-invalid");
        });

        it("should have a class is-invalid if the fields are empty", () => {
            // Clear the name
            userEvent.clear(
                screen.getByRole("textbox", { name: firstInputName })
            );
            expect(
                screen.getByRole("textbox", { name: firstInputName })
            ).toHaveClass("is-invalid");

            // Clear the field
            userEvent.selectOptions(
                screen.getByRole("combobox", { name: firstInputField }),
                ""
            );
            expect(
                screen.getByRole("combobox", { name: firstInputField })
            ).toHaveClass("is-invalid");

            // Clear the foreign table dropdown
            userEvent.selectOptions(
                screen.getByRole("combobox", { name: firstInputForeignTable }),
                ""
            );
            expect(
                screen.getByRole("combobox", { name: firstInputForeignTable })
            ).toHaveClass("is-invalid");

            // Clear the foreign field dropdown
            userEvent.selectOptions(
                screen.getByRole("combobox", { name: firstInputForeignField }),
                ""
            );
            expect(
                screen.getByRole("combobox", { name: firstInputForeignField })
            ).toHaveClass("is-invalid");
        });

        it("should have a class is-invalid if selected foreign fields is not a primary key", () => {
            const selectForeignField = screen.getByRole("combobox", {
                name: firstInputForeignField,
            });
            userEvent.selectOptions(selectForeignField, "full_name");
            expect(selectForeignField).toHaveClass("is-invalid");
        });
    });
});
