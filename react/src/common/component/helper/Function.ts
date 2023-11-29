import { nanoid } from "nanoid";
import _ from "lodash";
import {
    callbackNames,
    dataFunctionFormat,
    functionFormat,
    Functions,
} from "../../data/Functions";
import {
    defaultX,
    defaultY,
    distanceX,
    distanceY,
    distanceWithWidth,
    distanceWithHeight,
} from "../event-flow/renderer/raphael/Variables";
import ActionFormat, {
    CombinedActionFormat,
    CombinedActionFormatParameterProps,
    CombinedActionFormatParameterTypeProps,
    CombinedGlobalActionFormat,
    GlobalActionParameter,
    ConnectionProps,
    DataFunctionFormatProps,
    FunctionInListProps,
    FunctionParameterProps,
    OldActionFormat,
    PositionProps,
    SelectedSubFlowsProps,
    CategoryProps,
} from "../event-flow/data/Functions";
import {
    ACTION_FORMAT_PARAMETER_KEYS_MAP,
    parameterTypes,
} from "../event-flow/data/Constant";

type DimensionProps = {
    total: number;
    num: number;
    coord?: boolean;
    push: (data: number) => void;
    [key: number]: number;
};

type DimensionDataFunctions = {
    width: DimensionProps;
    height: DimensionProps;
    x: DimensionProps;
    y: DimensionProps;
};

type DataFunctions = {
    functions: DataFunctionFormatProps[];

    // Dimension object to store the computed height/width
    dimension: DimensionDataFunctions;
};

type AssociativeArray = {
    [key: string]: string;
};

type ConnectionsParamsProps = {
    connections: {
        [key: string]: CombinedActionFormat[];
    };
};

type DataFunctionsOptionsProps = {
    coord: PositionProps;
    distanceX: number;
    distanceY: number;
    parentConnectionName?: string;
    parent_id?: string;
    parent_list?: string[];
};

// TODO: Check if some of the functions here should be inside the event-flow folder

export function getActionFormatVariableByParameter(
    func: CombinedActionFormat | CombinedGlobalActionFormat | undefined,
    parameter: string
): unknown {
    if (!func) return null;

    if (parameter in func) {
        return func[
            parameter as keyof (
                | CombinedActionFormat
                | CombinedGlobalActionFormat
            )
        ];
    }

    const map = ACTION_FORMAT_PARAMETER_KEYS_MAP;

    const oldParameter =
        map[
            parameter as keyof (
                | CombinedActionFormat
                | CombinedGlobalActionFormat
            )
        ];

    return func[
        oldParameter as keyof (
            | CombinedActionFormat
            | CombinedGlobalActionFormat
        )
    ];
}

export function isActionFormat(
    func: CombinedActionFormat
): func is ActionFormat {
    return "function" in func;
}

function isOldActionFormat(
    func: CombinedActionFormat
): func is OldActionFormat {
    return "f" in func;
}

/**
 * Get the icon base on value type
 * @param {string} type
 * @returns {object}
 */
export const getValueTypeIcon = (type: string) => {
    if (typeof parameterTypes[type] !== "undefined") {
        return parameterTypes[type].icon;
    }

    // If does not exists then return the value icon
    return parameterTypes.value.icon;
};

/**
 * Get the callback name of the param
 * @param {string} param
 * @param {string} valueType
 * @returns {mixed} The callback name (yes/no/<any other callback name>)
 */
export const getCallbackName = (param: string, valueType: string) => {
    let result = null;
    // Loop through callback then return yes/no
    Object.keys(callbackNames).every((i) => {
        // for (let i in callbackNames) {
        const callback = callbackNames[i];
        if (typeof callback[param] !== "undefined") {
            result = i;
            return false;
        }

        return true;
    });

    if (result) {
        return result;
    }

    // If not found from the callbacks then check if it is a functionList
    if (valueType === "functionList") {
        return param;
    }

    return result;
};

/**
 * Get the user defined functions
 * @param {CombinedGlobalActionFormat[]} functions
 * @returns {CategoryProps}
 */
