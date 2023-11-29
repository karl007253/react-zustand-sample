import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { act } from "react-dom/test-utils";
import {
    AuthType,
    ConfigurationType,
} from "../../../../common/zustand/interface/ConfigurationInterface";
import EditConfiguration from "./EditConfiguration";
import useStore from "../../../../common/zustand/Store";
import {
    Encoding,
    Engine,
} from "../../../../common/zustand/interface/DatabaseInterface";
import { DatabaseTableDataType } from "../../../../common/zustand/interface/DatabaseTableInterface";

// Prepare mock data
const mockConfiguration = [
    {
        uuid: "Config 1",
        type: ConfigurationType.API,
        name: "Config 1",
        title: "Config 1",
        data: {
            dbConnection: "Auth",
            authType: AuthType.OAUTH2,
            tableReference: "Table1",
            username: "username",
            password: "password",
        },
        order: 0,
    },
    {
        uuid: "Config 2",
        type: ConfigurationType.API,
        name: "Config 2",
        title: "Config 2",
        data: {
            dbConnection: "Auth",
            authType: AuthType.BASIC_AUTH,
            tableReference: "Table1",
            username: "username",
            password: "password",
        },
        order: 0,
    },
    {
        uuid: "Config 3",
        type: ConfigurationType.DATABASE,
        name: "Config 3",
        title: "Config 3",
        order: 0,
    },
];

// Prepare mock data
const mockDatabase = [
    {
        id: 1,
        uuid: "DATABASE-1",
        name: "Auth",
        title: "Auth",
        order: 0,
        data: {
            engine: Engine.INNODB,
            encoding: Encoding.UTF8,
        },
    },
    {
        id: 2,
        uuid: "DATABASE-2",
        name: "Auth2",
        title: "Auth2",
        order: 0,
        data: {
            engine: Engine.INNODB,
            encoding: Encoding.UTF8,
        },
    },
];

// Prepare mock data
const mockDatabaseTable = [
    {
        uuid: "TABLE-1",
        name: "Table1",
        title: "Table1",
        order: 0,
        database_uuid: "DATABASE-1",
        data: {
            structure: [
                {
                    uuid: "field-id",
                    primary: true,
                    type: DatabaseTableDataType.INT,
                    optional: false,
                    name: "id",
                    length: "8",
                    default: "",
                },
                {
                    uuid: "field-username",
                    primary: false,
                    type: DatabaseTableDataType.VARCHAR,
                    optional: false,
                    name: "username",
                    length: "25",
                    default: "",
                },
                {
                    uuid: "field-password",
                    primary: false,
                    type: DatabaseTableDataType.VARCHAR,
                    optional: false,
                    name: "password",
                    length: "25",
                    default: "",
                },
                {
                    uuid: "field-token",
                    primary: false,
                    type: DatabaseTableDataType.VARCHAR,
                    optional: false,
                    name: "token",
                    length: "50",
                    default: "",
                },
            ],
        },
    },
    {
        uuid: "TABLE-2",
        name: "Table2",
        title: "Table2",
        order: 0,
        database_uuid: "DATABASE-1",
        data: {
            structure: [
                {
                    uuid: "field-id2",
                    primary: true,
                    type: DatabaseTableDataType.INT,
                    optional: false,
                    name: "id2",
                    length: "8",
                    default: "",
                },
                {
                    uuid: "field-username2",
                    primary: false,
                    type: DatabaseTableDataType.VARCHAR,
                    optional: false,
                    name: "username2",
                    length: "25",
                    default: "",
                },
                {
                    uuid: "field-password2",
                    primary: false,
                    type: DatabaseTableDataType.VARCHAR,
                    optional: false,
                    name: "password2",
                    length: "25",
                    default: "",
                },
                {
                    uuid: "field-token2",
                    primary: false,
                    type: DatabaseTableDataType.VARCHAR,
                    optional: false,
                    name: "token2",
                    length: "50",
                    default: "",
                },
            ],
        },
    },
];

const initialExpectedValue = [
    {
        name: "dbConnection", // dropdown item key
        value: "Auth", // dropdown item value
        itemIndex: 0, // dropdown item index
    },
    {
        name: "tableReference",
        value: "Table1",
        itemIndex: 0,
    },
    {
        name: "username",
        value: "username",
        itemIndex: 1,
    },
    {
        name: "password",
        value: "password",
        itemIndex: 2,
    },
];

