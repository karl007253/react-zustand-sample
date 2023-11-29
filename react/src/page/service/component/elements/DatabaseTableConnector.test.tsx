import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import DatabaseTableConnector from "./DatabaseTableConnector";

import {
    Service,
    ServiceType,
} from "../../../../common/zustand/interface/ServiceInterface";
import { ServiceAttributes } from "../../../../common/data/Service";

const serviceList: Service[] = [
    {
        id: 1,
        name: "dbConnector1",
        title: "dbConnector1",
        type: ServiceType.DatabaseConnector,
        data: {
            attribute: {
                database: "db1",
            },
        },
        order: 1,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCH",
    },
    {
        id: 2,
        name: "dbConnector2",
        title: "dbConnector2",
        type: ServiceType.DatabaseConnector,
        data: {
            attribute: {
                database: "db2",
            },
        },
        order: 2,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCj",
    },
    {
        id: 3,
        name: "service3",
        title: "service3",
        type: ServiceType.DatabaseTable,
        data: {
            attribute: {
                connector: "dbConnector1",
                table: "",
            },
        },
        order: 3,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCk",
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
        service: serviceList,
        addNewService: jest.fn().mockImplementationOnce(() => undefined),
        deleteService: jest.fn().mockImplementationOnce(() => undefined),
        updateServiceName: jest.fn().mockImplementationOnce(() => undefined),
        updateServiceData: jest.fn().mockImplementationOnce(() => undefined),
    });

    await act(async () => {
        render(
            <DatabaseTableConnector
                options={[
                    { key: "dbConnector1", value: "dbConnector1" },
                    { key: "dbConnector2", value: "dbConnector2" },
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

describe("Component: DatabaseTableConnector", () => {
    beforeEach(() => mockRender());

    it("should be able to find the database table connector option", () => {
        expect(
            screen.getByRole("option", {
                name: "dbConnector1",
            })
        ).toBeInTheDocument();
    });

    it("should update service data when the user has changed the selection database table connector input", () => {
        expect(
            screen.getByRole("combobox", {
                name: "dbConnector1database",
            })
        ).toHaveValue("");

        userEvent.selectOptions(
            // Find the select element
            screen.getByRole("combobox"),
            // Find and select the dbConnector2 option
            screen.getByRole("option", { name: "dbConnector2" })
        );

        expect(
            screen.getByRole("option", { name: "dbConnector2" }).textContent
        ).toBe("dbConnector2");

        expect(
            screen.getByRole("combobox", {
                name: "dbConnector1database",
            })
        ).toHaveValue("dbConnector2");
    });
});
