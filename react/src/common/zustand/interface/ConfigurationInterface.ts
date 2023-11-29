import { Encoding, Engine } from "./DatabaseInterface";

enum ConfigurationType {
    API = "api",
    DATABASE = "database",
    SCHEDULER = "scheduler",
    GLOBAL = "global",
}
enum GlobalConfigurationType {
    APPLICATION = "application",
    AUTHENTICATION = "authentication",
    SSL = "ssl",
}

enum AuthType {
    BASIC_AUTH = "basic-auth",
    OAUTH2 = "oauth2",
}

// TODO: Update the structure of Api, Configuration, Scheduler configuration data
type ApiConfigurationData = {
    dbConnection?: string;
    authType?: AuthType;
    tableReference?: string;
    username?: string;
    password?: string;
    tableTokenReference?: string;
};
type DatabaseConfigurationData = {
    engine?: Engine;
    encoding?: Encoding;
    host?: string;
    port?: string;
    username?: string;
    password?: string;
};
type SchedulerConfigurationData = {
    minute?: string;
    hour?: string;
    dayMonth?: string;
    month?: string;
    dayWeek?: string;
};

type GlobalApplicationConfigurationData = {
    groupId?: string;
    artifactId?: string;
    packageName?: string;
    smtpTimeout?: number;
    fileStoragePath?: string;
    asyncPoolSize?: number;
    asyncMaxSize?: number;
    asyncQueueCapacity?: number;
    schedulePoolSize?: number;
};

type GlobalAuthenticationConfigurationData = {
    clientId?: string;
    clientSecret?: string;
    accessTokenValidity?: number;
    refreshTokenValidity?: number;
};

type GlobalSSLConfigurationData = {
    sslEnabled?: boolean;
    keyAlias?: string;
    keyPassword?: string;
    keyStore?: string;
    keyStoreType?: string;
    keyStorePassword?: string;
};

type GlobalConfigurationData =
    | GlobalApplicationConfigurationData
    | GlobalAuthenticationConfigurationData
    | GlobalSSLConfigurationData;

type Configuration = {
    uuid: string;
    id?: number;
    type: ConfigurationType;
    name: string;
    title: string;
    data?:
        | ApiConfigurationData
        | DatabaseConfigurationData
        | SchedulerConfigurationData
        | GlobalConfigurationData;
    order: number;
};

type ConfigurationSlice = {
    configuration: Configuration[];
    updateConfiguration: (newConfig: Configuration) => void;
    addNewConfiguration: (data: Configuration) => void;
    deleteConfiguration: (configUuid: string) => void;
};

export { ConfigurationType, GlobalConfigurationType, AuthType };
export type {
    Configuration,
    ApiConfigurationData,
    DatabaseConfigurationData,
    SchedulerConfigurationData,
    GlobalConfigurationData,
};
export default ConfigurationSlice;
