import { Dropdown } from "react-bootstrap";

import { OptionObjectValuesProps, OptionObjectProps } from "./data/Functions";
import useStore from "../../zustand/Store";
import { ServiceType } from "../../zustand/interface/ServiceInterface";

type ParamDropdownProps = {
    options: string | OptionObjectProps;
    onChange: (currentValue: string) => void;
};

/**
 * List of supported service types for easy lookup
 */
const allServiceTypes = Object.values(ServiceType) as string[];

/**
 * Get the type of option to display
 * @param {string|object} options
 *                          - "the type"
 *                          - { type: "the type", values: [] }
 * @returns {string}
 */
const getType = (options: string | OptionObjectProps): string => {
    switch (typeof options) {
        case "string":
            return options;
        case "object":
            return options?.type ?? "";
        default:
    }
    return "";
};

/**
 * Normalizes the value. If it is an array of string then formats it to { display: "", value: "" }
 * @param {mixed} values
 * @returns {OptionObjectValuesProps[]}
 */
const normalizeValues = (
    values: (string | OptionObjectValuesProps)[]
): OptionObjectValuesProps[] => {
    const result: OptionObjectValuesProps[] = [];
    Object.keys(values ?? {}).forEach((i) => {
        const value = values[i as keyof OptionObjectValuesProps[]];

        switch (typeof value) {
            case "string":
                result.push({ display: value, value });
                break;
            case "object":
                result.push(value as OptionObjectValuesProps);
                break;
            default:
        }
    });
    return result;
};

/**
 * Retrieve list of services for dropdown selection
 * @param {string} type
 * @returns {OptionObjectValuesProps[]}
 */
const getServices = (type: string): OptionObjectValuesProps[] => {
    const { service } = useStore((state) => ({
        service: state.service,
    }));
    return service
        .filter((s) => s.type === type)
        .map((s) => ({ display: s.name, value: s.name }));
};

/**
 * Get the options that will be displayed in the dropdown of a function's parameter
 * @param {mixed} options
 *                  possible values
 *                  - "the type"
 *                  - { type: "the type", values: [ { display: "", value: "" } ] }
 * @returns {OptionObjectValuesProps[]}
 */
const getOptions = (
    options: string | OptionObjectProps
): OptionObjectValuesProps[] => {
    // Get the type of option to display
    const type = getType(options);

    // Check if type is a service connector
    if (type && allServiceTypes.includes(type)) {
        return getServices(type);
    }
    switch (type) {
        case "SoapConnector":
        case "RestConnector":
        case "DatabaseTable":
            return getServices(type);
        case "integer":
            return [{ display: "(Integer - e.g. 1)", value: "1" }];
        case "integer2":
            return [{ display: "(Integer - e.g. 10)", value: "10" }];
        case "boolean":
            return [
                { display: "yes", value: "true" },
                { display: "no", value: "false" },
            ];
        default:
    }

    return normalizeValues((options as OptionObjectProps)?.values ?? []);
};

/**
 * The component dropdown that displays the suggested values of a function's parameter
 */
const ParamDropdown = ({ options, onChange }: ParamDropdownProps) => {
    // Get the options
    const paramDropdownOptions = getOptions(options);

    const handleClick = (
        value: string,
        e: React.SyntheticEvent<unknown, Event>
    ) => {
        e.preventDefault();
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className="input-group-append">
            <Dropdown
                onSelect={(eventKey, e) => {
                    if (eventKey) {
                        handleClick(eventKey, e);
                    }
                }}
            >
                <Dropdown.Toggle
                    variant="secondary"
                    className="btn-chinese-silver h-36 rounded-3-px"
                />

                <Dropdown.Menu className="scrollable-dropdown">
                    {paramDropdownOptions.length > 0 &&
                        paramDropdownOptions.map((option) => (
                            <Dropdown.Item
                                eventKey={option.value}
                                key={option.value}
                            >
                                {option.display}
                            </Dropdown.Item>
                        ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default ParamDropdown;
