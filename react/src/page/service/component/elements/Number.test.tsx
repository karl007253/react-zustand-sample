import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import Number from "./Number";

import { ServiceType } from "../../../../common/zustand/interface/ServiceInterface";
import { ServiceAttributes } from "../../../../common/data/Service";

const serviceList = [
    {
        id: 1,
        name: "service1",
        title: "service1",
        type: ServiceType.RestConnector,
        data: {
            attribute: {
                timeout: "30000",
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
            <Number
                index={1}
                className="input"
                attrName="timeout"
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

describe("Component: Number", () => {
    beforeEach(() => mockRender());

    it("should be able to find the spinbutton", () => {
        expect(
            screen.getByRole("spinbutton", {
                name: "service1timeout",
            })
        ).toBeInTheDocument();
    });

    it("should update service data when the user has changed something on the spinbutton input", () => {
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
                                    type: ServiceType.RestConnector,
                                    data: {
                                        attribute: {
                                            timeout: "50000",
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
            screen.getByRole("spinbutton", {
                name: "service1timeout",
            })
        ).toHaveValue(parseInt(serviceList[0].data.attribute.timeout, 10));

        userEvent.type(
            screen.getByRole("spinbutton", {
                name: "service1timeout",
            }),
            `50000`
        );

        // trigger the function
        expect(updateServiceData).not.toHaveBeenCalled();
        updateServiceData();
        expect(updateServiceData).toHaveBeenCalled();

        const state = useStore.getState();

        expect(state.service[0].data.attribute.timeout).toBe("50000");
    });
});
