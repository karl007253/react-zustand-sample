import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// eslint-disable-next-line import/no-extraneous-dependencies
import WS from "jest-websocket-mock";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { mockedJavaTesterHttpRequest } from "../../../common/helper/HttpRequest";
import {
    Api,
    ApiTestData,
    ApiTestDataParameter,
    ApiTestRequestPayload,
    ApiTestResponse,
    DataType,
    ParameterType,
    QueryParameter,
    RequestParameter,
} from "../../../common/zustand/interface/ApiInterface";
import useStore from "../../../common/zustand/Store";

import ApiTestRun from "./ApiTestRun";
import { socketInstance } from "../../../common/helper/Socket";

// Prepare mock data
const mockedRequestMethod = "get";

const mockParameters: QueryParameter[] = [
    { field: "field-1", required: false, type: DataType.STRING },
    { field: "field-2", required: false, type: DataType.STRING },
    { field: "required-3", required: true, type: DataType.STRING },
    { field: "required-4", required: true, type: DataType.STRING },
];

const mockParametersListValue: QueryParameter[] = [
    { field: "list-1", required: true, type: DataType.LIST },
];

const mockApiData: Api = {
    uuid: "id-endpoint-3",
    name: "endpoint-3",
    title: "endpoint-3",
    order: 0,
    data: {
        [mockedRequestMethod]: {},
    },
};

const mockPostResponse: ApiTestResponse = {
    success: true,
    message: "Success",
    data: {
        type: ParameterType.TEXT,
        result: "test-results",
    },
};

const addButton = () => {
    return screen.getByRole("button", {
        name: "api.dashboard.test.button.add",
    });
};

const deleteButton = () => {
    return screen.getByRole("button", {
        name: "delete",
    });
};

const runTestButton = () => {
    return screen.getByRole("button", {
        name: "api.dashboard.test.button.run",
    });
};

const outputResultTab = () => {
    return screen.getByLabelText("tab-output-result");
};

const outputLogTab = () => {
    return screen.getByLabelText("tab-output-log");
};

const inputFieldList = () => {
    return screen.getByLabelText("test-field-list");
};

const getTabByName = (name: string) => {
    return screen.getByRole("tab", {
        name: `api.dashboard.test.tabs.secondary.${name}`,
    });
};

const getTabPanelByName = (name: string) => {
    return screen.getByRole("tabpanel", {
        name: `api.dashboard.test.tabs.secondary.${name}`,
    });
};

const getTextBoxByName = (name: string) => {
    return screen.getByRole("textbox", { name });
};

// Method to check tab and tabpanel
const isTabPresent = (tabTitle: string) => {
    expect(getTabByName(tabTitle)).toBeInTheDocument();
    expect(getTabPanelByName(tabTitle)).toBeInTheDocument();
};

// Method to render component with the data
const renderComponent = async (paramType: "query" | "body") => {
    // set state to test the run test endpont
    useStore.setState({
        api: [mockApiData],
        selectedApiUuid: mockApiData.uuid,
        runtimeValue: {},
    });

    // Mock http request
    mockedJavaTesterHttpRequest.post.mockImplementation(() =>
        Promise.resolve({
            data: mockPostResponse,
        })
    );

    await waitFor(() =>
        render(
            <MemoryRouter>
                <ApiTestRun
                    requestMethod={mockedRequestMethod}
                    parameterType={paramType}
                />
                <ToastContainer limit={1} />
            </MemoryRouter>
        )
    );
};

// Method to update parameter on state
const updateParameterData = async (data: RequestParameter) => {
    const { updateApiParameter } = useStore.getState();

    await waitFor(() => {
        updateApiParameter(mockedRequestMethod, data);
    });
};

// Method to check Log and Result tabs on component
const verifyLogAndResultTabs = () => {
    // Parameter types
    const parameterTypes = ["result", "log"];

    // Ensure tabs exists
    parameterTypes.forEach((type) => isTabPresent(type));
};

// Method to ensure field list does not exist
const verifyEmptyList = () => {
    // Ensure parameter list is empty by checking the test-field-list component
    expect(screen.queryByLabelText("test-field-list")).not.toBeInTheDocument();
};

// Method to check each parameter input if they exist
const verifyNumberOfInputs = () => {
    // Ensure number of inputs is correct
    expect(within(inputFieldList()).getAllByRole("textbox")).toHaveLength(
        mockParameters.length
    );
};