// submit button
const submitButton = () => {
    return screen.getByTestId("button-submit");
};

// selected config
const selectedConfigurationButton = () => {
    return screen.getByRole("button", {
        name: /Config 1/i,
    });
};

const enterFormFieldsAndSubmit = async (
    type: AuthType | null,
    name?: string,
    skipSubmit?: boolean
) => {
    // trigger select event to type
    userEvent.selectOptions(
        screen.getByLabelText("api.dashboard.modalConfig.form.input.authType"),
        type || ""
    );

    // trigger type event to name input
    const nameInputField = screen.getByLabelText(
        "api.dashboard.modalConfig.form.input.name"
    );
    userEvent.clear(nameInputField);
    if (name) {
        userEvent.type(nameInputField, name);
    }

    // TODO: Tests for dbConnection, tableReference, username, password, will need to be readjusted in the future
    ["dbConnection", "tableReference", "username", "password"].forEach(
        (value) => {
            // Click the dropdown
            userEvent.click(screen.getByLabelText(value));
            // Select the option
            userEvent.click(
                screen.getAllByRole("button", {
                    name: `${
                        initialExpectedValue[
                            initialExpectedValue.findIndex(
                                (x) => x.name === value
                            )
                        ].value
                    }`,
                })[
                    initialExpectedValue[
                        initialExpectedValue.findIndex((x) => x.name === value)
                    ].itemIndex
                ]
            );
        }
    );

    if (!skipSubmit) {
        // then trigger submit button
        userEvent.click(submitButton());
    }
};

