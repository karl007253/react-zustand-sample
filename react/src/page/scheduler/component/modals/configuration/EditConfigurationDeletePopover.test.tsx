import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditConfigurationDeletePopover from "./EditConfigurationDeletePopover";

describe("Component: Modal Form Popover - EditConfigurationDeletePopover", () => {
    const mockDeleteConfigPopover = jest.fn();
    const mockDeleteConfig = jest.fn();

    beforeEach(() => {
        render(
            <EditConfigurationDeletePopover
                isUsed="delete"
                isFolder="Scheduler"
                deleteConfig={mockDeleteConfig}
                deleteConfigPopover={mockDeleteConfigPopover}
            />
        );
    });

    it("should display matching confirmation message and buttons", async () => {
        // click the delete button
        await waitFor(() => {
            userEvent.click(screen.getByLabelText("delete-config"));
            expect(mockDeleteConfigPopover).toHaveBeenCalledTimes(1);
        });

        // displaying the Yes button
        await act(async () => {
            expect(
                screen.getByLabelText("delete-config-yes")
            ).toBeInTheDocument();
        });

        // displaying the No button
        await act(async () => {
            expect(
                screen.getByLabelText("delete-config-no")
            ).toBeInTheDocument();
        });

        // click the Yes button
        await waitFor(() => {
            userEvent.click(screen.getByLabelText("delete-config-yes"));
            expect(mockDeleteConfig).toHaveBeenCalledTimes(1);
        });

        // ensure displaying the delete confirmation
        await act(async () => {
            expect(
                screen.getByText(
                    "scheduler.dashboard.modalConfig.confirm.delete"
                )
            ).toBeInTheDocument();
        });
    });
});
