/**
 * TODO:
 * Please be reminded that all the interfaces are just a temporary baseline.
 * Please feel free to modify them in future development to fit your need.
 */

import { HttpResponse } from "../../helper/HttpRequest";
import { Field } from "./DatabaseTableInterface";

type DatabaseTableRecordValue = { [key: string]: string | number | null };

type DatabaseTableRecordField = {
    id: number;
    database_table_record_id: number;
    field: string;
    type: string;
    value?: DatabaseTableRecordValue;
};

type DatabaseTableRecord = {
    id: number;
    database_table_id: number;
};

type DatabaseTableContentCreateUpdateResponse = {
    record: DatabaseTableRecord;
    values: DatabaseTableRecordValue;
};

type DatabaseTableContentContentResponse = {
    fields: Field[];
    contents: DatabaseTableContentCreateUpdateResponse[];
};

interface DatabaseTableContentSlice {
    databaseTableContentFields: Field[];
    databaseTableContentContents: DatabaseTableContentCreateUpdateResponse[];

    clearDatabaseTableContents: () => void;
    getApplicationDatabaseTableContents: (
        applicationCode: string,
        databaseId: number,
        tableId: number
    ) => Promise<HttpResponse<DatabaseTableContentContentResponse>>;
    postApplicationDatabaseTableContents: (
        applicationCode: string,
        databaseId: number,
        tableId: number,
        data: DatabaseTableRecordValue
    ) => Promise<HttpResponse<DatabaseTableContentCreateUpdateResponse>>;
    patchApplicationDatabaseTableContent: (
        applicationCode: string,
        databaseId: number,
        tableId: number,
        recordId: number,
        data: DatabaseTableRecordValue
    ) => Promise<HttpResponse<DatabaseTableContentCreateUpdateResponse>>;
    deleteApplicationDatabaseTableContent: (
        applicationCode: string,
        databaseId: number,
        tableId: number,
        recordId: number
    ) => Promise<HttpResponse<null>>;
    addTableRecord: (data: DatabaseTableContentCreateUpdateResponse) => void;
}

export type {
    DatabaseTableRecordValue,
    DatabaseTableRecordField,
    DatabaseTableRecord,
    DatabaseTableContentCreateUpdateResponse,
    DatabaseTableContentContentResponse,
};
export default DatabaseTableContentSlice;
