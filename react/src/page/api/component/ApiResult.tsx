import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useEffect, useState } from "react";
import _ from "lodash";

import { toast } from "react-toastify";
import useStore from "../../../common/zustand/Store";
import {
    ApiData,
    DataType,
    ParameterType,
    RequestResult,
    ResultParameter,
} from "../../../common/zustand/interface/ApiInterface";

import { ButtonVariant } from "../../../common/component/helper/EmobiqModal";
import useDebounce from "../../../common/hooks/Debounce";
import useToast from "../../../common/hooks/Toast";
import { validateSpecialCharacters } from "../../../common/helper/Function";

type ApiResultProps = {
    requestMethod: keyof ApiData;
};

const ApiResult = ({ requestMethod }: ApiResultProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const { selectedApi, updateApiResult } = useStore((state) => ({
        selectedApi: state.api.find((a) => a.uuid === state.selectedApiUuid),
        updateApiResult: state.updateApiResult,
    }));

    const [result, setResult] = useState<RequestResult>({} as RequestResult);

    // Ensure result parameter list is updated only when user typing is completed
    const debouncedResultParameters = useDebounce(result.parameter ?? []);

    // Reset result when selectedApi is changed or a new requestMethod is selected
    useEffect(() => {
        setResult(
            selectedApi?.data?.[requestMethod]?.result ||
                ({ type: ParameterType.JSON } as RequestResult)
        );
    }, [selectedApi?.uuid, requestMethod]);

    // Update global state if format is changed
    useEffect(() => {
        if (requestMethod) {
            updateApiResult(requestMethod, result);
        }
    }, [result.type]);

    // Update result parameter list in global state if applicable
    useEffect(() => {
        // Ensure only valid data is saved in the global state by removing all data with empty type
        const newResultParameters = debouncedResultParameters.filter(
            ({ field }) => field?.length > 0
        );

        // Prepare current result parameter list. Empty list is used if current result parameter list is undefined.
        const currentResultParameter =
            selectedApi?.data?.[requestMethod]?.result?.parameter || [];

        // Return true if current result parameter list's length is greater than new result parameter list's length
        const isCurrentParameterGreaterThanNewParameter =
            currentResultParameter.length > newResultParameters.length;

        // Return true if current result parameter list is different from new result parameter list
        const isResultUpdated = newResultParameters.some((parameter, index) => {
            if (currentResultParameter[index]) {
                // Verify if a result parameter is found in current result parameter list and consequently, compare the result parameter in current result parameter list and new result parameter list
                return !_.isEqual(parameter, currentResultParameter[index]);
            }

            // Return true if the result parameter is not found in current result parameter list and the value of type is not an empty string
            return true;
        });

        if (isCurrentParameterGreaterThanNewParameter || isResultUpdated) {
            updateApiResult(requestMethod, {
                ...result,
                parameter: newResultParameters,
            });
        }
    }, [debouncedResultParameters]);

    // add a new empty result parameter
    const handleAdd = () => {
        const newParameter: ResultParameter = {
            field: "",
            type: DataType.STRING,
        };

        // if result parameter is already of type array, add into the array
        setResult({
            ...result,
            parameter: [...(result.parameter ?? []), newParameter],
        });
    };

    // handle deleting a result parameter item
    const handleDelete = (index: number) => {
        // Remove the deleted result parameter from result parameter list
        const newResult = {
            ...result,
            parameter: result.parameter.filter((_param, i) => i !== index),
        };

        setResult(newResult);
    };

    // Functions for updating input fields
    // NB: If the previous result.parameter is of type Array, it will be changed to String once format type is changed to text and the input field is filled in, and vice versa

    // handle updating the input field of field
    const handleUpdateField = (index: number, field: string) => {
        if (field.length > 0) {
            // Checking for special characters
            if (validateSpecialCharacters(field)) {
                toastMessage(
                    t("common.error.specialCharactersDetected"),
                    toast.TYPE.ERROR
                );
            } else {
                // Update value of specific result parameter
                const newResult = {
                    ...result,
                    parameter: result?.parameter?.map((parameter, i) =>
                        i === index ? { ...parameter, field } : parameter
                    ),
                };

                setResult(newResult);
            }
        } else {
            handleDelete(index);
        }
    };

    // handle updating the input field of type
    const handleUpdateType = (index: number, type: DataType) => {
        // Update type of specific result parameter if the type is not an empty string
        const newResult = {
            ...result,
            parameter: result?.parameter?.map((parameter, i) =>
                i === index ? { ...parameter, type } : parameter
            ),
        };
        setResult(newResult);
    };

    // handle updating the input field of description
    const handleUpdateDescription = (index: number, defaultValue: string) => {
        // Update value of specific result parameter
        const newResult = {
            ...result,
            parameter: result?.parameter?.map((parameter, i) =>
                i === index
                    ? { ...parameter, description: defaultValue }
                    : parameter
            ),
        };

        setResult(newResult);
    };

    // handle updating the input field of string parameter
    const handleUpdateText = (event: ChangeEvent<HTMLInputElement>) => {
        const newResult = {
            ...result,
            parameter: [
                {
                    field: t("api.dashboard.action.result.input.text"),
                    description: event.target.value,
                    type: DataType.STRING,
                },
            ],
        };

        setResult(newResult);
    };

    return (
        <Container className="px-0">
            <Form.Group key="type" controlId="type">
                <Row className="align-items-center">
                    <Col xs={12} md={3} lg={2} xl={1}>
                        <Form.Label className="text-rg m-0 text-spanish-gray">
                            {t(`api.dashboard.action.result.format.title`)}
                        </Form.Label>
                    </Col>
                    <Col xs={12} md={6} lg={4} xl={3}>
                        <Form.Select
                            className="text-rg rounded-6 icon-arrow-down-grey border-platinum"
                            onChange={(e) => {
                                setResult({
                                    type: e.target.value as ParameterType,
                                    parameter: [],
                                });
                            }}
                            value={result.type}
                        >
                            {Object.values(ParameterType).map((type) => (
                                <option key={type} value={type}>
                                    {t(
                                        `api.dashboard.action.result.format.options.${type}`
                                    )}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </Form.Group>

            <hr className="opacity-100 text-light-gray mt-4 mb-40" />

            {result.type === ParameterType.TEXT ? (
                <Table
                    responsive
                    borderless
                    className="text-spanish-gray text-rg table-width-api-result-text"
                >
                    <thead>
                        <tr>
                            <th className="pt-0 ps-0 fw-normal">
                                {t("api.dashboard.action.result.header.key")}
                            </th>
                            <th className="pt-0 pe-0 fw-normal">
                                {t(
                                    "api.dashboard.action.result.header.description"
                                )}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="ps-0 align-middle">
                                {t("api.dashboard.action.result.input.text")}
                            </td>
                            <td className="pe-0">
                                <Form.Control
                                    aria-label="api-result-input-string-parameter"
                                    className="text-rg h-35"
                                    onChange={handleUpdateText}
                                    value={
                                        result.parameter?.[0]?.description ?? ""
                                    }
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <>
                    <Table
                        responsive
                        borderless
                        className="text-spanish-gray text-rg table-width-api-result-json"
                    >
                        <thead>
                            <tr>
                                <th className="pt-0 ps-0 fw-normal">
                                    {t(
                                        "api.dashboard.action.result.header.key"
                                    )}
                                </th>
                                <th className="pt-0 fw-normal">
                                    {t(
                                        "api.dashboard.action.result.header.description"
                                    )}
                                </th>
                                <th className="pt-0 fw-normal">
                                    {t(
                                        "api.dashboard.action.result.header.type"
                                    )}
                                </th>
                                <th
                                    aria-label="table-column-delete-button"
                                    className="pt-0 pe-0"
                                />
                            </tr>
                        </thead>

                        <tbody>
                            {result.parameter?.map((resultParameter, index) => (
                                <tr
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    aria-label="table-row-api-result-json"
                                >
                                    <td className="ps-0">
                                        <Form.Control
                                            aria-label={`api-result-input-field-${index}`}
                                            className="text-rg h-35"
                                            onChange={(e) =>
                                                handleUpdateField(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            value={resultParameter?.field ?? ""}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            aria-label={`api-result-input-description-${index}`}
                                            className="text-rg h-35"
                                            onChange={(e) =>
                                                handleUpdateDescription(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            value={
                                                resultParameter?.description ??
                                                ""
                                            }
                                        />
                                    </td>
                                    <td>
                                        <Form.Select
                                            aria-label={`api-result-input-type-${index}`}
                                            className="text-rg h-35 py-1 rounded-3-px icon-arrow-down-grey"
                                            onChange={(
                                                e: React.ChangeEvent<HTMLSelectElement>
                                            ) =>
                                                handleUpdateType(
                                                    index,
                                                    e.target.value as DataType
                                                )
                                            }
                                            value={resultParameter?.type}
                                        >
                                            {Object.values(DataType).map(
                                                (type) => (
                                                    <option
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {t(
                                                            `api.dashboard.action.result.json.typeOptions.${type}`
                                                        )}
                                                    </option>
                                                )
                                            )}
                                        </Form.Select>
                                    </td>
                                    <td className="pe-0">
                                        <Button
                                            aria-label={`api-result-delete-button-${index}`}
                                            variant={
                                                ButtonVariant.OUTLINE_CHINESE_SILVER
                                            }
                                            onClick={() => {
                                                handleDelete(index);
                                            }}
                                            className="text-rg rounded-3-px"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Button
                        variant={ButtonVariant.OUTLINE_LIGHT_EMOBIQ_BRAND}
                        onClick={handleAdd}
                        className="text-sm"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span className="ms-2">
                            {t("api.dashboard.action.result.button.add")}
                        </span>
                    </Button>
                </>
            )}
        </Container>
    );
};

export default ApiResult;
