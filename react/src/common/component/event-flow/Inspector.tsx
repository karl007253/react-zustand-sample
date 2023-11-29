/* eslint no-underscore-dangle: 0 */
import { useState } from "react";
import { debounce, isArray, isEmpty, truncate, cloneDeep } from "lodash";
import { Container, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

import { toast } from "react-toastify";
import {
    faPaste,
    faCopy,
    faEllipsisH,
    faPlus,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import ParamDropdown from "./ParamDropdown";
import useToast from "../../hooks/Toast";

// TODO: Don't import anything outside event-flow folder
//       EventFlowPanel component is the one using eventflow, not the eventflow using EventFlowPanel
import {
    SelectedGlobalFunctionProps,
    ShapeClickedDataProps,
} from "../EventFlowPanel";

import {
    findFunctionInList,
    generateUUIDtoFunction,
    getActionFormatVariableByParameter,
    getValueTypeIcon,
    isActionFormat,
    valueFromString,
    valueToString,
    valueToShow,
} from "../helper/Function";

import { copyFunctionParam, getCopiedFunctionParam } from "./helper/Clipboard";
import { getSubFlowsFromList } from "./helper/Function";
import ActionFormat, {
    CombinedActionFormat,
    CombinedActionFormatParameterProps,
    CombinedActionFormatParameterTypeProps,
    FunctionInListProps,
    FunctionParameterProps,
    OldActionFormat,
    SelectedSubFlowsProps,
    CombinedGlobalActionFormat,
    GlobalActionFormat,
    ActionResultParameter,
} from "./data/Functions";
import ObjectEditorModal from "./modals/ObjectEditorModal";
import AddDynamicParamModal from "./modals/AddDynamicParamModal";
import Input from "./form/Input";
import { parameterTypes } from "./data/Constant";

type ParamTypeProps = {
    name: string;
    data: CombinedActionFormat;
    type: string;
    selectedFunction: ShapeClickedDataProps;
    onUpdate: (
        data: ShapeClickedDataProps,
        isUpdateSubFlows?: boolean,
        selectedParamType?: string
    ) => void;
    functions: (ActionFormat | OldActionFormat)[];
    setSelectedSubFlows: (data: SelectedSubFlowsProps[]) => void;
    globalFunctions: CombinedGlobalActionFormat[];
    selectedGlobalFunction: SelectedGlobalFunctionProps | null;
};

type ParamProps = {
    data: CombinedActionFormat;
    paramsList: ActionResultParameter[];
    selectedFunction: ShapeClickedDataProps;
    onUpdate: (
        data: ShapeClickedDataProps,
        isUpdateSubFlows?: boolean,
        selectedParamType?: string
    ) => void;
    functions: (ActionFormat | OldActionFormat)[];
    setSelectedSubFlows: (data: SelectedSubFlowsProps[]) => void;
    globalFunctions: CombinedGlobalActionFormat[];
    selectedGlobalFunction: SelectedGlobalFunctionProps | null;
};

type ParamsListResultProps = {
    params: ActionResultParameter[];
    dynamic: boolean;
};

type IconProps = {
    type: string;
    className?: string;
};

type InspectorProps = {
    type: string;
    functions: CombinedActionFormat[];
    onUpdate: (newFunctions: CombinedActionFormat[]) => void;
    selectedFunction: ShapeClickedDataProps | null;
    setSelectedFunction: (data: ShapeClickedDataProps | null) => void;
    selectedSubFlows: SelectedSubFlowsProps[];
    setSelectedSubFlows: (data: SelectedSubFlowsProps[]) => void;
    globalFunctions: CombinedGlobalActionFormat[];
    selectedGlobalFunction: GlobalActionFormat | null;
    onUpdateGlobal: (newGlobalFunctions: CombinedGlobalActionFormat[]) => void;
};

export type FunctionParamSelectionDataProps = {
    paramName: string;
    paramType: {
        [name: string]: string;
    };
    params: {
        [name: string]: string | ActionFormat | ActionFormat[] | undefined;
    };
};

type FunctionParamSelectionProps = {
    name: string;
    data: FunctionParamSelectionDataProps | Record<string, never>;
};

const functionParamSelection: FunctionParamSelectionProps = {
    name: "",
    data: {},
};

/**
 * Get the parameter list of a function
 * @param {object} func
 * @returns {array}
 */
const getParamsList = (func: CombinedActionFormat | undefined) => {
    const actionRes = getActionFormatVariableByParameter(
        func,
        "res"
    ) as FunctionParameterProps;
    const actionParameter = getActionFormatVariableByParameter(
        func,
        "parameter"
    ) as CombinedActionFormatParameterProps;
    const actionParameterType = getActionFormatVariableByParameter(
        func,
        "parameter_type"
    ) as CombinedActionFormatParameterTypeProps;

    const result: ParamsListResultProps = {
        params: [],
        dynamic: false,
    };

    if (func && actionRes && actionRes.params) {
        const { params } = actionRes;
        const paramNames = Object.keys(params);
        const isDynamic = paramNames.length === 0;

        let paramsList = paramNames;
        if (isDynamic) {
            paramsList = actionParameter ? Object.keys(actionParameter) : [];
        }

        paramsList.forEach((name) => {
            // Get the parameter type
            let type = params[name];

            // If this is dynamic then look for the type in paramType attribute
            if (isDynamic) {
                type =
                    actionParameterType &&
                    Object.keys(actionParameterType).length > 0 &&
                    actionParameterType[name]
                        ? actionParameterType[name]
                        : "string";
            }

            // Check if the parameter is a function list
            if (type === "functionList") {
                return;
            }

            result.params.push({ name, type });
        });

        // If there's dynamic
        result.dynamic = isDynamic;
    }

    return result;
};

/**
 * Displays the icon without html entities escaping
 */
const Icon = ({ className, type }: IconProps) => {
    return (
        <span
            className={className}
            dangerouslySetInnerHTML={{ __html: getValueTypeIcon(type) }}
        />
    );
};

/**
 * Displays the parameter types in a dropdown with input textbox
 * @param {object} props
 */
const ParamType = ({
    name,
    data,
    type,
    globalFunctions,
    selectedGlobalFunction,
    selectedFunction,
    onUpdate,
    functions,
    setSelectedSubFlows,
}: ParamTypeProps) => {
    const [objectEditorModalVisible, setObjectEditorModalVisible] =
        useState<boolean>(false);
    const showObjectEditorModal = () => setObjectEditorModalVisible(true);
    const hideObjectEditorModal = () => setObjectEditorModalVisible(false);

    const actionParameterData = getActionFormatVariableByParameter(
        data,
        "parameter"
    ) as CombinedActionFormatParameterProps;
    const actionParameterTypeData = getActionFormatVariableByParameter(
        data,
        "parameter_type"
    ) as CombinedActionFormatParameterTypeProps;
    const actionResData = getActionFormatVariableByParameter(
        data,
        "res"
    ) as FunctionParameterProps;

    const types = Object.keys(parameterTypes);
    const paramTypeName = name;
    const params = isEmpty(actionParameterData) ? {} : actionParameterData;
    // const { paramType } = data;
    const valueType = actionParameterTypeData?.[paramTypeName]
        ? actionParameterTypeData[paramTypeName]
        : "value";
    const isValueTypeField = [
        "dataField",
        "inputField",
        "extraField",
        "headerField",
        "queryField",
        "bodyField",
    ].includes(valueType);
    const originalValue = params[paramTypeName];
    const value =
        valueType === "value"
            ? valueToString(originalValue, type)
            : originalValue; // Only for valueType value, use validation
    const isFunction = valueType === "function";
    let isReadonly = ["array", "object", "longText"].includes(type);
    const withEllipsis = isFunction && !isValueTypeField;
    let disabledClass = withEllipsis || isReadonly ? " disabled" : "";
    let valueText = isFunction ? "[sub flow]" : value;
    const withDropdown =
        !!actionResData?.dropdown &&
        !withEllipsis &&
        (valueType === "value" || valueType === undefined);
    const isComment = type === "comment";
    let suggestedOptions = null;

    // Suggested options
    if (withDropdown) {
        suggestedOptions = actionResData?.dropdown?.[name];
    }

    // If this input or data then make the valuetext as input/data
    if (
        [
            "input",
            "data",
            "extra",
            "header",
            "query",
            "body",
            "function",
        ].includes(valueType)
    ) {
        if (!isFunction) {
            valueText = valueType;
        }
        isReadonly = true;
        disabledClass = " disabled";
    }

    // Enable the input if these valueType is selected
    if (isValueTypeField) {
        isReadonly = false;
        disabledClass = "";
    }

    // Handle the updating the text of a function parameter
    const updateText = (val: string) => {
        // // define on top to get the correct scrollTop value
        // const scroll = getScrollPropertyOnActionRefs();

        // If no value then remove the param from the list by passing "undefined"
        if (selectedFunction) {
            const actionParameter = getActionFormatVariableByParameter(
                selectedFunction.data,
                "parameter"
            ) as CombinedActionFormatParameterProps;

            const actionParameterKey = isActionFormat(selectedFunction.data)
                ? "parameter"
                : "params";

            if (val === "") {
                const currentSelectedFunction = {
                    ...selectedFunction,
                    data: {
                        ...selectedFunction?.data,
                        [actionParameterKey]: {
                            ...actionParameter,
                            // set param to {}, e.g params: {}
                            [paramTypeName]: undefined,
                        },
                    },
                } as ShapeClickedDataProps;

                onUpdate(currentSelectedFunction);

                // set functionParamSelection object so it can be used for copy and pasting a function param
                functionParamSelection.data = {
                    ...functionParamSelection.data,
                    params: {
                        // set param to {}, e.g params: {}
                        [paramTypeName]: undefined,
                    },
                } as FunctionParamSelectionDataProps;
            } else {
                // Only for valueType value, use validation
                const currentValue =
                    valueType === "value" ? valueFromString(val, type) : val;
                // prevent if value = null from auto erase user-entry (e.g. 123->123a->suddenly-auto-cleared)
                if (currentValue !== null) {
                    const currentSelectedFunction = {
                        ...selectedFunction,
                        data: {
                            ...selectedFunction?.data,
                            [actionParameterKey]: {
                                ...actionParameter,
                                [paramTypeName]: currentValue,
                            },
                        },
                    } as ShapeClickedDataProps;

                    onUpdate(currentSelectedFunction);

                    // set functionParamSelection object so it can be used for copy and pasting a function param
                    functionParamSelection.data = {
                        ...functionParamSelection.data,
                        params: {
                            // set param to {}, e.g params: {}
                            [paramTypeName]: currentValue,
                        },
                    } as FunctionParamSelectionDataProps;
                }
            }
        }

        // // HACK: prevents autoscroll to the bottom after selecting functions on a big flow
        // setScrollPropertyOnActionRefs(scroll);
    };

    const handleObjectEditorModalConfirm = (text: string) => {
        updateText(text);

        hideObjectEditorModal();
    };

    // Handles the selection of a parameter type
    const handleDropdownClick = (
        currentType: string,
        e: React.SyntheticEvent<unknown, Event>
    ) => {
        e.preventDefault();

        const actionParameterType = getActionFormatVariableByParameter(
            selectedFunction.data,
            "parameter_type"
        ) as CombinedActionFormatParameterTypeProps;
        const actionParameter = getActionFormatVariableByParameter(
            selectedFunction.data,
            "parameter"
        ) as CombinedActionFormatParameterProps;
        const actionParameterTypeKey = isActionFormat(selectedFunction.data)
            ? "parameter_type"
            : "paramType";
        const actionParameterKey = isActionFormat(selectedFunction.data)
            ? "parameter"
            : "params";

        const currentSelectedFunction = {
            ...selectedFunction,
            data: {
                ...selectedFunction.data,
                [actionParameterTypeKey]: {
                    ...actionParameterType,
                    [paramTypeName]: currentType,
                },
                [actionParameterKey]: {
                    ...actionParameter,
                    [paramTypeName]: "",
                },
            },
        } as ShapeClickedDataProps;

        onUpdate(currentSelectedFunction, currentType === "function", name);
    };

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        const actionParameter = getActionFormatVariableByParameter(
            data,
            "parameter"
        ) as CombinedActionFormatParameterProps;
        const actionFunction = getActionFormatVariableByParameter(
            data,
            "function"
        ) as string;

        if (valueType === "function") {
            let selectedList = cloneDeep(functions);
            const listGlobal = cloneDeep(globalFunctions);

            // if global function is selected
            if (selectedGlobalFunction) {
                selectedList =
                    listGlobal.find((currentList) => {
                        return currentList.uuid === selectedGlobalFunction.uuid;
                    })?.process || [];
            }

            if ((actionParameter?.[name] as CombinedActionFormat)?.uuid) {
                const currentSubFlows = getSubFlowsFromList(
                    selectedList,
                    (actionParameter?.[name] as CombinedActionFormat)?.uuid ||
                        "",
                    selectedFunction.flowIndex + 1
                );
                setSelectedSubFlows(currentSubFlows);
            } else {
                // add empty subFlows for no params
                const currentSubFlows = getSubFlowsFromList(
                    selectedList,
                    data?.uuid || "",
                    selectedFunction.flowIndex,
                    {
                        function: actionFunction,
                        param: name,
                        uuid: data.uuid || "",
                    }
                );
                setSelectedSubFlows(currentSubFlows);
            }
        } else {
            // TODO - handle other types

            switch (type) {
                case "array":
                    showObjectEditorModal();
                    break;
                case "object":
                    showObjectEditorModal();
                    break;
                case "longText":
                    break;
                default:
                    break;
            }
        }
    };

    // Handles the suggested selection
    const handleDropdownChange = (currentValue: string) => {
        // Change the text by re-assigning new value from the suggested values
        updateText(currentValue);
    };

    // Handle input form on blur, resetting functionParamSelection objects
    const onInputBlur = () => {
        setTimeout(() => {
            // reset functionParamSelection object
            functionParamSelection.name = "";
            functionParamSelection.data = {};
        }, 250);
    };

    // Handle input form selection by clicking
    const onInputClick = () => {
        const paramTypeData = {
            paramType: {
                [paramTypeName]: valueType,
            },
            params: {
                [paramTypeName]: params[paramTypeName],
            },
            paramName: paramTypeName,
        };

        // set functionParamSelection object so it can be used for copy and pasting a function param
        functionParamSelection.name = paramTypeName;
        functionParamSelection.data =
            paramTypeData as FunctionParamSelectionDataProps;
    };

    return (
        <div className="input-group input-group-sm">
            <div className="input-group-prepend">
                <Dropdown
                    onSelect={(eventKey, e) => {
                        if (eventKey) {
                            handleDropdownClick(eventKey, e);
                        }
                    }}
                >
                    <Dropdown.Toggle
                        className="btn-chinese-silver h-36 rounded-3-px dropdown-toggle-no-caret px-1 py-1"
                        style={{ minWidth: 30 }}
                    >
                        <Icon type={valueType} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="scrollable-dropdown">
                        {!isComment &&
                            types.map((currentType) => (
                                <Dropdown.Item
                                    eventKey={currentType}
                                    key={currentType}
                                >
                                    <Icon
                                        className="param-icon"
                                        type={currentType}
                                    />{" "}
                                    {currentType}
                                </Dropdown.Item>
                            ))}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Input
                onBlur={onInputBlur}
                onClick={onInputClick}
                type="text"
                className={`form-control${disabledClass}`}
                value={valueText as string}
                readOnly={isReadonly}
                onChange={debounce(updateText, 500)}
            />
            {withEllipsis && (
                <>
                    <div className="input-group-append">
                        <button
                            onClick={handleClick}
                            className="btn btn-chinese-silver param-button"
                            type="button"
                        >
                            <FontAwesomeIcon icon={faEllipsisH} />
                        </button>
                    </div>

                    <ObjectEditorModal
                        show={objectEditorModalVisible}
                        handleClose={hideObjectEditorModal}
                        handleConfirm={handleObjectEditorModalConfirm}
                        value={valueToShow(originalValue, type) as string}
                    />
                </>
            )}

            {withDropdown && suggestedOptions && (
                <ParamDropdown
                    options={suggestedOptions}
                    onChange={handleDropdownChange}
                />
            )}
        </div>
    );
};

/**
 * Displays the parameters of a function property
 */
const Param = ({
    data,
    paramsList,
    globalFunctions,
    selectedGlobalFunction,
    selectedFunction,
    onUpdate,
    functions,
    setSelectedSubFlows,
}: ParamProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);
    const [addDynamicParamModalVisible, setAddDynamicParamModalVisible] =
        useState<boolean>(false);
    const showAddDynamicParamModal = () => setAddDynamicParamModalVisible(true);
    const hideAddDynamicParamModal = () =>
        setAddDynamicParamModalVisible(false);

    const func = data;
    const actionRes = getActionFormatVariableByParameter(
        func,
        "res"
    ) as FunctionParameterProps;

    const { params } = actionRes as FunctionParameterProps;
    const paramNames = Object.keys(params ?? {});
    const isDynamic = paramNames.length === 0;
    const currentParamsList = paramsList;

    const handleAddDynamicParamModalConfirm = (paramTypeName: string) => {
        const actionParameter = getActionFormatVariableByParameter(
            selectedFunction.data,
            "parameter"
        ) as CombinedActionFormatParameterProps;
        const actionParameterKey = isActionFormat(selectedFunction.data)
            ? "parameter"
            : "params";

        // Check if name is empty
        if (!paramTypeName) {
            toastMessage(
                t(
                    "eventFlow.tabs.action.modal.addDynamicParam.form.error.required.name"
                ),
                toast.TYPE.ERROR
            );

            return;
        }

        // Check if name exists
        if (
            Object.keys(actionParameter)?.some(
                (item) => item?.toLowerCase() === paramTypeName.toLowerCase()
            )
        ) {
            toastMessage(
                t(
                    "eventFlow.tabs.action.modal.addDynamicParam.form.error.existing.name"
                ),
                toast.TYPE.ERROR
            );

            return;
        }

        // Add Params
        const currentSelectedFunction = {
            ...selectedFunction,
            data: {
                ...selectedFunction?.data,
                [actionParameterKey]: {
                    ...actionParameter,
                    [paramTypeName]: "",
                },
            },
        } as ShapeClickedDataProps;

        onUpdate(currentSelectedFunction);

        hideAddDynamicParamModal();
    };

    /**
     * {function for deleting a dynamic param}
     * @param {String} functionName
     * @return  {void}
     */
    const deleteDynamicParam = (paramTypeName: string) => {
        // Delete parameter and parameter_type
        const currentSelectedFunction = {
            ...selectedFunction,
        } as ShapeClickedDataProps;
        if (isActionFormat(currentSelectedFunction.data)) {
            delete (currentSelectedFunction.data as ActionFormat)?.parameter?.[
                paramTypeName
            ];
            delete (currentSelectedFunction.data as ActionFormat)
                ?.parameter_type?.[paramTypeName];
        } else {
            delete (currentSelectedFunction.data as OldActionFormat)?.params?.[
                paramTypeName
            ];
            delete (currentSelectedFunction.data as OldActionFormat)
                ?.paramType?.[paramTypeName];
        }

        const selectedParamList = currentParamsList.find((currentParamList) => {
            return currentParamList.name === paramTypeName;
        });

        const currentType = selectedParamList?.type;

        onUpdate(
            currentSelectedFunction,
            currentType === "function" ? false : undefined
        );
    };

    return (
        <>
            {isDynamic && (
                <>
                    <button
                        type="button"
                        draggable="false"
                        className="border-0 text-sm px-1 py-2 bg-transparent"
                        role="tab"
                        onClick={showAddDynamicParamModal}
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="text-philippine-gray"
                        />
                        <span className="ms-2 text-philippine-gray">
                            {t("eventFlow.inspector.button.addNewParameter")}
                        </span>
                    </button>
                    <AddDynamicParamModal
                        show={addDynamicParamModalVisible}
                        handleClose={hideAddDynamicParamModal}
                        handleConfirm={handleAddDynamicParamModalConfirm}
                    />
                </>
            )}

            {currentParamsList.map(
                (param: ActionResultParameter, index: number) => {
                    const { name, type } = param;

                    // Key of the param component
                    const key = `${name}_${func?.uuid}_${index}`;

                    return (
                        <div
                            key={key}
                            className="form-group row mb-1 d-flex align-items-center pe-1"
                        >
                            <span
                                className="col-sm-4 col-form-label param-label text-philippine-gray text-sm"
                                title={name}
                            >
                                {truncate(name, { length: 14 })}
                            </span>
                            <div
                                className={
                                    isDynamic ? "p-0 col-sm-7" : "col-sm-8"
                                }
                            >
                                <ParamType
                                    type={type}
                                    name={name}
                                    data={func}
                                    selectedFunction={selectedFunction}
                                    globalFunctions={globalFunctions}
                                    selectedGlobalFunction={
                                        selectedGlobalFunction
                                    }
                                    onUpdate={onUpdate}
                                    key={key}
                                    functions={functions}
                                    setSelectedSubFlows={setSelectedSubFlows}
                                />
                            </div>
                            {isDynamic && (
                                <button
                                    type="button"
                                    aria-label={t("common.button.delete")}
                                    onClick={() => deleteDynamicParam(name)}
                                    className="col-sm-1 border-0 bg-transparent p-0 small"
                                >
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="small text-spanish-gray"
                                    />
                                </button>
                            )}
                        </div>
                    );
                }
            )}
        </>
    );
};

