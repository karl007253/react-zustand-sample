import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import ApiResult from "./ApiResult";
import {
    DataType,
    ParameterType,
    ResultParameter,
} from "../../../common/zustand/interface/ApiInterface";
import useStore from "../../../common/zustand/Store";

let mockUpdateApiResult: jest.Mock;
const mockApi = {
    uuid: "1",
    name: "testApi",
    title: "testApi",
    order: 0,
};

const mockResultJsonData: ResultParameter[] = [
    {
        field: "Type1",
        description: "Value1",
        type: DataType.STRING,
    },
];

const mockResultTextData: ResultParameter[] = [
    {
        field: "text",
        description: "Value1",
        type: DataType.STRING,
    },
];

const populateStateWithResultData = (type: ParameterType) => {
    act(() => {
        // Ensure mockUpdateApiResult is reset to 0 call, by assigning a new jest.fn() in each test
        mockUpdateApiResult = jest.fn();
        useStore.setState(
            {
                api: [
                    {
                        ...mockApi,
                        data: {
                            get: {
                                result: {
                                    type,
                                    parameter:
                                        type === ParameterType.JSON
                                            ? mockResultJsonData
                                            : mockResultTextData,
                                },
                            },
                        },
                    },
                ],
                selectedApiUuid: mockApi.uuid,
                updateApiResult: mockUpdateApiResult,
            },
            true
        );
    });
};

