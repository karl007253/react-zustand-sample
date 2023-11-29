import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import TabMenu, { TabItem } from "../../../common/component/TabMenu";

import ApiHeader from "./ApiHeader";
import ApiResult from "./ApiResult";
import useStore from "../../../common/zustand/Store";
import ApiTest from "./ApiTest";
import ApiParameter from "./ApiParameter";
import ApiAction from "./ApiAction";

const ApiMenu = () => {
    const { t } = useTranslation();

    const selectedApiUuid = useStore((state) => state.selectedApiUuid);

    // Prepare primary active tab state. Use "get" as default
    const [primaryActiveTab, setPrimaryActiveTab] = useState("");

    // Prepare secondary active tab state. Use "header" as default
    const [secondaryActiveTab, setSecondaryActiveTab] = useState("");

    // Prepare primary tabs list
    const primaryTabs: TabItem[] = [
        {
            title: "api.dashboard.menu.tabs.primary.get",
        },
        {
            title: "api.dashboard.menu.tabs.primary.patch",
        },
        {
            title: "api.dashboard.menu.tabs.primary.put",
        },
        {
            title: "api.dashboard.menu.tabs.primary.post",
        },
        {
            title: "api.dashboard.menu.tabs.primary.delete",
        },
    ];

    // Prepare secondary tabs list
    const secondaryTabs: TabItem[] = [
        {
            title: "api.dashboard.menu.tabs.secondary.header",
            component: <ApiHeader requestMethod={t(primaryActiveTab)} />,
        },
        {
            title: "api.dashboard.menu.tabs.secondary.parameters",
            component: <ApiParameter requestMethod={t(primaryActiveTab)} />,
        },
        {
            title: "api.dashboard.menu.tabs.secondary.result",
            component: <ApiResult requestMethod={t(primaryActiveTab)} />,
        },
        {
            title: "api.dashboard.menu.tabs.secondary.action",
            component: (
                <ApiAction
                    tab={t(secondaryActiveTab)}
                    requestMethod={t(primaryActiveTab)}
                />
            ),
        },
        {
            title: "api.dashboard.menu.tabs.secondary.test",
            component: <ApiTest requestMethod={t(primaryActiveTab)} />,
        },
    ];

    // Set primary & secondary active tab to the first item in list whenever the selectedApi is changed
    useEffect(() => {
        setPrimaryActiveTab(primaryTabs[0].title);
        setSecondaryActiveTab(secondaryTabs[0].title);
    }, [selectedApiUuid]);

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

export default ApiMenu;
