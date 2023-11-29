import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StringBoolean } from "../../../../common/data/Enum";
import { DatabaseTableDataType } from "../../../../common/zustand/interface/DatabaseTableInterface";
import DatabaseStructureFormInput from "./DatabaseStructureFormInput";

const firstInputPrimary = "database-table-structure-input-primary-0";
const firstInputName = "database-table-structure-input-name-0";
const firstInputType = "database-table-structure-input-type-0";
const firstInputLength = "database-table-structure-input-length-0";
const firstInputOptional = "database-table-structure-input-optional-0";
const firstInputDefault = "database-table-structure-input-default-0";
const firstDeleteButton = "database-table-structure-button-delete-0";

describe("Database: DatabaseStructureFormInput", () => {
    const mockHandleDelete = jest.fn();
    const mockHandleChange = jest.fn();

    beforeEach(() =>
        render(
            <DatabaseStructureFormInput
                index={0}
                primary={false}
                primaryExist={false}
                name="User_id"
                type={DatabaseTableDataType.INT}
                length="10"
                optional={StringBoolean.TRUE}
                defaultValue="Null"
                handleDelete={mockHandleDelete}
                handleChange={mockHandleChange}
            />
        )
    );

    it("should trigger handleChange when a textbox is updated", async () => {
        // During initialization, mockHandleChange may be called several times to keep the values in the state in sync.
        // Therefore, we have to reset the call counters here
        mockHandleChange.mockClear();

        // Type anything in the input field
        userEvent.type(
            screen.getByRole("textbox", { name: firstInputName }),
            "0"
        );

        // Ensure handleChange is called
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });

    it("should have a delete button that triggers handleDelete", () => {
        // Click the delete button
        userEvent.click(
            screen.getByRole("button", { name: firstDeleteButton })
        );

        // Ensure handleDelete is called
        expect(mockHandleDelete).toHaveBeenCalledTimes(1);
    });

    it("should have a checkbox for primary; a textbox for name, length and default; and combobox for type and optional", () => {
        // Ensure all input fields and one button are shown

        expect(
            screen.getByRole("checkbox", { name: firstInputPrimary })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: firstInputName })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: firstInputType })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: firstInputLength })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: firstInputOptional })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: firstInputDefault })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: firstDeleteButton })
        ).toBeInTheDocument();
    });

    it("should disable the length field if selected type does not require length", async () => {
        // choose VARCHAR in the type input field
        userEvent.selectOptions(
            screen.getByRole("combobox", { name: firstInputType }),
            "varchar"
        );

        // Since varchar accepts length, ensure the length field is not disabled
        expect(
            screen.getByRole("textbox", { name: firstInputLength })
        ).not.toBeDisabled();

        // choose BOOLEAN in the type input field
        userEvent.selectOptions(
            screen.getByRole("combobox", { name: firstInputType }),
            "boolean"
        );

        // Since boolean doesn't have length, ensure the length field is disabled
        expect(
            screen.getByRole("textbox", { name: firstInputLength })
        ).toBeDisabled();
    });

    it("should clear the length field after selecting a type which does not require length", async () => {
        // choose INT in the type input field
        userEvent.selectOptions(
            screen.getByRole("combobox", { name: firstInputType }),
            "int"
        );

        // Type something in the length field
        userEvent.type(
            screen.getByRole("textbox", { name: firstInputName }),
            "10"
        );

        // now choose BOOLEAN in the type input field
        userEvent.selectOptions(
            screen.getByRole("combobox", { name: firstInputType }),
            "boolean"
        );

        // Since boolean doesn't have length, ensure the length field is cleared
        expect(
            screen.getByRole("textbox", { name: firstInputLength })
        ).toHaveValue("");
    });

    it("should clear the primary key checkbox after selecting a type which does not support it", async () => {
        // choose INT in the type input field
        userEvent.selectOptions(
            screen.getByRole("combobox", { name: firstInputType }),
            "int"
        );

        // Tick the primary key checkbox
        fireEvent.click(
            screen.getByRole("checkbox", { name: firstInputPrimary })
        );

        // Ensure it is checked
        expect(
            screen.getByRole("checkbox", { name: firstInputPrimary })
        ).toBeChecked();

        // now choose TEXT in the type input field
        userEvent.selectOptions(
            screen.getByRole("combobox", { name: firstInputType }),
            "text"
        );

        // Since text doesn't support primary key, ensure it is cleared
        expect(
            screen.getByRole("checkbox", { name: firstInputPrimary })
        ).not.toBeChecked();
    });

    it("should have a validation/error message when length is invalid", async () => {
        // choose VARCHAR in the type input field
        userEvent.selectOptions(
            screen.getByRole("combobox", { name: firstInputType }),
            "varchar"
        );

        // Type an illegal value in the length input field
        userEvent.type(
            screen.getByRole("textbox", { name: firstInputLength }),
            "abc"
        );

        expect(
            screen.getByText(
                "database.dashboard.action.structure.error.length.invalid"
            )
        ).toBeInTheDocument();
    });

    it("should have a validation/error message when length is required for input", async () => {
        // choose VARCHAR in the type input field
        userEvent.selectOptions(
            screen.getByRole("combobox", { name: firstInputType }),
            "varchar"
        );

        // Clear the length input field
        userEvent.clear(
            screen.getByRole("textbox", { name: firstInputLength })
        );

        // VARCHAR require a length, so ensure error message is shown
        expect(
            screen.getByText(
                "database.dashboard.action.structure.error.length.required"
            )
        ).toBeInTheDocument();
    });

    it("should have a validation/error message when length is out of range", async () => {
        // choose VARCHAR in the type input field
        userEvent.selectOptions(
            screen.getByRole("combobox", { name: firstInputType }),
            "varchar"
        );

        // Type a value in the length input field which will be out of range according to selected type
        userEvent.type(
            screen.getByRole("textbox", { name: firstInputLength }),
            "100000"
        );

        expect(
            screen.getByText(
                "database.dashboard.action.structure.error.length.outOfRange"
            )
        ).toBeInTheDocument();
    });
});
