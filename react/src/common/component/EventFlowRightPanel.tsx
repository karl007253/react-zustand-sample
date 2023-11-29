import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

import TabMenu, { TabItem } from "./TabMenu";
import FunctionList from "./event-flow/FunctionList";
import Inspector from "./event-flow/Inspector";
import { ShapeClickedDataProps } from "./EventFlowPanel";
import {
    CombinedActionFormat,
    CombinedGlobalActionFormat,
    FunctionListsProps,
    GlobalActionFormat,
    SelectedSubFlowsProps,
} from "./event-flow/data/Functions";
import GlobalFunction from "./event-flow/GlobalFunction";
import GlobalInspector from "./event-flow/GlobalInspector";

enum PanelTabs {
    ACTION = "eventFlow.tabs.action.title",
    GLOBAL = "eventFlow.tabs.global.title",
}

type EventFlowRightPanelProps = {
    functions: CombinedActionFormat[];
    functionLists: FunctionListsProps;
    onUpdate: (newFunctions: CombinedActionFormat[]) => void;
    selectedFunction: ShapeClickedDataProps | null;
    setSelectedFunction: (data: ShapeClickedDataProps | null) => void;
    selectedSubFlows: SelectedSubFlowsProps[];
    setSelectedSubFlows: (data: SelectedSubFlowsProps[]) => void;
    globalFunctions: CombinedGlobalActionFormat[];
    selectedGlobalFunction: GlobalActionFormat | null;
    setSelectedGlobalFunction: (
        selectedGlobalFunction: GlobalActionFormat | null
    ) => void;
    onUpdateGlobal: (newGlobalFunctions: CombinedGlobalActionFormat[]) => void;
    onTabChange: (tab: string) => void;
    switchTabMain?: string; // Switch the tab to main (action) base from the changes of this prop
};

const EventFlowRightPanel = ({
    functions,
    functionLists,
    onUpdate,
    selectedFunction,
    setSelectedFunction,
    selectedSubFlows,
    setSelectedSubFlows,
    globalFunctions,
    selectedGlobalFunction,
    setSelectedGlobalFunction,
    onUpdateGlobal,
    onTabChange,
    switchTabMain,
}: EventFlowRightPanelProps) => {
    // Prepare primary active tab state. Use "action" as default
    const [primaryActiveTab, setPrimaryActiveTab] = useState<string>(
        PanelTabs.ACTION
    );

    useEffect(() => {
        // Reset selectedGlobalFunction
        setSelectedGlobalFunction(null);

        // Reset inspector selection
        setSelectedFunction(null);

        // TODO: For now use this to know which tab is on. Use for changing the flowchart in eventflow component
        onTabChange(primaryActiveTab);
    }, [primaryActiveTab]);

    useEffect(() => {
        setPrimaryActiveTab(PanelTabs.ACTION);

        // Reset inspector selection
        setSelectedFunction(null);
    }, [switchTabMain]);

    // Update the global function
    const handleGlobalFunctionChange = (globalFunction: GlobalActionFormat) => {
        const newGlobalFunctions = cloneDeep(globalFunctions);

        const index = newGlobalFunctions.findIndex(
            (item) => item.uuid === globalFunction.uuid
        );

        if (index !== -1) {
            const func = newGlobalFunctions[index];

            newGlobalFunctions[index] = {
                ...func,
                function: globalFunction.function,
                result: globalFunction.result,
                parameter: globalFunction.parameter,
            };

            onUpdateGlobal(newGlobalFunctions);
        }
    };

    // Tab content for action
    const actionTabContent = () => {
        return primaryActiveTab === PanelTabs.ACTION ? (
            <>
                <FunctionList functionLists={functionLists} type="action" />
                <Inspector
                    type="action"
                    functions={functions}
                    onUpdate={onUpdate}
                    selectedFunction={selectedFunction}
                    setSelectedFunction={setSelectedFunction}
                    selectedSubFlows={selectedSubFlows}
                    setSelectedSubFlows={setSelectedSubFlows}
                    globalFunctions={globalFunctions}
                    selectedGlobalFunction={selectedGlobalFunction}
                    onUpdateGlobal={onUpdateGlobal}
                />
            </>
        ) : undefined;
    };

    // Tab content for global function
    const globalTabContent = () => {
        return primaryActiveTab === PanelTabs.GLOBAL ? (
            <>
                <FunctionList functionLists={functionLists} type="global" />
                <GlobalFunction
                    globalFunctions={globalFunctions}
                    onUpdateGlobal={onUpdateGlobal}
                    selectedGlobalFunction={selectedGlobalFunction}
                    setSelectedGlobalFunction={setSelectedGlobalFunction}
                />

                {/* If no "global function" is selected but a "function" is selected then display the inspector */}
                {!selectedGlobalFunction || selectedFunction ? (
                    <Inspector
                        type="global"
                        functions={functions}
                        onUpdate={onUpdate}
                        selectedFunction={selectedFunction}
                        setSelectedFunction={setSelectedFunction}
                        selectedSubFlows={selectedSubFlows}
                        setSelectedSubFlows={setSelectedSubFlows}
                        globalFunctions={globalFunctions}
                        selectedGlobalFunction={selectedGlobalFunction}
                        onUpdateGlobal={onUpdateGlobal}
                    />
                ) : (
                    <GlobalInspector
                        globalFunctionList={globalFunctions}
                        globalFunction={selectedGlobalFunction}
                        setSelectedGlobalFunction={setSelectedGlobalFunction}
                        onUpdate={handleGlobalFunctionChange}
                    />
                )}
            </>
        ) : undefined;
    };

    // Prepare primary tabs list
    const primaryTabs: TabItem[] = [
        {
            title: PanelTabs.ACTION,
            component: actionTabContent(),
        },
        {
            title: PanelTabs.GLOBAL,
            component: globalTabContent(),
        },
    ];

    return (
        <div className="w-300">
            <TabMenu
                body={{ className: "p-0" }}
                primary={{
                    tabs: primaryTabs,
                    activeTab: primaryActiveTab,
                    onTabChange: setPrimaryActiveTab,
                    className: "shadow",
                }}
            />
        </div>
    );
};

export { PanelTabs };
export default EventFlowRightPanel;
