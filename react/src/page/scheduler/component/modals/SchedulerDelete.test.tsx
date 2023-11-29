import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useStore from "../../../../common/zustand/Store";
import { Scheduler } from "../../../../common/zustand/interface/SchedulerInterface";

import SchedulerDelete from "./SchedulerDelete";

const mockSchedulerList: Scheduler[] = [
    {
        uuid: "id-endpoint-1",
        folder_uuid: "id-folder-1",
        name: "endpoint-1",
        title: "endpoint-1",
        order: 0,
        id: 1,
    },
    {
        uuid: "id-endpoint-2",
        folder_uuid: "id-folder-1",
        name: "endpoint-2",
        title: "endpoint-2",
        order: 0,
        id: 2,
    },
];

const submitButton = () => {
    return screen.getByRole("button", { name: "common.button.delete" });
};

describe("Component: Modal - SchedulerDelete", () => {
    const mockHandleClose = jest.fn();

    beforeEach(async () => {
        await waitFor(() => {
            // Initial state
            const state = useStore.getState();

            useStore.setState(
                {
                    ...state,
                    scheduler: mockSchedulerList,
                },
                true
            );

            render(
                <MemoryRouter>
                    <SchedulerDelete show handleClose={mockHandleClose} />
                    <ToastContainer />
                </MemoryRouter>
            );
        });
    });

    it("should have a modal title", () => {
        const linkElement = screen.getByText(
            "scheduler.dashboard.modal.delete.title"
        );
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a text label", () => {
        const linkElement = screen.getByText(
            /scheduler.dashboard.modal.delete.form.message.confirm/i
        );
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a cancel button", () => {
        const linkElement = screen.getByRole("button", {
            name: "common.button.cancel",
        });
        expect(linkElement).toBeInTheDocument();
    });

    it("should have a delete button", () => {
        expect(submitButton()).toBeInTheDocument();
    });

    it("should delete a scheduler", async () => {
        await waitFor(() => {
            useStore.setState({
                selectedSchedulerUuid: "id-endpoint-1",
            });
        });

        userEvent.click(submitButton());

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "scheduler.dashboard.modal.delete.form.message.success.action"
            );
        });
    });
});
