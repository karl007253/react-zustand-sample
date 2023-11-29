import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DatabaseConfiguration from "./DatabaseConfiguration";
import useStore from "../../../../common/zustand/Store";
import { DATABASE_PARENT } from "../../../../common/data/Constant";
import {
    Configuration,
    ConfigurationType,
    DatabaseConfigurationData,
} from "../../../../common/zustand/interface/ConfigurationInterface";
import {
    Database,
    DatabaseData,
    Encoding,
    Engine,
} from "../../../../common/zustand/interface/DatabaseInterface";

const submitButton = () => {
    return screen.getByRole("button", { name: "common.button.update" });
};

const comboBox = (field: string) => {
    return screen.getByRole("combobox", {
        name: `database.dashboard.modal.configuration.form.label.${field}`,
    });
};

const textField = (field: string) => {
    return screen.getByRole("textbox", {
        name: `database.dashboard.modal.configuration.form.label.${field}`,
    });
};

// Some mock data for configuration, database etc.
const mockConfiguration = {
    host: "mock-host",
    port: "3306",
    username: "mock-username",
    password: "mock-password",
    encoding: Encoding.UTF8,
    engine: Engine.INNODB,
};
const mockConfiguration2 = {
    host: "mock-host-2",
    port: "3307",
    username: "mock-username-2",
    password: "mock-password-2",
    encoding: Encoding.UTF8,
    engine: Engine.INNODB,
};
const mockRootConfigurationData: Configuration = {
    uuid: "CONFIGURATION-mock-uuid",
    title: "mock-title",
    name: "mock-name",
    type: ConfigurationType.DATABASE,
    data: mockConfiguration as DatabaseConfigurationData,
    order: 1,
};
const mockChildrenDatabaseData: Database = {
    uuid: "DATABASE-mock-uuid",
    name: "mock-name",
    title: "mock-title",
    data: mockConfiguration as DatabaseData,
    order: 1,
};
const currentDatabaseUuid = mockChildrenDatabaseData.uuid;

// List of keys of data to test, corresponding to how many fields the configuration require
const textBoxToTest: (keyof DatabaseConfigurationData)[] = [
    "host",
    "port",
    "username",
    "password",
];
const comboBoxToTest: (keyof DatabaseConfigurationData)[] = [
    "engine",
    "encoding",
];

const expectFormFilledWith = (configuration: DatabaseConfigurationData) => {
    // Iterate over available text boxes
    textBoxToTest.forEach((field) => {
        // Ensure their value are the same as the mock data
        expect(textField(field)).toHaveValue(configuration[field]);
    });

    // Iterate over available check boxes
    comboBoxToTest.forEach((field) => {
        // Ensure their value are the same as the mock data
        expect(comboBox(field)).toHaveValue(configuration[field]);
    });
};

const fillFormAndSubmit = (configuration: DatabaseConfigurationData) => {
    textBoxToTest.forEach((field) => {
        userEvent.clear(textField(field));
        if (configuration[field]) {
            userEvent.type(
                textField(field),
                configuration[field]?.toString() ?? ""
            );
        }
    });
    comboBoxToTest.forEach((field) => {
        const targetOption = configuration[field];
        if (targetOption) {
            userEvent.selectOptions(comboBox(field), targetOption);
        }
    });

    userEvent.click(submitButton());
};

