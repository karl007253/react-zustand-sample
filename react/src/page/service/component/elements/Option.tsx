import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import { ServiceElementsProps } from "../ServiceInputFields";
import { serviceElementStructure } from "../../../../common/data/Service";

const Option = ({
    className,
    attrName,
    serviceData,
    onUpdateAttributes,
    options,
}: ServiceElementsProps) => {
    // value to restore if validation fails
    const [currentValue, setCurrentValue] = useState("");
    const component = serviceElementStructure[serviceData.type];

    useEffect(() => {
        const value =
            serviceData.data.attribute?.[attrName] ??
            component.attribute?.[attrName]?.value ??
            "";

        setCurrentValue(value);
    }, [serviceData.uuid, serviceData.data.attribute?.[attrName]]); // Do this only on initial render, so that the oldValue will be changed only initially or on some event trigger

    // Handle local change
    const handleChange: React.ChangeEventHandler = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setCurrentValue(e.target.value);
        onUpdateAttributes(
            attrName === "name",
            serviceData.uuid,
            attrName,
            e.target.value
        );
    };

    return (
        <Form.Select
            aria-label={serviceData.name + attrName}
            disabled={options?.length === 0}
            className={className}
            value={currentValue}
            onChange={handleChange}
        >
            <option key="default" value="" aria-label="default" />
            {options?.map((option) => {
                return (
                    <option
                        key={option.key}
                        value={option.value}
                        aria-label={option.key}
                    >
                        {option.key}
                    </option>
                );
            })}
        </Form.Select>
    );
};

export default Option;
