import { render, screen } from "@testing-library/react";
import { GlobalConfigurationType } from "../../../common/zustand/interface/ConfigurationInterface";
import ConfigurationTab, { ConfigTabItem } from "./ConfigurationTab";

import iconCog from "../../../common/assets/images/icons/gray-cog.svg";
import iconCogActive from "../../../common/assets/images/icons/gray-cog-active.svg";
import iconKey from "../../../common/assets/images/icons/gray-key.svg";
import iconKeyActive from "../../../common/assets/images/icons/gray-key-active.svg";
import iconLock from "../../../common/assets/images/icons/gray-lock.svg";
import iconLockActive from "../../../common/assets/images/icons/gray-lock-active.svg";

const getTabByName = (name: string) => {
    return screen.getByRole("tab", { name });
};

const getTabPanelByName = (name: string) => {
    return screen.getByRole("tabpanel", { name });
};

// Method to check tab and tabpanel
const isTabPresent = (tabName: string) => {
    // ensure tab to be in the document
    expect(getTabByName(tabName)).toBeInTheDocument();

    // ensure tabpanel to be in the document
    expect(getTabPanelByName(tabName)).toBeInTheDocument();
};

// Prepare tab name
const prepareTabName = (icon: string, title: string) => {
    return `icon-${icon} configuration.main.tab.${title}`;
};

describe("Configuration: ConfigurationTabs", () => {
    // Prepare primary tabs list
    const tabs: ConfigTabItem[] = [
        {
            icon: [iconCog, iconCogActive],
            title: GlobalConfigurationType.APPLICATION,
        },
        {
            icon: [iconKey, iconKeyActive],
            title: GlobalConfigurationType.AUTHENTICATION,
        },
        {
            icon: [iconLock, iconLockActive],
            title: GlobalConfigurationType.SSL,
        },
    ];

    it("should have correct tabs", () => {
        render(<ConfigurationTab />);

        // loop in tabs
        tabs.forEach(({ title, icon }) => {
            // Prepare icon name to use in the test
            // to ensure application tab has active icon initially
            const iconName =
                title === GlobalConfigurationType.APPLICATION
                    ? icon[1]
                    : icon[0];

            const tabName = prepareTabName(iconName, title);
            isTabPresent(tabName);
        });
    });
});
