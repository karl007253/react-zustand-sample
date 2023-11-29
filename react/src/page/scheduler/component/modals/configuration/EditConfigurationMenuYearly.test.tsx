import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditConfigurationMenuYearly from "./EditConfigurationMenuYearly";

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

// Data test scenarios for each sheduler type: yearly
const inputForm = [
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

// submit form based on the inputForm object
const enterFormFieldsAndSubmit = async (
    scType?: string,
    scenarioNumber?: number
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
                        ).toBeInTheDocument();
                    } else if (dataScType.type === "radio") {
                        await waitFor(() => {
                            userEvent.click(
                                screen.getByLabelText(dataScType.name)
                            );
                        });
                        const valRadio = screen.getByRole("radio", {
                            name: `${dataScType.name}`,
                        });
                        expect(valRadio).toBeInTheDocument();
                    }
                }
            );
        });
    }
};

describe("Component: Modal Form - EditConfigurationMenuYearly", () => {
    const mockHandleChange = jest.fn();

    beforeEach(() => {
        render(
            <EditConfigurationMenuYearly
                handleChange={mockHandleChange}
                optYearlyMonth
                optYearlyWeek={false}
                yearlyStartsAtHour="1"
                yearlyStartsAtMinute="10"
                yearlyStartsAtAmPm="am"
                yearlyEveryDay="1"
                yearlyEveryMonth="1"
                yearlyQuarter="first"
                yearlyQuarterDay="1"
                yearlyQuarterMonth="1"
            />
        );
    });

    it("should create form successfully after scenario 12 yearly scheduler added", async () => {
        // checking components form inputs
        await waitFor(() => enterFormFieldsAndSubmit("yearly", 12));
    });
});
