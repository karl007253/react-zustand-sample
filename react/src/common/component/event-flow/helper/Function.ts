import { isArray, isEmpty, isObject } from "lodash";
import {
    addParamsFunction,
    findFunctionInList,
    generateUUIDtoFunction,
    getActionFormatVariableByParameter,
    getCallbacks,
} from "../../helper/Function";
import ActionFormat, {
    CombinedActionFormat,
    CombinedActionFormatParameterProps,
    FunctionInListProps,
    FunctionParameterProps,
    SelectedSubFlowsProps,
} from "../data/Functions";

type DeleteOptionsProps = {
    list: { [key: string]: CombinedActionFormat } | CombinedActionFormat[];
    index: string | number;
};

/**
 * Deletes a function
 * @param {DeleteOptionsProps} options The options on how to delete the function
 */
const functionDelete = (options: DeleteOptionsProps) => {
    const { list, index /* , eventName, isSubFlow */ } = options;

    // If both are empty then cannot delete
    if (!(list && index)) {
        return;
    }

    if (isArray(list)) {
        // Remove from the list
        // Need to parseInt because index is a string
        list.splice(parseInt(index.toString(), 10), 1);
    } else if (isObject(list)) {
        // This is a parameter function
        // Set to empty string
        // if (eventName === "presetValue" && !isSubFlow) {
        //     delete (list)[index]
        // } else {
        // (list)[index] = "";
        list[index] = {} as CombinedActionFormat;
        // }
    }
};

export const findFunctionByParentUuid = (
    index: number,
    selectedList: CombinedActionFormat[],
    subFlows: SelectedSubFlowsProps[],
    parentUuid = "#none"
) => {
    if (parentUuid === "#none") {
        const subFlowIndex = index - 1;
        // handle subflow
        if (index > 0 && !isEmpty(subFlows)) {
            // Find the function using the uuid of the subflow function
            const functionInList = findFunctionInList(
                subFlows[subFlowIndex].uuid,
                selectedList
            ) as FunctionInListProps;

            const actionParameter = getActionFormatVariableByParameter(
                functionInList.func,
                "parameter"
            ) as CombinedActionFormatParameterProps;

            return {
                // This is undefined because this is not the function we're looking for
                func: undefined,
                list: actionParameter,
                index: subFlows[subFlowIndex].param,
            };
        }

        return {
            func: undefined,
            list: selectedList,
            index: undefined,
        };
    }
    return findFunctionInList(parentUuid, selectedList);
};

export const handleDeleteFunction = (
    uuid: string,
    selectedList: CombinedActionFormat[]
) => {
    const { list, index: currentIndex } = findFunctionInList(
        uuid,
        selectedList
    ) as FunctionInListProps;
    functionDelete({
        list,
        index: currentIndex,
    });
};

export const addFunctionToList = (
    index: number,
    selectedList: CombinedActionFormat[],
    selectedSubFlows: SelectedSubFlowsProps[],
    parentUuid: string,
    connectionName: string,
    data: CombinedActionFormat
) => {
    const {
        func,
        list,
        index: currentIndex,
    } = findFunctionByParentUuid(
        index,
        selectedList,
        selectedSubFlows,
        parentUuid
    ) as FunctionInListProps;

    // Add uuid to the new function
    generateUUIDtoFunction(data);

    // if (isArray(list) /* || (isSubFlow && connectionName) */) {
    if (isArray(list) || (selectedSubFlows.length > 0 && connectionName)) {
        if (connectionName) {
            const fn = addParamsFunction(func);
            const actionRes = getActionFormatVariableByParameter(
                fn,
                "res"
            ) as FunctionParameterProps;

            // Get all callbacks of this connection name
            const callbacks = getCallbacks(connectionName);

            // Loop through the params of the destination function
            if (actionRes?.params) {
                Object.keys(actionRes.params).forEach((paramName) => {
                    // for (let paramName in actionRes.params) {
                    const valueType = actionRes?.params?.[paramName];

                    // Make sure paramName is a functionList
                    if (
                        valueType === "functionList" &&
                        (Object.keys(callbacks).includes(paramName) ||
                            paramName === connectionName)
                    ) {
                        const actionParameter =
                            getActionFormatVariableByParameter(
                                func,
                                "parameter"
                            ) as CombinedActionFormatParameterProps;

                        if (isArray(actionParameter[paramName])) {
                            (
                                actionParameter[
                                    paramName
                                ] as CombinedActionFormat[]
                            ).unshift(data);
                        } else {
                            actionParameter[paramName] = [data];
                        }
                    }
                });
            }
        } else {
            (list as CombinedActionFormat[]).splice(
                currentIndex ? parseInt(currentIndex.toString(), 10) + 1 : 0,
                0,
                data
            );
        }
    } else if (isObject(list)) {
        list[currentIndex] = data;
    }
};

export const getSubFlowsFromList = (
    selectedList: CombinedActionFormat[],
    uuid: string,
    flowIndex: number,
    additionalData?: SelectedSubFlowsProps
) => {
    const { subFlows } = findFunctionInList(
        uuid || "",
        selectedList,
        flowIndex
    ) as FunctionInListProps;

    if (additionalData) {
        // Remove same uuid
        const filteredSubFlows = subFlows.filter(
            (subFlow) => subFlow.uuid !== uuid
        );
        filteredSubFlows.push(additionalData);

        return filteredSubFlows;
    }

    return subFlows;
};

/**
 * Iterate over API/Scheduler action tree, and run a custom converter to transform or modify the existing function blocks.
 * This includes all nested function, and function list in callbacks.
 * @param actions the action list
 * @param converter custom operation that takes a function block and allows output of a modified one.
 * @return a modified action tree, having similar structure as the input
 */
export const iterateModifyFunctions = (
    actions: ActionFormat[],
    converter: (action: ActionFormat) => ActionFormat
): ActionFormat[] => {
    // Iterate over the action list
    return actions.map((action) => {
        // This new variable holds a copy of function parameters that will be modified afterward.
        const newParameter = {
            ...action.parameter,
        };

        if (action.parameter) {
            Object.entries(action.parameter).forEach(([key, value]) => {
                if (action.parameter_type) {
                    if (action.parameter_type[key] === "function") {
                        // Parameter is a function (nested function); recursively call this function again.
                        // Since this function's input is expected to be an array, and the argument here is a single object,
                        // immediately construct and destruct the intermediate array.
                        [newParameter[key]] = iterateModifyFunctions(
                            [value] as ActionFormat[],
                            converter
                        );
                    } else if (Array.isArray(value)) {
                        // Parameter is a function list; recursively call this function again.
                        newParameter[key] = iterateModifyFunctions(
                            value as ActionFormat[],
                            converter
                        );
                    }
                }
            });
        }

        // Run the converter, and return the result of it
        return converter({
            ...action,
            parameter: newParameter,
        });
    });
};