export const getUserDefinedFunctions = (
    functions: CombinedGlobalActionFormat[]
): CategoryProps => {
    const functionCategory: CategoryProps = {};

    // Loop through global functions
    functions.forEach((func) => {
        const parameters: FunctionParameterProps = { params: null };

        // Get the function name
        const functionName = getActionFormatVariableByParameter(
            func,
            "function"
        ) as string;

        // Get the params
        const functionParams = getActionFormatVariableByParameter(
            func,
            "parameter"
        ) as GlobalActionParameter;

        if (
            functionName &&
            !_.isEmpty(functionParams) &&
            !(_.isArray(functionParams) && functionParams.length === 0)
        ) {
            parameters.params = functionParams;
        }

        // Add to the user defined functions
        functionCategory[functionName] = parameters;
    });

    return functionCategory;
};

/**
 * Add the parameters to a function
 * This will only put parameters in the first level
 * @param {object} fn
 * @returns {object}
 */
export const addParamsFunction = (fn: CombinedActionFormat) => {
    // Clone the function
    const clonedFn = _.cloneDeep(fn);
    const actionRes = getActionFormatVariableByParameter(
        clonedFn,
        "res"
    ) as FunctionParameterProps;

    // Check if there's already a "res" attribute (not sure what is res. maybe resource)
    if (actionRes && actionRes.params) {
        return clonedFn;
    }

    const actionFunction = getActionFormatVariableByParameter(
        fn,
        "function"
    ) as string;

    // Find the function from the group
    Object.keys(Functions).every((group) => {
        if (
            typeof Functions[group][actionFunction] !== "undefined" &&
            Object.prototype.hasOwnProperty.call(
                Functions[group],
                actionFunction
            )
        ) {
            // need to use this to prevent using object prototype function/object assigned to res (like toString)
            const keys = Object.keys(Functions[group]);
            const selectedFuncIndex = keys.indexOf(actionFunction);

            if (isActionFormat(clonedFn)) {
                (clonedFn as ActionFormat).res = Object.values(
                    Functions[group]
                )[selectedFuncIndex];
            } else {
                /* eslint no-underscore-dangle: ["error", { "allow": ["_res"] }] */
                (clonedFn as OldActionFormat)._res = Object.values(
                    Functions[group]
                )[selectedFuncIndex];
            }

            // break;
            return false;
        }
        return true;
    });

    // Return the cloned function with the parameters
    return clonedFn;
};

/**
 * Creates a function
 * @param {string} name The name of the function to create
 */
export const createFunction = (name: string, params: AssociativeArray = {}) => {
    // Clone the basic function format variable
    const resultFn = _.cloneDeep(functionFormat);

    if (isActionFormat(resultFn)) {
        (resultFn as ActionFormat).function = name;
    } else {
        (resultFn as OldActionFormat).f = name;
    }

    // Check if there's param
    if (!_.isEmpty(params)) {
        // Get parameters
        const clonedFn = addParamsFunction(resultFn);
        const actionRes = getActionFormatVariableByParameter(
            clonedFn,
            "res"
        ) as FunctionParameterProps;
        const actionParameter = getActionFormatVariableByParameter(
            resultFn,
            "parameter"
        ) as CombinedActionFormatParameterProps;

        // Resource parameters
        const resParams = actionRes?.params;

        // If the resource parameters is an empty object then get the parameters from the params (arguments)
        const parameters =
            _.isPlainObject(resParams) && _.isEmpty(resParams)
                ? Object.keys(params || {})
                : Object.keys(resParams || {});

        if (parameters.length > 0) {
            Object.keys(params).forEach((key) => {
                // Check if this param is included in the parameters
                if (parameters.includes(key) && actionParameter) {
                    if (isActionFormat(resultFn) && resultFn.parameter) {
                        resultFn.parameter[key] = params[key];
                    } else if (isOldActionFormat(resultFn) && resultFn.params) {
                        resultFn.params[key] = params[key];
                    }
                }
            });
        }
    }

    return resultFn;
};

