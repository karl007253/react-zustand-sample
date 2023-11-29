import { FunctionParameterType, FunctionParameterValueType } from "./Functions";

const ACTION_FORMAT_PARAMETER_KEYS_MAP = {
    uuid: "uuid",
    res: "_res",
    function: "f",
    parameter: "params",
    parameter_type: "paramType",
};

/**
 * The parameter types with icons
 */
const parameterTypes: FunctionParameterType = {
    value: {
        icon: "&nu;",
    },
    param: {
        icon: "&weierp;",
    },
    input: {
        icon: "&iota;",
    },
    inputField: {
        icon: "&epsilon;",
    },
    data: {
        icon: "&delta;",
    },
    dataField: {
        icon: "&part;",
    },
    extra: {
        icon: "&egrave;",
    },
    extraField: {
        icon: "&Egrave;",
    },
    header: {
        icon: "&eta;",
    },
    headerField: {
        icon: "&Eta;",
    },
    query: {
        icon: "&aring;",
    },
    queryField: {
        icon: "&Aring;",
    },
    body: {
        icon: "&beta;",
    },
    bodyField: {
        icon: "&Beta;",
    },
    function: {
        icon: "&fnof;",
    },
};

const valueTypes: FunctionParameterValueType[] = [
    {
        name: "string",
    },
    {
        name: "integer",
    },
    {
        name: "number",
    },
    {
        name: "boolean",
    },
    {
        name: "function",
    },
    {
        name: "functionList",
    },
    {
        name: "array",
    },
    {
        name: "object",
    },
    {
        name: "longText",
    },
    {
        name: "comment",
    },
];

export { ACTION_FORMAT_PARAMETER_KEYS_MAP, parameterTypes, valueTypes };
