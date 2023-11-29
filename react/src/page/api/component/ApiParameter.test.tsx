import { render, screen } from "@testing-library/react";
import ApiParameter from "./ApiParameter";

const getTabByName = (name: string) => {
    return screen.getByRole("tab", {
        name: `api.dashboard.action.parameters.menu.tabs.${name}`,
    });
};

const getTabPanelByName = (name: string) => {
    return screen.getByRole("tabpanel", {
        name: `api.dashboard.action.parameters.menu.tabs.${name}`,
    });
};

// Method to check tab and tabpanel
const isTabPresent = (tabTitle: string) => {
    // ensure tab to be in the document
    expect(getTabByName(tabTitle)).toBeInTheDocument();

    // ensure tabpanel to be in the document        f
    expect(getTabPanelByName(tabTitle)).toBeInTheDocument();
};

describe("Api: ApiParameter", () => {
    it("should have correct tabs", () => {
        // Prepare parameter types
        const parameterTypes = ["query", "body"];

        render(<ApiParameter requestMethod="get" />);

        // loop parameter types
        parameterTypes.forEach((type) => {
            // ensure tab/panel exist
            isTabPresent(type);
        });
    });
});
