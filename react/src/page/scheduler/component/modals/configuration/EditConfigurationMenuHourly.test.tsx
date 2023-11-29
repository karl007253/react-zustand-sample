import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditConfigurationMenuHourly from "./EditConfigurationMenuHourly";

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

// Data test scenarios for each sheduler type: hourly
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

describe("Component: Modal Form - EditConfigurationMenuHourly", () => {
    const mockHandleChange = jest.fn();

    beforeEach(() => {
        render(
            <EditConfigurationMenuHourly
                handleChange={mockHandleChange}
                hourlyEveryHour="true"
                hourlyStartsAtHour="01"
                hourlyStartsAtMinute="10"
                hourlyStartsAtAmPm="am"
            />
        );
    });

    it("should create form successfully after scenario 1 hourly scheduler added", async () => {
        // checking components form inputs
        await waitFor(() => enterFormFieldsAndSubmit("hourly", 1));
    });
});
