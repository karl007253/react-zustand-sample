import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import { DatabaseTableContentCreateUpdateResponse } from "../../../../common/zustand/interface/DatabaseTableContentInterface";
import {
    DatabaseTableDataType,
    Field,
} from "../../../../common/zustand/interface/DatabaseTableInterface";
import DatabaseContentFormInput from "./DatabaseContentFormInput";

const mockTableContentData: DatabaseTableContentCreateUpdateResponse = {
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
};

describe("Database: DatabaseContentFormInput", () => {
    let mockHandleChange: jest.Mock;

    beforeEach(() => {
        mockHandleChange = jest.fn();
    });

    it("should trigger handleChange when a textbox is updated", async () => {
        const mockStructureData: Field = {
            primary: false,
            uuid: "name",
            name: "name",
            type: DatabaseTableDataType.VARCHAR,
            length: "5",
            optional: true,
            default: "default name",
        };

        render(
            <DatabaseContentFormInput
                onChange={mockHandleChange}
                tableContent={mockTableContentData}
                structure={mockStructureData}
                structureIndex={0}
                defaultValue="Name Here"
            />
        );

        // Type anything in the input field
        userEvent.type(
            screen.getByRole("textbox", {
                name: `database-content-input-varchar-2-0`,
            }),
            "yes"
        );

        // Ensure the value has changed based from the input
        expect(
            screen.getByRole("textbox", {
                name: `database-content-input-varchar-2-0`,
            })
        ).toHaveValue("Name Hereyes");

        // Ensure handleChange is called
        expect(mockHandleChange).toHaveBeenCalledTimes(3);
    });

    it("should trigger handleChange when a boolean input is updated", async () => {
        const mockStructureData: Field = {
            primary: false,
            uuid: "boolean",
            name: "boolean",
            type: DatabaseTableDataType.BOOLEAN,
            length: "10",
            optional: true,
            default: "true",
        };

        render(
            <DatabaseContentFormInput
                onChange={mockHandleChange}
                tableContent={mockTableContentData}
                structure={mockStructureData}
                structureIndex={10}
                defaultValue="1"
            />
        );

        // Select an option
        userEvent.selectOptions(
            screen.getByRole("combobox", {
                name: `database-content-input-boolean-2-10`,
            }),
            "0"
        );

        // Ensure the value has changed based from the input
        expect(
            screen.getByRole("combobox", {
                name: `database-content-input-boolean-2-10`,
            })
        ).toHaveValue("0");

        // Ensure handleChange is called
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });

    it("should trigger handleChange when an int input is updated", async () => {
        const mockStructureData: Field = {
            primary: false,
            uuid: "int",
            name: "int",
            type: DatabaseTableDataType.INT,
            length: "5",
            optional: false,
            default: "1",
        };

        render(
            <DatabaseContentFormInput
                onChange={mockHandleChange}
                tableContent={mockTableContentData}
                structure={mockStructureData}
                structureIndex={10}
                defaultValue="1"
            />
        );

        // Type the input
        userEvent.type(
            screen.getByRole("spinbutton", {
                name: `database-content-input-int-2-10`,
            }),
            "2"
        );

        // Ensure the value has changed based from the input
        expect(
            screen.getByRole("spinbutton", {
                name: `database-content-input-int-2-10`,
            })
        ).toHaveValue(12);

        // Ensure handleChange is called
        expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });
});
