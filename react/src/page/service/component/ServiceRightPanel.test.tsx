import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import ServiceRightPanel from "./ServiceRightPanel";
import useStore from "../../../common/zustand/Store";
import { ServiceType } from "../../../common/zustand/interface/ServiceInterface";

const mockRender = async () => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
    }));

    useStore.setState({
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
        addNewService: jest.fn().mockImplementationOnce(() => undefined),
        updateServiceOrder: jest.fn().mockImplementationOnce(() => undefined),
    });

    await act(async () => {
        render(<ServiceRightPanel />, { wrapper: MemoryRouter });
    });
};

describe("Component: ServiceRightPanel", () => {
    beforeEach(() => mockRender());

    it("should show the number of services data", () => {
        expect(screen.getByText("2 Service(s)")).toBeInTheDocument();
    });

    it("should have the service grid", () => {
        const component = screen.getByTestId("service-grid");
        expect(component).toBeInTheDocument();
    });

    it("should change to sorting mode when the sorting button was pressed", () => {
        // Add fakeTimers because the sorting function has a timeout in it
        jest.useFakeTimers();

        // Click sorting button
        userEvent.click(
            screen.getByRole("img", {
                name: "Enable Sort",
            })
        );

        act(() => {
            jest.runAllTimers();
        });

        expect(
            screen.getByRole("img", {
                name: "Disable Sort",
            })
        ).toBeInTheDocument();

        jest.useRealTimers();
    });
});
