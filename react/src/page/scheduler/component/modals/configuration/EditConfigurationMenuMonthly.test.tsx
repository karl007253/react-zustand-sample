import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditConfigurationMenuMonthly from "./EditConfigurationMenuMonthly";

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

// Data test scenarios for each sheduler type: monthly
const inputForm = [
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

describe("Component: Modal Form - EditConfigurationMenuMonthly", () => {
    const mockHandleChange = jest.fn();

    beforeEach(() => {
        render(
            <EditConfigurationMenuMonthly
                handleChange={mockHandleChange}
                optMonthlyDay
                optMonthlyWeek={false}
                monthlyStartsAtHour="01"
                monthlyStartsAtMinute="10"
                monthlyStartsAtAmPm="am"
                monthlyEveryDay="1"
                monthlyEveryMonth="1"
                monthlyQuarter="first"
                monthlyQuarterDay="mon"
                monthlyQuarterMonth="1"
            />
        );
    });

    it("should create form successfully after scenario 9 monthly scheduler added", async () => {
        // checking components form inputs
        await waitFor(() => enterFormFieldsAndSubmit("monthly", 9));
    });
});
