import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import DatabaseConnectorDatabase from "./DatabaseConnectorDatabase";

import { ServiceType } from "../../../../common/zustand/interface/ServiceInterface";
import { ServiceAttributes } from "../../../../common/data/Service";
import {
    Encoding,
    Engine,
} from "../../../../common/zustand/interface/DatabaseInterface";

const serviceList = [
    {
        id: 1,
        name: "service1",
        title: "service1",
        type: ServiceType.DatabaseConnector,
        data: {
            attribute: {
                database: "db1",
            },
        },
        order: 1,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCH",
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
        service: [serviceList[0]],
        database: databaseList,
        addNewService: jest.fn().mockImplementationOnce(() => undefined),
        deleteService: jest.fn().mockImplementationOnce(() => undefined),
        updateServiceName: jest.fn().mockImplementationOnce(() => undefined),
        updateServiceData: jest.fn().mockImplementationOnce(() => undefined),
    });

    await act(async () => {
        render(
            <DatabaseConnectorDatabase
                options={[
                    { key: "db1", value: "db1" },
                    { key: "db2", value: "db2" },
                ]}
                index={1}
                className="input"
                attrName="database"
                serviceData={serviceList[0]}
                onUpdateAttributes={() => {
                    return true;
                }}
                handleValidation={handleValidation}
            />,
            { wrapper: MemoryRouter }
        );
    });
};

describe("Component: DatabaseConnectorDatabase", () => {
    beforeEach(() => mockRender());

    it("should be able to find the database option", () => {
        expect(
            screen.getByRole("option", {
                name: "db1",
            })
        ).toBeInTheDocument();
    });

    it("should update service data when the user has changed the selection database input", () => {
        expect(
            screen.getByRole("combobox", {
                name: "service1database",
            })
        ).toHaveValue(serviceList[0].data.attribute.database);

        userEvent.selectOptions(
            // Find the select element
            screen.getByRole("combobox"),
            // Find and select the db2 option
            screen.getByRole("option", { name: "db2" })
        );

        expect(screen.getByRole("option", { name: "db2" }).textContent).toBe(
            "db2"
        );

        expect(
            screen.getByRole("combobox", {
                name: "service1database",
            })
        ).toHaveValue("db2");
    });
});
