import { render, screen } from "@testing-library/react";
import SchedulerAction from "./SchedulerAction";

describe("Scheduler: SchedulerAction", () => {
    it("should have event flow panel", () => {
        render(
            <SchedulerAction tab="scheduler.dashboard.menu.tabs.secondary.action" />
        );
        expect(screen.getByLabelText("event-flow-panel")).toBeInTheDocument();
    });

    it("should not have event flow panel", () => {
        const tabOtherThanAction =
            "scheduler.dashboard.menu.tabs.secondary.test";

        render(<SchedulerAction tab={tabOtherThanAction} />);
        expect(
            screen.queryByLabelText("event-flow-panel")
        ).not.toBeInTheDocument();
    });
});