/**
 * Converts value from string
 * @param {mixed} value The value to process
 * @param {string} type The type to use in converting the value
 * @returns {mixed}
 */
export const valueFromString = (value: string, type: string) => {
    switch (type) {
        case "comment":
        case "string":
            return _.isString(value) ? value : "";
        case "integer":
            return value && value !== "" && !Number.isNaN(parseInt(value, 10))
                ? parseInt(value, 10)
                : null;
        case "number":
            return value && value !== "" && !Number.isNaN(parseInt(value, 10))
                ? parseFloat(value)
                : null;
        case "boolean": {
            const val = _.trim(value.toLowerCase());
            if (["true", "yes", "1", "t", "y"].includes(val)) {
                return true;
            }
            if (["false", "no", "0", "f", "n"].includes(val)) {
                return false;
            }
            return null;
        }
        case "function": {
            // Use lodash 'attempt' so that this won't throw an error exception
            const fn = _.attempt(JSON.parse.bind(null, value));

            if (
                _.isObject(fn) &&
                (isActionFormat(fn as CombinedActionFormat) ||
                    isOldActionFormat(fn as CombinedActionFormat))
            ) {
                return fn;
            }
            return null;

            // return isObject(fn) && (fn as FunctionFormatProps)?.f ? fn : null;
        }
        case "functionList":
            break;
        case "array": {
            // Use lodash 'attempt' so that this won't throw an error exception
            const arr = _.attempt(JSON.parse.bind(null, value));
            return !_.isError(arr) && _.isArray(arr) ? arr : null;
        }
        case "object": {
            // Use lodash 'attempt' so that this won't throw an error exception
            const obj = _.attempt(JSON.parse.bind(null, value));
            return !_.isError(obj) && _.isObject(obj) ? obj : null;
        }
        case "longText":
            return value || "";
        default:
    }
    return value;
};

/**
 * Converts value to string
 * @param {mixed} value The value to convert
 * @param {string} type The type to use in converting the value
 * @returns {mixed}
 */
export const valueToString = (value: unknown, type: string) => {
    switch (type) {
        case "comment":
        case "string":
            return _.isString(value) ? value : "";
        case "integer":
        case "number":
            return _.isNumber(value) ? value.toString() : "";
        case "boolean":
            if (
                value === null ||
                typeof value === "undefined" ||
                value === ""
            ) {
                return "";
            }
            if (value) {
                return "true";
            }
            return "false";

        case "array":
        case "function": // TODO : Check if this still needed (function)
            return JSON.stringify(value);
        case "functionList":
            break;
        case "object":
            return value ? JSON.stringify(value) : "";
        case "longText":
            return value ? "..." : "";
        default:
    }

    return value;
};

/**
 * Converts value to string to display
 * @param {mixed} value The value to convert
 * @param {string} type The type to use in converting the value
 * @returns {mixed}
 */
export const valueToShow = (value: unknown, type: string) => {
    switch (type) {
        case "comment":
        case "string":
            return _.isString(value) ? value : "";
        case "integer":
        case "number":
            return _.isNumber(value) ? value.toString() : "";
        case "boolean":
            if (
                value === null ||
                typeof value === "undefined" ||
                value === ""
            ) {
                return "";
            }
            if (value) {
                return "true";
            }
            return "false";

        case "array":
        case "function": // TODO : Check if this still needed (function)
            return JSON.stringify(value, null, "\t");
        case "functionList":
            break;
        case "object":
            return value ? JSON.stringify(value, null, "\t") : "";
        case "longText":
            return value || "";
        default:
    }

    return value;
};

/**
 * Set the connections of a function
 * @param {CombinedActionFormat} func
 * @returns {object}
 */