describe("Component: Modal - EditConfiguration", () => {
    // mock handle close
    const mockHandleClose = jest.fn();
    let mockUpdateApiConfig: jest.Mock;
    let mockAddApiConfig: jest.Mock;
    let mockDeleteApiConfig: jest.Mock;

    // Needed to fix the exceeded timeout of 5000ms for a test
    jest.setTimeout(20000);

    describe("With configurations loaded, with selected configuration", () => {
        beforeEach(async () => {
            // Reset all function call to 0
            mockUpdateApiConfig = jest.fn();
            mockAddApiConfig = jest.fn();
            mockDeleteApiConfig = jest.fn();
            await act(async () => {
                useStore.setState({
                    api: [
                        {
                            uuid: "id-endpoint-1",
                            name: "endpoint-1",
                            title: "endpoint-1",
                            configuration_uuid: mockConfiguration[0].uuid,
                            data: {},
                            order: 0,
                        },
                    ],
                    folder: [],
                    selectedApiUuid: "id-endpoint-1",
                    configuration: mockConfiguration,
                    selectedApiFolderUuid: null,
                    database: mockDatabase,
                    databaseTable: mockDatabaseTable,
                    updateConfiguration: mockUpdateApiConfig,
                    addNewConfiguration: mockAddApiConfig,
                    deleteConfiguration: mockDeleteApiConfig,
                });

                render(
                    <MemoryRouter>
                        <EditConfiguration show handleClose={mockHandleClose} />
                        <ToastContainer />
                    </MemoryRouter>
                );
            });
        });

        it("should have the data of Selected Api Configuration shown", () => {
            // Check authType value
            expect(
                screen.getByRole("combobox", {
                    name: "api.dashboard.modalConfig.form.input.authType",
                })
            ).toHaveValue(AuthType.OAUTH2);
            const nameInputField = screen.getByLabelText(
                "api.dashboard.modalConfig.form.input.name"
            );

            // Check name value
            expect(nameInputField).toHaveValue("Config 1");

            // Check the rest of the data value
            ["dbConnection", "tableReference", "username", "password"].forEach(
                (key) => {
                    const dropdownInputField = screen.getByLabelText(
                        `text-${key}`
                    );
                    expect(dropdownInputField).toHaveValue(
                        `${
                            initialExpectedValue[
                                initialExpectedValue.findIndex(
                                    (x) => x.name === key
                                )
                            ].value
                        }`
                    );
                }
            );
        });

        it("should have a Selected, Delete, and Update Button", () => {
            expect(
                screen.getByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.selected",
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.delete",
                })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.update",
                })
            ).toBeInTheDocument();
        });

        it("should not show the form anymore after deleting a selected configuration", async () => {
            // Check that the form still exists
            // Check authType value
            expect(
                screen.getByRole("combobox", {
                    name: "api.dashboard.modalConfig.form.input.authType",
                })
            ).toHaveValue(AuthType.OAUTH2);
            const nameInputField = screen.getByLabelText(
                "api.dashboard.modalConfig.form.input.name"
            );

            // Check name value
            expect(nameInputField).toHaveValue("Config 1");

            // Check the rest of the data value
            ["dbConnection", "tableReference", "username", "password"].forEach(
                (key) => {
                    const dropdownInputField = screen.getByLabelText(
                        `text-${key}`
                    );
                    expect(dropdownInputField).toHaveValue(
                        `${
                            initialExpectedValue[
                                initialExpectedValue.findIndex(
                                    (x) => x.name === key
                                )
                            ].value
                        }`
                    );
                }
            );

            // delete the config
            await waitFor(() => {
                userEvent.click(
                    screen.getByRole("button", {
                        name: "api.dashboard.modalConfig.form.button.delete",
                    })
                );
            });

            await waitFor(() => {
                userEvent.click(screen.getByLabelText("delete-config-yes"));
            });

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modalConfig.form.success.delete"
                );
            });

            // Check that the input fields (form) doesn't show anymore
            expect(
                screen.queryByRole("combobox", {
                    name: "api.dashboard.modalConfig.form.input.authType",
                })
            ).not.toBeInTheDocument();

            expect(
                screen.queryByLabelText(
                    "api.dashboard.modalConfig.form.input.name"
                )
            ).not.toBeInTheDocument();

            ["dbConnection", "tableReference", "username", "password"].forEach(
                (value) => {
                    // Click the dropdown
                    expect(
                        screen.queryByLabelText(value)
                    ).not.toBeInTheDocument();
                }
            );
        });

        it("should still keep an unsaved created config even if another existing config is deleted", async () => {
            // create a new config
            await waitFor(() =>
                userEvent.click(screen.getByLabelText("button-create"))
            );

            // Highlight an existing configuration
            await waitFor(() => userEvent.click(selectedConfigurationButton()));

            // delete the selected config
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "api.dashboard.modalConfig.form.button.delete",
                    })
                )
            );
            await waitFor(() => {
                userEvent.click(screen.getByLabelText("delete-config-yes"));
            });

            // ensure delete alert is called
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modalConfig.form.success.delete"
                );
            });

            // Check that the new config still exists
            expect(
                screen.getByRole("button", {
                    name: "api.dashboard.modalConfig.form.placeholder.new",
                })
            ).toBeInTheDocument();
        });

        it("should have the Update button disabled initially", async () => {
            // Check that the button is disabled
            expect(
                screen.getByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.update",
                })
            ).toBeDisabled();
        });

        it("should have the Update button enabled after user make edits the form", async () => {
            // Make a small edit to one of the form fields. We take the name field.
            const nameInputField = screen.getByLabelText(
                "api.dashboard.modalConfig.form.input.name"
            );
            await waitFor(() => {
                userEvent.type(nameInputField, "nameTest");
            });

            // Check that the button is now enabled
            expect(
                screen.getByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.update",
                })
            ).toBeEnabled();
        });

        it("should have the Update button disabled after user submitted the changes", async () => {
            // Continue editing and save it
            await waitFor(() => {
                enterFormFieldsAndSubmit(AuthType.OAUTH2, "nameTest");
            });

            // Check that the button is now disabled
            await waitFor(() => {
                expect(
                    screen.getByRole("button", {
                        name: "api.dashboard.modalConfig.form.button.update",
                    })
                ).toBeDisabled();
            });
        });
    });

    describe("With configurations loaded, without selected configuration", () => {
        beforeEach(async () => {
            // Reset all function call to 0
            mockUpdateApiConfig = jest.fn();
            mockAddApiConfig = jest.fn();
            mockDeleteApiConfig = jest.fn();
            await act(async () => {
                useStore.setState({
                    api: [
                        {
                            uuid: "id-endpoint-1",
                            name: "endpoint-1",
                            title: "endpoint-1",
                            data: {},
                            order: 0,
                        },
                    ],
                    folder: [],
                    selectedApiUuid: "id-endpoint-1",
                    configuration: mockConfiguration,
                    database: mockDatabase,
                    databaseTable: mockDatabaseTable,
                    updateConfiguration: mockUpdateApiConfig,
                    addNewConfiguration: mockAddApiConfig,
                    deleteConfiguration: mockDeleteApiConfig,
                });

                render(
                    <MemoryRouter>
                        <EditConfiguration show handleClose={mockHandleClose} />
                        <ToastContainer />
                    </MemoryRouter>
                );
            });
        });

        it("should have a Modal title", () => {
            // Ensure provided title exists within modal header
            expect(screen.getByLabelText("modal-header")).toHaveTextContent(
                "api.dashboard.modalConfig.title"
            );
        });

        it("should display all Api Configuration that exists in global state", async () => {
            mockConfiguration.forEach(({ type, name }) => {
                if (type === ConfigurationType.API) {
                    // Ensure all configuration with the type of API is present
                    expect(
                        screen.getByRole("button", { name })
                    ).toBeInTheDocument();
                } else {
                    // Ensure all other configuration which is not the type of API, is absent
                    expect(
                        screen.queryByRole("button", { name })
                    ).not.toBeInTheDocument();
                }
            });
        });

        describe("Before clicking any configuration", () => {
            it("should not have a Select Button", () => {
                expect(
                    screen.queryByRole("button", {
                        name: "api.dashboard.modalConfig.form.button.select",
                    })
                ).not.toBeInTheDocument();
            });

            it("should not have a Delete Button", () => {
                expect(
                    screen.queryByRole("button", {
                        name: "api.dashboard.modalConfig.form.button.delete",
                    })
                ).not.toBeInTheDocument();
            });

            it("should not have an Update Button", () => {
                expect(
                    screen.queryByRole("button", {
                        name: "api.dashboard.modalConfig.form.button.update",
                    })
                ).not.toBeInTheDocument();
            });
        });

        it("should display matching result after typing in searched name", async () => {
            // Type in "1" in search field
            await waitFor(() =>
                userEvent.type(
                    screen.getByPlaceholderText(
                        `api.dashboard.modalConfig.form.placeholder.search`
                    ),
                    "1"
                )
            );
            await waitFor(() => {
                // Config 1 should be in the document because it contains "1"
                expect(
                    screen.getByRole("button", {
                        name: /Config 1/i,
                    })
                ).toBeInTheDocument();

                // Config 2 should not be in the document because the name doesn't contain "1"
                expect(
                    screen.queryByRole("button", {
                        name: /Config 2/i,
                    })
                ).not.toBeInTheDocument();
            });
        });

        it("should show another create button after creating a new configuration", async () => {
            // Click create button
            await waitFor(() =>
                userEvent.click(screen.getByLabelText("button-create"))
            );
            // Another create button to submit the form should exist
            expect(
                screen.getByLabelText("button-create-add")
            ).toBeInTheDocument();
        });

        it("should hide the select button if a new configuration is focused", async () => {
            // after clicking create button it should automatically focus the new config as well
            await waitFor(() =>
                userEvent.click(screen.getByLabelText("button-create"))
            );
            // Select button should not exist anymore
            expect(
                screen.queryByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.select",
                })
            ).not.toBeInTheDocument();
        });

        it("should create form successfully when validation has passed", async () => {
            await waitFor(() =>
                userEvent.click(screen.getByLabelText("button-create"))
            );
            // change input field values
            await waitFor(() =>
                enterFormFieldsAndSubmit(AuthType.OAUTH2, "nameTest")
            );

            // ensure alert is there with right message
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddApiConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should reset the form if previously created config is deleted before saving", async () => {
            await waitFor(() =>
                userEvent.click(screen.getByLabelText("button-create"))
            );

            // input all the fields without submitting
            await waitFor(() =>
                enterFormFieldsAndSubmit(AuthType.OAUTH2, "nameTest", true)
            );

            // select the previously created config
            await waitFor(() => userEvent.click(selectedConfigurationButton()));

            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "api.dashboard.modalConfig.form.button.delete",
                    })
                )
            );

            await waitFor(() => {
                userEvent.click(screen.getByLabelText("delete-config-yes"));
            });

            // ensure delete alert is called
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modalConfig.form.success.delete"
                );
            });

            // Click create again
            await waitFor(() =>
                userEvent.click(screen.getByLabelText("button-create"))
            );

            // Check that the form has been reset
            const nameInputField = screen.getByLabelText(
                "api.dashboard.modalConfig.form.input.name"
            );
            // Check name value
            expect(nameInputField).toHaveValue("");

            // Select authType
            await waitFor(() => {
                expect(
                    screen.getByLabelText(
                        "api.dashboard.modalConfig.form.input.authType"
                    )
                ).toHaveValue("");
            });

            // Select authType
            await waitFor(() => {
                userEvent.selectOptions(
                    screen.getByLabelText(
                        "api.dashboard.modalConfig.form.input.authType"
                    ),
                    AuthType.OAUTH2
                );
            });

            // Check the rest of the data value
            ["dbConnection", "tableReference", "username", "password"].forEach(
                (key) => {
                    const dropdownInputField = screen.getByLabelText(
                        `text-${key}`
                    );
                    expect(dropdownInputField).toHaveValue("");
                }
            );
        });

        it("should update form successfully when validation has passed", async () => {
            await waitFor(() => userEvent.click(selectedConfigurationButton()));

            await waitFor(() =>
                // change input field values
                enterFormFieldsAndSubmit(AuthType.OAUTH2, "Config1")
            );

            // ensure alert is there with right message
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modalConfig.form.success.update"
                );
                // updateConfiguration should be called once
                expect(mockUpdateApiConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should select a configuration successfully", async () => {
            // Click on a configuration
            await waitFor(() => userEvent.click(selectedConfigurationButton()));

            // Click the select button
            await waitFor(() => {
                userEvent.click(
                    screen.getByRole("button", {
                        name: "api.dashboard.modalConfig.form.button.select",
                    })
                );
            });

            // a "Select" text should appear within the selected config button
            await waitFor(() => {
                expect(selectedConfigurationButton()).toHaveTextContent(
                    "api.dashboard.modalConfig.selectedLabel"
                );
            });
        });

        describe("should fail to submit if", () => {
            beforeEach(() => {
                waitFor(() => userEvent.click(selectedConfigurationButton()));
            });

            it("config name is empty", async () => {
                // input data
                await waitFor(() => enterFormFieldsAndSubmit(AuthType.OAUTH2));

                // ensure a require message will show
                await waitFor(() => {
                    expect(screen.getByRole("alert")).toHaveTextContent(
                        "api.dashboard.modalConfig.form.error.required.name"
                    );
                    // updateConfiguration should not be called at all
                    expect(mockUpdateApiConfig).toHaveBeenCalledTimes(0);
                });
            });

            it("config name has special characters", async () => {
                const mockName = "Config 1@";

                // input data
                await waitFor(() =>
                    enterFormFieldsAndSubmit(AuthType.OAUTH2, mockName)
                );

                // ensure a require message will show
                await waitFor(() => {
                    expect(screen.getByRole("alert")).toHaveTextContent(
                        "common.error.specialCharactersDetectedSpecific"
                    );

                    // updateConfiguration should not be called at all
                    expect(mockUpdateApiConfig).toHaveBeenCalledTimes(0);
                });
            });

            it("config's action name already exist", async () => {
                await waitFor(() =>
                    userEvent.click(screen.getByLabelText("button-create"))
                );
                // input data
                await waitFor(() =>
                    enterFormFieldsAndSubmit(AuthType.OAUTH2, "Config 1")
                );

                // ensure an error will show
                await waitFor(() => {
                    expect(screen.getByRole("alert")).toHaveTextContent(
                        "common.error.nameExist"
                    );
                    // updateConfiguration should not be called at all
                    expect(mockUpdateApiConfig).toHaveBeenCalledTimes(0);
                });
            });
        });

        it("should delete succesfully", async () => {
            await waitFor(() => userEvent.click(selectedConfigurationButton()));

            userEvent.click(
                screen.getByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.delete",
                })
            );

            await waitFor(() => {
                userEvent.click(screen.getByLabelText("delete-config-yes"));
            });

            // ensure alert is there with right message
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modalConfig.form.success.delete"
                );
                // deleteConfiguration should be called once
                expect(mockDeleteApiConfig).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("With empty configurations", () => {
        beforeEach(async () => {
            // Reset all function call to 0
            mockUpdateApiConfig = jest.fn();
            mockAddApiConfig = jest.fn();
            mockDeleteApiConfig = jest.fn();
            act(() => {
                useStore.setState({
                    api: [
                        {
                            uuid: "id-endpoint-1",
                            name: "endpoint-1",
                            title: "endpoint-1",
                            data: {},
                            order: 0,
                        },
                    ],
                    folder: [],
                    selectedApiUuid: "id-endpoint-1",
                    configuration: [],
                    database: [],
                    databaseTable: [],
                    updateConfiguration: mockUpdateApiConfig,
                    addNewConfiguration: mockAddApiConfig,
                    deleteConfiguration: mockDeleteApiConfig,
                });
            });
            await act(async () => {
                useStore.setState({
                    api: [
                        {
                            uuid: "id-endpoint-1",
                            name: "endpoint-1",
                            title: "endpoint-1",
                            data: {},
                            order: 0,
                        },
                    ],
                    folder: [],
                    selectedApiUuid: "id-endpoint-1",
                    configuration: [],
                    updateConfiguration: mockUpdateApiConfig,
                    addNewConfiguration: mockAddApiConfig,
                    deleteConfiguration: mockDeleteApiConfig,
                });

                render(
                    <MemoryRouter>
                        <EditConfiguration show handleClose={mockHandleClose} />
                        <ToastContainer />
                    </MemoryRouter>
                );
            });
        });

        it("should have a Modal title", () => {
            // Ensure provided title exists within modal header
            expect(screen.getByLabelText("modal-header")).toHaveTextContent(
                "api.dashboard.modalConfig.title"
            );
        });

        it("should display a New Configuration button in configuration list", async () => {
            expect(
                screen.queryByRole("button", {
                    name: "api.dashboard.modalConfig.form.placeholder.new",
                })
            ).toBeInTheDocument();
        });

        it("should not have a Select or Selected Button", () => {
            expect(
                screen.queryByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.select",
                })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.selected",
                })
            ).not.toBeInTheDocument();
        });

        it("should have a Cancel button", () => {
            expect(
                screen.queryByRole("button", {
                    name: "api.dashboard.modalConfig.form.button.cancel",
                })
            ).toBeInTheDocument();
        });

        it("should have a Create button", () => {
            expect(
                screen.queryByLabelText("button-create-add")
            ).toBeInTheDocument();
        });

        it("should contain a Name field", () => {
            expect(
                screen.queryByPlaceholderText(
                    "api.dashboard.modalConfig.form.placeholder.name"
                )
            ).toBeInTheDocument();
        });

        it("should contain an Auth Type dropdown field", () => {
            expect(
                screen.queryByLabelText(
                    "api.dashboard.modalConfig.form.input.authType"
                )
            ).toBeInTheDocument();
        });

        it("should not contain a DB Connection field", () => {
            expect(
                screen.queryByPlaceholderText(
                    "api.dashboard.modalConfig.form.input.dbConnection"
                )
            ).not.toBeInTheDocument();
        });

        describe("after selecting an Auth Type (Basic Auth)", () => {
            beforeEach(async () => {
                await waitFor(() => {
                    userEvent.selectOptions(
                        screen.getByLabelText(
                            "api.dashboard.modalConfig.form.input.authType"
                        ),
                        AuthType.BASIC_AUTH
                    );
                });
            });

            it("should contain all field", () => {
                [
                    "dbConnection",
                    "tableReference",
                    "username",
                    "password",
                ].forEach((key) => {
                    expect(
                        screen.queryByLabelText(`text-${key}`)
                    ).toBeInTheDocument();
                });
            });
        });

        describe("after selecting an Auth Type (OAuth2)", () => {
            beforeEach(async () => {
                await waitFor(() => {
                    userEvent.selectOptions(
                        screen.getByLabelText(
                            "api.dashboard.modalConfig.form.input.authType"
                        ),
                        AuthType.OAUTH2
                    );
                });
            });

            it("should contain all fields", () => {
                [
                    "dbConnection",
                    "tableReference",
                    "username",
                    "password",
                ].forEach((key) => {
                    expect(
                        screen.getByLabelText(`text-${key}`)
                    ).toBeInTheDocument();
                });
            });
        });
    });
});
