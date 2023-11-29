import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import String from "./String";

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
                url: "yes",
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
            <String
                index={1}
                className="input"
                attrName="url"
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

describe("Component: String", () => {
    beforeEach(() => mockRender());

    it("should be able to find the textbox", () => {
        expect(
            screen.getByRole("textbox", {
                name: "service1url",
            })
        ).toBeInTheDocument();
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
                                    type: ServiceType.RestConnector,
                                    data: {
                                        attribute: {
                                            url: "yes-updated",
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
            screen.getByRole("textbox", {
                name: "service1url",
            })
        ).toHaveValue(serviceList[0].data.attribute.url);

        userEvent.type(
            screen.getByRole("textbox", {
                name: "service1url",
            }),
            `-updated`
        );

        // trigger the function
        expect(updateServiceData).not.toHaveBeenCalled();
        updateServiceData();
        expect(updateServiceData).toHaveBeenCalled();

        const state = useStore.getState();

        expect(state.service[0].data.attribute.url).toBe("yes-updated");
    });
});