const getFunctionConnections = (func: CombinedActionFormat) => {
    // TODO - check if this is dynamic function param or not

    // The result
    const result: ConnectionsParamsProps = { connections: {} };

    const actionRes = getActionFormatVariableByParameter(
        func,
        "res"
    ) as FunctionParameterProps;

    // Set the connections
    if (actionRes?.params) {
        Object.keys(actionRes?.params).forEach((i) => {
            const param = actionRes?.params?.[i] || "";

            // Check if this is a callback
            const cb = getCallbackName(i, param);
            if (cb) {
                const actionParameter = getActionFormatVariableByParameter(
                    func,
                    "parameter"
                ) as CombinedActionFormatParameterProps;
                if (actionParameter) {
                    result.connections[cb] =
                        (actionParameter[i] as CombinedActionFormat[]) || [];
                } else {
                    result.connections[cb] = [];
                }
            }
        });
    }

    // Sort the connections so that the "yes" is always the first in the list
    const sortList = ["yes", "no"];
    const connections: { [key: string]: CombinedActionFormat[] } = {};

    sortList.forEach((key) => {
        if (result.connections[key] !== undefined) {
            connections[key] = result.connections[key];
        }
    });

    // re-assign the connection
    result.connections = { ...connections, ...result.connections };

    return result;
};

/**
 * Returns the data format of a function to be displayed in event flow
 * @param {DataFunctionFormatProps} attributes
 * @returns {DataFunctionFormatProps}
 */
const getDataFunctionFormat = (attributes: DataFunctionFormatProps) => {
    // Get the data format of a function
    const format: DataFunctionFormatProps = _.cloneDeep(dataFunctionFormat);

    // Check if the attribute argument is an object
    if (_.isObject(attributes)) {
        Object.keys(attributes).forEach((i) => {
            // Check if the attribute exists
            if (i in format) {
                (format[
                    i as keyof DataFunctionFormatProps
                ] as DataFunctionFormatProps) = attributes[
                    i as keyof DataFunctionFormatProps
                ] as DataFunctionFormatProps;
            }
        });
    }

    return format;
};

/**
 * Recursively format the function to a format that can be use to display in event flow
 * @param {CombinedActionFormat[]} functions
 * @param {DataFunctionFormatProps[]} results
 * @param {DimensionDataFunctions} dimension
 *                      {
 *                          width: { total: 0, num: 120, push: <function> },
 *                          height: { total: 0, num: 120, push: <function> },
 *                      }
 * @param {DataFunctionsOptionsProps} options
 * @returns {int} The x coordinate
 */
