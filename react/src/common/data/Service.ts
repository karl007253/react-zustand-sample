import { ServiceType } from "../zustand/interface/ServiceInterface";

/**
 * These contains all the services element structure
 */

type ServiceAttributesOptions = {
    key: string;
    value: string | number;
};

type ServiceAttributes = {
    type: string;
    value?: string;
    isReadOnly?: boolean;
    isRequired?: boolean;
    options?: ServiceAttributesOptions[];
};

type ServiceElementStructureProps = {
    [key in ServiceType]: {
        title: string;
        name: string;
        attribute: {
            [field: string]: ServiceAttributes;
        };
    };
};

export const serviceElementStructure: ServiceElementStructureProps = {
    [ServiceType.RestConnector]: {
        title: "RAW(REST) Connector",
        name: "RAW-Connector",
        attribute: {
            url: {
                type: "string",
            },
            timeout: {
                type: "number",
                value: "30000",
            },
        },
    },
    [ServiceType.SoapConnector]: {
        title: "Soap Connector",
        name: "Soap-Connector",
        attribute: {
            url: {
                type: "string",
            },
            timeout: {
                type: "number",
                value: "30000",
            },
        },
    },
    [ServiceType.DatabaseConnector]: {
        title: "Database Connector",
        name: "Database-Connector",
        attribute: {
            database: {
                type: "databaseConnectorDatabase",
            },
        },
    },
    [ServiceType.DatabaseTable]: {
        title: "Database Table",
        name: "Database-Table",
        attribute: {
            connector: {
                type: "databaseTableConnector",
            },
            table: {
                type: "databaseTableTable",
            },
        },
    },
};

export type {
    ServiceAttributes,
    ServiceElementStructureProps,
    ServiceAttributesOptions,
};