// Method to run and verify sent payload to backend
const runTestAndVerifyPayload = async (data: Partial<ApiTestData> = {}) => {
    // Prepare test endpoint
    const testEndpoint = "test/api";

    // Fire click event
    userEvent.click(runTestButton());

    // Ensure test api is called
    await waitFor(() => expect(runTestButton()).not.toBeDisabled());

    // Get updated api data
    const apiData = useStore.getState().api[0]?.data?.[mockedRequestMethod];

    // Prepare expected payload
    const expectedPayload: Partial<ApiTestRequestPayload> = {
        ...(data.query && {
            query: {
                value: data.query,
            },
        }),
        ...(data.body && {
            body: {
                type: apiData?.parameter?.body?.type ?? ParameterType.TEXT,
                value: data.body,
            },
        }),
    };

    // expect api called with correct payload
    expect(mockedJavaTesterHttpRequest.post).toHaveBeenNthCalledWith(
        1,
        testEndpoint,
        expect.objectContaining(expectedPayload)
    );
};

// Method to fill out the parameter fields and run test to verify
const inputParametersAndVerify = async (type: "body" | "query") => {
    const expectedBody: ApiTestDataParameter = {};

    // Iterate through queries and type a test value
    mockParameters.forEach(({ field }) => {
        // Prepare mock value
        const mockValue = `${field}-test-value`;

        // Set to expectedBody
        expectedBody[field] = mockValue;

        // Perform type event
        userEvent.type(getTextBoxByName(field), mockValue);
    });

    // run test and verify
    await runTestAndVerifyPayload({ [type]: expectedBody });
};

