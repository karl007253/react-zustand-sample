import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import { ServiceElementsProps } from "../ServiceInputFields";
import { serviceElementStructure } from "../../../../common/data/Service";

const String = ({
    className,
    attrName,
    serviceData,
    onUpdateAttributes,
    handleValidation,
}: ServiceElementsProps) => {
    // value to restore if validation fails
    const [oldValue, setOldValue] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const component = serviceElementStructure[serviceData.type];

    useEffect(() => {
        let value =
            serviceData.data.attribute?.[attrName] ??
            component.attribute?.[attrName]?.value ??
            "";
        if (attrName === "name") {
            value = serviceData?.name ?? "";
        }
        setOldValue(value);
        setCurrentValue(value);
    }, [
        serviceData.uuid,
        serviceData.data.attribute?.[attrName],
        serviceData.name,
    ]); // Do this only on initial render, so that the oldValue will be changed only initially or on some event trigger

    // Action passed down from parent
    const actionFromParent = (value: string, onBlurEnter: boolean) => {
        // If need a validation
        if (handleValidation && onBlurEnter) {
            if (
                handleValidation(attrName, {
                    ...component.attribute[attrName],
                    value,
                })
            ) {
                // empty values shall return previous value
                if (value === "") {
                    setCurrentValue(oldValue);
                    onUpdateAttributes(
                        attrName === "name",
                        serviceData.uuid,
                        attrName,
                        value
                    );
                } else {
                    onUpdateAttributes(
                        attrName === "name",
                        serviceData.uuid,
                        attrName,
                        value
                    );
                    setOldValue(value);
                }
            } else {
                setCurrentValue(oldValue);
                onUpdateAttributes(
                    attrName === "name",
                    serviceData.uuid,
                    attrName,
                    oldValue
                );
            }
        } else {
            // If no validation
            setCurrentValue(value);
            onUpdateAttributes(
                attrName === "name",
                serviceData.uuid,
                attrName,
                value
            );
        }
    };

    // Handle local change
    const handleChange: React.ChangeEventHandler = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        actionFromParent(e.target.value, false);
    };

    const handleKeyDown: React.KeyboardEventHandler = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            actionFromParent((e.target as HTMLInputElement).value, true);
        }
    };

    const handleBlur: React.FocusEventHandler = (
        e: React.FocusEvent<HTMLInputElement>
    ) => {
        actionFromParent(e.target.value, true);
    };

    return (
        <Form.Control
            aria-label={serviceData.name + attrName}
            className={className}
            type="text"
            value={currentValue}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onChange={handleChange}
        />
    );
};

export default String;
