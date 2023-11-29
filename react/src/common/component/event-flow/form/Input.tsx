import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { validateSpecialCharacters } from "../../../helper/Function";
import useToast from "../../../hooks/Toast";

type InputProps = {
    value: string;
    type: string;
    className?: string;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    onClick?: () => void;
    specialCharactersValidation?: boolean;
    ariaLabel?: string; // TODO: fix this
};

/**
 * Controlled component (input text)
 * @param {object} props
 */
const Input = ({
    value,
    onBlur,
    onChange,
    onClick,
    type,
    className,
    readOnly,
    specialCharactersValidation = false,
    ariaLabel,
}: InputProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);
    const [inputValue, setInputValue] = useState<string>(value);

    // Set the value from props
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Listen to the changes of value
    useEffect(() => {
        if (onChange && inputValue !== value) {
            onChange(inputValue);
        }
    }, [inputValue]);

    return (
        <input
            type={type}
            className={className}
            readOnly={readOnly}
            value={inputValue}
            onBlur={onBlur}
            onClick={onClick}
            onChange={(e) => {
                // Checking for special characters
                if (
                    specialCharactersValidation &&
                    validateSpecialCharacters(e.target.value) &&
                    e.target.value !== ""
                ) {
                    toastMessage(
                        t("common.error.specialCharactersDetected"),
                        toast.TYPE.ERROR
                    );
                    return;
                }

                setInputValue(e.target.value);
            }}
            aria-label={ariaLabel ?? ""}
        />
    );
};

export default Input;