describe("Api: ApiTestRun", () => {
    describe("Query:", () => {
        // Render before each
        beforeEach(() => renderComponent("query"));

        it("should render tabs correctly", verifyLogAndResultTabs);

        it("should not show the list of fields initially", verifyEmptyList);

        describe("key-value parameters", () => {
            // Update parameter using mock data
            beforeEach(async () =>
                updateParameterData({ query: mockParameters })
            );

            it("should have the right input fields", verifyNumberOfInputs);

            it("should run test succesfully", async () =>
                inputParametersAndVerify("query"));
        });

        describe("key-value parameters with list", () => {
            // Update parameter using mock data
            beforeEach(async () =>
                updateParameterData({ query: mockParametersListValue })
            );

            it("should have the add button", () => {
                expect(addButton()).toBeInTheDocument();
            });

            it("should have a single empty field initially", async () => {
                expect(screen.getAllByRole("textbox")).toHaveLength(1);

                expect(screen.getByRole("textbox")).toHaveValue("");
            });

            it("should add a new field if add button is clicked", async () => {
                userEvent.click(addButton());

                await waitFor(() =>
                    expect(screen.getAllByRole("textbox")).toHaveLength(2)
                );

                userEvent.click(addButton());

                await waitFor(() =>
                    expect(screen.getAllByRole("textbox")).toHaveLength(3)
                );
            });

            it("should be able to retain input", async () => {
                const testValue = [
                    "test-value-1",
                    "test-value-2",
                    "test-value-3",
                ];

                // Add two more fields, making a total of three
                await act(() => userEvent.click(addButton()));
                await act(() => userEvent.click(addButton()));

                expect(screen.getAllByRole("textbox")).toHaveLength(3);

                // Simulate user input
                screen.getAllByRole("textbox").forEach((e, i) => {
                    userEvent.type(e, testValue[i]);
                });

                // Check for corresponding state storing the values
                const { runtimeValue } = useStore.getState();

                const runtimeQueryValue =
                    runtimeValue[mockApiData.uuid][mockedRequestMethod]
                        ?.parameterQueryValue ?? {};

                const storedListValue =
                    runtimeQueryValue[mockParametersListValue[0].field];

                expect(storedListValue).toEqual(testValue);
            });

            it("should be able to delete fields", async () => {
                const queryDeleteButton = screen.queryByRole("button", {
                    name: "delete",
                });

                // Ensure no delete button yet
                expect(queryDeleteButton).not.toBeInTheDocument();

                // Add one more field
                await act(() => userEvent.click(addButton()));

                // Now, delete button should be visible
                expect(deleteButton()).toBeInTheDocument();
                expect(screen.getAllByRole("textbox")).toHaveLength(2);

                // Attempt to click the delete button
                await act(() => userEvent.click(deleteButton()));

                // Now, ensure delete button is gone, and field count revert to initial state
                expect(queryDeleteButton).not.toBeInTheDocument();
                expect(screen.getAllByRole("textbox")).toHaveLength(1);
            });
        });
    });

    describe("Body:", () => {
        // Render before each
        beforeEach(() => renderComponent("body"));

        it("should render tabs correctly", verifyLogAndResultTabs);

        it("should not show the list of fields initially", verifyEmptyList);

        describe("text parameter", () => {
            beforeEach(async () =>
                updateParameterData({
                    query: [],
                    body: { type: ParameterType.TEXT, parameter: [] },
                })
            );

            it("should have one textarea field", async () => {
                expect(
                    within(inputFieldList()).getAllByRole("textbox")
                ).toHaveLength(1);
            });

            it("should run test successfully", async () => {
                const expectedBodyText = "testing-body";

                // Perform type event
                userEvent.type(
                    within(inputFieldList()).getByRole("textbox"),
                    expectedBodyText
                );

                // run test and verify
                await runTestAndVerifyPayload({
                    body: expectedBodyText,
                });
            });
        });

        describe("json parameters", () => {
            beforeEach(async () =>
                updateParameterData({
                    query: [],
                    body: {
                        parameter: mockParameters,
                        type: ParameterType.JSON,
                    },
                })
            );

            it("should have the right input fields", verifyNumberOfInputs);

            it("should run test successfully", () =>
                inputParametersAndVerify("body"));
        });
    });

    describe("Outputs:", () => {
        beforeEach(() => renderComponent("query"));

        it("should initially have empty values in Result tab", () => {
            // Ensure the Result tab is there
            expect(outputResultTab()).toBeInTheDocument();

            // Ensure the Result tab have nothing
            expect(outputResultTab()).toHaveTextContent("");
        });

        it("should initially have nothing in Log tab", () => {
            // Ensure the Log tab is there
            expect(outputLogTab()).toBeInTheDocument();

            // Ensure the Result tab have nothing
            expect(outputLogTab()).toHaveTextContent("");
        });

        it("should show text results in Result tab", async () => {
            // Ensure the test API is callable
            await runTestAndVerifyPayload();

            await waitFor(() => {
                expect(screen.getAllByRole("alert")).toHaveLength(1);

                // Ensure a success toast popup appears
                expect(screen.getByRole("alert")).toHaveTextContent(
                    mockPostResponse.message
                );

                // Ensure the Result tab have the expected content
                expect(outputResultTab()).toHaveTextContent(
                    mockPostResponse.data.result as string
                );
            });
        });

        it("should show json results in Result tab", async () => {
            const mockJsonPostResponse: ApiTestResponse = {
                success: true,
                message: "Success",
                data: {
                    type: ParameterType.JSON,
                    result: {
                        key1: "value1",
                        key2: "value2",
                    },
                },
            };

            // Custom API implementation to return JSON result
            mockedJavaTesterHttpRequest.post.mockImplementation(() => {
                return Promise.resolve({
                    data: mockJsonPostResponse,
                });
            });

            // Ensure the test API is callable
            await runTestAndVerifyPayload();

            await waitFor(() => {
                // Ensure a success toast popup appears
                expect(screen.getByRole("alert")).toHaveTextContent(
                    mockPostResponse.message
                );

                // Ensure the Result tab have the expected content
                expect(outputResultTab()).toHaveTextContent(
                    JSON.stringify(
                        mockJsonPostResponse.data.result as object,
                        undefined,
                        4
                    ),
                    // Keep newlines and spaces intact
                    {
                        normalizeWhitespace: false,
                    }
                );
            });
        });

        it("should show messages from socket in Log tab", async () => {
            const customSocketChannelName = "socket-channel-name";
            const customSocketMessage = "socket-message";

            // Create a WS server instance to mock an active socket server.
            // This "server" will be able to send and receive messages equivalent to the real one.
            const socketServer = new WS(
                socketInstance.socketUrl(customSocketChannelName)
            );

            // Create a mocked instance of socket object
            const mockedSocket = socketInstance as jest.Mocked<
                typeof socketInstance
            >;

            // Modify the channel name generation to return a constant value (since the current behavior is to generate unique random name)
            mockedSocket.uniqueChannelName = jest.fn(() => {
                return customSocketChannelName;
            });

            // Modify the POST request implementation. Return the response as usual, but inject a socket-sending function within it.
            mockedJavaTesterHttpRequest.post.mockImplementation(() => {
                socketServer.send(customSocketMessage);
                return Promise.resolve({
                    data: mockPostResponse,
                });
            });

            // Ensure the test API is callable
            await runTestAndVerifyPayload();

            // Ensure the Result tab have the socket message
            expect(outputLogTab()).toHaveTextContent(customSocketMessage);

            // Cleanup and close the WS server instance
            WS.clean();
        });

        it("should show errors in Log tab", async () => {
            const customErrorMessage = "error-message";

            // Modify the POST request implementation to return error instead
            mockedJavaTesterHttpRequest.post.mockImplementation(() => {
                return Promise.reject(new Error(customErrorMessage));
            });

            // Ensure the test API is callable
            await runTestAndVerifyPayload();

            await waitFor(() => {
                // Ensure an error toast popup appears
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.test.run.error"
                );

                // Ensure the Result tab have the error message
                expect(outputLogTab()).toHaveTextContent(customErrorMessage);
            });
        });
    });
});
