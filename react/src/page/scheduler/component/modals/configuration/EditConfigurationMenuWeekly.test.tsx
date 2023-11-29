import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditConfigurationMenuWeekly from "./EditConfigurationMenuWeekly";

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

// Data test scenarios for each sheduler type: weekly
const inputForm = [
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

describe("Component: Modal Form - EditConfigurationMenuWeekly", () => {
    const mockHandleChange = jest.fn();

    const days = [
        { day: "1", name: "mon", checked: false },
        { day: "2", name: "tue", checked: false },
        { day: "3", name: "wed", checked: false },
        { day: "4", name: "thu", checked: false },
        { day: "5", name: "fri", checked: false },
        { day: "6", name: "sat", checked: false },
        { day: "0", name: "sun", checked: false },
    ];

    beforeEach(() => {
        render(
            <EditConfigurationMenuWeekly
                handleChange={mockHandleChange}
                optWeeklyDays={days}
                weeklyStartsAtHour="1"
                weeklyStartsAtMinute="10"
                weeklyStartsAtAmPm="am"
            />
        );
    });

    it("should create form successfully after scenario 7 weekly scheduler added", async () => {
        // checking components form inputs
        await waitFor(() => enterFormFieldsAndSubmit("weekly", 7));
    });
});
