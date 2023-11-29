import { useEffect, useMemo, useState } from "react";
import { cloneDeep, isArray, isEmpty, isObject } from "lodash";

// TODO: Don't import anything outside event-flow folder
import {
    addParamsFunction,
    createFunction,
    getActionFormatVariableByParameter,
    getCallbackName,
} from "../helper/Function";

import ActionPanel from "./ActionPanel";
import Toolbar from "./Toolbar";

import {
    CombinedActionFormat,
    CombinedActionFormatParameterProps,
    CombinedActionFormatParameterTypeProps,
    FunctionInListProps,
    FunctionListsProps,
    FunctionParameterProps,
    OptionProps,
    SelectedSubFlowsProps,
    CombinedGlobalActionFormat,
} from "./data/Functions";
import {
    addFunctionToList,
    findFunctionByParentUuid,
    handleDeleteFunction,
    getSubFlowsFromList,
} from "./helper/Function";
import FunctionModal from "./modals/FunctionModal";

import { ZoomPercentage } from "./ZoomSelect";

// TODO: Don't import anything outside event-flow folder
//       EventFlowPanel component is the one using eventflow, not the eventflow using EventFlowPanel
import {
    SelectedGlobalFunctionProps,
    ShapeClickedDataProps,
} from "../EventFlowPanel";

export type NodeDataProps = {
    parentUuid?: string;
    connectionName?: string;
    functionData?: CombinedActionFormat;
    functionName?: string;

    // for delete
    uuid?: string;
};

export type ParentFunctionProps = {
    function_uuid: string;
    connection_name: string;
    flowIndex: number;
};

type UpdateFunctionDataProps = {
    index: number;
    data: NodeDataProps;
    type?: string;
};

type FlowResultProps = {
    flow:
        | string
        | null
        | CombinedActionFormat
        | CombinedActionFormat[]
        | Record<string, never>;
    status: boolean;
    uuid?: string;
};

type EventFlowProps = {
    onUpdate: (newFunctions: CombinedActionFormat[]) => void;
    functions: CombinedActionFormat[];
    functionLists: FunctionListsProps;
    selectedFunction: ShapeClickedDataProps | null;
    setSelectedFunction: (data: ShapeClickedDataProps | null) => void;
    selectedSubFlows: SelectedSubFlowsProps[];
    setSelectedSubFlows: (data: SelectedSubFlowsProps[]) => void;
    globalFunctions: CombinedGlobalActionFormat[]; // TODO: This shouldn't be here
    selectedGlobalFunction: SelectedGlobalFunctionProps | null; // TODO: This shouldn't be here
    onUpdateGlobal: (newGlobalFunctions: CombinedGlobalActionFormat[]) => void; // TODO: This shouldn't be here
    hidden?: boolean; // TODO: For now use this to hide the event flow
};

export type ButtonStateProps = {
    copy: boolean;
    paste: boolean;
    delete: boolean;
};

/**
 * Event flow component
 *
 * TODO: Remove the global functions here, only pass the functions of the global
 */
