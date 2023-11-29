import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import DatabaseTableTable from "./DatabaseTableTable";

import {
    Service,
    ServiceType,
} from "../../../../common/zustand/interface/ServiceInterface";
import { ServiceAttributes } from "../../../../common/data/Service";
import {
    Encoding,
    Engine,
} from "../../../../common/zustand/interface/DatabaseInterface";
import { DatabaseTableDataType } from "../../../../common/zustand/interface/DatabaseTableInterface";

const serviceList: Service[] = [
    {
        id: 1,
        name: "dbTable1",
        title: "dbTable1",
        type: ServiceType.DatabaseTable,
        data: {
            attribute: {
                connector: "dbConnector1",
                table: "customers",
            },
        },
        order: 1,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCk",
    },
    {
        id: 2,
        name: "dbConnector1",
        title: "dbConnector1",
        type: ServiceType.DatabaseConnector,
        data: {
            attribute: {
                database: "db1",
            },
        },
        order: 2,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCj",
    },
];

const databaseList = [
    {
        uuid: "DATABASE-jtSn6Rtd5dWpi8rNbuMke",
        name: "db1",
        title: "db1",
        order: 1,
        data: {
            engine: Engine.INNODB,
            encoding: Encoding.UTF8,
        },
    },
    {
        uuid: "DATABASE-jtSn6Rtd5dWpi8rNbuMkr",
        name: "db2",
        title: "db2",
        order: 2,
        data: {
            engine: Engine.INNODB,
            encoding: Encoding.UTF8,
        },
    },
];

const mockDatabaseTable2 = {
    uuid: "TABLE-2",
    name: "customers",
    title: "customers",
    order: 1,
    database_uuid: "DATABASE-jtSn6Rtd5dWpi8rNbuMke",
    data: {},
};

const mockStructureTable1 = [
    {
        name: "user_ID",
        type: DatabaseTableDataType.INT,
        length: "11",
        optional: true,
        default: "null",
    },
    {
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
    database_uuid: "DATABASE-jtSn6Rtd5dWpi8rNbuMke",
    data: {
        structure: mockStructureTable1,
        relations: mockRelationsTable1,
    },
};

const databaseTableList = [mockDatabaseTable1, mockDatabaseTable2];

const handleValidation = (
    attributeName: string,
    attributeData: ServiceAttributes
) => {
    if (attributeName && attributeData) {
        return true;
    }
    return false;
};

const mockRender = async () => {
    useStore.setState({
        service: serviceList,
        database: databaseList,
        databaseTable: databaseTableList,
        addNewService: jest.fn().mockImplementationOnce(() => undefined),
        deleteService: jest.fn().mockImplementationOnce(() => undefined),
        updateServiceName: jest.fn().mockImplementationOnce(() => undefined),
        updateServiceData: jest.fn().mockImplementationOnce(() => undefined),
    });

    await act(async () => {
        render(
            <DatabaseTableTable
                options={[
                    { key: "customers", value: "customers" },
                    { key: "users", value: "users" },
                ]}
                index={1}
                className="input"
                attrName="database"
                serviceData={serviceList[0]}
                onUpdateAttributes={() => {
                    return true;
                }}
                services={serviceList}
                handleValidation={handleValidation}
            />,
            { wrapper: MemoryRouter }
        );
    });
};

describe("Component: DatabaseTableTable", () => {
    beforeEach(() => mockRender());

    it("should be able to find the database table table option", () => {
        expect(
            screen.getByRole("option", {
                name: "customers",
            })
        ).toBeInTheDocument();
    });

    it("should update service data when the user has changed the selection database table table input", () => {
        expect(
            screen.getByRole("combobox", {
                name: "dbTable1database",
            })
        ).toHaveValue("");

        userEvent.selectOptions(
            // Find the select element
            screen.getByRole("combobox"),
            // Find and select the users option
            screen.getByRole("option", { name: "users" })
        );

        expect(screen.getByRole("option", { name: "users" }).textContent).toBe(
            "users"
        );

        expect(
            screen.getByRole("combobox", {
                name: "dbTable1database",
            })
        ).toHaveValue("users");
    });
});