/**
 * Displays the properties of a function
 */
const Inspector = ({
    type,
    functions,
    onUpdate,
    selectedFunction,
    setSelectedFunction,
    selectedSubFlows,
    setSelectedSubFlows,
    globalFunctions,
    selectedGlobalFunction,
    onUpdateGlobal,
}: InspectorProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const func = selectedFunction?.data;
    const actionFunctionFunc = getActionFormatVariableByParameter(
        func,
        "function"
    ) as string;

    const name = func ? actionFunctionFunc : "";

    const paramsList = getParamsList(func);

    const handleUpdate = (
        data: ShapeClickedDataProps,
        isUpdateSubFlows?: boolean,
        selectedParamType?: string
    ) => {
        let selectedList = cloneDeep(functions);
        const listGlobal = cloneDeep(globalFunctions);

        // if global function is selected
        if (selectedGlobalFunction) {
            selectedList =
                listGlobal.find((currentList) => {
                    return currentList.uuid === selectedGlobalFunction.uuid;
                })?.process || [];
        }

        const {
            func: currentFunc,
            list,
            index: currentIndex,
        } = findFunctionInList(
            data?.data?.uuid || "",
            selectedList
        ) as FunctionInListProps;

        // update list with updated params
        const dataWithoutRes: CombinedActionFormat = { ...data.data };
        if (isActionFormat(dataWithoutRes)) {
            delete (dataWithoutRes as Partial<ActionFormat>).res;
        } else {
            delete (dataWithoutRes as Partial<OldActionFormat>)._res;
        }
        // delete dataWithoutRes._res;

        if (isArray(list)) {
            (list[
                currentIndex as keyof CombinedActionFormat[]
            ] as CombinedActionFormat) = dataWithoutRes;
        } else {
            // (list as AssociativeFunctionFormatProps)[
            //     currentIndex as keyof AssociativeFunctionFormatProps
            // ] = dataWithoutRes;
            list[currentIndex] = dataWithoutRes;
        }
        setSelectedFunction(data);

        if (selectedGlobalFunction) {
            onUpdateGlobal(listGlobal);
        } else {
            onUpdate(selectedList);
        }

        if (isUpdateSubFlows === true) {
            const actionParameterType = getActionFormatVariableByParameter(
                data.data,
                "parameter_type"
            ) as CombinedActionFormatParameterTypeProps;
            const actionFunction = getActionFormatVariableByParameter(
                currentFunc,
                "function"
            ) as string;

            // Insert subFlows
            if (
                actionParameterType &&
                Object.keys(actionParameterType).length > 0
            ) {
                if (selectedParamType) {
                    const currentSelectedSubFlows = [
                        ...selectedSubFlows.filter(
                            (selectedSubFlow) =>
                                selectedSubFlow.uuid !== currentFunc.uuid
                        ),
                        {
                            function: actionFunction,
                            param: selectedParamType || "",
                            uuid: currentFunc.uuid || "",
                        },
                    ];

                    setSelectedSubFlows(currentSelectedSubFlows);
                }
            }
        } else if (isUpdateSubFlows === false) {
            // Remove last subFlows
            const currentSelectedSubFlows = selectedSubFlows.filter(
                (selectedSubFlow) => selectedSubFlow.uuid !== currentFunc.uuid
            );

            setSelectedSubFlows(currentSelectedSubFlows);
        }
    };

    const handleCopy = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        // if have not select a param to copy, shows up the toast
        if (functionParamSelection.name.length === 0) {
            toastMessage(
                "Select a function param to copy first.",
                toast.TYPE.ERROR
            );
            return;
        }

        // copy the selected function param to clipboard
        const result = copyFunctionParam(
            functionParamSelection.data as FunctionParamSelectionDataProps,
            functionParamSelection.name
        );

        toastMessage(
            result.message,
            result.error ? toast.TYPE.ERROR : toast.TYPE.SUCCESS
        );
    };

    const handlePaste = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        // if have not select a param to paste on, shows up the toast
        if (functionParamSelection.name === "") {
            toastMessage(
                "Select a function param to paste first.",
                toast.TYPE.ERROR
            );
            return;
        }

        // Get the copied function param from clipboard
        const result = getCopiedFunctionParam();

        if (!result || (result && !result.data) || (result && result.error)) {
            toastMessage(result.message, toast.TYPE.ERROR);
            return;
        }

        // change the UUID of the copied function if the param type is a function
        if (
            result.data.paramType &&
            result.data.params &&
            result.data.paramType[result.data.paramName] === "function"
        ) {
            generateUUIDtoFunction(result.data);
        }

        if (selectedFunction) {
            const actionParameterType = getActionFormatVariableByParameter(
                selectedFunction.data,
                "parameter_type"
            ) as CombinedActionFormatParameterTypeProps;
            const actionParameter = getActionFormatVariableByParameter(
                selectedFunction.data,
                "parameter"
            ) as CombinedActionFormatParameterProps;
            const actionParameterTypeKey = isActionFormat(selectedFunction.data)
                ? "parameter_type"
                : "paramType";
            const actionParameterKey = isActionFormat(selectedFunction.data)
                ? "parameter"
                : "params";

            // TODO: handle old and new
            const currentSelectedFunction = {
                ...selectedFunction,
                data: {
                    ...selectedFunction.data,
                    [actionParameterTypeKey]: {
                        ...actionParameterType,
                        [functionParamSelection.name]:
                            result.data.paramType[result.data.paramName],
                    },
                    [actionParameterKey]: {
                        ...actionParameter,
                        [functionParamSelection.name]:
                            result.data.params[result.data.paramName],
                    },
                },
            };

            handleUpdate(currentSelectedFunction);
        }

        // Display a success/error message
        toastMessage(
            result.message ? result.message : "Success",
            result.error ? toast.TYPE.ERROR : toast.TYPE.SUCCESS
        );

        // reset functionParamSelection object
        functionParamSelection.name = "";
        functionParamSelection.data = {};
    };

    return (
        <Container
            className={`inspector-parameter position-relative p-0 mt-2 ${
                type === "global" ? "h-180 global-inspector-parameter" : "h-350"
            }`}
        >
            <div className="param-nav bg-light-gray">
                <ul className="nav nav-tabs px-2">
                    <li className="nav-item">
                        <button
                            type="button"
                            draggable="false"
                            className="border-0 text-sm px-1 py-2 text-philippine-gray"
                            role="tab"
                        >
                            {name} {t("eventFlow.inspector.header.title")}
                        </button>
                    </li>
                    {(paramsList.params?.length > 0 || paramsList.dynamic) && (
                        <>
                            <li className="nav-item ms-auto d-flex align-items-center">
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>
                                            {t("common.button.copy")}
                                        </Tooltip>
                                    }
                                >
                                    <button
                                        type="button"
                                        aria-label={t("common.button.copy")}
                                        onClick={handleCopy}
                                        className="float-end border-0 bg-transparent"
                                    >
                                        <FontAwesomeIcon
                                            icon={faCopy}
                                            className="small text-granite-gray"
                                        />
                                    </button>
                                </OverlayTrigger>
                            </li>
                            <li className="nav-item d-flex align-items-center">
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip>
                                            {t("common.button.paste")}
                                        </Tooltip>
                                    }
                                >
                                    <button
                                        type="button"
                                        aria-label={t("common.button.paste")}
                                        onClick={handlePaste}
                                        className="float-end border-0 bg-transparent"
                                    >
                                        <FontAwesomeIcon
                                            icon={faPaste}
                                            className="small text-granite-gray"
                                        />
                                    </button>
                                </OverlayTrigger>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            <div
                className={`row param mt-2 ms-auto me-auto overflow-auto h-75 ${
                    type === "global" ? "global-inspector-parameter" : ""
                }`}
            >
                <div className="col-sm-12">
                    {selectedFunction &&
                    (paramsList.params?.length > 0 || paramsList.dynamic) ? (
                        <Param
                            data={selectedFunction.data}
                            paramsList={paramsList.params}
                            globalFunctions={globalFunctions}
                            selectedGlobalFunction={selectedGlobalFunction}
                            selectedFunction={selectedFunction}
                            onUpdate={handleUpdate}
                            functions={functions}
                            setSelectedSubFlows={setSelectedSubFlows}
                        />
                    ) : (
                        <div className="text-argent text-sm m-2 d-flex justify-content-center align-items-center">
                            {t("eventFlow.inspector.message.noParameters")}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default Inspector;