const getDataFunctionsRecursive = (
    functions: CombinedActionFormat[],
    results: DataFunctionFormatProps[],
    dimension: DimensionDataFunctions,
    options: DataFunctionsOptionsProps
) => {
    let currentOptions = options;
    // Make sure options is object
    currentOptions = options || {};

    // Coordinate
    const coord = currentOptions.coord || {};
    let x = coord.x || defaultX;
    let y = coord.y || defaultY;

    // Initial value of total and valid connections
    let totalConnections = 0;
    let validConnections = 0;

    // True to display the "end" shape
    let forceEnd = false;

    // Parent id
    const parentId = currentOptions.parent_id || null;
    const parentList = currentOptions.parent_list
        ? [...currentOptions.parent_list]
        : [];

    // From id
    let fromId: string | null = null;

    // The sibling of a function
    let sibling: string | null = null;

    // The first sibling of a function
    let firstSibling: string | null = null;

    // Default to "false"
    let isSiblingCallbackDisplayed = false;

    Object.keys(functions).forEach((key, i) => {
        // for (let i in functions) {
        const connections: ConnectionProps = {};

        // Some variables used for y calc
        let parentY = y;

        // The counter of connections
        // for the loop
        let connectionCounter = 0;

        // Add params to the function
        const fn = addParamsFunction(functions[i]);

        // Get the connections of a function
        const funcConnections = getFunctionConnections(fn);

        // Get the data format of a function
        const func = getDataFunctionFormat({
            id: nanoid(),
            parent: parentId,
            parent_list: parentList,
            is_sibling_callback_displayed: isSiblingCallbackDisplayed,
            sibling,
            first_sibling: firstSibling,
            fromId,
            name: getActionFormatVariableByParameter(fn, "function") as string,
            data: fn,
            position: { x, y },
            parent_connection_name: currentOptions.parentConnectionName || "",
            connections,
        });

        // Add to the result
        results.push(func);

        // Update the sibling callback display
        // Reset to "false" for the new function
        isSiblingCallbackDisplayed = false;

        // Compute the height and width
        dimension.width.push(x);
        dimension.height.push(y);
        dimension.x.push(x);
        dimension.y.push(y);

        // Reset to zero for every function
        totalConnections = 0;
        validConnections = 0;

        // Compute the total and valid connections
        Object.keys(funcConnections.connections).forEach((n) => {
            totalConnections += 1;
            if (
                (funcConnections.connections[n] as CombinedActionFormat[])
                    .length > 0
            ) {
                // Increment only if there's element
                validConnections += 1;
            }
        });

        // Add the total connections
        func.total_connections = totalConnections;

        // Generate the connections
        Object.keys(funcConnections.connections).forEach((n) => {
            // Check if there is only one valid connection
            // then take the additional value in x or y
            if (totalConnections > 1 || validConnections > 0) {
                if (totalConnections > 0 && validConnections === 0) {
                    forceEnd = true;
                    return;
                }

                // Update if the previous sibling callback is already displayed
                // Meaning the yes/no connection has a function/s in it
                isSiblingCallbackDisplayed = true;

                // Compute the 'y' if this is 'yes' or the counter is zero
                if (n === "yes" || connectionCounter === 0) {
                    parentY += currentOptions.distanceY;
                } else {
                    x += currentOptions.distanceX;
                }
            } else if (totalConnections === 1) {
                forceEnd = true;
                return;
            } else {
                parentY += currentOptions.distanceY;
            }

            // increment the counter
            connectionCounter += 1;
            // connectionCounter++;

            // Initializes the connection for this node
            connections[n as keyof ConnectionProps] = [];

            // Options for the next set of functions
            const opt = {
                ...currentOptions,
                parent_id: func.id,
                parent_list: [...parentList, func.id],
                coord: { x, y: parentY },
                parentConnectionName: n,
            };

            // Recursively format the function and then assign the new computed "x" coordinate
            x = getDataFunctionsRecursive(
                funcConnections.connections[n] as CombinedActionFormat[],
                connections[
                    n as keyof ConnectionProps
                ] as DataFunctionFormatProps[],
                dimension,
                opt
            );
        });

        // Check if there was valid connection
        // set the proper x and y
        if (validConnections === 0) {
            y += currentOptions.distanceY;
            fromId = func.id;
        } else {
            x += currentOptions.distanceX;
        }

        if (i === 0) {
            // The first sibling
            firstSibling = func.id;
        }

        // Assign the function as the sibling of the next function
        sibling = func.id;
    });

    if (
        (totalConnections === 0 && validConnections === 0) ||
        (totalConnections > 0 && validConnections > 0) ||
        forceEnd
    ) {
        // Get the data format of a function for end shape
        const endFunc = getDataFunctionFormat({
            id: nanoid(),
            parent: parentId,
            parent_list: parentList,
            sibling,
            first_sibling: firstSibling,
            is_sibling_callback_displayed: isSiblingCallbackDisplayed,
            fromId,
            name: "End",
            end: true,
            position: { x, y: y - 3 },
            parent_connection_name: currentOptions.parentConnectionName || "",
            connections: {},
        });

        // Add to the result
        results.push(endFunc);

        // Compute the height and width
        dimension.width.push(x);
        dimension.height.push(y);
        dimension.x.push(x);
        dimension.y.push(y);
    }

    // Return the x coordinate
    // To be use for the next function in the list
    return x;
};

/**
 * Returns the callback names by connection name (yes/no)
 * @param {string} connectionName
 * @returns {object}
 */
