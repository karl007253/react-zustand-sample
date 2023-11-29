import { useState, useEffect } from "react";
import useStore from "../../../common/zustand/Store";

import TabMenu, { TabItem } from "../../../common/component/TabMenu";
import SchedulerTest from "./SchedulerTest";
import SchedulerAction from "./SchedulerAction";

const SchedulerMenu = () => {
    const selectedSchedulerUuid = useStore(
        (state) => state.selectedSchedulerUuid
    );

    // Prepare primary active tab state
    const [primaryActiveTab, setPrimaryActiveTab] = useState("");

    // Prepare secondary active tab state. Use "action" as default
    const [secondaryActiveTab, setSecondaryActiveTab] = useState("");

    // Prepare primary tabs list
    const primaryTabs: TabItem[] = [
        {
            title: "scheduler.dashboard.menu.tabs.primary.main",
        },
    ];

    // Prepare secondary tabs list
    const secondaryTabs: TabItem[] = [
        {
            title: "scheduler.dashboard.menu.tabs.secondary.action",
            component: <SchedulerAction tab={secondaryActiveTab} />,
        },
        {
            title: "scheduler.dashboard.menu.tabs.secondary.test",
            component: <SchedulerTest />,
        },
    ];

    // Set primary & secondary active tab to the first item in list whenever the selectedScheduler is changed
    useEffect(() => {
        setPrimaryActiveTab(primaryTabs[0].title);
        setSecondaryActiveTab(secondaryTabs[0].title);
    }, [selectedSchedulerUuid]);

    return (
        <TabMenu
            primary={{
                tabs: primaryTabs,
                activeTab: primaryActiveTab,
                onTabChange: setPrimaryActiveTab,
                className: "shadow",
            }}
            secondary={{
                tabs: secondaryTabs,
                activeTab: secondaryActiveTab,
                onTabChange: setSecondaryActiveTab,
            }}
        />
    );
};

export default SchedulerMenu;
