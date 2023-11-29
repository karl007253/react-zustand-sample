type OptionObjectValuesProps = {
    display: string;
    value: string;
};

type OptionObjectProps = {
    type?: string;
    values: (string | OptionObjectValuesProps)[];
};

type FunctionParameterProps = {
    params: {
        [key: string]: string;
    } | null;
    dropdown?: {
        [key: string]: string | OptionObjectProps;
    };
    info?: {
        version: number;
    };
};

type CategoryProps = {
    [functionName: string]: FunctionParameterProps;
};

type FunctionListsProps = {
    [category: string]: CategoryProps;
};

type OptionProps = {
    text: string;
    value: string;
};

type PositionProps = {
    x: number;
    y: number;
};

interface BaseAction {
    uuid: string;
}

interface ActionFormat extends BaseAction {
    function: string;
    parameter?: {
        [name: string]: string | null | ActionFormat | ActionFormat[];
    };
    parameter_type?: {
        [name: string]: string;
    };
    res?: FunctionParameterProps;
}

interface OldActionFormat extends BaseAction {
    f: string;
    params?: {
        [name: string]: string | null | OldActionFormat | OldActionFormat[];
    };
    paramType?: {
        [name: string]: string;
    };
    _res?: FunctionParameterProps;
}

type CombinedActionFormat = ActionFormat | OldActionFormat;

type GlobalActionParameter = {
    [name: string]: string;
};

interface BaseGlobalAction {
    uuid: string;
    process: CombinedActionFormat[];
    result?: string;
}

interface GlobalActionFormat extends BaseGlobalAction {
    function: string;
    parameter: GlobalActionParameter;
}

interface OldGlobalActionFormat extends BaseGlobalAction {
    f: string;
    params: GlobalActionParameter;
}

type CombinedGlobalActionFormat = GlobalActionFormat | OldGlobalActionFormat;

type CombinedActionFormatParameterProps = {
    [name: string]:
        | string
        | null
        | CombinedActionFormat
        | CombinedActionFormat[];
};

type CombinedActionFormatParameterTypeProps = {
    [name: string]: string;
};

type ActionResultParameter = {
    name: string;
    type: string;
};

// Use by global function add/delete
type GlobalForm = {
    name?: string;
    result?: string;
    uuid?: string;
};

type DataFunctionFormatProps = {
    id: string;
    parent: string | null;
    parent_list: string[];
    fromId: string | null;
    is_sibling_callback_displayed: boolean;
    sibling: string | null;
    first_sibling: string | null;
    end?: boolean;
    name: string;
    data?: CombinedActionFormat | Record<string, never>; // If you want a type meaning "empty object", you probably want Record<string, never> instead
    position: PositionProps;
    parent_connection_name: string;
    total_connections?: number;
    connections: {
        yes?: DataFunctionFormatProps[];
        no?: DataFunctionFormatProps[];
    };
};

type ConnectionProps = {
    yes?: DataFunctionFormatProps[];
    no?: DataFunctionFormatProps[];
};

type SelectedSubFlowsProps = {
    function: string;
    param: string;
    uuid: string;
};

type FunctionInListProps = {
    func: CombinedActionFormat;
    list: { [key: string]: CombinedActionFormat } | CombinedActionFormat[];
    index: string | number;
    subFlows: SelectedSubFlowsProps[];
};

type FunctionParameterType = {
    [parameter: string]: {
        icon: string;
    };
};

type FunctionParameterValueType = {
    name: string;
};

export type {
    OldActionFormat,
    CombinedActionFormat,
    GlobalActionFormat,
    OldGlobalActionFormat,
    CombinedGlobalActionFormat,
    GlobalActionParameter,
    GlobalForm,
    FunctionInListProps,
    SelectedSubFlowsProps,
    ConnectionProps,
    DataFunctionFormatProps,
    CombinedActionFormatParameterTypeProps,
    CombinedActionFormatParameterProps,
    PositionProps,
    OptionProps,
    FunctionListsProps,
    CategoryProps,
    FunctionParameterProps,
    OptionObjectProps,
    OptionObjectValuesProps,
    FunctionParameterType,
    FunctionParameterValueType,
    ActionResultParameter,
};
export default ActionFormat;
