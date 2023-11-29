import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastContainer } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import useStore from "../../../common/zustand/Store";
import SchedulerTest from "./SchedulerTest";
import {
    Scheduler,
    SchedulerStatus,
    SchedulerTestRequestPayload,
    SchedulerTestResponse,
} from "../../../common/zustand/interface/SchedulerInterface";
import { mockedJavaTesterHttpRequest } from "../../../common/helper/HttpRequest";

const mockSchedulerData: Scheduler = {
    uuid: "id-scheduler-1",
    name: "scheduler-1",
    title: "scheduler-1",
    order: 0,
    data: {
        status: SchedulerStatus.ENABLED,
        action: [
            {
                function: "function-1",
                parameter: { a: "1", b: "2" },
                parameter_type: { a: "type-1", b: "type-2" },
                uuid: "id-function-1",
            },
        ],
    },
};

const mockPostResponse: SchedulerTestResponse = {
    success: true,
    message: "Success",
    data: null,
};

const runTestButton = () => {
    return screen.getByRole("button", {
        name: "scheduler.dashboard.menu.tabs.button.run",
    });
};

const renderSchedulerMenuTest = async () => {
    useStore.setState({
        scheduler: [mockSchedulerData],
        selectedSchedulerUuid: mockSchedulerData.uuid,
        dataHasChanged: false,
    });

    await waitFor(() => {
        render(
            <MemoryRouter>
                <SchedulerTest />
                <ToastContainer limit={1} />
            </MemoryRouter>
        );
    });
};

describe("Scheduler: SchedulerMenuTestResult", () => {
    beforeEach(() => renderSchedulerMenuTest());

    it("should have the run button to start the test", () => {
        expect(runTestButton()).toBeInTheDocument();
    });

    it("should display the tabs title", () => {
        // ensure the log tab title exist
        expect(
            screen.getByText("scheduler.dashboard.menu.tabs.primary.log")
        ).toBeInTheDocument();
    });

    it("should be able to call Java tester and run the action flow", async () => {
        const testEndpoint = "test/scheduler";

        mockedJavaTesterHttpRequest.post.mockImplementation(() => {
            return Promise.resolve({
                data: mockPostResponse,
            });
        });

        // Fire click event
        userEvent.click(runTestButton());

        const expectedPayload: Partial<SchedulerTestRequestPayload> = {
            action: mockSchedulerData.data?.action,
        };

        await waitFor(() => {
            // Ensure toast popup is shown
            expect(screen.getByRole("alert")).toHaveTextContent(
                mockPostResponse.message
            );
        });

        // Ensure Java tester endpoint is called
        expect(mockedJavaTesterHttpRequest.post).toHaveBeenNthCalledWith(
            1,
            testEndpoint,
            expect.objectContaining(expectedPayload)
        );
    });
});
