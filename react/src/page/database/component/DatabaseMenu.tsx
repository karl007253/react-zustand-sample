import { useState } from "react";
import TabMenu, { TabItem } from "../../../common/component/TabMenu";
import DatabaseRelation from "./relation/DatabaseRelation";
import DatabaseStructure from "./structure/DatabaseStructure";
import DatabaseContent from "./content/DatabaseContent";

const DatabaseMenu = () => {
    const primaryTabs: TabItem[] = [
        {
            title: "database.dashboard.menu.tabs.primary.structure",
            component: <DatabaseStructure />,
        },
        {
            title: "database.dashboard.menu.tabs.primary.relations",
            component: <DatabaseRelation />,
        },
        {
            title: "database.dashboard.menu.tabs.primary.content",
            component: <DatabaseContent />,
        },
    ];

    // Prepare primary active tab state. Use "get" as default
    const [primaryActiveTab, setPrimaryActiveTab] = useState(
        primaryTabs[0].title
    );

    return (
        <TabMenu
            unmountOnExit
            primary={{
                tabs: primaryTabs,
                activeTab: primaryActiveTab,
                onTabChange: setPrimaryActiveTab,
            }}
        />
    );
};

export default DatabaseMenu;