export const getCallbacks = (connectionName: string) => {
    return typeof callbackNames[connectionName] !== "undefined"
        ? callbackNames[connectionName]
        : {};
};

/**
 * Get the functions in a format that can be use to display in event flow
 * @param {CombinedActionFormat[]} functions
 * @param {object} options
 * @returns {array}
 */
export const getDataFunctions = (
    functions: CombinedActionFormat[],
    options: DataFunctionsOptionsProps
) => {
    // This function will compute the total width/height
    // this also checks if the coordinate provided already been computed
    const push = function (this: DimensionProps, num: number) {
        if (typeof this[num] === "undefined") {
            this[num] = this.num;

            // Check if computing for the coordinate x & y
            this.total += this.coord ? 1 : this.num;
        }
    };

    const results: DataFunctions = {
        functions: [],

        // Dimension object to store the computed height/width
        dimension: {
            width: { total: 0, num: distanceWithWidth, push },
            height: { total: 0, num: distanceWithHeight, push },
            x: { total: 0, num: distanceX + 10, coord: true, push },
            y: { total: 0, num: distanceY + 10, coord: true, push },
        },
    };

    // Only do the formatting if have functions
    if (functions.length > 0) {
        getDataFunctionsRecursive(
            functions,
            results.functions,
            results.dimension,
            options
        );
    }
    return results;
};

/**
 * Removes uuid of array of functions
 * @param {array} functions
 */
const cleanFunctionFromList = (functions: CombinedActionFormat[]) => {
    functions.forEach((func) => {
        // Remove the UUID from function
        // eslint-disable-next-line no-use-before-define
        cleanFunction(func);
    });
};

/**
 * Removes the uuid of a function and all of its callback
 * @param {object} func
 */
export const cleanFunction = (func: CombinedActionFormat) => {
    const currentFunc: Partial<CombinedActionFormat> = func;
    const actionRes = getActionFormatVariableByParameter(
        func,
        "res"
    ) as FunctionParameterProps;
    const actionParameterType = getActionFormatVariableByParameter(
        func,
        "parameter_type"
    ) as CombinedActionFormatParameterTypeProps;
    const actionParameter = getActionFormatVariableByParameter(
        func,
        "parameter"
    ) as CombinedActionFormatParameterProps;

    // Check if empty
    if (!currentFunc) {
        return;
    }

    // Remove the UUID
    if (currentFunc?.uuid) {
        delete currentFunc.uuid;
    }

    // Remove if there's _res
    if (actionRes) {
        if (isActionFormat(func)) {
            delete (currentFunc as Partial<ActionFormat>).res;
        } else {
            delete (currentFunc as Partial<OldActionFormat>)._res;
        }
    }

    // Check if there's paramType
    if (actionParameterType) {
        Object.keys(actionParameterType).forEach((n) => {
            // Check if the param is not a function
            if (actionParameterType?.[n] !== "function") {
                return;
            }

            if (actionParameter[n]) {
                // Remove the uuid from the function
                cleanFunction(actionParameter?.[n] as CombinedActionFormat);
            } else if (actionParameterType?.[n]) {
                // function is empty
                // remove the paramType "function"
                if (isActionFormat(func)) {
                    delete (currentFunc as Partial<ActionFormat>)
                        .parameter_type?.[n];
                } else {
                    delete (currentFunc as Partial<OldActionFormat>)
                        .paramType?.[n];
                }
            }
        });

        // Check if paramType is empty
        if (_.isEmpty(actionParameterType)) {
            if (isActionFormat(func)) {
                delete (currentFunc as Partial<ActionFormat>).parameter_type;
            } else {
                delete (currentFunc as Partial<OldActionFormat>).paramType;
            }
        }
    }

    // add params to get all callbacks
    const fn = addParamsFunction(func);

    const actionParameterFn = getActionFormatVariableByParameter(
        fn,
        "parameter"
    ) as CombinedActionFormatParameterProps;
    const actionResFn = getActionFormatVariableByParameter(
        fn,
        "res"
    ) as FunctionParameterProps;

    // If no params then no need to continue
    if (!actionParameterFn) {
        return;
    }

    // Loop through all params
    Object.keys(actionParameterFn).forEach((n) => {
        // Check if the param is a callback (functionList)
        if (
            actionResFn?.params &&
            actionResFn.params[n] === "functionList" &&
            _.isArray(actionParameterFn[n])
        ) {
            cleanFunctionFromList(actionParameter[n] as CombinedActionFormat[]);
        }
    });
};

