import { HttpResponse } from "../../helper/HttpRequest";
import { Api } from "./ApiInterface";
import { Database } from "./DatabaseInterface";
import { Folder } from "./FolderInterface";
import { Scheduler } from "./SchedulerInterface";
import { Configuration } from "./ConfigurationInterface";
import { Service } from "./ServiceInterface";
import { DatabaseTable } from "./DatabaseTableInterface";
import { Action } from "./ActionInterface";

enum ApplicationType {
    CLIENT = "Client",
    SERVER = "Server",
}

enum ApplicationBuildMode {
    DEBUG = "debug",
    DEVELOPMENT = "development",
    RELEASE = "release",
}

enum ApplicationVersionType {
    MAJOR = "major",
    MINOR = "minor",
    PATCH = "patch",
    BUILD = "build",
}

interface BuiltFileDetails {
    file: string | null;
    size: number | null;
    modified_date: string | null;
}

interface BuiltFilePlatforms {
    debug?: BuiltFileDetails | null;
    development?: BuiltFileDetails | null;
    release?: BuiltFileDetails | null;
}

interface BuiltFiles {
    java_spring_boot: BuiltFilePlatforms | null;
}

interface Built {
    files: BuiltFiles | null;
    modes: string[] | null;
    platforms: string[] | null;
}

interface ApplicationDetails {
    id: number;
    application_code: string;
    application_type_id: number;
    application_type_name: string;
    user_id: number | null;
    appname: string;
    description: string | null;
    compiler: string | null;
    icon: string | null;
    is_locked: boolean;
    is_published: boolean;
    version: number | null;
    version_name: string | null;
    build_status: string | null;
    theme: string | null;
    last_build_at: string | null;
    created_at: string;
    created_by: number | null;
    updated_at: string;
    updated_by: number | null;
}

interface StorageInfoMemory {
    max: number;
    used: number;
    free: number;
}

interface StorageInfo {
    memory: StorageInfoMemory;
}

interface ApplicationResponseModel {
    app: ApplicationDetails;
    configuration: Configuration[];
    folder: Folder[];
    api: Api[];
    database: Database[];
    database_table: DatabaseTable[];
    scheduler: Scheduler[];
    action: Action[];
    service: Service[];
    built: Built;
}

interface ApplicationSlice {
    applicationData: ApplicationDetails | null;
    storageInfo: StorageInfo | null;
    dataHasChanged: boolean;
    built: Built | null;

    getApplicationByApplicationCode: (
        applicationCode: string
    ) => Promise<HttpResponse<ApplicationResponseModel>>;

    saveApplication: () => Promise<HttpResponse>;
    uploadAppIcon: (
        applicationCode: string,
        iconFile: File
    ) => Promise<HttpResponse<string>>;
    patchApplication: (
        applicationCode: string
    ) => Promise<HttpResponse<ApplicationResponseModel>>;
    buildApplication: (
        applicationCode: string,
        buildMode: ApplicationBuildMode,
        versionType: string
    ) => Promise<HttpResponse>;
    getApplicationLog: (applicationCode: string) => Promise<HttpResponse>;
    cleanupActionFlow: () => void;
    setDataHasChanged: (dataHasChanged: boolean) => Promise<void>;
    getStorageInfoByApplicationCode: (
        applicationCode: string
    ) => Promise<HttpResponse<StorageInfo>>;
}

export { ApplicationType, ApplicationBuildMode, ApplicationVersionType };
export type {
    ApplicationDetails,
    ApplicationResponseModel,
    Built,
    BuiltFiles,
    BuiltFilePlatforms,
    BuiltFileDetails,
    StorageInfo,
    StorageInfoMemory,
};
export default ApplicationSlice;
