/**
 * TODO:
 * Please be reminded that all the interfaces are just a temporary baseline.
 * Please feel free to modify them in future development to fit your need.
 */

enum ServiceType {
    RestConnector = "RestConnector",
    SoapConnector = "SoapConnector",
    DatabaseConnector = "DatabaseConnector",
    DatabaseTable = "DatabaseTable",
}

type ServiceDataValue = {
    [field: string]: string;
};

type ServiceData = {
    attribute: ServiceDataValue;
};

type Sort = {
    uuid: string;
    order: number;
};

interface Service {
    uuid: string;
    id?: number;
    type: ServiceType;
    name: string;
    order: number;
    title?: string | null;
    data: ServiceData;
}

interface ServiceSlice {
    service: Service[];

    addNewService: (data: Service) => void;
    updateServiceOrder: (data: Sort[]) => void;
    deleteService: (uuid: string) => void;
    updateServiceName: (uuid: string, name: string, title?: string) => void;
    updateServiceData: (uuid: string, field: string, data: string) => void;
}

export { ServiceType };
export type { Service, ServiceData, Sort, ServiceDataValue };
export default ServiceSlice;
