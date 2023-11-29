import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import Boolean from "./Boolean";

import { ServiceType } from "../../../../common/zustand/interface/ServiceInterface";
import { ServiceAttributes } from "../../../../common/data/Service";

const serviceList = [
    {
        id: 1,
        name: "service1",
        title: "service1",
        type: ServiceType.DatabaseConnector,
        data: {
            attribute: {
                database: "1",
            },
        },
        order: 1,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCH",
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
        addNewService: jest.fn().mockImplementationOnce(() => undefined),
        deleteService: jest.fn().mockImplementationOnce(() => undefined),
        updateServiceName: jest.fn().mockImplementationOnce(() => undefined),
        updateServiceData: jest.fn().mockImplementationOnce(() => undefined),
    });

    await act(async () => {
        render(
            <Boolean
                options={[
                    { key: "True", value: "1" },
                    { key: "False", value: "0" },
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

describe("Component: Boolean", () => {
    beforeEach(() => mockRender());

    it("should be able to find the boolean option", () => {
        expect(
            screen.getByRole("option", {
                name: "True",
            })
        ).toBeInTheDocument();
    });

    it("should update service data when the user has changed the selection boolean input", () => {
        expect(
            screen.getByRole("combobox", {
                name: "service1database",
            })
        ).toHaveValue(serviceList[0].data.attribute.database);

        userEvent.selectOptions(
            // Find the select element
            screen.getByRole("combobox"),
            // Find and select the false option
            screen.getByRole("option", { name: "False" })
        );

        expect(screen.getByRole("option", { name: "False" }).textContent).toBe(
            "False"
        );
    });
});
