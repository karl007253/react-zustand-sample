/* eslint no-underscore-dangle: 0 */
import { cloneDeep, isEmpty, isObject } from "lodash";
import {
    cleanFunction,
    getActionFormatVariableByParameter,
    isActionFormat,
} from "../../helper/Function";

import LocalStorage from "../../../library/storage/LocalStorage";
import ActionFormat, {
    CombinedActionFormat,
    FunctionParameterProps,
    OldActionFormat,
} from "../data/Functions";
import { FunctionParamSelectionDataProps } from "../Inspector";

/**
 * The name of the clipboard in localStorage
 */
const clipboardName = "emobiqClipboard";

/**
 * Copy a function to clipboard (localStorage)
 * @param {object} func The function to copy
 * @returns {object}
 */
export const copyFunction = (func: CombinedActionFormat) => {
    // Clipboard
    const clipboard = new LocalStorage(clipboardName);

    if (Object.keys(func).length === 0) {
        // Clear the function clipboard
        clipboard.clear("function");
        return {
            error: true,
            message: "Function was not successfully copied.",
        };
    }

    // Clone the function and then remove the uuid and _res
    const clonedFunction = cloneDeep(func);
    cleanFunction(clonedFunction);

    const actionRes = getActionFormatVariableByParameter(
        clonedFunction,
        "res"
    ) as FunctionParameterProps;

    if (actionRes) {
        if (isActionFormat(clonedFunction)) {
            delete (clonedFunction as Partial<ActionFormat>).res;
        } else {
            delete (clonedFunction as Partial<OldActionFormat>)._res;
        }
        // delete clonedFunction._res;
    }

    // Save the component to the clipboard
    clipboard.set("function", clonedFunction);

    return {
        error: false,
        message: `The function "${getActionFormatVariableByParameter(
            clonedFunction,
            "function"
        )}" successfully copied.`,
    };
};

/**
 * The copied function from the clipboard
 * @returns {object}
 */
export const getCopiedFunction = () => {
    const clipboard = new LocalStorage(clipboardName);

    // Get the components to be copied from the clipboard
    const func = clipboard.get("function");

    // Check if there are components in the clipboard
    if (!func || (isObject(func) && isEmpty(func))) {
        return { error: true, message: "No function to paste." };
    }

    return {
        error: false,
        data: { func },
        message: "Function successfully duplicated",
    };
};

/**
 * Copy a function param to clipboard (localStorage)
 * @param {object} data The function param data to copy
 * @param {String} name The function param name
 * @returns {object}
 */
export const copyFunctionParam = (
    data: FunctionParamSelectionDataProps,
    name: string
) => {
    // Clipboard
    const clipboard = new LocalStorage(clipboardName);

    if (Object.keys(data).length === 0) {
        // Clear the function clipboard
        clipboard.clear("function_param");
        return {
            error: true,
            message: "Function param was not successfully copied.",
        };
    }

    // Save the component to the clipboard
    clipboard.set("function_param", data);

    return {
        error: false,
        message: `The function param "${name}" successfully copied.`,
    };
};

/**
 * The copied function param from the clipboard
 * @returns {object}
 */
export const getCopiedFunctionParam = () => {
    const clipboard = new LocalStorage(clipboardName);

    // Get the components to be copied from the clipboard
    const param = clipboard.get("function_param");

    // Check if there are components in the clipboard
    if (!param || (isObject(param) && isEmpty(param))) {
        return { error: true, message: "No function param to paste." };
    }

    return {
        error: false,
        data: param,
        message: "Function param successfully pasted",
    };
};
