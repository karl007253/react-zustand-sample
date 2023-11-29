import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DatabaseStructureForm from "./DatabaseStructureForm";
import {
    Field,
    DatabaseTableDataType,
} from "../../../../common/zustand/interface/DatabaseTableInterface";
import { StringBoolean } from "../../../../common/data/Enum";

const structureData: Field[] = [
    {
        primary: true,
        uuid: "TABLE-FIELD-1",
        name: "user_ID",
        type: DatabaseTableDataType.INT,
        length: "5",
        optional: true,
        default: "null",
    },
];

const firstInputPrimary = "database-table-structure-input-primary-0";
const firstInputName = "database-table-structure-input-name-0";
const firstInputType = "database-table-structure-input-type-0";
const firstInputLength = "database-table-structure-input-length-0";
const firstInputOptional = "database-table-structure-input-optional-0";
const firstInputDefault = "database-table-structure-input-default-0";
const firstDeleteButton = "database-table-structure-button-delete-0";

describe("Database: DatabaseStructureForm", () => {
    const mockHandleDelete = jest.fn();
    const mockHandleChange = jest.fn();
    const mockHandleAdd = jest.fn();

    beforeEach(() => {
        render(
            <DatabaseStructureForm
                formData={structureData}
                handleDelete={mockHandleDelete}
                handleChange={mockHandleChange}
                handleAdd={mockHandleAdd}
            />
        );
    });

    it("should have add button that triggers handleAdd", () => {
        // Click the add button
        userEvent.click(
            screen.getByRole("button", {
                name: "common.button.add",
            })
        );

        // Ensure that the handleAdd callback is called
        expect(mockHandleAdd).toHaveBeenCalledTimes(1);
    });

    it("should display all input fields with values", async () => {
        // Ensure all input fields are shown with correct values

        expect(
            screen.getByRole("checkbox", {
                name: firstInputPrimary,
            })
        ).toBeChecked();

        expect(
            screen.getByRole("textbox", {
                name: firstInputName,
            })
        ).toHaveValue("user_ID");

        expect(
            screen.getByRole("combobox", {
                name: firstInputType,
            })
        ).toHaveValue(DatabaseTableDataType.INT);

        expect(
            screen.getByRole("textbox", {
                name: firstInputLength,
            })
        ).toHaveValue("5");

        expect(
            screen.getByRole("combobox", {
                name: firstInputOptional,
            })
        ).toHaveValue(StringBoolean.TRUE);

        expect(
            screen.getByRole("textbox", {
                name: firstInputDefault,
            })
        ).toHaveValue("null");

        expect(
            screen.queryByRole("button", { name: firstDeleteButton })
        ).toBeInTheDocument();
    });
});
