import { HttpResponse } from "../../helper/HttpRequest";
import { Sort } from "../../data/Type";

/**
 * TODO:
 * Please be reminded that all the interfaces are just a temporary baseline.
 * Please feel free to modify them in future development to fit your need.
 */

import ActionFormat from "../../component/event-flow/data/Functions";
import { Service } from "./ServiceInterface";

enum ParameterType {
    JSON = "json",
    TEXT = "text",
}

enum DataType {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    LIST = "list",
}

interface ResultParameter {
    field: string;
    description?: string;
    type: DataType;
}

interface QueryParameter {
    field: string;
    type: DataType;
    description?: string;
    required: boolean;
}

interface BodyParameter {
    type: ParameterType;
    parameter: QueryParameter[];
}

interface RequestResult {
    type: ParameterType;
    parameter: ResultParameter[];
}

interface RequestParameter {
    query?: QueryParameter[];
    body?: BodyParameter;
}

interface RequestHeader {
    type: string;
    value?: string;
}

interface Request {
    header?: RequestHeader[];
    parameter?: RequestParameter;
    result?: RequestResult;
    action?: ActionFormat[];
}

interface ApiData {
    get?: Request;
    post?: Request;
    patch?: Request;
    put?: Request;
    delete?: Request;
}

interface Api {
    uuid: string;
    id?: number;
    configuration_id?: number | null;
    configuration_uuid?: string;
    name: string;
    order: number;
    title?: string | null;
    folder_uuid?: string;
    folder_id?: number | null;
    data?: ApiData;
    updated_at?: string;
    updated_by?: string;
}

type ApiTestResponse = HttpResponse<{
    type: ParameterType;
    result: string | object;
}>;

type ApiTestDataParameter = { [field: string]: string | string[] };

type ApiTestData = {
    query: ApiTestDataParameter;
    body: ApiTestDataParameter | string;
};

interface ApiRuntimeValueItem {
    parameterQueryValue?: { [key: string]: string | string[] };
    parameterBodyValue?: { [key: string]: string | string[] } | string;
    outputResult?: string | object;
    outputLog?: string[];
    socketChannelName?: string;
}

type ApiRuntimeValue = {
    [method in keyof ApiData]: ApiRuntimeValueItem;
};

interface ApiTestRequestPayload {
    application: {
        code: string;
    };
    socket: {
        channelName: string;
    };
    header: {
        value: { [key: string]: unknown };
    };
    query: {
        value: { [key: string]: unknown };
    };
    body: {
        type: ParameterType;
        value: string | { [key: string]: string | string[] } | undefined;
    };
    result: {
        type: ParameterType;
        fields: { [key: string]: DataType };
    };
    action: ActionFormat[];
    service: Service[];
}

interface ApiSlice {
    api: Api[];
    selectedApiUuid: string | null;
    runtimeValue: { [appUuid: string]: ApiRuntimeValue };
    addNewApi: (data: Api) => void;
    setSelectedApiUuid: (uuid: string) => void;
    setSelectedConfiguration: (configUuid?: string) => void;
    updateApiSort: (data: Sort[]) => void;
    updateApiHeader: (
        requestMethod: keyof ApiData,
        header: RequestHeader[]
    ) => void;
    deleteApi: () => void;
    updateApiName: (name: string, title?: string) => void;
    updateApiParameter: (
        requestMethod: keyof ApiData,
        data: RequestParameter
    ) => void;
    updateApiResult: (
        requestMethod: keyof ApiData,
        result: RequestResult
    ) => void;
    updateApiAction: (
        requestMethod: keyof ApiData,
        action: ActionFormat[]
    ) => void;
    updateApiSocketChannelName: (
        requestMethod: keyof ApiData,
        channelName?: string
    ) => void;
    runApiTest: (
        requestMethod: keyof ApiData,
        socketChannelName: string,
        applicationCode?: string
    ) => Promise<HttpResponse<ApiTestResponse>>;
    updateOutputLog: (requestMethod: keyof ApiData, message?: string) => void;
    updateOutputResult: (
        requestMethod: keyof ApiData,
        result: string | object
    ) => void;
    clearOutput: (requestMethod: keyof ApiData) => void;
    updateParameterValues: (
        requestMethod: keyof ApiData,
        parameterType: keyof RequestParameter,
        data: ApiTestDataParameter | string
    ) => void;
}

export { ParameterType, DataType };
export type {
    QueryParameter,
    BodyParameter,
    RequestParameter,
    Api,
    ApiData,
    Request,
    RequestHeader,
    ApiTestDataParameter,
    ApiTestData,
    ResultParameter,
    RequestResult,
    ApiTestRequestPayload,
    ApiTestResponse,
};
export default ApiSlice;
