import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import useStore from "../../../../common/zustand/Store";
import { DatabaseTableDataType } from "../../../../common/zustand/interface/DatabaseTableInterface";

import DatabaseRelationForm from "./DatabaseRelationForm";

const mockStructureTable = [
    {
        primary: true,
        uuid: "user_ID",
        name: "user_ID",
        type: DatabaseTableDataType.INT,
        length: "11",
        optional: true,
        default: "null",
    },
];

const mockRelationsTable = [
    {
        name: "fk_user_id",
        field: "user_ID",
        foreign_table: "users",
        foreign_field: "user_ID",
    },
];

const mockDatabaseTable = [
    {
        uuid: "TABLE-1",
        name: "users",
        title: "users",
        order: 1,
        data: {
            structure: mockStructureTable,
            relations: mockRelationsTable,
        },
    },
];

const firstInputName = "database-table-relation-input-name-0";
const firstInputField = "database-table-relation-input-field-0";
const firstInputForeignTable = "database-table-relation-input-foreigntable-0";
const firstInputForeignField = "database-table-relation-input-foreignfield-0";
const firstDeleteButton = "database-table-relation-button-delete-0";

describe("Database: DatabaseRelationForm", () => {
    const mockHandleDelete = jest.fn();
    const mockHandleChange = jest.fn();
    const mockHandleAdd = jest.fn();

    beforeEach(() =>
        render(
            <DatabaseRelationForm
                formData={mockRelationsTable}
                handleDelete={mockHandleDelete}
                handleChange={mockHandleChange}
                handleAdd={mockHandleAdd}
            />
        )
    );

    it("should have add button that triggers handleAdd", () => {
        // Click the add button
        userEvent.click(
            screen.getByRole("button", { name: "common.button.add" })
        );

        // Ensure that the handleAdd callback is called
        expect(mockHandleAdd).toHaveBeenCalledTimes(1);
    });

    describe("with relations data in databasetable data", () => {
        let mockUpdateDatabaseTableRelation: jest.Mock;
        beforeEach(() =>
            act(async () => {
                // Ensure mockUpdateDatabaseTableRelation is reset to 0 call, by assigning a new jest.fn() in each test
                mockUpdateDatabaseTableRelation = jest.fn();

                useStore.setState(
                    {
                        databaseTable: mockDatabaseTable,
                        selectedDatabaseTableUuid: "TABLE-1",
                        updateDatabaseTableRelation:
                            mockUpdateDatabaseTableRelation,
                    },
                    true
                );
            })
        );

        it("should display all fields with values", () => {
            const changedRelation = mockRelationsTable[0];

            // ensure a relation data is exists
            expect(
                screen.getByRole("textbox", { name: firstInputName })
            ).toHaveValue(changedRelation.name);

            expect(
                screen.getByRole("combobox", { name: firstInputField })
            ).toHaveValue(changedRelation.field);

            expect(
                screen.getByRole("combobox", { name: firstInputForeignTable })
            ).toHaveValue(changedRelation.foreign_table);

            expect(
                screen.getByRole("combobox", { name: firstInputForeignField })
            ).toHaveValue(changedRelation.foreign_field);

            expect(
                screen.queryByRole("button", { name: firstDeleteButton })
            ).toBeInTheDocument();
        });
    });
});