describe("Api: ApiResult", () => {
    describe("Generic test", () => {
        beforeEach(() => {
            render(<ApiResult requestMethod="get" />);
        });

        it("should have json as the initial format", async () => {
            expect(
                screen.getByDisplayValue(
                    "api.dashboard.action.result.format.options.json"
                )
            ).toBeInTheDocument();
        });

        it("should allow user to switch format", async () => {
            // select text format
            userEvent.selectOptions(
                screen.getByLabelText(
                    "api.dashboard.action.result.format.title"
                ),
                ParameterType.TEXT
            );

            // make sure that format is already changed
            expect(
                screen.getByDisplayValue(
                    "api.dashboard.action.result.format.options.text"
                )
            ).toBeInTheDocument();
        });
    });

    describe("For format type json", () => {
        beforeEach(() => {
            render(<ApiResult requestMethod="get" />);
        });

        it("should have the header Key, Description and Type", () => {
            expect(
                screen.getByRole("columnheader", {
                    name: "api.dashboard.action.result.header.key",
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("columnheader", {
                    name: "api.dashboard.action.result.header.description",
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("columnheader", {
                    name: "api.dashboard.action.result.header.type",
                })
            ).toBeInTheDocument();
        });

        it("should show no input fields before having any data", () => {
            expect(
                screen.queryAllByRole("row", {
                    name: "table-row-api-result-json",
                })
            ).toHaveLength(0);
        });

        describe("with result data", () => {
            beforeEach(() => {
                populateStateWithResultData(ParameterType.JSON);

                // Ensure updateApiParameter is not called yet before each test
                mockUpdateApiResult.mockReset();
            });

            it("should show JSON format", () => {
                expect(
                    screen.getByRole("combobox", {
                        name: "api.dashboard.action.result.format.title",
                    })
                ).toHaveValue(ParameterType.JSON);
            });

            it("should remove the record after clicking the delete button", async () => {
                // make sure the data is there first
                expect(
                    screen.getByRole("textbox", {
                        name: "api-result-input-field-0",
                    })
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("textbox", {
                        name: "api-result-input-description-0",
                    })
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("combobox", {
                        name: "api-result-input-type-0",
                    })
                ).toBeInTheDocument();

                // Click Delete button
                userEvent.click(
                    screen.getByRole("button", {
                        name: "api-result-delete-button-0",
                    })
                );
                await waitFor(() => {
                    expect(mockUpdateApiResult).toHaveBeenCalledTimes(1);
                });

                // Check if the data is already deleted
                expect(
                    screen.queryByRole("textbox", {
                        name: "api-result-input-field-0",
                    })
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByRole("textbox", {
                        name: "api-result-input-description-0",
                    })
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByRole("combobox", {
                        name: "api-result-input-type-0",
                    })
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByRole("button", {
                        name: "api-result-delete-button-0",
                    })
                ).not.toBeInTheDocument();
            });

            it("should remove the record after an existing parameter field is cleared", async () => {
                // Clear input field of type
                userEvent.clear(
                    screen.getByRole("textbox", {
                        name: "api-result-input-field-0",
                    })
                );
                // Check if the data is already deleted
                expect(
                    screen.queryByRole("textbox", {
                        name: "api-result-input-field-0",
                    })
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByRole("textbox", {
                        name: "api-result-input-description-0",
                    })
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByRole("combobox", {
                        name: "api-result-input-type-0",
                    })
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByRole("button", {
                        name: "api-result-delete-button-0",
                    })
                ).not.toBeInTheDocument();

                // Ensure updateApiResult is not called immediately
                expect(mockUpdateApiResult).toHaveBeenCalledTimes(0);
                // Ensure updateApiResult is called upon completion of clearing
                await waitFor(() => {
                    expect(mockUpdateApiResult).toHaveBeenCalledTimes(1);
                });
            });

            it("should update result parameter data in global state when an input value is changed", async () => {
                const changedResultParameter = mockResultJsonData[0];

                // Input anything to the field input
                userEvent.type(
                    screen.getByRole("textbox", {
                        name: "api-result-input-field-0",
                    }),
                    `-updated`
                );
                // Ensure the field input is updated after user input
                expect(
                    screen.getByRole("textbox", {
                        name: "api-result-input-field-0",
                    })
                ).toHaveValue(`${changedResultParameter.field}-updated`);
                // Ensure updateApiResult is not called immediately
                expect(mockUpdateApiResult).toHaveBeenCalledTimes(0);
                // Ensure updateApiResult is called upon completion of user typing
                await waitFor(() => {
                    expect(mockUpdateApiResult).toHaveBeenCalledTimes(1);
                });

                // Input anything to the defaultValue input
                userEvent.type(
                    screen.getByRole("textbox", {
                        name: "api-result-input-description-0",
                    }),
                    `-updated`
                );
                // Ensure the defaultValue input is updated after user input
                expect(
                    screen.getByRole("textbox", {
                        name: "api-result-input-description-0",
                    })
                ).toHaveValue(`${changedResultParameter.description}-updated`);
                // Ensure updateApiResult is called upon completion of user typing
                await waitFor(() => {
                    expect(mockUpdateApiResult).toHaveBeenCalledTimes(2);
                });

                // select another option on type dropdown
                userEvent.selectOptions(
                    screen.getByLabelText("api-result-input-type-0"),
                    DataType.BOOLEAN
                );
                // Ensure the value of type is updated
                expect(
                    screen.getByDisplayValue(
                        "api.dashboard.action.result.json.typeOptions.boolean"
                    )
                ).toBeInTheDocument();
                // Ensure updateApiResult is called upon completion of user selection
                await waitFor(() => {
                    expect(mockUpdateApiResult).toHaveBeenCalledTimes(3);
                });
            });

            it("should not update result when a new result parameter is provided without a field", async () => {
                // Click Add button
                userEvent.click(
                    screen.getByRole("button", {
                        name: "api.dashboard.action.result.button.add",
                    })
                );
                // Ensure new input field of type does not have any value
                expect(
                    screen.getByRole("textbox", {
                        name: `api-result-input-field-${mockResultJsonData.length}`,
                    })
                ).toHaveValue("");
                // Ensure updateApiResult is not called immediately
                expect(mockUpdateApiResult).toHaveBeenCalledTimes(0);
                // Ensure updateApiResult is not called upon completion of user typing
                await waitFor(() => {
                    expect(mockUpdateApiResult).toHaveBeenCalledTimes(0);
                });
            });

            it("should add a parameter data in global state when a new parameter field is provided", async () => {
                // Click Add button
                userEvent.click(
                    screen.getByRole("button", {
                        name: "api.dashboard.action.result.button.add",
                    })
                );
                // Input a value to the new input field of type
                userEvent.type(
                    screen.getByRole("textbox", {
                        name: `api-result-input-field-${mockResultJsonData.length}`,
                    }),
                    "newInput"
                );
                // Ensure updateApiResult is not called immediately
                expect(mockUpdateApiResult).toHaveBeenCalledTimes(0);
                // Ensure updateApiResult is called upon completion of user typing
                await waitFor(() => {
                    expect(mockUpdateApiResult).toHaveBeenCalledTimes(1);
                });
            });

            it("should remove all the JSON data after switch to text format", () => {
                // Ensure the JSON data exists initially
                expect(
                    screen.getAllByRole("row", {
                        name: "table-row-api-result-json",
                    })
                ).toHaveLength(mockResultJsonData.length);

                // select text format
                userEvent.selectOptions(
                    screen.getByLabelText(
                        "api.dashboard.action.result.format.title"
                    ),
                    ParameterType.TEXT
                );

                expect(mockUpdateApiResult).toHaveBeenCalledTimes(1);

                // select json format
                userEvent.selectOptions(
                    screen.getByLabelText(
                        "api.dashboard.action.result.format.title"
                    ),
                    ParameterType.JSON
                );

                expect(mockUpdateApiResult).toHaveBeenCalledTimes(2);

                expect(
                    screen.queryAllByRole("row", {
                        name: "table-row-api-result-json",
                    })
                ).toHaveLength(0);
            });
        });
    });

    describe("For format type text", () => {
        beforeEach(() => {
            populateStateWithResultData(ParameterType.TEXT);
            render(<ApiResult requestMethod="get" />);

            // Ensure updateApiParameter is not called yet before each test
            mockUpdateApiResult.mockReset();
        });

        it("should show text format", () => {
            expect(
                screen.getByRole("combobox", {
                    name: "api.dashboard.action.result.format.title",
                })
            ).toHaveValue(ParameterType.TEXT);
        });

        it("should have the header Key and Description only", () => {
            expect(
                screen.getByRole("columnheader", {
                    name: "api.dashboard.action.result.header.key",
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("columnheader", {
                    name: "api.dashboard.action.result.header.description",
                })
            ).toBeInTheDocument();

            expect(
                screen.queryByRole("columnheader", {
                    name: "api.dashboard.action.result.header.type",
                })
            ).not.toBeInTheDocument();
        });

        it("should have the correct text data", () => {
            expect(
                screen.getByRole("cell", {
                    name: "api.dashboard.action.result.input.text",
                })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("textbox", {
                    name: "api-result-input-string-parameter",
                })
            ).toHaveValue(mockResultTextData[0].description ?? "");
        });

        it("should update api result data when description is updated", async () => {
            userEvent.type(
                screen.getByRole("textbox", {
                    name: "api-result-input-string-parameter",
                }),
                "-updated"
            );

            expect(
                screen.getByRole("textbox", {
                    name: "api-result-input-string-parameter",
                })
            ).toHaveValue(`${mockResultTextData[0].description ?? ""}-updated`);

            expect(mockUpdateApiResult).toHaveBeenCalledTimes(0);

            await waitFor(() => {
                expect(mockUpdateApiResult).toHaveBeenCalledTimes(1);
            });
        });

        it("should remove all the text data after switch to JSON format", () => {
            // Ensure the text data exists initially
            expect(
                screen.getByRole("textbox", {
                    name: "api-result-input-string-parameter",
                })
            ).toHaveValue(mockResultTextData[0].description ?? "");

            // select json format
            userEvent.selectOptions(
                screen.getByLabelText(
                    "api.dashboard.action.result.format.title"
                ),
                ParameterType.JSON
            );

            expect(mockUpdateApiResult).toHaveBeenCalledTimes(1);

            // select text format
            userEvent.selectOptions(
                screen.getByLabelText(
                    "api.dashboard.action.result.format.title"
                ),
                ParameterType.TEXT
            );

            expect(mockUpdateApiResult).toHaveBeenCalledTimes(2);

            expect(
                screen.getByRole("textbox", {
                    name: "api-result-input-string-parameter",
                })
            ).toHaveValue("");
        });
    });
});
