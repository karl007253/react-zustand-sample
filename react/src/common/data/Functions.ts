import ActionFormat, {
    DataFunctionFormatProps,
    FunctionListsProps,
} from "../component/event-flow/data/Functions";

type CallbackNamesProps = {
    [key: string]: {
        [key: string]: string;
    };
};

/**
 * Format use by raw data
 */
export const functionFormat: ActionFormat = {
    uuid: "",

    // The name of the function
    function: "",

    // Hidden if empty
    parameter_type: {},

    // Hidden if empty
    parameter: {},
};

/**
 * List of functions with their parameters
 */
export const Functions: FunctionListsProps = {
    Result: {
        "Result.setAPI": {
            params: null,
            info: {
                version: 2,
            },
        },
    },
    Log: {
        "Log.write": {
            params: {
                value: "string", // any
            },
            info: {
                version: 2,
            },
        },
    },
    Math: {
        "Math.add": {
            params: {
                value1: "number", // required
                value2: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.subtract": {
            params: {
                value1: "number", // required
                value2: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.multiply": {
            params: {
                value1: "number", // required
                value2: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.divide": {
            params: {
                dividend: "number", // required
                divisor: "number", // required
                isIntegerOnly: "boolean",
            },
            dropdown: {
                isIntegerOnly: "boolean",
            },
            info: {
                version: 2,
            },
        },
        "Math.modulo": {
            params: {
                value1: "number", // required
                value2: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.round": {
            params: {
                value: "number", // required
                mode: "string",
            },
            dropdown: {
                mode: {
                    values: [
                        "Ceiling",
                        "Down",
                        "Floor",
                        "Half_Down",
                        "Half_Even",
                        "Half_Up", // default
                        "Up",
                    ],
                },
            },
            info: {
                version: 2,
            },
        },
        "Math.pi": {
            params: null,
            info: {
                version: 2,
            },
        },
        "Math.absolute": {
            params: {
                value: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.pow": {
            params: {
                base: "number", // required
                component: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.sqr": {
            params: {
                value: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.sqrt": {
            params: {
                value: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.sin": {
            params: {
                value: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.cos": {
            params: {
                value: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.tan": {
            params: {
                value: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Math.atan2": {
            params: {
                value1: "number", // required
                value2: "number", // required
            },
            info: {
                version: 2,
            },
        },
    },
    List: {
        "List.sum": {
            params: {
                data: "array", // required
            },
            info: {
                version: 2,
            },
        },
        "List.count": {
            params: {
                data: "array", // required
            },
            info: {
                version: 2,
            },
        },
        "List.average": {
            params: {
                data: "array", // required
            },
            info: {
                version: 2,
            },
        },
        "List.sort": {
            params: {
                data: "array", // required
                descending: "boolean",
            },
            dropdown: {
                desc: "boolean",
            },
            info: {
                version: 2,
            },
        },
        "List.insertLast": {
            params: {
                data: "array", // required
                value: "string", // required, any
            },
            info: {
                version: 2,
            },
        },
        "List.removeLast": {
            params: {
                data: "array", // required
            },
            info: {
                version: 2,
            },
        },
        "List.insertFirst": {
            params: {
                data: "array", // required
                value: "string", // required, any
            },
            info: {
                version: 2,
            },
        },
        "List.removeFirst": {
            params: {
                data: "array", // required
            },
            info: {
                version: 2,
            },
        },
        "List.includes": {
            params: {
                data: "array", // required
                value: "string", // required, any
            },
            info: {
                version: 2,
            },
        },
        "List.find": {
            params: {
                data: "array", // required
                value: "string", // required, any
            },
            info: {
                version: 2,
            },
        },
        "List.min": {
            params: {
                data: "array", // required
            },
            info: {
                version: 2,
            },
        },
        "List.max": {
            params: {
                data: "array", // required
            },
            info: {
                version: 2,
            },
        },
        "List.combine": {
            params: {
                data: "array", // required
                delimiter: "string",
            },
            info: {
                version: 2,
            },
        },
        "List.fill": {
            params: {
                value: "string", // required
                separator: "string", // required
            },
            info: {
                version: 2,
            },
        },
    },
    Object: {
        "Object.insert": {
            params: {
                data: "object", // required
                key: "string", // required
                value: "string", // any
            },
            info: {
                version: 2,
            },
        },
        "Object.remove": {
            params: {
                data: "object", // required
                key: "string", // required
            },
            info: {
                version: 2,
            },
        },
    },
    Logic: {
        "Logic.equal": {
            params: {
                value1: "string", // any
                value2: "string", // any
            },
            info: {
                version: 2,
            },
        },
        "Logic.notEqual": {
            params: {
                value1: "string", // any
                value2: "string", // any
            },
            info: {
                version: 2,
            },
        },
        "Logic.greaterThan": {
            params: {
                value1: "number", // required
                value2: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Logic.lessThan": {
            params: {
                value1: "number", // required
                value2: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Logic.greaterThanOrEqual": {
            params: {
                value1: "number", // required
                value2: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Logic.lessThanOrEqual": {
            params: {
                value1: "number", // required
                value2: "number", // required
            },
            info: {
                version: 2,
            },
        },
        "Logic.and": {
            params: {
                value1: "boolean", // required
                value2: "boolean", // required
            },
            info: {
                version: 2,
            },
        },
        "Logic.or": {
            params: {
                value1: "boolean", // required
                value2: "boolean", // required
            },
            info: {
                version: 2,
            },
        },
        "Logic.not": {
            params: {
                value: "boolean", // required
            },
            info: {
                version: 2,
            },
        },
    },
    Conversion: {
        "Conversion.toString": {
            params: {
                value: "string", // required, any
            },
            info: {
                version: 2,
            },
        },
        "Conversion.toBoolean": {
            params: {
                value: "string", // required, any
            },
            info: {
                version: 2,
            },
        },
        "Conversion.toInteger": {
            params: {
                value: "string", // required, String | Number
            },
            info: {
                version: 2,
            },
        },
        "Conversion.toFloat": {
            params: {
                value: "string", // required, String | Number
            },
            info: {
                version: 2,
            },
        },
        "Conversion.toList": {
            params: {
                data1: "string",
                data2: "string",
                data3: "string",
                data4: "string",
                data5: "string",
                data6: "string",
                data7: "string",
                data8: "string",
                data9: "string",
                data10: "string",
            },
            info: {
                version: 2,
            },
        },
        "Conversion.toObject": {
            params: {},
            info: {
                version: 2,
            },
        },
    },
    Validation: {
        "Validation.isList": {
            params: {
                value: "string", // required, any
            },
            info: {
                version: 2,
            },
        },
        "Validation.isNumber": {
            params: {
                value: "string", // required, any
            },
            info: {
                version: 2,
            },
        },
        "Validation.isEmail": {
            params: {
                value: "string", // required, any
            },
            info: {
                version: 2,
            },
        },
    },
    Control: {
        "Control.conditional": {
            params: {
                condition: "boolean", // required
                yesValue: "string", // any
                noValue: "string", // any
                extra: "string", // any
                yesCallback: "functionList",
                noCallback: "functionList",
            },
            info: {
                version: 2,
            },
        },
        "Control.map": {
            params: {
                data: "array", // required
                extra: "string", // any
                callback: "functionList", // required
            },
            info: {
                version: 2,
            },
        },
        "Control.forLoop": {
            params: {
                start: "integer", // required
                end: "integer", // required
                extra: "string", // any
                callback: "functionList", // required
            },
            dropdown: {
                start: "integer",
                end: "integer2",
            },
            info: {
                version: 2,
            },
        },
    },
    Dataset: {
        "Dataset.insert": {
            params: {
                dataset: "string", // required
                data: "object", // required
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            dropdown: {
                dataset: "DatabaseTable",
            },
            info: {
                version: 2,
            },
        },
        "Dataset.read": {
            params: {
                dataset: "string", // required
                filter: "object", // FilterFormat
                limit: "integer",
                page: "integer",
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            dropdown: {
                dataset: "DatabaseTable",
            },
            info: {
                version: 2,
            },
        },
        "Dataset.update": {
            params: {
                dataset: "string", // required
                filter: "object", // FilterFormat
                data: "object", // required
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            dropdown: {
                dataset: "DatabaseTable",
            },
            info: {
                version: 2,
            },
        },
        "Dataset.remove": {
            params: {
                dataset: "string", // required
                filter: "object", // FilterFormat
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            dropdown: {
                dataset: "DatabaseTable",
            },
            info: {
                version: 2,
            },
        },
    },
    Connector: {
        "Connector.restCall": {
            params: {
                connector: "string", // required
                path: "string",
                method: "string",
                query: "object",
                callType: "string",
                headers: "object",
                cookies: "object", // Object | Array
                resultType: "string",
                body: "object", // Object | String
                attachment: "string",
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            dropdown: {
                connector: "RestConnector",
                method: {
                    values: ["Get", "Patch", "Put", "Post", "Delete"],
                },
                callType: {
                    values: [
                        "Form_Data",
                        "X_WWW_FORM_URLENCODED",
                        "Raw",
                        "Binary",
                        "JSON",
                    ],
                },
                resultType: {
                    values: ["String_UTF8", "Byte_Array"],
                },
            },
            info: {
                version: 2,
            },
        },
        "Connector.soapCall": {
            params: {
                connector: "string", // required
                header: "object", // Array | Object
                mimeHeader: "object",
                action: "string", // required
                body: "object",
                attachment: "object", // Object | Array
                actionNamespace: "string",
                sendAsMtom: "boolean",
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            dropdown: {
                connector: "SoapConnector",
                sendAsMtom: "boolean", // default: true
            },
            info: {
                version: 2,
            },
        },
    },
    Mail: {
        "Mail.send": {
            params: {
                type: "string", // required
                smtpHost: "string", // required
                smtpPort: "number", // required
                smtpUsername: "string", // required
                smtpPassword: "string", // required
                smtpUseStartTLS: "boolean",
                smtpUseSSL: "boolean",
                fromEmail: "string", // required
                fromName: "string",
                to: "object", // required, Object | Array
                cc: "object", // Object | Array
                bcc: "object", // Object | Array
                subject: "string", // required
                body: "string", // required
                attachment: "object", // Object | Array
                extra: "string", // any
                successCallback: "functionList",
                failureCallback: "functionList",
            },
            dropdown: {
                smtpUseStartTLS: "boolean", // default: true
                smtpUseSSL: "boolean", // default: true
            },
            info: {
                version: 2,
            },
        },
    },
    File: {
        "File.read": {
            params: {
                fileName: "string", // required
                folder: "string",
                dataType: "string", // required
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            dropdown: {
                dataType: {
                    values: ["Base64", "Text", "Byte array"],
                },
            },
            info: {
                version: 2,
            },
        },
        "File.write": {
            params: {
                data: "string", // required, (base64 / text / byte array – same as dataType of “read”
                dataType: "string", // required
                fileName: "string", // required
                folder: "string",
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            dropdown: {
                data: {
                    values: ["Base64", "Text", "Byte array"],
                },
                dataType: {
                    values: ["Base64", "Text", "Byte_Array"],
                },
            },
            info: {
                version: 2,
            },
        },
        "File.copy": {
            params: {
                sourceFileName: "string", // required
                sourceFolder: "string",
                destinationFileName: "string", // required
                destinationFolder: "string",
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            info: {
                version: 2,
            },
        },
        "File.remove": {
            params: {
                fileName: "string", // required
                folder: "string",
                extra: "string", // any
                callback: "functionList",
                errorCallback: "functionList",
            },
            info: {
                version: 2,
            },
        },
    },
    UserDefined: {},
    Variable: {
        "Variable.set": {
            params: {
                name: "string", // required
                value: "string", // any
            },
            info: {
                version: 2,
            },
        },
        "Variable.get": {
            params: {
                name: "string", // required
                defaultValue: "string", // any
            },
            info: {
                version: 2,
            },
        },
        "Variable.getAttribute": {
            params: {
                name: "string", // required
                attribute: "string", // required
                defaultValue: "string", // any
            },
            info: {
                version: 2,
            },
        },
    },
    Format: {
        "Format.number": {
            params: {
                value: "number", // required
                decimal: "integer",
                decimalSeparator: "string",
                thousandSeparator: "string",
            },
            dropdown: {
                decimal: "integer",
            },
            info: {
                version: 2,
            },
        },
        "Format.dateTime": {
            params: {
                date: "string", // required, Date | String
                currentFormat: "string",
                newFormat: "string",
            },
            info: {
                version: 2,
            },
        },
    },
    DateTime: {
        "DateTime.get": {
            params: {
                type: "string",
            },
            dropdown: {
                type: {
                    values: ["datetime", "date", "time"],
                },
            },
            info: {
                version: 2,
            },
        },
        "DateTime.update": {
            params: {
                date: "string", // required, Date | String
                dateFormat: "string",
                value: "integer", // required
                interval: "string",
            },
            dropdown: {
                interval: {
                    values: [
                        "Days",
                        "Years",
                        "Months",
                        "Weeks",
                        "Hours",
                        "Minutes",
                        "Seconds",
                    ],
                },
            },
            info: {
                version: 2,
            },
        },
        "DateTime.difference": {
            params: {
                date1: "string", // required, Date | String
                dateFormat1: "string",
                date2: "string", // required, Date | String
                dateFormat2: "string",
                interval: "string",
            },
            dropdown: {
                interval: {
                    values: [
                        "Days",
                        "Years",
                        "Months",
                        "Weeks",
                        "Hours",
                        "Minutes",
                        "Seconds",
                    ],
                },
            },
            info: {
                version: 2,
            },
        },
    },
};

/**
 * Callback mapping (yes/no)
 */
export const callbackNames: CallbackNamesProps = {
    yes: {
        callback: "callback",
        sCallback: "sCallback",
        okCallback: "okCallback",
        yesCallback: "yesCallback",
    },
    no: {
        errCallback: "errCallback",
        eCallback: "eCallback",
        noCallback: "noCallback",
        errorCallback: "errorCallback",
        cancelCallback: "cancelCallback",
    },
};

/**
 * The data format of a function to display in the event flow
 */
export const dataFunctionFormat: DataFunctionFormatProps = {
    // The id & parent id of a function
    id: "",
    parent: null,

    // The list of parent of a function
    // Grand parent -> parent -> ...
    parent_list: [],

    // From id
    // If there's a function before this function
    // Use for drawing the shape
    fromId: null,

    // This tells that the callback (yes/no) of the sibling node is already displayed
    is_sibling_callback_displayed: false,

    // The sibling of the function
    sibling: null,

    // The first sibling of the function
    first_sibling: null,

    // End shape
    end: false,

    // The name of the function
    name: "",

    // The raw data of a function
    data: {},

    position: {
        x: 0, // x coordinate
        y: 0, // y coordinate
    },

    // The parent connection name (yes/no/<or other name>)
    parent_connection_name: "",

    // Total number of connections of a function
    total_connections: 0,

    // The callbacks of this function
    connections: {
        yes: [
            /** same as dataFormat * */
        ],
        no: [
            /** same as dataFormat * */
        ],

        /** may include other names for connection (callback) * */
    },
};
