import { Button, Col, Form, Row } from "react-bootstrap";
import { isEmpty } from "lodash";
import { ButtonVariant } from "../../../common/component/helper/EmobiqModal";

enum ConfigurationInputType {
    TEXT = "text",
    BOOLEAN = "boolean",
    NUMBER = "number",
    NUMBER_STEP = "numberstep",
}

type ConfigurationInputProps = {
    label: string;
    disabled?: boolean;
    type?: ConfigurationInputType;
    value: string;
    onChange: (value: string) => void;
    spacing?: [number?, number?];
};

/**
 * Configuration Input Component
 * @param {string} label - Label of the input
 * @param {boolean} disabled - Whether the input is disabled
 * @param {ConfigurationInputType} type - Type of the input
 * @param {string} value - Value of the input
 * @param {(string) => void} onChange - Callback when input value changes
 * @param {number[]} spacing - Spacing of the label and input (default: [5, 7])
 *
 */
const ConfigurationInput = ({
    label,
    disabled,
    type,
    value,
    onChange,
    spacing = [5, 7],
}: ConfigurationInputProps) => {
    // Handle change for inputs
    const handleChange = (newValue: string) => {
        // Validation for number, if new value is not parsable as number don't change
        if (
            (type === ConfigurationInputType.NUMBER_STEP ||
                type === ConfigurationInputType.NUMBER) &&
            !isEmpty(newValue) &&
            !newValue.match(/^[0-9]+$/)
        ) {
            return;
        }

        onChange(newValue);
    };

    const getInputComponent = () => {
        // Override input type if it is boolean
        if (type === ConfigurationInputType.BOOLEAN) {
            return (
                <Form.Select
                    aria-label={label}
                    value={value}
                    className="text-rg"
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={disabled}
                >
                    {["true", "false"].map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </Form.Select>
            );
        }

        // Override input type if it is number
        if (type === ConfigurationInputType.NUMBER_STEP) {
            const onButtonClick = (op: string) => {
                // Parse value to number
                const number = parseInt(value || "0", 10);

                // Check if operation is minus
                const newValue = op === "minus" ? number - 1 : number + 1;

                // Check if new value is less than 0
                // Validate new value to be greater than 0
                handleChange(String(newValue < 0 ? 0 : newValue));
            };

            return (
                <div className="input-group">
                    <Button
                        variant={ButtonVariant.DARK_PLATINUM_OSLO_GRAY}
                        className="shadow-none"
                        onClick={() => onButtonClick("minus")}
                    >
                        -
                    </Button>
                    <Form.Control
                        aria-label={label}
                        className="form-control text-sm text-center p-0"
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={disabled}
                    />
                    <Button
                        variant={ButtonVariant.DARK_PLATINUM_OSLO_GRAY}
                        className="shadow-none"
                        onClick={() => onButtonClick("plus")}
                    >
                        +
                    </Button>
                </div>
            );
        }

        // Default input type is text
        return (
            <Form.Control
                aria-label={label}
                className="text-rg"
                inputMode={
                    type === ConfigurationInputType.NUMBER ? "numeric" : "text"
                }
                disabled={disabled}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
        );
    };

    return (
        <Form.Group controlId={label} className="align-items-center mb-3">
            <Row className="align-items-center">
                <Col sm={12} md={spacing[0]}>
                    <Form.Label
                        title={label}
                        className="d-block m-0 text-rg text-truncate text-philippine-gray"
                    >
                        {label}
                    </Form.Label>
                </Col>
                <Col sm={12} md={spacing[1]} className="p-sm-2 p-0">
                    {getInputComponent()}
                </Col>
            </Row>
        </Form.Group>
    );
};

export { ConfigurationInputType };
export default ConfigurationInput;