/**
 * Set the uuid of function list
 * @param {array} functions
 */
const generateUUIDtoFunctionList = (functions: CombinedActionFormat[]) => {
    functions.forEach((func) => {
        // Generate uuid for the function
        // eslint-disable-next-line no-use-before-define
        generateUUIDtoFunction(func);
    });
};

/**
 * Set the uuid for a function
 * @param {object} func
 */
export const generateUUIDtoFunction = (func: CombinedActionFormat) => {
    const currentFunc = func;
    const actionParameterType = getActionFormatVariableByParameter(
        currentFunc,
        "parameter_type"
    ) as CombinedActionFormatParameterTypeProps;
    const actionParameter = getActionFormatVariableByParameter(
        currentFunc,
        "parameter"
    ) as CombinedActionFormatParameterProps;

    // Check if empty
    if (!currentFunc || (currentFunc && typeof currentFunc === "string")) {
        return;
    }

    // Set the uuid for this function
    if (typeof currentFunc === "object") {
        currentFunc.uuid = nanoid();
    }

    // Check if there's paramType
    if (actionParameterType) {
        Object.keys(actionParameterType).forEach((n) => {
            // Check if the param is a function
            if (actionParameterType?.[n] !== "function") {
                return;
            }

            // Generate uuid for the function
            if (actionParameter?.[n]) {
                generateUUIDtoFunction(
                    actionParameter[n] as CombinedActionFormat
                );
            }
        });
    }

    // add params to get all callbacks
    const fn = addParamsFunction(currentFunc);
    const actionParameterFn = getActionFormatVariableByParameter(
        fn,
        "parameter"
    ) as CombinedActionFormatParameterProps;
    const actionResFn = getActionFormatVariableByParameter(
        fn,
        "res"
    ) as FunctionParameterProps;

    // If no params then no need to continue
    if (!actionParameterFn) {
        return;
    }

    // Loop through all params
    Object.keys(actionParameterFn).forEach((n) => {
        // Check if the param is a callback (functionList)
        if (
            actionResFn?.params &&
            actionResFn.params[n] === "functionList" &&
            _.isArray(actionParameterFn[n])
        ) {
            generateUUIDtoFunctionList(
                actionParameter[n] as CombinedActionFormat[]
            );
        }
    });
};

const getSubFlowsInList = (
    subFlows: SelectedSubFlowsProps[],
    selectedList: CombinedActionFormat
) => {
    const actionParameterType = getActionFormatVariableByParameter(
        selectedList,
        "parameter_type"
    ) as CombinedActionFormatParameterTypeProps;
    const actionParameter = getActionFormatVariableByParameter(
        selectedList,
        "parameter"
    ) as CombinedActionFormatParameterProps;
    const actionFunction = getActionFormatVariableByParameter(
        selectedList,
        "function"
    ) as string;

    // get last found paramType with function value
    const currentParamType = { ...actionParameterType };
    const lastFunctionParamType = Object.keys(currentParamType ?? {})
        .reverse()
        .find((paramType) => actionParameterType?.[paramType] === "function");

    if (lastFunctionParamType) {
        subFlows.push({
            function: actionFunction,
            param: lastFunctionParamType,
            uuid: selectedList.uuid || "",
        });

        const selectedListParams = actionParameter[
            lastFunctionParamType
        ] as CombinedActionFormat;

        getSubFlowsInList(subFlows, selectedListParams);
    }

    return subFlows;
};

/**
 * Find the function by uuid
 * @param {string} uuid
 * @param {CombinedActionFormat[]} list
 * @returns {FunctionInListProps | boolean}
 */
