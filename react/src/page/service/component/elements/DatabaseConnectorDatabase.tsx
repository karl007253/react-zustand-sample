import { ServiceElementsProps } from "../ServiceInputFields";
import { ServiceAttributesOptions } from "../../../../common/data/Service";

import Option from "./Option";
import useStore from "../../../../common/zustand/Store";

const DatabaseConnectorDatabase = ({
    className,
    index,
    attrName,
    attrType,
    serviceData,
    onUpdateAttributes,
    handleValidation,
    services,
}: ServiceElementsProps) => {
    const { databases } = useStore((state) => ({
        databases: state.database,
    }));

    const options: ServiceAttributesOptions[] = databases.map((item) => {
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

export default DatabaseConnectorDatabase;
