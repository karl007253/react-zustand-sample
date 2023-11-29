import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import { ServiceElementsProps } from "../ServiceInputFields";
import { serviceElementStructure } from "../../../../common/data/Service";

const Number = ({
    className,
    attrName,
    serviceData,
    onUpdateAttributes,
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
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        onUpdateAttributes(
            attrName === "name",
            serviceData.uuid,
            attrName,
            e.target.value
        );
    };

    return (
        <Form.Control
            aria-label={serviceData.name + attrName}
            className={className}
            type="number"
            value={currentValue}
            onChange={handleChange}
        />
    );
};

export default Number;
