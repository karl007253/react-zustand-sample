import { useState, useEffect } from "react";
import EventFlowRightPanel, { PanelTabs } from "./EventFlowRightPanel";

import { getUserDefinedFunctions } from "./helper/Function";
import { Functions } from "../data/Functions";
import EventFlow from "./event-flow/EventFlow";
import ActionFormat, {
    GlobalActionFormat,
    CombinedActionFormat,
    CombinedGlobalActionFormat,
    SelectedSubFlowsProps,
    FunctionListsProps,
    ActionResultParameter,
} from "./event-flow/data/Functions";

type SelectedGlobalFunctionProps = {
    function: string;
    uuid: string;
    process: CombinedActionFormat[];
};

type ShapeClickedDataProps = {
    data: CombinedActionFormat;
    flowIndex: number;
};

type EventFlowPanelProps = {
    functions: ActionFormat[];
    globalFunctions: GlobalActionFormat[];
    onUpdateAction: (newFunctions: ActionFormat[]) => void;
    onUpdateGlobal: (newGlobalFunctions: GlobalActionFormat[]) => void;
    actionResultParameter?: ActionResultParameter[];
    switchRightPanelTabMain?: string;
};

const EventFlowPanel = ({
    functions,
    globalFunctions,
    onUpdateAction,
    onUpdateGlobal,
    actionResultParameter,
    switchRightPanelTabMain,
}: EventFlowPanelProps) => {
    // TODO: For now use this to hide/display the eventflow when the right panel tab is change
    const [rightPanelActiveTab, setRightPanelActiveTab] =
        useState<string>("action");

    // Set the function list to local state so that when a global function is added
    // it will trigger re-render then the added global function will be available in UserDefined category
    const [functionLists, setFunctionLists] =
        useState<FunctionListsProps>(Functions);

    const [selectedSubFlows, setSelectedSubFlows] = useState<
        SelectedSubFlowsProps[]
    >([]);

    // TODO: The selected function and setting which one is selected should be inside <EventFlow> component
    const [selectedFunction, setSelectedFunction] =
        useState<ShapeClickedDataProps | null>(null);

    // TODO: The selected function and setting which one is selected should be inside <EventFlow> component
    const [selectedGlobalFunction, setSelectedGlobalFunction] =
        useState<GlobalActionFormat | null>(null);

    // TODO: Check if this can be put inside the EventFlow component
    // If there's any changes in global function then add it to the function list
    useEffect(() => {
        const userDefined = getUserDefinedFunctions(globalFunctions);

        setFunctionLists({
            ...functionLists,
            UserDefined: userDefined,
        });

        // TODO: For now, need to update this variable so that the global functions will have parameters
        //       displayed in the inspector
        Functions.UserDefined = userDefined;
    }, [globalFunctions]);

    // Update the "result" function with parameters, set from the result tab
    useEffect(() => {
        const params: { [name: string]: string } = {};

        actionResultParameter?.forEach((item) => {
            params[item.name] = item.type;
        });

        const setResultRef = Functions.Result["Result.setAPI"];

        setResultRef.params = Object.keys(params).length > 0 ? params : null;

        setFunctionLists({
            ...functionLists,
            Result: {
                ...functionLists.Result,
                "Result.setAPI": {
                    ...functionLists.Result["Result.setAPI"],
                    params: setResultRef.params,
                },
            },
        });
    }, [actionResultParameter]);

    const updateFunctions = (newFunctions: CombinedActionFormat[]) => {
        onUpdateAction(newFunctions as ActionFormat[]);
    };

    const updateGlobalFunctions = (
        newGlobalFunctions: CombinedGlobalActionFormat[]
    ) => {
        // Check if there's selected
        if (selectedGlobalFunction) {
            const selected = newGlobalFunctions.find(
                (item) => item.uuid === selectedGlobalFunction.uuid
            );

            if (selected) {
                // Update the selected global function
                setSelectedGlobalFunction(selected as GlobalActionFormat);
            }
        }

        onUpdateGlobal(newGlobalFunctions as GlobalActionFormat[]);
    };

    const handleTabChange = (tab: string) => {
        setRightPanelActiveTab(tab);
    };

    return (
        <div className="d-flex mh-100vh-100px" aria-label="event-flow-panel">
            {/* TODO: The EventFlow will render the functions into a flowchart, don't pass the global functions here only the functions of the global */}
            <EventFlow
                functions={functions}
                functionLists={functionLists}
                onUpdate={updateFunctions}
                selectedFunction={selectedFunction}
                setSelectedFunction={setSelectedFunction}
                selectedSubFlows={selectedSubFlows}
                setSelectedSubFlows={setSelectedSubFlows}
                globalFunctions={globalFunctions} // TODO: Don't pass the whole global functions here, only the "process" which will contain all the functions
                selectedGlobalFunction={selectedGlobalFunction} // TODO: Find a way not to pass this
                onUpdateGlobal={updateGlobalFunctions} // TODO: This shouldn't be pass
                hidden={
                    rightPanelActiveTab === PanelTabs.GLOBAL &&
                    !selectedGlobalFunction
                }
            />

            <EventFlowRightPanel
                functions={functions}
                functionLists={functionLists}
                onUpdate={updateFunctions}
                selectedFunction={selectedFunction}
                setSelectedFunction={setSelectedFunction}
                selectedSubFlows={selectedSubFlows}
                setSelectedSubFlows={setSelectedSubFlows}
                globalFunctions={globalFunctions} // TODO: Don't pass the whole global functions here, only the "process" which will contain all the functions
                selectedGlobalFunction={selectedGlobalFunction} // TODO: Find a way not to pass this
                setSelectedGlobalFunction={setSelectedGlobalFunction} // TODO: This shouldn't be pass
                onUpdateGlobal={updateGlobalFunctions} // TODO: This shouldn't be pass
                onTabChange={handleTabChange}
                switchTabMain={switchRightPanelTabMain}
            />
        </div>
    );
};

export type { SelectedGlobalFunctionProps, ShapeClickedDataProps };
export default EventFlowPanel;
