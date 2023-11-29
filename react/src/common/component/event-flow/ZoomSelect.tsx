import { useEffect, useState } from "react";

type ZoomPercentage = {
    index: number;
    percentage: string;
};

type ZoomSelectProps = {
    value: string;
    action: (value: string) => void;
    options: string[];
};

const ZoomSelect = ({ value, action, options }: ZoomSelectProps) => {
    const [currentValue, setCurrentValue] = useState("");

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleZoomSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        action(e.target.value);
        setCurrentValue(e.target.value);
    };

    return (
        <select value={currentValue} onChange={handleZoomSelect}>
            {options.map((option) => (
                <option key={option} value={option}>
                    {`${option}%`}
                </option>
            ))}
        </select>
    );
};

export type { ZoomPercentage };
export default ZoomSelect;
