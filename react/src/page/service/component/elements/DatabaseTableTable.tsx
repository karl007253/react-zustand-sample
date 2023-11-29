import { ServiceElementsProps } from "../ServiceInputFields";
import { ServiceAttributesOptions } from "../../../../common/data/Service";

import Option from "./Option";
import useStore from "../../../../common/zustand/Store";

const DatabaseTableTable = ({
    className,
    index,
    attrName,
    attrType,
    serviceData,
    onUpdateAttributes,
    handleValidation,
    services,
}: ServiceElementsProps) => {
    const { databaseTables, databases } = useStore((state) => ({
        databases: state.database,
        databaseTables: state.databaseTable,
    }));

    const selectedDatabaseConnector =
        serviceData.data?.attribute?.connector ?? "";
    const selectedDatabaseName =
        services?.find((data) => data.name === selectedDatabaseConnector)?.data
            ?.attribute?.database ?? "";
    const selectedDatabaseUUID =
        databases?.find((data) => data.name === selectedDatabaseName)?.uuid ??
        "";

    const options: ServiceAttributesOptions[] | undefined =
        selectedDatabaseConnector.length > 0
            ? databaseTables
                  ?.filter(
                      (item) => item.database_uuid === selectedDatabaseUUID
                  )
                  ?.map((item) => {
                      return {
                          key: item.name,
                          value: item.name,
                      } as ServiceAttributesOptions;
                  })
            : [];
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

export default DatabaseTableTable;
