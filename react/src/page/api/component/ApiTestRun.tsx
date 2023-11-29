import { faPlus, faTrash, faWalking } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty, isString } from "lodash";
import { SyntheticEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import TabMenu, { TabItem } from "../../../common/component/TabMenu";
import useToast from "../../../common/hooks/Toast";

import {
    ApiData,
    ApiTestDataParameter,
    ParameterType,
    QueryParameter,
    RequestParameter,
} from "../../../common/zustand/interface/ApiInterface";
import useStore from "../../../common/zustand/Store";
import { HttpResponse } from "../../../common/helper/HttpRequest";
import { socketInstance } from "../../../common/helper/Socket";
import { getCookies } from "../../../common/helper/Cookies";
import { API_TOKEN } from "../../../common/data/Constant";
import TestLogList from "../../../common/component/TestLogList";

const parseParameters = (
    param: QueryParameter[] | string,
    currentValue?: { [key: string]: unknown } | string
) => {
    // If param is already a string return
    if (isString(param)) {
        if (typeof currentValue === "string" && currentValue) {
            return currentValue;
        }
        return param;
    }

    // Prepare field variable
    let fields = {};

    // Iterate parameters to be used and assign it as fields
    if (typeof currentValue !== "string") {
        param?.forEach(({ field }) => {
            fields = {
                ...fields,
                [field]: currentValue?.[field] ?? "",
            };
        });
    }

    return fields;
};

type ApiTestRunProps = {
    requestMethod: keyof ApiData;
    parameterType: keyof RequestParameter;
};

const ApiTestRun = ({ requestMethod, parameterType }: ApiTestRunProps) => {
    const { appid } = useParams();

    // Prepare translation hook
    const { t } = useTranslation();

    // Prepare toast hook
    const toastMessage = useToast(true);

    // Get Selected API
    const {
        selectedApi,
        runApiTest,
        runtimeValue,
        updateOutputLog,
        updateOutputResult,
        updateApiSocketChannelName,
        clearOutput,
        updateParameterValues,
    } = useStore((state) => ({
        selectedApi: state.api.find((a) => a.uuid === state.selectedApiUuid),
        runApiTest: state.runApiTest,
        runtimeValue: state.runtimeValue?.[state.selectedApiUuid ?? ""],
        updateOutputLog: state.updateOutputLog,
        updateOutputResult: state.updateOutputResult,
        updateApiSocketChannelName: state.updateApiSocketChannelName,
        clearOutput: state.clearOutput,
        updateParameterValues: state.updateParameterValues,
    }));

    const apiData = selectedApi?.data?.[requestMethod];

    // Prepare parameters to show
    const requestParameter = apiData?.parameter;

    // Get parameters to setup fields
    const parametersList = {
        query: requestParameter?.query as QueryParameter[],
        body:
            requestParameter?.body?.type === "json"
                ? (requestParameter?.body?.parameter as QueryParameter[])
                : "",
    };

    const resultData = runtimeValue?.[requestMethod]?.outputResult ?? "";
    const testLogData = runtimeValue?.[requestMethod]?.outputLog ?? [];

    // Prepare fields variable
    const [loading, setLoading] = useState<boolean>(false);

    const fields = {
        body: parseParameters(
            parametersList.body,
            runtimeValue?.[requestMethod]?.parameterBodyValue
        ),
        query: parseParameters(
            parametersList.query,
            runtimeValue?.[requestMethod]?.parameterQueryValue
        ),
    };

    const resultTabLabel = `api.dashboard.test.tabs.secondary.result`;
    const logTabLabel = `api.dashboard.test.tabs.secondary.log`;

    const outputTabs: TabItem[] = [
        {
            title: resultTabLabel,
            component: (
                <div aria-label="tab-output-result">
                    <pre className="text-sm">
                        {typeof resultData === "object"
                            ? JSON.stringify(resultData, undefined, 4)
                            : resultData}
                    </pre>
                </div>
            ),
        },
        {
            title: logTabLabel,
            component: (
                <div aria-label="tab-output-log">
                    <TestLogList logs={testLogData} />
                </div>
            ),
        },
    ];

    // Prepare activetab state
    const [parameterActiveTab, setParameterActiveTab] = useState(
        outputTabs[0].title
    );

    const handleRunTest = async (e: SyntheticEvent) => {
        e.preventDefault();

        // set loading
        setLoading(true);

        const existingSocketChannelName =
            runtimeValue?.[requestMethod]?.socketChannelName;

        // Close previously-opened socket
        if (existingSocketChannelName) {
            socketInstance.close(existingSocketChannelName);
        }

        // Get the token from cookie
        const token = getCookies(API_TOKEN);

        // start connecting and listening to socket
        const { channelName } = socketInstance.listen({
            onReceive: (message) => {
                updateOutputLog(requestMethod, message);
            },
            protocols: token,
        });

        // Store current socket channel name (so that we can close it later)
        updateApiSocketChannelName(requestMethod, channelName);

        // reset output log & result for this tab
        clearOutput(requestMethod);

        // call api test. this api will also feed the socket channel name for broadcast
        runApiTest(requestMethod, channelName, appid)
            .then((res) => {
                const { message, data } = res.data;

                // result obtained, update output in UI
                updateOutputResult(requestMethod, data.result);

                toastMessage(message, toast.TYPE.SUCCESS);
            })
            .catch((error: Error) => {
                let errorMessage: string | undefined;
                let errorDetail: string | undefined;

                if (error instanceof AxiosError<HttpResponse<string>>) {
                    // Error comes from API.
                    // Error message will likely be inside "data"
                    const { message, data } =
                        (error as AxiosError<HttpResponse<string>>).response
                            ?.data ?? {};
                    errorMessage = message;
                    errorDetail = data;
                } else {
                    // Error caused by other internal errors
                    // Use a generic JavaScript error message
                    errorDetail = error.message;
                }
                // Something goes wrong, add error message to Log tab.
                // There might be a condition where socket will still output messages even if the testing is already finished with error.
                // Thus, let socket finish updating itself first for a while.
                setTimeout(
                    () => updateOutputLog(requestMethod, errorDetail),
                    500
                );
                toastMessage(
                    errorMessage ?? t(`api.dashboard.test.run.error`),
                    toast.TYPE.ERROR
                );
            })
            .finally(() => {
                // set loading
                setLoading(false);
            });
    };

    const handleFieldChange = (
        fieldType: ParameterType, // field type
        value: string | string[],
        key?: string
    ) => {
        updateParameterValues(
            requestMethod,
            parameterType,
            fieldType === ParameterType.JSON
                ? { [key as string]: value }
                : (value as string)
        );
    };

    // prepare field inputs
    const fieldInputs = parametersList[parameterType];

    const singleParamValueInput = (
        fieldName: string,
        paramValues: ApiTestDataParameter
    ) => (
        <Form.Group key={fieldName} controlId={fieldName} className="mb-3">
            <Row className="align-items-center">
                <Col xs={12} lg={2}>
                    <Form.Label
                        title={fieldName}
                        className="d-block m-0 text-sm text-truncate text-philippine-gray"
                    >
                        {fieldName}
                    </Form.Label>
                </Col>
                <Col xs={12} lg={5}>
                    <Form.Control
                        className="text-sm"
                        value={
                            typeof paramValues[fieldName] === "string"
                                ? paramValues[fieldName]
                                : ""
                        }
                        onChange={(e) =>
                            handleFieldChange(
                                ParameterType.JSON,
                                e.target.value,
                                fieldName // field name
                            )
                        }
                    />
                </Col>
            </Row>
        </Form.Group>
    );

    const listParamValueInput = (
        fieldName: string,
        paramValues: ApiTestDataParameter
    ) => {
        // Always start with an empty value as the first entry
        const listValues =
            Array.isArray(paramValues[fieldName]) &&
            (paramValues[fieldName] as string[]).length > 0
                ? (paramValues[fieldName] as string[])
                : [""];

        return (
            <Form.Group key={fieldName} controlId={fieldName} className="mb-4">
                {listValues.map((value, index) => (
                    <Row className="align-items-center mb-3">
                        <Col xs={12} lg={2}>
                            {index === 0 && (
                                <Form.Label
                                    title={fieldName}
                                    className="d-block m-0 text-sm text-truncate text-philippine-gray"
                                >
                                    {fieldName}
                                </Form.Label>
                            )}
                        </Col>
                        <Col xs={12} lg={5}>
                            <Form.Control
                                className="text-sm"
                                value={listValues[index] ?? ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        ParameterType.JSON,
                                        listValues.map((v, i) =>
                                            index === i ? e.target.value : v
                                        ),
                                        fieldName // field name
                                    )
                                }
                            />
                        </Col>
                        <Col xs={12} lg={2}>
                            {index > 0 && (
                                <Button
                                    aria-label="delete"
                                    variant="outline-chinese-silver"
                                    onClick={() => {
                                        handleFieldChange(
                                            ParameterType.JSON,
                                            listValues.filter(
                                                (v, i) => i !== index
                                            ),
                                            fieldName // field name
                                        );
                                    }}
                                    className="text-rg rounded-3-px"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            )}
                        </Col>
                    </Row>
                ))}

                <Row>
                    <Col xs={12} lg={{ span: 5, offset: 2 }}>
                        <Button
                            size="sm"
                            variant="outline-light-emobiq-brand"
                            className="btn btn-outline-light-emobiq-brand px-3"
                            onClick={() => {
                                handleFieldChange(
                                    ParameterType.JSON,
                                    [...listValues, ""],
                                    fieldName // field name
                                );
                            }}
                        >
                            <FontAwesomeIcon
                                size="sm"
                                className="me-2"
                                icon={faPlus}
                            />
                            {t(`api.dashboard.test.button.add`)}
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        );
    };

    return (
        <div>
            <Form onSubmit={handleRunTest} className="mb-4">
                {Array.isArray(fieldInputs) && !isEmpty(fieldInputs) && (
                    <div
                        aria-label="test-field-list"
                        className="border-bottom border-2 pb-4 mb-4"
                    >
                        {fieldInputs?.map((param) => {
                            const paramValues = fields[
                                parameterType
                            ] as ApiTestDataParameter;

                            return param.type === "list"
                                ? listParamValueInput(param.field, paramValues)
                                : singleParamValueInput(
                                      param.field,
                                      paramValues
                                  );
                        })}
                    </div>
                )}

                {parameterType === "body" &&
                    requestParameter?.body?.type === "text" && (
                        <div
                            aria-label="test-field-list"
                            className="border-bottom border-2 pb-4 mb-4"
                        >
                            <Form.Control
                                as="textarea"
                                rows={6}
                                className="text-sm"
                                value={fields[parameterType] as string}
                                onChange={(e) =>
                                    handleFieldChange(
                                        ParameterType.TEXT,
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    )}

                <Button
                    type="submit"
                    size="sm"
                    variant="outline-light-emobiq-brand"
                    className="btn btn-outline-light-emobiq-brand px-3"
                    disabled={loading}
                >
                    <FontAwesomeIcon
                        size="sm"
                        className="me-2"
                        icon={faWalking}
                    />
                    {t(`api.dashboard.test.button.run`)}
                </Button>
            </Form>

            <div className="h-400">
                <TabMenu
                    dark
                    scrollable
                    primary={{
                        tabs: outputTabs,
                        activeTab: parameterActiveTab,
                        onTabChange: setParameterActiveTab,
                    }}
                />
            </div>
        </div>
    );
};

export default ApiTestRun;
