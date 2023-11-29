import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfigurationInput, {
    ConfigurationInputType,
} from "./ConfigurationInput";

describe("Configuration: ConfigurationInput", () => {
    const handleChange = jest.fn();

    afterEach(() => {
        handleChange.mockClear();
    });

    describe("Text Input", () => {
        it("should render a text input", () => {
            const mockLabel = "Text Input";
            const mockValue = "Hello World";

            const { getByLabelText } = render(
                <ConfigurationInput
                    label={mockLabel}
                    value={mockValue}
                    onChange={handleChange}
                />
            );

            const input = getByLabelText(mockLabel) as HTMLInputElement;

            // Ensure values are correct
            expect(input.value).toBe(mockValue);

            // Ensure that the input type is text
            expect(input.type).toBe("text");

            // Type in the input
            userEvent.type(input, mockValue);

            // Ensure that the onChange callback is called the correct number of times
            expect(handleChange).toHaveBeenCalledTimes(mockValue.length);
        });

        it("should render a disabled text input", () => {
            const mockLabel = "Disabled Text Input";
            const mockValue = "Hello World";

            const { getByLabelText } = render(
                <ConfigurationInput
                    label={mockLabel}
                    value={mockValue}
                    onChange={handleChange}
                    disabled
                />
            );

            const input = getByLabelText(mockLabel) as HTMLInputElement;

            // Ensure values are correct
            expect(input.value).toBe(mockValue);

            // Ensure that the input type is text
            expect(input.type).toBe("text");

            // Type in the input
            userEvent.type(input, mockValue);

            // Ensure that the onChange callback is not called at all
            expect(handleChange).toHaveBeenCalledTimes(0);
        });
    });

    describe("Number Input", () => {
        it("should render a number input", () => {
            const mockLabel = "Number Input";
            const mockValue = "12345";
            const mockInvalidValue = "abcde";

            const { getByLabelText } = render(
                <ConfigurationInput
                    label={mockLabel}
                    value={mockValue}
                    onChange={handleChange}
                    type={ConfigurationInputType.NUMBER}
                />
            );

            const input = getByLabelText(mockLabel) as HTMLInputElement;

            // Ensure values are correct
            expect(input.value).toBe(mockValue);

            // Ensure that the input type is text
            expect(input.type).toBe("text");

            // Ensure that the input mode is numeric
            expect(input.inputMode).toBe("numeric");

            // Type in the input
            userEvent.type(input, mockValue);

            // Ensure that the onChange callback is called the correct number of times
            expect(handleChange).toHaveBeenCalledTimes(mockValue.length);

            // Continue typing invalid characters
            userEvent.type(input, mockInvalidValue);

            // Ensure that the onChange callback frequency is not changed
            expect(handleChange).toHaveBeenCalledTimes(mockValue.length);
        });
    });

    describe("Number Step Input", () => {
        it("should render a number step input", () => {
            const mockLabel = "Number Step Input";
            const mockValue = "1";

            const { getByLabelText, getByText } = render(
                <ConfigurationInput
                    label={mockLabel}
                    value={mockValue}
                    onChange={handleChange}
                    type={ConfigurationInputType.NUMBER_STEP}
                />
            );

            const input = getByLabelText(mockLabel) as HTMLInputElement;

            // Ensure values are correct
            expect(input.value).toBe(mockValue);

            // Prepare the buttons
            const minusButton = getByText("-") as HTMLButtonElement;
            const plusButton = getByText("+") as HTMLButtonElement;

            // Trigger the plus button
            userEvent.click(plusButton);

            // Ensure that the onChange callback called once
            expect(handleChange).toHaveBeenCalledTimes(1);

            // Trigger the minus button
            userEvent.click(minusButton);

            // Ensure that the onChange callback called twice
            expect(handleChange).toHaveBeenCalledTimes(2);
        });
    });

    describe("Boolean Input", () => {
        it("should render a boolean input", () => {
            const mockLabel = "Boolean Input";
            const mockValue = "true";

            const { getByLabelText } = render(
                <ConfigurationInput
                    label={mockLabel}
                    value={mockValue}
                    onChange={handleChange}
                    type={ConfigurationInputType.BOOLEAN}
                />
            );

            const input = getByLabelText(mockLabel) as HTMLSelectElement;

            // Ensure values are correct
            expect(input.value).toBe(mockValue);

            // Trigger the change event
            userEvent.selectOptions(input, mockValue);

            // Ensure that the onChange callback called once
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
    });
});
