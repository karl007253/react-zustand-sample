import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { act } from "react-dom/test-utils";
import { ConfigurationType } from "../../../../common/zustand/interface/ConfigurationInterface";
import EditConfiguration from "./EditConfiguration";
import useStore from "../../../../common/zustand/Store";

interface configScenarios {
    scenario: number;
    name: string;
    data: {
        input: {
            name: string;
            type: string;
            newValue: string;
        }[];
    };
}
// Prepare mock data
const mockConfiguration = [
    {
        uuid: "Hourly",
        type: ConfigurationType.SCHEDULER,
        name: "Hourly",
        title: "Hourly",
        data: {
            minute: "0",
            hour: "*",
            dayMonth: "*",
            month: "*",
            dayWeek: "*",
        },
        order: 0,
    },
    {
        uuid: "Config 2",
        type: ConfigurationType.API,
        name: "Config 2",
        title: "Config 2",
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

// Data test scenarios for each sheduler type: daily - yearly
const inputForm = [
    {
        scenario: 1,
        name: "hourly",
        data: {
            input: [
                {
                    name: "everyhours",
                    type: "combobox",
                    newValue: "2",
                },
            ],
        },
    },
    {
        scenario: 2,
        name: "hourly",
        data: {
            input: [
                {
                    name: "everyhours",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "startshours",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "startsminutes",
                    type: "combobox",
                    newValue: "10",
                },
            ],
        },
    },
    {
        scenario: 3,
        name: "daily",
        data: {
            input: [
                {
                    name: "opteveryday",
                    type: "radio",
                    newValue: "true",
                },
            ],
        },
    },
    {
        scenario: 4,
        name: "daily",
        data: {
            input: [
                {
                    name: "opteveryweekday",
                    type: "radio",
                    newValue: "true",
                },
            ],
        },
    },
    {
        scenario: 5,
        name: "daily",
        data: {
            input: [
                {
                    name: "opteveryweekend",
                    type: "radio",
                    newValue: "true",
                },
            ],
        },
    },
    {
        scenario: 6,
        name: "daily",
        data: {
            input: [
                {
                    name: "opteveryday",
                    type: "radio",
                    newValue: "true",
                },
                {
                    name: "dailystartshour",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "dailystartsminute",
                    type: "combobox",
                    newValue: "10",
                },
            ],
        },
    },
    {
        scenario: 7,
        name: "weekly",
        data: {
            input: [
                {
                    name: "optweeklydays[1]",
                    type: "radio",
                    newValue: "true",
                },
                {
                    name: "optweeklydays[2]",
                    type: "radio",
                    newValue: "true",
                },
            ],
        },
    },
    {
        scenario: 8,
        name: "weekly",
        data: {
            input: [
                {
                    name: "optweeklydays[1]",
                    type: "radio",
                    newValue: "true",
                },
                {
                    name: "optweeklydays[2]",
                    type: "radio",
                    newValue: "true",
                },
                {
                    name: "weeklystartshours",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "weeklystartsminute",
                    type: "combobox",
                    newValue: "10",
                },
                {
                    name: "weeklystartsampm",
                    type: "combobox",
                    newValue: "pm",
                },
            ],
        },
    },
    {
        scenario: 9,
        name: "monthly",
        data: {
            input: [
                {
                    name: "optmonthlyday",
                    type: "radio",
                    newValue: "true",
                },
                {
                    name: "monthlyeveryday",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "monthlyeverymonth",
                    type: "combobox",
                    newValue: "2",
                },
            ],
        },
    },
    {
        scenario: 10,
        name: "monthly",
        data: {
            input: [
                {
                    name: "optmonthlyweek",
                    type: "radio",
                    newValue: "true",
                },
                {
                    name: "monthlyquarter",
                    type: "combobox",
                    newValue: "second",
                },
                {
                    name: "monthlyquarterday",
                    type: "combobox",
                    newValue: "2", // 2 for tuesday
                },
                {
                    name: "monthlyquartermonth",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "monthlystartsathour",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "monthlystartsatminute",
                    type: "combobox",
                    newValue: "10",
                },
                {
                    name: "monthlystartsatampm",
                    type: "combobox",
                    newValue: "pm",
                },
            ],
        },
    },
    {
        scenario: 11,
        name: "yearly",
        data: {
            input: [
                {
                    name: "optyearlymonth",
                    type: "radio",
                    newValue: "true",
                },
                {
                    name: "yearlyeveryday",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "yearlyeverymonth",
                    type: "combobox",
                    newValue: "2",
                },
            ],
        },
    },
    {
        scenario: 12,
        name: "yearly",
        data: {
            input: [
                {
                    name: "optyearlyweek",
                    type: "radio",
                    newValue: "true",
                },
                {
                    name: "yearlyquarter",
                    type: "combobox",
                    newValue: "second",
                },
                {
                    name: "yearlyquarterday",
                    type: "combobox",
                    newValue: "2", // 2 for tuesday
                },
                {
                    name: "yearlyquartermonth",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "yearlystartsathour",
                    type: "combobox",
                    newValue: "2",
                },
                {
                    name: "yearlystartsatminute",
                    type: "combobox",
                    newValue: "10",
                },
                {
                    name: "yearlystartsatampm",
                    type: "combobox",
                    newValue: "pm",
                },
            ],
        },
    },
];

// submit button
const submitButton = () => {
    return screen.getByRole("button", {
        name: "scheduler.dashboard.modalConfig.form.button.update",
    });
};

// to get configuration button on the configuration list
const selectedConfigurationButton = () => {
    return screen.getByRole("button", {
        name: /Hourly/i,
    });
};

// submit form based on the inputForm object
const enterFormFieldsAndSubmit = async (
    scType?: string,
    scenarioNumber?: number,
    skipSubmit?: boolean
) => {
    if (scType) {
        // filtering the inputform object data by schedule type and number
        const filteredInputForm: configScenarios[] = inputForm.filter(
            (conf) => {
                return conf.name === scType && conf.scenario === scenarioNumber;
            }
        );

        // submit the filtered object data
        filteredInputForm.forEach((valScType, indexScType) => {
            // trigger type event to name input
            const nameInputField = screen.getByLabelText(
                "scheduler.dashboard.modalConfig.form.input.name"
            );

            userEvent.clear(nameInputField);
            if (scType) {
                userEvent.type(
                    nameInputField,
                    valScType.name.concat(String(valScType.scenario))
                );
            }

            filteredInputForm[indexScType].data.input.forEach(
                async (dataScType) => {
                    // Click the radio and dropdown buttons
                    if (dataScType.type === "combobox") {
                        // Select an option
                        await waitFor(() => {
                            userEvent.selectOptions(
                                screen.getByRole("combobox", {
                                    name: `${dataScType.name}`,
                                }),
                                dataScType.newValue
                            );
                        });
                        // Ensure the value has changed based from the input
                        expect(
                            screen.getByRole("combobox", {
                                name: `${dataScType.name}`,
                            })
                        ).toHaveValue(dataScType.newValue);
                    } else if (dataScType.type === "radio") {
                        await waitFor(() => {
                            userEvent.click(
                                screen.getByLabelText(dataScType.name)
                            );
                        });
                        const valRadio = screen.getByRole("radio", {
                            name: `${dataScType.name}`,
                        });
                        expect(valRadio).toBeChecked();
                    }
                }
            );
            if (!skipSubmit) {
                userEvent.click(submitButton());
            }
        });
    }
};

describe("Component: Modal - EditConfiguration", () => {
    // mock handle close
    const mockHandleClose = jest.fn();
    let mockUpdateSchedulerConfig: jest.Mock;
    let mockAddSchedulerConfig: jest.Mock;
    let mockDeleteSchedulerConfig: jest.Mock;

    // Needed to fix the exceeded timeout of 5000ms for a test
    jest.setTimeout(20000);

    describe("Without selected configuration", () => {
        beforeEach(async () => {
            // Reset all function call to 0
            mockUpdateSchedulerConfig = jest.fn();
            mockAddSchedulerConfig = jest.fn();
            mockDeleteSchedulerConfig = jest.fn();
            act(() => {
                useStore.setState({
                    scheduler: [
                        {
                            uuid: "SCHEDULER-1",
                            id: 1,
                            name: "user",
                            order: 1,
                            title: "user",
                            folder_uuid: "FOLDER-2",
                            folder_id: 1,
                        },
                    ],
                    selectedSchedulerUuid: "SCHEDULER-1",
                    folder: [],
                    configuration: mockConfiguration,
                    updateConfiguration: mockUpdateSchedulerConfig,
                    addNewConfiguration: mockAddSchedulerConfig,
                    deleteConfiguration: mockDeleteSchedulerConfig,
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
            // checking the modal title name
            expect(screen.getByLabelText("modal-header")).toHaveTextContent(
                "scheduler.dashboard.modalConfig.title"
            );
        });

        it("should display all Scheduler Configuration that exists in global state", async () => {
            mockConfiguration.forEach(({ type, name }) => {
                if (type === ConfigurationType.SCHEDULER) {
                    // Checking type of Scheduler Configurations
                    expect(
                        screen.getByRole("button", { name })
                    ).toBeInTheDocument();
                } else {
                    // Checking other type of Configuration
                    expect(
                        screen.queryByRole("button", { name })
                    ).not.toBeInTheDocument();
                }
            });
        });

        it("should have a Create Button", () => {
            expect(
                screen.getByRole("button", {
                    name: "scheduler.dashboard.modalConfig.form.button.create",
                })
            ).toBeInTheDocument();
        });

        it("should display matching result after typing in searched name", async () => {
            // Type in "H" in search field to find the Hourly configuration
            await waitFor(() =>
                userEvent.type(
                    screen.getByPlaceholderText(
                        `scheduler.dashboard.modalConfig.form.placeholder.search`
                    ),
                    "H"
                )
            );
            await waitFor(() => {
                // Hourly should be in the document after the letter "H" typed in the search input
                expect(
                    screen.getByRole("button", {
                        name: /Hourly/i,
                    })
                ).toBeInTheDocument();
            });
        });

        it("should showing the update and delete buttons, and hiding select button after creating a new configuration", async () => {
            // Click create button
            await waitFor(() => {
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                );
            });
            // Create button should not exist and showing the update and delete buttons
            await waitFor(() => {
                expect(
                    screen.queryByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.update",
                    })
                ).toBeInTheDocument();
            });
            // Select button should not exist when new configuration selected after newly created
            await waitFor(() => {
                expect(
                    screen.queryByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.select",
                    })
                ).not.toBeInTheDocument();
            });
        });

        it("should create form successfully after scenario 1 hourly scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 1 hourly every 2 hours ( 0 2 * * * )
            await waitFor(() => enterFormFieldsAndSubmit("hourly", 1));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 2 hourly scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 2 hourly starts at 02:10 am every 1 hour ( 10 2/1 * * * )
            await waitFor(() => enterFormFieldsAndSubmit("hourly", 2));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 3 daily scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 3 daily for everyday ( 0 0 * * * )
            await waitFor(() => enterFormFieldsAndSubmit("daily", 3));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 4 daily scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 4 daily for everyweekday ( 0 0 * * 1-5 )
            await waitFor(() => enterFormFieldsAndSubmit("daily", 4));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 5 daily scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 5 daily for everyweekend ( 0 0 * * 6,0 )
            await waitFor(() => enterFormFieldsAndSubmit("daily", 5));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 6 daily at 02:10 am scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 6 daily for everyweekday ( 10 2 * * * )
            await waitFor(() => enterFormFieldsAndSubmit("daily", 6));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 7 weekly on monday and tuesday scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 7 weekly for everyweekday ( 0 0 * * 1,2 )
            await waitFor(() => enterFormFieldsAndSubmit("weekly", 7));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 8 weekly on monday and tuesday at 02.10 pm scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 8 weekly for everyweekday ( 10 14 * * 1,2 )
            await waitFor(() => enterFormFieldsAndSubmit("weekly", 8));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 9 monthly day 2 of every two months scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 9 monthly for everyweekday ( 0 0 2 */2 * )
            await waitFor(() => enterFormFieldsAndSubmit("monthly", 9));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 10 second weeks of the month, and on Tuesday, every 2 months scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 10 monthly for everyweekday ( 10 14 8-14 */2 2 )
            await waitFor(() => enterFormFieldsAndSubmit("monthly", 10));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 11 Yearly At 00:00, on day 1 of the month, only in February scheduler added", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 11 yearly for everyweekday ( 0 0 1 2 * )
            await waitFor(() => enterFormFieldsAndSubmit("yearly", 11));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should create form successfully after scenario 12 Yearly At 14:10, second weeks of the month, and on Tuesday, only in February", async () => {
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                )
            );
            // Create scenario 12 yearly for everyweekday ( 10 14 8-14 2 2 )
            await waitFor(() => enterFormFieldsAndSubmit("yearly", 12));
            // showing success alert after form submitted
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.update"
                );
                // addConfiguration should be called once
                expect(mockAddSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("should select a configuration successfully", async () => {
            // Click on a configuration
            await waitFor(() => userEvent.click(selectedConfigurationButton()));

            // Click the select button
            await waitFor(() =>
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.select",
                    })
                )
            );

            // a "Select" text should appear within the selected config button
            await waitFor(() => {
                expect(selectedConfigurationButton()).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.selectedLabel"
                );
            });
        });

        describe("should fail to submit if", () => {
            beforeEach(() => {
                waitFor(() => userEvent.click(selectedConfigurationButton()));
            });

            it("config name is empty", async () => {
                // input data
                // await act(() => enterFormFieldsAndSubmit());
                const nameInputField = screen.getByLabelText(
                    "scheduler.dashboard.modalConfig.form.input.name"
                );

                userEvent.clear(nameInputField);
                userEvent.type(nameInputField, "{tab}");
                userEvent.click(submitButton());

                // ensure a require message will show
                await waitFor(() => {
                    expect(screen.getByRole("alert")).toHaveTextContent(
                        "scheduler.dashboard.modalConfig.form.error.required.name"
                    );
                    // updateConfiguration should not be called at all
                    expect(mockUpdateSchedulerConfig).toHaveBeenCalledTimes(0);
                });
            });

            it("config's action name already exist", async () => {
                await waitFor(() =>
                    userEvent.click(
                        screen.getByRole("button", {
                            name: "scheduler.dashboard.modalConfig.form.button.create",
                        })
                    )
                );

                const nameInputField = screen.getByLabelText(
                    "scheduler.dashboard.modalConfig.form.input.name"
                );
                userEvent.clear(nameInputField);
                userEvent.type(nameInputField, "Hourly");
                userEvent.click(submitButton());

                // ensure an error will show
                await waitFor(() => {
                    expect(screen.getByRole("alert")).toHaveTextContent(
                        "common.error.nameExist"
                    );
                });
                // updateConfiguration should not be called at all
                expect(mockUpdateSchedulerConfig).toHaveBeenCalledTimes(0);
            });
        });

        it("should delete succesfully", async () => {
            // Click on a configuration
            await waitFor(() => userEvent.click(selectedConfigurationButton()));

            // delete the selected config
            await waitFor(() => {
                userEvent.click(screen.getByLabelText("delete-config"));
            });

            // click the delete confirmation button
            await waitFor(() => {
                userEvent.click(screen.getByLabelText("delete-config-yes"));
            });

            // ensure alert is there with right message
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.delete"
                );
                // deleteConfiguration should be called once
                expect(mockDeleteSchedulerConfig).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("With selected configuration", () => {
        beforeEach(async () => {
            // Reset all function call to 0
            mockUpdateSchedulerConfig = jest.fn();
            mockAddSchedulerConfig = jest.fn();
            mockDeleteSchedulerConfig = jest.fn();
            act(() => {
                useStore.setState({
                    scheduler: [
                        {
                            uuid: "SCHEDULER-1",
                            name: "user",
                            title: "user",
                            configuration_uuid: mockConfiguration[0].uuid,
                            data: {},
                            order: 1,
                        },
                    ],
                    selectedSchedulerUuid: "SCHEDULER-1",
                    folder: [],
                    configuration: mockConfiguration,
                    selectedSchedulerFolderUuid: null,
                    updateConfiguration: mockUpdateSchedulerConfig,
                    addNewConfiguration: mockAddSchedulerConfig,
                    deleteConfiguration: mockDeleteSchedulerConfig,
                });
                render(
                    <MemoryRouter>
                        <EditConfiguration show handleClose={mockHandleClose} />
                        <ToastContainer />
                    </MemoryRouter>
                );
            });
        });

        it("should have the data of Selected Configuration", () => {
            const nameInputField = screen.getByLabelText(
                "scheduler.dashboard.modalConfig.form.input.name"
            );
            expect(nameInputField).toHaveValue("Hourly");
        });

        it("should still keep an unsaved created config even if another existing config is deleted", async () => {
            // create a new config
            await waitFor(() => {
                userEvent.click(
                    screen.getByRole("button", {
                        name: "scheduler.dashboard.modalConfig.form.button.create",
                    })
                );
            });

            // Highlight an existing configuration
            await waitFor(() => {
                userEvent.click(selectedConfigurationButton());
            });

            // delete the selected config
            await waitFor(() => {
                userEvent.click(screen.getByLabelText("delete-config"));
            });

            // click the delete confirmation button
            await waitFor(() => {
                userEvent.click(screen.getByLabelText("delete-config-yes"));
            });

            // ensure delete alert is called
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modalConfig.form.success.delete"
                );
            });

            // Check that the new config still exists
            expect(
                screen.getByRole("button", {
                    name: "scheduler.dashboard.modalConfig.form.placeholder.new",
                })
            ).toBeInTheDocument();
        });
    });
});
