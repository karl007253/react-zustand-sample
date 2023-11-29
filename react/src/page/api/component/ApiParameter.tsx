import { useState } from "react";
import {
    ApiData,
    RequestParameter,
} from "../../../common/zustand/interface/ApiInterface";
import TabMenu, { TabItem } from "../../../common/component/TabMenu";

import ApiParameterList from "./ApiParameterList";

type ApiParameterProps = {
    requestMethod: keyof ApiData;
};

const ApiParameter = ({ requestMethod }: ApiParameterProps) => {
    // Prepare parameter types
    const parameterTypes = ["query", "body"];

    // Prepare primary tabs list
    const tabs: TabItem[] = parameterTypes.map((paramType) => ({
        title: `api.dashboard.action.parameters.menu.tabs.${paramType}`,
        component: (
            <ApiParameterList
                requestMethod={requestMethod}
                paramType={paramType as keyof RequestParameter}
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

export default ApiParameter;
