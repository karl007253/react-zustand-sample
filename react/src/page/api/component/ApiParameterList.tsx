import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import _ from "lodash";

import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { toast } from "react-toastify";
import {
    ApiData,
    ParameterType,
    QueryParameter,
    DataType,
    RequestParameter,
} from "../../../common/zustand/interface/ApiInterface";
import useStore from "../../../common/zustand/Store";
import useDebounce from "../../../common/hooks/Debounce";
import useToast from "../../../common/hooks/Toast";
import { validateSpecialCharacters } from "../../../common/helper/Function";

type ApiParameterListProps = {
    requestMethod: keyof ApiData;
    paramType: keyof RequestParameter;
};

const ApiParameterList = ({
    requestMethod,
    paramType,
}: ApiParameterListProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    // prepare parameter list
    const [paramList, setParamList] = useState<QueryParameter[]>([]);

    // Ensure param list is updated only when user typing is completed
    const debouncedParamList = useDebounce(paramList);

    const { selectedApi, updateApiParameter, updateParameterValues } = useStore(
        (state) => ({
            selectedApi: state.api.find(
                (a) => a.uuid === state.selectedApiUuid
            ),
            updateApiParameter: state.updateApiParameter,
            updateParameterValues: state.updateParameterValues,
        })
    );

    // If parameter type is "query" use parameter field under action
    // Otherwise, use parameter under body
    const requestParameter = selectedApi?.data?.[requestMethod]?.parameter;
    const currParams =
        (paramType === "query"
            ? requestParameter?.query
            : requestParameter?.body?.parameter) || [];

    // listener for selectedApi & requestMethod change
    useEffect(() => {
        setParamList(currParams);
    }, [selectedApi?.uuid, requestMethod]);

    // Update param list in global state if applicable
    useEffect(() => {
        // Ensure only valid data is saved in the global state by removing all data with empty type
        const newParams = debouncedParamList.filter(
            ({ field }) => !_.isEmpty(field)
        );

        // Return true if current param list's length is not equal
        const paramNotEqual = currParams.length > newParams.length;

        // Return true if current param list is different from new param list
        const isUpdated = newParams.some((param, index) => {
            if (currParams[index]) {
                // Verify if a param is found in current param list
                return !_.isEqual(param, currParams[index]);
            }

            // Return true if the param is newly created
            return true;
        });

        if (paramNotEqual || isUpdated) {
            const data: RequestParameter = {};

            if (paramType === "query") {
                data.query = newParams;
            } else {
                data.body = {
                    type: ParameterType.JSON,
                    parameter: newParams,
                };
            }

            // Update parameter data on state
            updateApiParameter(requestMethod, data);
        }
    }, [debouncedParamList]);

    const handleDeleteItem = (index: number) => {
        // Prepare new list
        const newList = [...paramList];
        newList.splice(index, 1);

        // Save parameters
        setParamList(newList);
    };

    const handleOnChange = (
        index: number,
        key: keyof QueryParameter,
        val: string | boolean
    ) => {
        if (key === "field" && _.isEmpty(val)) {
            handleDeleteItem(index);
        } else if (key === "field") {
            // Checking for special characters
            if (validateSpecialCharacters(String(val))) {
                toastMessage(
                    t("common.error.specialCharactersDetected"),
                    toast.TYPE.ERROR
                );
            } else {
                // Prepare new list with updated field
                const newList = paramList.map((query, i) =>
                    i === index
                        ? {
                              ...query,
                              [key as "type" | "description" | "required"]: val,
                          }
                        : query
                );

                // Save parameters
                setParamList(newList);
            }
        } else {
            // Prepare new list with updated field
            const newList = paramList.map((query, i) =>
                i === index ? { ...query, [key]: val } : query
            );

            // Save parameters
            setParamList(newList);
        }

        if (key === "type") {
            // Clear test data fields when changing type (especially between lists and non-lists)
            const paramName = paramList[index].field;
            updateParameterValues(requestMethod, paramType, {
                [paramName]: val === "list" ? [] : "",
            });
        }
    };

    const handleTypeChange = (type: string) => {
        // prepare new data
        const data = {
            body: {
                type: type as ParameterType, // add type
                parameter: [],
            },
        };

        // update parameter data
        updateApiParameter(requestMethod, data);

        // Ensure no params are shown in the component
        setParamList([]);
    };

    const handleAddItem = () => {
        // add new item on the list
        setParamList((prevList) => [
            ...prevList,
            {
                field: "",
                type: DataType.STRING,
                required: false,
            },
        ]);
    };

    // Prepare parameter body type
    // If "body.type" does not exist use "json" as default
    const paramBodyType = (selectedApi?.data?.[requestMethod]?.parameter?.body
        ?.type ?? "json") as ParameterType;

    // Prepare isJSON variable
    const isJSON = paramBodyType === "json";

    return (
        <div>
            {/* Show if paramType is "body" */}
            {paramType === "body" && (
                <>
                    <Form.Group controlId="select-parameter-type">
                        <Row className="align-items-center">
                            <Col
                                xs={12}
                                md={3}
                                lg={2}
                                xl={1}
                                className="text-spanish-gray text-rg text-uppercase"
                            >
                                <Form.Label className="mb-md-0">
                                    {t(
                                        "api.dashboard.action.parameters.label.type"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} md={6} lg={4} xl={3}>
                                <Form.Select
                                    name="type"
                                    className="text-rg rounded-6 icon-arrow-down-grey border-platinum"
                                    value={paramBodyType}
                                    onChange={(e) =>
                                        handleTypeChange(e.target.value)
                                    }
                                >
                                    {Object.values(ParameterType).map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>

                    {isJSON && (
                        <hr className="opacity-100 text-light-gray mt-4 mb-40" />
                    )}
                </>
            )}

            {/* Show if paramType is "query" or bodyType is "JSON" */}
            {(isJSON || paramType === "query") && (
                <>
                    <Table
                        responsive
                        borderless
                        className="table-width-api-parameters"
                    >
                        <thead
                            className="text-spanish-gray text-rg"
                            aria-label="parameter-columns"
                        >
                            <tr>
                                <th className="pt-0 ps-0 fw-normal">
                                    {t(
                                        "api.dashboard.action.parameters.table.column.parameter"
                                    )}
                                </th>
                                <th className="pt-0 fw-normal">
                                    {t(
                                        "api.dashboard.action.parameters.table.column.description"
                                    )}
                                </th>
                                <th className="pt-0 fw-normal">
                                    {t(
                                        "api.dashboard.action.parameters.table.column.type"
                                    )}
                                </th>
                                <th className="pt-0 fw-normal text-center">
                                    {t(
                                        "api.dashboard.action.parameters.table.column.required"
                                    )}
                                </th>
                                <th
                                    aria-label="table-column-delete-button"
                                    className="pt-0 pe-0"
                                />
                            </tr>
                        </thead>

                        <tbody aria-label="parameter-list">
                            {paramList?.map((data, pIndex) => {
                                const { field, description, type, required } =
                                    data;

                                return (
                                    <tr
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={pIndex}
                                    >
                                        <td className="ps-0">
                                            <Form.Control
                                                aria-label="field"
                                                className="text-sm"
                                                value={field}
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        pIndex,
                                                        "field",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                aria-label="description"
                                                className="text-sm"
                                                value={description || ""}
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        pIndex,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <Form.Select
                                                aria-label="type"
                                                name="type"
                                                className="text-sm icon-arrow-down-grey text-capitalize"
                                                value={type}
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        pIndex,
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {Object.values(DataType).map(
                                                    (q) => (
                                                        <option
                                                            key={q}
                                                            value={q}
                                                        >
                                                            {t(
                                                                `api.dashboard.action.parameters.json.typeOptions.${q}`
                                                            )}
                                                        </option>
                                                    )
                                                )}
                                            </Form.Select>
                                        </td>
                                        <td className="text-center align-middle">
                                            <Form.Check
                                                aria-label="required"
                                                type="checkbox"
                                                checked={required}
                                                onChange={() =>
                                                    handleOnChange(
                                                        pIndex,
                                                        "required",
                                                        !required
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="pe-0">
                                            <Button
                                                aria-label="delete"
                                                variant="outline-chinese-silver"
                                                onClick={() =>
                                                    handleDeleteItem(pIndex)
                                                }
                                                className="text-rg rounded-3-px"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                    <Button
                        variant="outline-light-emobiq-brand"
                        onClick={handleAddItem}
                        className="text-sm"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span className="ms-2">{t("common.button.add")}</span>
                    </Button>
                </>
            )}
        </div>
    );
};

export default ApiParameterList;
