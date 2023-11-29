import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import { StringBoolean } from "../../../../common/data/Enum";
import useStore from "../../../../common/zustand/Store";
import { DatabaseTableDataType } from "../../../../common/zustand/interface/DatabaseTableInterface";

import DatabaseStructure from "./DatabaseStructure";

const firstInputPrimary = "database-table-structure-input-primary-0";
const firstInputName = "database-table-structure-input-name-0";
const firstInputType = "database-table-structure-input-type-0";
const firstInputLength = "database-table-structure-input-length-0";
const firstInputOptional = "database-table-structure-input-optional-0";
const firstInputDefault = "database-table-structure-input-default-0";
const firstDeleteButton = "database-table-structure-button-delete-0";

const inputPrimaryBox = (name: string) => {
    return screen.getByRole("checkbox", {
        name: `database-table-structure-input-${name}`,
    });
};

const inputTextbox = (name: string) => {
    return screen.getByRole("textbox", {
        name: `database-table-structure-input-${name}`,
    });
};

const inputCombobox = (name: string) => {
    return screen.getByRole("combobox", {
        name: `database-table-structure-input-${name}`,
    });
};

const buttonDelete = (index: number) => {
    return screen.getByRole("button", {
        name: `database-table-structure-button-delete-${index}`,
    });
};

