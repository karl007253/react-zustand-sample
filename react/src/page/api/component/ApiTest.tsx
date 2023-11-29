import { useState } from "react";

import {
    ApiData,
    RequestParameter,
} from "../../../common/zustand/interface/ApiInterface";
import TabMenu, { TabItem } from "../../../common/component/TabMenu";

import ApiTestRun from "./ApiTestRun";

type ApiTestProps = {
    requestMethod: keyof ApiData;
};

const ApiTest = ({ requestMethod }: ApiTestProps) => {
    // Prepare parameter types
    const parameterTypes = ["query", "body"];

    // Prepare primary tabs list
    const tabs: TabItem[] = parameterTypes.map((type) => ({
        title: `api.dashboard.test.tabs.main.${type}`,
        component: (
            <ApiTestRun
                requestMethod={requestMethod}
                parameterType={type as keyof RequestParameter}
            />
        ),
    }));

    // Prepare activetab state
    const [activeTab, setActiveTab] = useState(tabs[0].title);

    return (
        <TabMenu
            primary={{
                tabs,
                activeTab,
                onTabChange: setActiveTab,
            }}
        />
    );
};

export default ApiTest;
