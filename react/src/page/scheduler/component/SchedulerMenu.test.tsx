import { render, screen } from "@testing-library/react";
import SchedulerMenu from "./SchedulerMenu";

describe("Scheduler: SchedulerMenu", () => {
    beforeEach(() => render(<SchedulerMenu />));

    it("should have 1 tab title of primary menu", () => {
        const tabsTitle = ["scheduler.dashboard.menu.tabs.primary.main"];

        tabsTitle.forEach((title) =>
            expect(
                screen.getByRole("tab", {
                    name: title,
                })
            ).toBeInTheDocument()
        );
    });

    // TODO: Verify presence of components of secondary menu
    it("should have a secondary menu with 2 tabs", () => {
        const secondaryMenuTabTitle = [
            "scheduler.dashboard.menu.tabs.secondary.action",
            "scheduler.dashboard.menu.tabs.secondary.test",
        ];

        secondaryMenuTabTitle.forEach((title) =>
            expect(
                screen.getByRole("tab", {
                    name: title,
                })
            ).toBeInTheDocument()
        );
    });
});
