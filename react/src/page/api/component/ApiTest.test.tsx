import { render, screen } from "@testing-library/react";
import ApiTest from "./ApiTest";

const getTabByName = (name: string) => {
    return screen.getByRole("tab", {
        name: `api.dashboard.test.tabs.main.${name}`,
    });
};

const getTabPanelByName = (name: string) => {
    return screen.getByRole("tabpanel", {
        name: `api.dashboard.test.tabs.main.${name}`,
    });
};

// Method to check tab and tabpanel
const isTabPresent = (tabTitle: string) => {
    // ensure tab to be in the document
    expect(getTabByName(tabTitle)).toBeInTheDocument();

    // ensure tabpanel to be in the document
    expect(getTabPanelByName(tabTitle)).toBeInTheDocument();
};

describe("Api: ApiTest", () => {
    it("should have correct tabs", () => {
        // Prepare parameter types
        const parameterTypes = ["query", "body"];

        render(<ApiTest requestMethod="get" />);

        // loop parameter types
        parameterTypes.forEach((type) => {
            // ensure tab/panel exist
            isTabPresent(type);
        });
    });
});
