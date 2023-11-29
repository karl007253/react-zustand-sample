import { ServiceElementsProps } from "../ServiceInputFields";
import { ServiceAttributesOptions } from "../../../../common/data/Service";
import Option from "./Option";

const Boolean = ({
    className,
    index,
    attrName,
    attrType,
    serviceData,
    onUpdateAttributes,
    handleValidation,
    services,
}: ServiceElementsProps) => {
    const optionsBoolean: ServiceAttributesOptions[] = [
        { key: "True", value: "1" },
        { key: "False", value: "0" },
    ];
    return (
        <Option
            className={className}
            index={index}
            attrName={attrName}
            attrType={attrType}
            serviceData={serviceData}
            onUpdateAttributes={onUpdateAttributes}
            handleValidation={handleValidation}
            options={optionsBoolean}
            services={services}
        />
    );
};

export default Boolean;
