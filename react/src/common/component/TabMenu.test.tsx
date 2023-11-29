import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Menu, { TabItem } from "./TabMenu";

// mock tab change
const mockOnTabChange = jest.fn();

// Prepare random class
const primaryClassName = "random-primary-class-name";
const secondaryClassName = "random-secondary-class-name";

// prepare primary mock tabs
const mockPrimaryTabs: TabItem[] = [
    {
        title: "sampletab",
        component: <div aria-label="sampletab-component" />,
    },
    {
        title: "sampletab2",
        component: <div aria-label="sampletab2-component" />,
    },
    {
        title: "sampletab3",
    },
];

// prepare secondary mock tabs
const mockSecondaryTabs: TabItem[] = [
    {
        title: "secondary-sampletab",
        component: <div aria-label="secondary-sampletab-component" />,
    },
    {
        title: "secondary-sampletab2",
    },
];

type MenuProps = {
    primaryActiveTab?: string;
    secondaryActiveTab?: string;
    isSecondaryMenuRendered?: boolean;
};

const renderMenu = ({
    primaryActiveTab,
    secondaryActiveTab,
    isSecondaryMenuRendered,
}: MenuProps) => {
    render(
        <Menu
            primary={{
                tabs: mockPrimaryTabs,
                activeTab: primaryActiveTab,
                onTabChange: mockOnTabChange,
                className: primaryClassName,
            }}
            secondary={
                isSecondaryMenuRendered
                    ? {
                          tabs: mockSecondaryTabs,
                          activeTab: secondaryActiveTab,
                          onTabChange: mockOnTabChange,
                          className: secondaryClassName,
                      }
                    : undefined
            }
        />
    );
};

const getTabByName = (name: string) => {
    return screen.getByRole("tab", { name });
};

const getTabPanelByName = (name: string) => {
    return screen.getByRole("tabpanel", { name });
};

// Method to check tab and tabpanel
const isTabPresent = (tab: TabItem) => {
    // ensure tab to be in the document
    expect(getTabByName(tab.title)).toBeInTheDocument();

    // ensure tabpanel to be in the document
    expect(getTabPanelByName(tab.title)).toBeInTheDocument();

    if (tab.component) {
        // Ensure tab component is present if provided
        expect(
            screen.getByLabelText(`${tab.title}-component`)
        ).toBeInTheDocument();
    } else {
        // Ensure tab component is absent if not provided
        expect(
            screen.queryByLabelText(`${tab.title}-component`)
        ).not.toBeInTheDocument();
    }
};

// this method ensures tab is selected
// also, it will ensure other tabs is unselected
const isTabSelected = (tabName: string, isSecondaryMenu = false) => {
    // get all tabs
    const tabs = isSecondaryMenu
        ? within(screen.getByLabelText("secondary-tab-menu")).getAllByRole(
              "tab"
          )
        : screen.getAllByRole("tab");

    // looping through the tabs and check which is selected
    tabs.forEach((tab) => {
        const isSelected = tab.innerHTML === tabName;

        expect(tab).toHaveAttribute("aria-selected", isSelected.toString());
    });
};

describe("Component: Tab Menu", () => {
    describe("Primary menu", () => {
        describe("no active tab is provided", () => {
            // render menu with no initial tab
            beforeEach(() => renderMenu({}));

            it("should render all the tabs", () => {
                // ensure all tabs exist
                mockPrimaryTabs.forEach((tab) => isTabPresent(tab));
            });

            it("should allow user to switch tab and triggers onTabChange", async () => {
                // prepare initial tab
                const initialTab = mockPrimaryTabs[0].title;

                // prepare destination tab
                const desTab = mockPrimaryTabs[1].title;

                // ensure initial tab is selected while destination tab is not selected
                isTabSelected(initialTab);

                // select destination tab
                userEvent.click(getTabByName(desTab));

                // ensure on tab change is triggered
                expect(mockOnTabChange).toHaveBeenCalledTimes(1);

                // ensure initialTab is no longer selected while destination tab is selected
                isTabSelected(desTab);
            });

            it("should have the class name if a provided", () => {
                expect(screen.getByLabelText("primary-menu")).toHaveClass(
                    primaryClassName
                );
            });
        });

        it("should have the correct active tab ", () => {
            // prepare an initial tab to mock
            const mockInitialTab = mockPrimaryTabs[2].title;

            // render menu with an initial tab
            renderMenu({ primaryActiveTab: mockInitialTab });

            // ensure initial tab is selected
            isTabSelected(mockInitialTab);
        });
    });

    describe("Secondary menu", () => {
        describe("no active tab is provided", () => {
            // render menu with no initial tab
            beforeEach(() => renderMenu({ isSecondaryMenuRendered: true }));

            it("should render all the tabs", () => {
                // ensure all tabs exist
                mockSecondaryTabs.forEach((tab) => isTabPresent(tab));
            });

            it("should allow user to switch tab and triggers onTabChange", async () => {
                // prepare initial tab
                const initialTab = mockSecondaryTabs[0].title;

                // prepare destination tab
                const desTab = mockSecondaryTabs[1].title;

                // ensure initial tab is selected while destination tab is not selected
                isTabSelected(initialTab, true);

                // select destination tab
                userEvent.click(getTabByName(desTab));

                // ensure on tab change is triggered
                expect(mockOnTabChange).toHaveBeenCalledTimes(1);

                // ensure initialTab is no longer selected while destination tab is selected
                isTabSelected(desTab, true);
            });

            it("should not render components from primary menu, even though it is provided", () => {
                // Ensure all components from primary menu is absent
                mockPrimaryTabs.forEach((tab) =>
                    expect(
                        screen.queryByLabelText(`${tab.title}-component`)
                    ).not.toBeInTheDocument()
                );
            });

            it("should have the class name if provided", () => {
                expect(screen.getByLabelText("secondary-menu")).toHaveClass(
                    secondaryClassName
                );
            });
        });

        it("should have the correct active tab ", () => {
            // prepare an initial tab to mock
            const mockInitialTab = mockSecondaryTabs[1].title;

            // render menu with an initial tab
            renderMenu({
                secondaryActiveTab: mockInitialTab,
                isSecondaryMenuRendered: true,
            });

            // ensure initial tab is selected
            isTabSelected(mockInitialTab, true);
        });
    });
});