export const findFunctionInList = (
    uuid: string,
    list: CombinedActionFormat[],
    flowIndex?: number
): FunctionInListProps | boolean => {
    let result: boolean | FunctionInListProps = false;
    Object.keys(list).every((n) => {
        let subFlows: SelectedSubFlowsProps[] = [];

        // eslint-disable-next-line no-use-before-define
        result = findFunction(uuid, list, n, subFlows);
        if (result !== false) {
            // get subFlows for flowIndex === 0
            if (flowIndex === 0) {
                const selectedList = list[
                    n as keyof CombinedActionFormat[]
                ] as CombinedActionFormat;
                subFlows = getSubFlowsInList(subFlows, selectedList);
            }

            return false;
        }

        return true;
    });

    return result;
};

/**
 * Find the function from list
 * @param {string} uuid
 * @param {array|object} list
 * @param {string|int} index
 * @returns {FunctionInListProps | boolean}
 */
const findFunction = (
    uuid: string,
    list: { [key: string]: CombinedActionFormat } | CombinedActionFormat[],
    index: string | number,
    subFlows: SelectedSubFlowsProps[]
): FunctionInListProps | boolean => {
    let func: CombinedActionFormat;
    if (_.isArray(list)) {
        func = list[index as number];
    } else {
        func = list[index as string];
    }

    // If the function is not found then return
    if (!func) {
        return false;
    }

    if (uuid === func?.uuid) {
        return { func, list, index, subFlows };
    }

    const actionParameterType = getActionFormatVariableByParameter(
        func,
        "parameter_type"
    ) as CombinedActionFormatParameterTypeProps;
    const actionParameter = getActionFormatVariableByParameter(
        func,
        "parameter"
    ) as CombinedActionFormatParameterProps;
    const actionFunction = getActionFormatVariableByParameter(
        func,
        "function"
    ) as string;

    // Check if there's paramType
    if (actionParameterType) {
        let result: boolean | FunctionInListProps = false;
        Object.keys(actionParameterType).every((n) => {
            // Check if the param is a function
            if (actionParameterType?.[n] !== "function") {
                return true;
            }

            result = findFunction(
                uuid,
                actionParameter as { [key: string]: CombinedActionFormat },
                n,
                subFlows
            );
            if (result !== false) {
                // add subFlows
                subFlows.unshift({
                    function: actionFunction,
                    param: n,
                    uuid: func.uuid || "",
                });

                // If function is found then return
                return false;
            }

            return true;
        });

        if (result) {
            // add subFlows to result
            // adding subFlow of non-existing ones to result
            subFlows.forEach((subFlow) => {
                const existingSubFlow = (
                    result as FunctionInListProps
                ).subFlows.find((resultSubFlow) => {
                    return resultSubFlow.uuid === subFlow.uuid;
                });
                if (!existingSubFlow) {
                    (result as FunctionInListProps).subFlows.unshift(subFlow);
                }
            });
            return result;
        }
    }

    // Add params
    const fn = addParamsFunction(func);
    const actionParameterFn = getActionFormatVariableByParameter(
        fn,
        "parameter"
    ) as CombinedActionFormatParameterProps;
    const actionRes = getActionFormatVariableByParameter(
        fn,
        "res"
    ) as FunctionParameterProps;

    // If no params then no need to continue
    if (!actionParameterFn) {
        return false;
    }

    // Loop through all params
    let result: boolean | FunctionInListProps = false;
    Object.keys(actionParameterFn).every((n) => {
        // Check if the param is a callback (functionList)
        if (
            actionRes?.params &&
            actionRes.params[n] === "functionList" &&
            _.isArray(actionParameterFn[n])
        ) {
            result = findFunctionInList(
                uuid,
                actionParameter[n] as CombinedActionFormat[]
            );
            if (result !== false) {
                return false;
            }
        }

        return true;
    });

    if (result) {
        return result;
    }

    return false;
};
