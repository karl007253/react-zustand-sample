import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";

import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import ServiceDeleteModal from "./ServiceDeleteModal";

import { ServiceType } from "../../../../common/zustand/interface/ServiceInterface";

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
            <ServiceDeleteModal
                show
                service={serviceList[0]}
                onDelete={() => {
                    return true;
                }}
                handleClose={() => {
                    return true;
                }}
            />,
            { wrapper: MemoryRouter }
        );
    });
};

describe("Component: ServiceDeleteModal", () => {
    const { t } = useTranslation();
    beforeEach(() => mockRender());

    it("should delete a service data when pressing delete button", () => {
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

    it("should be able to find the cancel button", () => {
        expect(
            screen.getByRole("button", {
                name: t("common.button.cancel"),
            })
        ).toBeInTheDocument();
    });

    it("should be able to find the close button", () => {
        expect(
            screen.getByRole("button", {
                name: t("Close"),
            })
        ).toBeInTheDocument();
    });
});
