import { ServiceElementsProps } from "../ServiceInputFields";
import { ServiceAttributesOptions } from "../../../../common/data/Service";

import Option from "./Option";
import { ServiceType } from "../../../../common/zustand/interface/ServiceInterface";

const DatabaseTableConnector = ({
    className,
    index,
    attrName,
    attrType,
    serviceData,
    onUpdateAttributes,
    handleValidation,
    services,
}: ServiceElementsProps) => {
    const options: ServiceAttributesOptions[] | undefined = services
        ?.filter((item) => item.type === ServiceType.DatabaseConnector)
        .map((item) => {
            return {
                key: item.name,
                value: item.name,
            } as ServiceAttributesOptions;
        });
    return (
        <Option
            className={className}
            index={index}
            attrName={attrName}
            attrType={attrType}
            serviceData={serviceData}
            onUpdateAttributes={onUpdateAttributes}
            handleValidation={handleValidation}
            options={options}
            services={services}
        />
    );
};

export default DatabaseTableConnector;