const EventFlow = ({
    onUpdate,
    functions,
    functionLists,
    selectedFunction,
    setSelectedFunction,
    selectedSubFlows,
    setSelectedSubFlows,
    globalFunctions,
    selectedGlobalFunction,
    onUpdateGlobal,
    hidden = false, // Default is false
}: EventFlowProps) => {
    const [functionModalVisible, setFunctionModalVisible] =
        useState<boolean>(false);
    const showFunctionModal = () => setFunctionModalVisible(true);
    const hideFunctionModal = () => setFunctionModalVisible(false);

    const [updateFunctionData, setUpdateFunctionData] =
        useState<UpdateFunctionDataProps | null>(null);

    // List of connection names
    const [options, setOptions] = useState<OptionProps[]>([]);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const [buttonState, setButtonState] = useState<ButtonStateProps>({
        copy: true,
        paste: true,
        delete: true,
    });

    const [zoom, setZoom] = useState<ZoomPercentage[]>([
        {
            index: 0,
            percentage: "100",
        },
    ]);

    const [selectedParentFunction, setSelectedParentFunction] =
        useState<ParentFunctionProps | null>(null);

    useEffect(() => {
        setLoading(false);
    }, [functions, globalFunctions]);

    useEffect(() => {
        // Reset inspector selection
        setSelectedFunction(null);

        // Reset the zoom percentage
        setZoom([
            {
                index: 0,
                percentage: "100",
            },
        ]);
    }, [selectedGlobalFunction]);

    const updateFunctions = (
        index: number,
        data: NodeDataProps,
        type?: string
    ) => {
        const { parentUuid, connectionName, functionName, uuid } = data;
        let { functionData } = data;

        // loading state
        setLoading(true);

        // get selected list from index
        let list = cloneDeep(functions);
        const listGlobal = cloneDeep(globalFunctions);

        // if global function is selected
        if (selectedGlobalFunction) {
            list =
                listGlobal.find((currentList) => {
                    return currentList.uuid === selectedGlobalFunction.uuid;
                })?.process || [];
        }

        if (type === "delete" && uuid) {
            handleDeleteFunction(uuid, list);

            // Reset inspector selection
            setSelectedFunction(null);
        } else if (parentUuid && typeof connectionName === "string") {
            // for "new", functionData will be initialized from createFunction
            if (functionName) {
                functionData = createFunction(functionName);
            }

            if (type === "move" && functionData?.uuid) {
                // delete moved function
                handleDeleteFunction(functionData.uuid, list);

                // Reset inspector selection
                setSelectedFunction(null);
            }

            if (functionData) {
                addFunctionToList(
                    index,
                    list,
                    selectedSubFlows,
                    parentUuid || "#none",
                    connectionName || "",
                    functionData
                );
            }
        }

        if (selectedGlobalFunction) {
            onUpdateGlobal(listGlobal);
        } else {
            onUpdate(list);
        }
    };

    const handleUpdate = (
        index: number,
        data: NodeDataProps,
        type?: string
    ) => {
        const { parentUuid, connectionName, functionName } = data;
        let { functionData } = data;

        let selectedList = cloneDeep(functions);

        // if global function is selected
        if (selectedGlobalFunction) {
            selectedList =
                cloneDeep(globalFunctions).find((list) => {
                    return list.uuid === selectedGlobalFunction.uuid;
                })?.process || [];
        }

        // for "new", functionData will be initialized from createFunction
        if (functionName) {
            functionData = createFunction(functionName);
        }

        // check if there is options for callback
        const currentOptions: OptionProps[] = [];
        const { func } = findFunctionByParentUuid(
            index,
            selectedList,
            selectedSubFlows,
            parentUuid || "#none"
        ) as FunctionInListProps;

        if (func) {
            const fn = addParamsFunction(func);
            const actionRes = getActionFormatVariableByParameter(
                fn,
                "res"
            ) as FunctionParameterProps;

            if (
                !connectionName &&
                actionRes?.params &&
                !isEmpty(actionRes.params)
            ) {
                Object.keys(actionRes.params).forEach((name) => {
                    const paramValue = actionRes?.params?.[name] || "";
                    const callbackName =
                        getCallbackName(name, paramValue) || "";

                    if (paramValue === "functionList") {
                        const connectionText = ["yes", "no"].includes(
                            callbackName
                        )
                            ? callbackName.toUpperCase()
                            : callbackName;

                        currentOptions.push({
                            value: callbackName,
                            text: `${getActionFormatVariableByParameter(
                                fn,
                                "function"
                            )}: ${connectionText}`,
                        });
                    }
                });

                // Add a same level option only if there's functionList in the params
                if (currentOptions.length > 0) {
                    setMessage(
                        `Where do you want to put this function "${getActionFormatVariableByParameter(
                            functionData,
                            "function"
                        )}"?`
                    );

                    // If this is not subflow then add this option to the beginning of the array
                    // Greater than zero means is a subflow
                    // if (selectedState.selectedFlowIndex == 0 && props.query.eventSelected != "presetValue") {
                    if (index === 0) {
                        // Add at the beginning of the array
                        currentOptions.unshift({
                            value: "",
                            text: "Same level",
                        });
                    }
                }
                setOptions(currentOptions);
            }
        }

        if (currentOptions.length > 0) {
            // set state for update function data
            setUpdateFunctionData({ index, data, type });

            showFunctionModal();
        } else {
            updateFunctions(index, data, type);
        }
    };

    const handleFunctionModalConfirm = (connectionName: string) => {
        // put passed connectionName to updateFunctionData
        if (updateFunctionData) {
            const currentUpdateFunctionData = {
                ...updateFunctionData,
                data: {
                    ...updateFunctionData.data,
                    connectionName,
                },
            };
            const { index, data, type } = currentUpdateFunctionData;

            updateFunctions(index, data, type);
        }

        hideFunctionModal();
    };

    const handleCircleClicked = (data: ParentFunctionProps) => {
        setSelectedParentFunction(data);

        setButtonState({
            copy: true,
            paste: false,
            delete: true,
        });
    };

    const handleShapeClicked = (data: ShapeClickedDataProps | null) => {
        setSelectedFunction(data);

        if (data) {
            let selectedList = cloneDeep(functions);

            // if global function is selected
            if (selectedGlobalFunction) {
                selectedList =
                    cloneDeep(globalFunctions).find((list) => {
                        return list.uuid === selectedGlobalFunction.uuid;
                    })?.process || [];
            }

            const currentSubFlows = getSubFlowsFromList(
                selectedList,
                data.data?.uuid || "",
                data.flowIndex
            );
            setSelectedSubFlows(currentSubFlows);

            setButtonState({
                copy: false,
                paste: true,
                delete: false,
            });
        }
    };

    // source - is the function for an event (e.g. "click") of a component (e.g button)
    // and source is in the format defined in Functions.js->functionFormat, e.g. { f: "", paramType: {}, params: {} }
    // search.uuid - uuid of the selected node/shape in a flow, or the uuid of selected subflow via right-panel's action-inspector             uuid: uuid, param: sting
    // search.param - a key/property in function object.params[key]
    const findInFlow = (
        search: SelectedSubFlowsProps,
        source: string | null | CombinedActionFormat | CombinedActionFormat[]
    ) => {
        let result: FlowResultProps = { flow: {}, status: false };
        // 1a. result.status = true, means the object with the uuid is found. But it doesn't necessary mean the flow (object.param[property]) exists.
        // 1b. result.flow is set to empty object if flow doesn't exist.
        // 2. result.status = false, means no object with uuid is found

        if (!source) {
            return result;
        }

        // source is array
        if (isArray(source)) {
            for (let j = 0; j < source.length; j++) {
                const current = source[j];
                const actionParameter = getActionFormatVariableByParameter(
                    current,
                    "parameter"
                ) as CombinedActionFormatParameterProps;

                if (current.uuid === search.uuid) {
                    const flow = actionParameter[search.param];
                    result = { uuid: search.uuid, flow, status: true };
                    break;
                } else if (actionParameter) {
                    result = findInFlow(search, current);
                    if (result.status) {
                        // object with uuid is found, but flow is set to empty object cos (object.param[property]) does not exist.
                        result.flow = result.flow ? result.flow : {};
                        return result;
                    }
                }
            }
        } // source is object
        else if (isObject(source)) {
            const currentSource = source as CombinedActionFormat;
            const actionParameter = getActionFormatVariableByParameter(
                currentSource,
                "parameter"
            ) as CombinedActionFormatParameterProps;
            const actionParameterType = getActionFormatVariableByParameter(
                currentSource,
                "parameter_type"
            ) as CombinedActionFormatParameterTypeProps;
            const fn = addParamsFunction(currentSource);
            const actionRes = getActionFormatVariableByParameter(
                fn,
                "res"
            ) as FunctionParameterProps;

            if (currentSource?.uuid === search.uuid) {
                const flow = actionParameter[search.param];
                result = { uuid: search.uuid, flow, status: true };
            } else {
                // same logic as above (for searching object)
                Object.keys(actionParameter ?? {}).every((key) => {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            actionParameter,
                            key
                        ) && // check if the key exists in parameter_type
                        ((actionParameterType &&
                            Object.prototype.hasOwnProperty.call(
                                actionParameterType,
                                key
                            )) ||
                            // check if the key exists in res.params with value of functionList
                            (actionRes &&
                                actionRes.params &&
                                Object.prototype.hasOwnProperty.call(
                                    actionRes.params,
                                    key
                                ) &&
                                actionRes.params[key] === "functionList"))
                    ) {
                        result = findInFlow(search, actionParameter[key]);
                        if (result.status) {
                            // object with uuid is found, but flow is set to empty object cos (object.param[property]) does not exist.
                            result.flow = result.flow ? result.flow : {};
                            return false;
                        }
                    }

                    return true;
                });

                if (result.status) {
                    return result;
                }
            }
        }

        // object with uuid is found, but flow is set to empty object cos (object.param[property]) does not exist.
        result.flow = result.flow ? result.flow : {};
        return result;
    };

    const appendSubflowsToMain = (
        currentFlows: CombinedActionFormat[][],
        selectedSubflows: SelectedSubFlowsProps[]
    ) => {
        // remove all except main event-flow in current flows
        const newFlows = cloneDeep(currentFlows);
        if (newFlows.length > 0) {
            newFlows.splice(1);
        }

        if (selectedSubflows) {
            let source: CombinedActionFormat | CombinedActionFormat[] =
                currentFlows[0];
            // find and append subflow to newFlows
            for (let i = 0; i < selectedSubflows.length; i++) {
                const search = selectedSubflows[i];
                const result = findInFlow(search, source);

                if (result.status) {
                    // do not bother to find the next flow cos the current flow does not exisit
                    if (
                        typeof result.flow !== "object" ||
                        isEmpty(result.flow)
                    ) {
                        // prepare an empty subflow for user
                        newFlows.push([]);
                        break;
                    }

                    // the current flow is found, continue to find the next flow using the current flow as source
                    newFlows.push([result.flow as CombinedActionFormat]);

                    source = result.flow as CombinedActionFormat;
                } else {
                    // do not bother to find the next flow cos the parent does not exists
                    break;
                }
            }
        }

        return newFlows;
    };

    let flows;

    // TODO: The global function should be processed outside this component
    //       Just need to pass the functions to the "functions" props of this component
    if (selectedGlobalFunction) {
        const initialFlowsArray = appendSubflowsToMain(
            [
                selectedGlobalFunction.process?.filter((item) => {
                    const actionFunction = getActionFormatVariableByParameter(
                        item,
                        "function"
                    ) as string;

                    return actionFunction;
                }),
            ],
            selectedSubFlows
        );
        flows = initialFlowsArray;
    } else {
        const initialFlowsArray = appendSubflowsToMain(
            [functions],
            selectedSubFlows
        );
        flows = initialFlowsArray;
    }

    // Memoized the toolbar so that this won't re-render
    const memoizedToolbar = useMemo(
        () => (
            <Toolbar
                selectedFunction={selectedFunction}
                onUpdate={handleUpdate}
                selectedParentFunction={selectedParentFunction}
                buttonState={buttonState}
            />
        ),
        [selectedFunction, selectedParentFunction]
    );

    return (
        <>
            <div className="eventF event-flow flex-grow-1 mw-100-300 w-0 me-2 rounded-2 border-light-gray">
                {!hidden && memoizedToolbar}
                <div
                    id="event-flow-main"
                    className="overflow-auto d-flex flex-row bg-white h-100-40px"
                    data-testid="event-flow-main"
                >
                    {!hidden && (
                        <ActionPanel
                            onUpdate={handleUpdate}
                            functions={flows}
                            functionLists={functionLists}
                            action={handleShapeClicked}
                            selectedParentFunction={selectedParentFunction}
                            handleCircleClicked={handleCircleClicked}
                            loading={loading}
                            selectedSubFlows={selectedSubFlows}
                            zoom={zoom}
                            setZoom={setZoom}
                        />
                    )}
                </div>
            </div>

            <FunctionModal
                show={functionModalVisible}
                handleClose={hideFunctionModal}
                handleConfirm={handleFunctionModalConfirm}
                title="Dropped Function"
                message={message}
                options={options}
            />
        </>
    );
};

export default EventFlow;