describe("Component: Modal - DatabaseConfiguration", () => {
    const mockHandleClose = jest.fn();

    beforeEach(() => {
        render(
            <MemoryRouter>
                <DatabaseConfiguration show handleClose={mockHandleClose} />
                <ToastContainer />
            </MemoryRouter>
        );
    });

    describe("General", () => {
        it("should have a Modal title", () => {
            expect(
                screen.getByText("database.dashboard.modal.configuration.title")
            ).toBeInTheDocument();
        });

        it("should have a cancel button that triggers handleClose ", () => {
            userEvent.click(
                screen.getByRole("button", { name: "common.button.cancel" })
            );
            expect(mockHandleClose).toBeCalledTimes(1);
        });

        it("should be able to see the engine combobox options and select one", async () => {
            expect(comboBox("engine")).toBeInTheDocument();

            userEvent.selectOptions(comboBox("engine"), "InnoDB");

            expect(comboBox("engine")).toHaveValue("InnoDB");
        });

        it("should be able to see the encoding combobox options and select one", async () => {
            expect(comboBox("encoding")).toBeInTheDocument();

            userEvent.selectOptions(comboBox("encoding"), "utf8");

            expect(comboBox("encoding")).toHaveValue("utf8");
        });

        it("should be able to submit form successfully", async () => {
            userEvent.click(submitButton());

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "database.dashboard.modal.configuration.form.message.success"
                );
            });
        });

        it("should return errors if port is not a number", async () => {
            fillFormAndSubmit({
                ...mockConfiguration,
                port: "abc",
            });

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "database.dashboard.modal.configuration.form.message.error.portNotANumber"
                );
            });
        });
    });

    describe("Root Configuration", () => {
        beforeEach(async () => {
            // Set initial state with prefilled data
            await act(() => {
                useStore.setState({
                    selectedDatabaseUuid: DATABASE_PARENT,
                    selectedDatabaseTableUuid: null,
                    configuration: [mockRootConfigurationData],
                });
            });
        });

        it("should show initial values from currently saved configuration", () => {
            expectFormFilledWith(mockConfiguration);
        });

        it("should add the entered configuration on submit, if no configuration is saved before", async () => {
            // Empty the configuration list state for a while
            await act(() => {
                useStore.setState({
                    configuration: [],
                });
            });

            // Ensure that current configuration is empty
            let state = useStore.getState();
            expect(state.configuration).toHaveLength(0);

            // Fill up the dialog form with mock data
            await act(() => {
                fillFormAndSubmit(mockConfiguration);
            });

            // After submit, ensure that current configuration is the same as entered data
            state = useStore.getState();
            expect(state.configuration).toHaveLength(1);
            expect(state.configuration[0]).toEqual(
                expect.objectContaining({
                    data: mockConfiguration,
                })
            );
        });

        it("should update the entered configuration on submit, if configuration is saved before", async () => {
            // Read currently store UUID;
            let state = useStore.getState();
            const previousUuid = state.configuration[0].uuid;

            // Ensure UUID exists
            expect(previousUuid).toBeDefined();

            // Fill up the dialog form with mock data
            await act(() => {
                fillFormAndSubmit(mockConfiguration2);
            });

            // After submit, ensure that current configuration is the same as entered data
            state = useStore.getState();
            expect(state.configuration).toHaveLength(1);
            expect(state.configuration[0]).toEqual(
                expect.objectContaining({
                    data: mockConfiguration2,
                    // Also ensure UUID is not changing
                    uuid: previousUuid,
                })
            );
        });
    });

    describe("Children Configuration", () => {
        beforeEach(async () => {
            // Set initial state with prefilled data
            await act(() => {
                useStore.setState({
                    configuration: [],
                    selectedDatabaseUuid: mockChildrenDatabaseData.uuid,
                    selectedDatabaseTableUuid: null,
                    database: [mockChildrenDatabaseData],
                });
            });
        });

        it("should show initial values from currently saved configuration", () => {
            expectFormFilledWith(mockConfiguration);
        });

        it("should update the entered configuration on submit", async () => {
            // Fill up the dialog form with mock data
            await act(() => {
                fillFormAndSubmit(mockConfiguration2);
            });

            // After submit, ensure that current configuration is the same as entered data
            const state = useStore.getState();

            const database = state.database.find(
                (d) => d.uuid === currentDatabaseUuid
            );
            expect(state.selectedDatabaseUuid).toEqual(currentDatabaseUuid);
            expect(database).toBeDefined();
            expect(database).toEqual(
                expect.objectContaining({
                    data: mockConfiguration2,
                })
            );
        });

        describe("With prefilled root configuration", () => {
            beforeEach(async () => {
                // Fill the root configuration, empty the child configuration
                await act(() => {
                    useStore.setState({
                        configuration: [mockRootConfigurationData],
                        selectedDatabaseUuid: mockChildrenDatabaseData.uuid,
                        selectedDatabaseTableUuid: null,
                        database: [
                            {
                                ...mockChildrenDatabaseData,
                                data: {},
                            },
                        ],
                    });
                });
            });

            it("should show root configuration in the form initially, if available", async () => {
                // Ensure the form is pre-filled with root configuration data
                expectFormFilledWith(mockConfiguration);
            });

            it("should show field with duplicate data as root configuration is removed", async () => {
                // Fill the form with data similar to root configuration
                await act(() => {
                    fillFormAndSubmit(mockConfiguration);
                });

                const state = useStore.getState();

                // Retrieve saved database data from updated state
                const database = state.database.find(
                    (d) => d.uuid === currentDatabaseUuid
                );
                expect(database?.data).toBeDefined();

                const databaseData = database?.data as DatabaseData;

                // All the fields should be undefined
                Object.keys(databaseData).forEach((field) => {
                    expect(
                        databaseData[field as keyof DatabaseData]
                    ).toBeUndefined();
                });
            });

            it("should restore display value from root configuration if empty value is saved before", async () => {
                const newMockTextEntry = "new-mock-host";

                // Fill some new data to one of the text field.
                await act(() => {
                    fillFormAndSubmit({ host: newMockTextEntry });
                });

                // Ensure the stored value reflected by the UI is the same as the submitted one.
                expect(textField("host")).toHaveValue(newMockTextEntry);

                // Now enter a blank entry.
                await act(() => {
                    fillFormAndSubmit({ host: "" });
                });

                // Ensure the displayed value is taken from the root configuration.
                expect(textField("host")).toHaveValue(
                    (
                        mockRootConfigurationData?.data as DatabaseConfigurationData
                    ).host
                );
            });
        });
    });
});
