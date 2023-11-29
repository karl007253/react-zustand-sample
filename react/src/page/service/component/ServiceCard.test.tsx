import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";

import userEvent from "@testing-library/user-event";

import useStore from "../../../common/zustand/Store";
import ServiceCard from "./ServiceCard";

import { ServiceType } from "../../../common/zustand/interface/ServiceInterface";

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
    {
        id: 2,
        name: "service2",
        title: "service2",
        type: ServiceType.RestConnector,
        data: {
            attribute: {
                url: "no",
            },
        },
        order: 2,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCO",
    },
];

const mockRender = async () => {
    useStore.setState({
        service: [serviceList[0]],
        addNewService: jest.fn().mockImplementationOnce(() => undefined),
        deleteService: jest.fn().mockImplementationOnce(() => undefined),
    });

    await act(async () => {
        render(
            <ServiceCard
                sortEnabled={false}
                active
                index={0}
                onDelete={() => {
                    return true;
                }}
                onCopy={() => {
                    return true;
                }}
                toggleClick={() => {
                    return true;
                }}
                onUpdateAttributes={() => {
                    return true;
                }}
                setHeight={() => {
                    return 0;
                }}
                indexRow={0}
                indexCol={0}
            />,
            { wrapper: MemoryRouter }
        );
    });
};

describe("Component: ServiceCard", () => {
    const { t } = useTranslation();
    beforeEach(() => mockRender());

    it("should add a new service data when pressing duplicate service icon and then pressing copy button", () => {
        const addNewService: jest.Mock = jest
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
                                            url: "yes",
                                        },
                                    },
                                    order: 1,
                                    uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCH",
                                },
                                {
                                    id: 2,
                                    name: "service2",
                                    title: "service2",
                                    type: ServiceType.RestConnector,
                                    data: {
                                        attribute: {
                                            url: "no",
                                        },
                                    },
                                    order: 2,
                                    uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCO",
                                },
                            ],
                        },
                        true,
                        "addNewService"
                    );
                });
                return undefined;
            });

        userEvent.click(
            screen.getByRole("img", {
                name: "Duplicate Service",
            })
        );

        userEvent.click(
            screen.getByRole("button", {
                name: t("common.button.copy"),
            })
        );

        // trigger the function
        expect(addNewService).not.toHaveBeenCalled();
        addNewService();
        expect(addNewService).toHaveBeenCalled();

        const state = useStore.getState();

        expect(state.service.length).toBe(2);
    });

    it("should delete a service data when pressing delete service icon and then pressing delete button", () => {
        const deleteService: jest.Mock = jest
            .fn()
            .mockImplementationOnce(() => {
                act(() => {
                    useStore.setState(
                        {
                            service: [],
                        },
                        true,
                        "deleteService"
                    );
                });
                return undefined;
            });

        userEvent.click(
            screen.getByRole("img", {
                name: "Delete Service",
            })
        );

        userEvent.click(
            screen.getByRole("button", {
                name: t("common.button.delete"),
            })
        );

        // trigger the function
        expect(deleteService).not.toHaveBeenCalled();
        deleteService();
        expect(deleteService).toHaveBeenCalled();

        const state = useStore.getState();

        expect(state.service.length).toBe(0);
    });

    it("should be able to find an input text and number input spinner of the active service", () => {
        expect(
            screen.getByRole("textbox", {
                name: "service1name",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("spinbutton", {
                name: "service1timeout",
            })
        ).toBeInTheDocument();
    });
});
