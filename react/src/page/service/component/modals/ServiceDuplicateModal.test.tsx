import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";

import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import ServiceDuplicateModal from "./ServiceDuplicateModal";

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
            <ServiceDuplicateModal
                show
                service={serviceList[0]}
                onCopy={() => {
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

describe("Component: ServiceDuplicateModal", () => {
    const { t } = useTranslation();
    beforeEach(() => mockRender());

    it("should duplicate a service data when pressing delete button", () => {
        const addNewService: jest.Mock = jest
            .fn()
            .mockImplementationOnce(() => {
                act(() => {
                    useStore.setState(
                        {
                            service: serviceList,
                        },
                        true,
                        "addNewService"
                    );
                });
                return undefined;
            });

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