describe("Database: DatabaseStructure", () => {
    beforeEach(() => render(<DatabaseStructure />));

    it("should show no input fields before having any data", () => {
        const inputFields = screen.queryAllByRole("textbox");
        expect(inputFields.length).toEqual(0);
    });

    it("should add a new first field data after clicking Add button", async () => {
        // Click Add button
        await waitFor(() => {
            userEvent.click(
                screen.getByRole("button", {
                    name: "common.button.add",
                })
            );
        });

        // ensure a new record is added
        expect(inputPrimaryBox("primary-0")).toBeInTheDocument();
        expect(inputTextbox("name-0")).toBeInTheDocument();
        expect(inputCombobox("type-0")).toBeInTheDocument();
        expect(inputTextbox("length-0")).toBeInTheDocument();
        expect(inputCombobox("optional-0")).toBeInTheDocument();
        expect(inputTextbox("default-0")).toBeInTheDocument();
        expect(buttonDelete(0)).toBeInTheDocument();
    });

    describe("with structure fields data in databasetable data", () => {
        const mockFields = [
            {
                primary: false,
                uuid: "TABLE-FIELD-1",
                name: "User_ID_Test",
                type: DatabaseTableDataType.INT,
                length: "5",
                optional: true,
                default: "null",
            },
        ];

        const mockDatabaseTable = {
            uuid: "TABLE-1",
            name: "users",
            title: "users",
            order: 1,
            database_uuid: "DATABASE-1",
            data: {
                structure: mockFields,
            },
        };

        let mockUpdateDatabaseTableStructure: jest.Mock;

        // render module with data
        beforeEach(() => {
            // Ensure mockUpdateDatabaseTableStructure is reset to 0 call, by assigning a new jest.fn() in each test
            mockUpdateDatabaseTableStructure = jest.fn();
            act(() => {
                useStore.setState(
                    {
                        databaseTable: [mockDatabaseTable],
                        selectedDatabaseTableUuid: mockDatabaseTable.uuid,
                        updateDatabaseTableStructure:
                            mockUpdateDatabaseTableStructure,
                    },
                    true
                );
            });
        });

        it("should display all fields data", () => {
            mockFields.forEach((item, index) => {
                // Ensure input field of primary is shown with the expected value
                expect(inputPrimaryBox(`primary-${index}`)).not.toBeChecked();

                // Ensure input field of name is shown with the expected value
                expect(inputTextbox(`name-${index}`)).toHaveValue(item.name);

                // Ensure input field of type is shown with the expected value
                expect(inputCombobox(`type-${index}`)).toHaveValue(item.type);

                // Ensure input field of length is shown with the expected value
                expect(inputTextbox(`length-${index}`)).toHaveValue("5");

                // Ensure input field of optional is shown with the expected value
                expect(inputCombobox(`optional-${index}`)).toHaveValue(
                    StringBoolean.TRUE
                );

                // Ensure input field of default is shown with the expected value
                expect(inputTextbox(`default-${index}`)).toHaveValue(
                    item.default
                );

                // Ensure delete button is shown
                expect(buttonDelete(index)).toBeInTheDocument();
            });
        });

        it("should update field data in global state when an existing value of field is changed", async () => {
            const changedField = mockFields[0];

            // Ensure checkbox is not toggled initially
            expect(inputPrimaryBox("primary-0")).not.toBeChecked();

            // Toggle the input field of primary
            userEvent.click(inputPrimaryBox("primary-0"));

            // Ensure checkbox is toggled
            expect(inputPrimaryBox("primary-0")).toBeChecked();

            // Input anything to the input field of name
            userEvent.type(inputTextbox("name-0"), "-new");

            // Ensure the input field of name is updated after user input
            expect(inputTextbox("name-0")).toHaveValue(
                `${changedField.name}-new`
            );

            // Ensure mockUpdateDatabaseTableStructure is not called immediately
            expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(0);

            // Ensure mockUpdateDatabaseTableStructure is called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(
                    1
                );
            });

            // Ensure the input field of type is updated after user selected new type
            userEvent.selectOptions(
                inputCombobox("type-0"),
                DatabaseTableDataType.VARCHAR
            );
            expect(inputCombobox("type-0")).toHaveValue(
                DatabaseTableDataType.VARCHAR
            );

            // Ensure mockUpdateDatabaseTableStructure is called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(
                    2
                );
            });

            // Input anything to the input field of length
            userEvent.type(inputTextbox("length-0"), "50");

            // Ensure the input field of length is updated after user changed the value
            expect(inputTextbox("length-0")).toHaveValue("50");

            // Ensure mockUpdateDatabaseTableStructure is called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(
                    3
                );
            });

            // Select an option
            userEvent.selectOptions(
                inputCombobox("optional-0"),
                StringBoolean.FALSE
            );

            // Ensure the input field of optional is updated after user selected new optional
            expect(inputCombobox("optional-0")).toHaveValue(
                StringBoolean.FALSE
            );

            // Ensure mockUpdateDatabaseTableStructure is called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(
                    4
                );
            });

            // Input Null value to the input field of default
            userEvent.type(inputTextbox("default-0"), `-new`);

            // Ensure the input field of default is updated after user changed the value
            expect(inputTextbox("default-0")).toHaveValue(
                `${changedField.default}-new`
            );

            // Ensure mockUpdateDatabaseTableStructure is called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(
                    5
                );
            });
        });

        it("should remove the record after clicking the delete button", async () => {
            // Click Delete button
            await waitFor(() => {
                userEvent.click(buttonDelete(0));
            });

            // Check if the data is already deleted
            expect(
                screen.queryByRole("checkbox", { name: firstInputPrimary })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("textbox", { name: firstInputName })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("combobox", { name: firstInputType })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("textbox", { name: firstInputLength })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("combobox", { name: firstInputOptional })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("textbox", { name: firstInputDefault })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: firstDeleteButton })
            ).not.toBeInTheDocument();

            // Ensure mockUpdateDatabaseTableStructure is not called immediately
            expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(0);

            // Ensure mockUpdateDatabaseTableStructure is called upon completion of deletion
            await waitFor(() => {
                expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(
                    1
                );
            });
        });

        it("should remove the record after an existing field name is cleared", async () => {
            userEvent.clear(
                screen.getByRole("textbox", { name: firstInputName })
            );

            expect(
                screen.queryByRole("textbox", { name: firstInputName })
            ).not.toBeInTheDocument();

            // Ensure mockUpdateDatabaseTableStructure is not called immediately
            expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(0);

            // Ensure mockUpdateDatabaseTableStructure is called upon completion of deletion
            await waitFor(() => {
                expect(mockUpdateDatabaseTableStructure).toHaveBeenCalledTimes(
                    1
                );
            });
        });
    });
});
