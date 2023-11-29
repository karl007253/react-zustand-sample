import { useState, useEffect } from "react";

type SelectProps = {
    className?: string;
    value: string;
    onChange?: (value: string) => void;
    children?: JSX.Element | JSX.Element[];
};

const Select = ({ className, value, onChange, children }: SelectProps) => {
    const [selectValue, setSelectValue] = useState<string>(value);

    // Set the value from props
    useEffect(() => {
        setSelectValue(value);
    }, [value]);

    // Listen to the changes of value
    useEffect(() => {
        if (onChange && selectValue !== value) {
            onChange(selectValue);
        }
    }, [selectValue]);

    return (
        <select
            className={className}
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
        >
            {children}
        </select>
    );
};

export default Select;
