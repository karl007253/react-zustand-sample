import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DatabaseRelationFormInput from "./DatabaseRelationFormInput";

const firstInputName = "database-table-relation-input-name-0";
const firstInputField = "database-table-relation-input-field-0";
const firstInputForeignTable = "database-table-relation-input-foreigntable-0";
const firstInputForeignField = "database-table-relation-input-foreignfield-0";
const firstDeleteButton = "database-table-relation-button-delete-0";

describe("Database: DatabaseRelationFormInput", () => {
    const mockHandleDelete = jest.fn();
    const mockHandleChange = jest.fn();

    beforeEach(() =>
        render(
            <DatabaseRelationFormInput
                name="customersrelation"
                field="user_ID"
                foreignTable="customers"
                foreignField="customer_ID"
                tableFields={[]}
                tableList={[]}
                index={0}
                handleDelete={mockHandleDelete}
                handleChange={mockHandleChange}
            />
        )
    );

    it("should trigger handleChange when a textbox is updated", async () => {
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

    it("should display all input fields", async () => {
        // Ensure all fields are displayed
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
});
