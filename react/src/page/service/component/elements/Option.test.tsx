import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import Option from "./Option";

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
                database: "database1",
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
            <Option
                options={[
                    { key: "database1", value: "database1" },
                    { key: "database2", value: "database2" },
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

describe("Component: Option", () => {
    beforeEach(() => mockRender());

    it("should be able to find the option", () => {
        expect(
            screen.getByRole("option", {
                name: "database1",
            })
        ).toBeInTheDocument();
    });

    it("should update service data when the user has changed the option input", () => {
        expect(
            screen.getByRole("combobox", {
                name: "service1database",
            })
        ).toHaveValue(serviceList[0].data.attribute.database);

        userEvent.selectOptions(
            // Find the select element
            screen.getByRole("combobox"),
            // Find and select the database2 option
            screen.getByRole("option", { name: "database2" })
        );

        expect(
            screen.getByRole("option", { name: "database2" }).textContent
        ).toBe("database2");
    });

    it("should update service data when the user has typed something on the textbox input", () => {
        const updateServiceData: jest.Mock = jest
            .fn()
            .mockImplementationOnce(() => {
                act(() => {
                    useStore.setState(
                        {
                            service: [
                                {
                                    id: 1,
                                    name: "service1",
                                    title: "service1",
                                    type: ServiceType.DatabaseConnector,
                                    data: {
                                        attribute: {
                                            database: "database2",
                                        },
                                    },
                                    order: 1,
                                    uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCH",
                                },
                            ],
                        },
                        true,
                        "updateServiceData"
                    );
                });
                return undefined;
            });

        expect(
            screen.getByRole("combobox", {
                name: "service1database",
            })
        ).toHaveValue(serviceList[0].data.attribute.database);

        userEvent.selectOptions(screen.getByRole("combobox"), "database2");

        // trigger the function
        expect(updateServiceData).not.toHaveBeenCalled();
        updateServiceData();
        expect(updateServiceData).toHaveBeenCalled();

        const state = useStore.getState();

        expect(state.service[0].data.attribute.database).toBe("database2");
    });
});
