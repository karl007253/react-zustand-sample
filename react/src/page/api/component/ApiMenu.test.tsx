import { render, screen } from "@testing-library/react";
import ApiMenu from "./ApiMenu";

describe("Api: ApiRequestMethodMenu", () => {
    beforeEach(() => render(<ApiMenu />));

    it("should have 5 request methods as the tab of primary menu", () => {
        // Prepare all available request methods
        const requestMethodTabTitle = [
            "api.dashboard.menu.tabs.primary.get",
            "api.dashboard.menu.tabs.primary.patch",
            "api.dashboard.menu.tabs.primary.put",
            "api.dashboard.menu.tabs.primary.post",
            "api.dashboard.menu.tabs.primary.delete",
        ];

        // Ensure all the available request methods are present in the tab
        requestMethodTabTitle.forEach((title) =>
            expect(
                screen.getByRole("tab", {
                    name: title,
                })
            ).toBeInTheDocument()
        );
    });

    // TODO: Verify presence of components of secondary menu
    it("should have a secondary menu with 5 tabs", () => {
        // Prepare all available request methods
        const secondaryMenuTabTitle = [
            "api.dashboard.menu.tabs.secondary.header",
            "api.dashboard.menu.tabs.secondary.parameters",
            "api.dashboard.menu.tabs.secondary.result",
            "api.dashboard.menu.tabs.secondary.action",
            "api.dashboard.menu.tabs.secondary.test",
        ];

        // Ensure all the available request methods are present in the tab
        secondaryMenuTabTitle.forEach((title) =>
            expect(
                screen.getByRole("tab", {
                    name: title,
                })
            ).toBeInTheDocument()
        );
    });
});
