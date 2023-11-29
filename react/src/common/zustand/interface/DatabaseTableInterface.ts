import { Sort } from "../../data/Type";

/**
 * TODO:
 * Please be reminded that all the interfaces are just a temporary baseline.
 * Please feel free to modify them in future development to fit your need.
 */

enum DatabaseTableDataType {
    VARCHAR = "varchar",
    TEXT = "text",
    BOOLEAN = "boolean",
    INT = "int",
    DECIMAL = "decimal",
    DATE = "date",
    DATETIME = "datetime",
    TIME = "time",
    TIMESTAMP = "timestamp",
    BLOB = "blob",
}

interface Field {
    primary: boolean;
    id?: string;
    uuid: string;
    name: string;
    type: DatabaseTableDataType;
    length: string;
    optional: boolean;
    default: string;
}

interface Relation {
    name: string;
    field: string;
    foreign_table: string;
    foreign_field: string;
}

interface DatabaseTableData {
    structure?: Field[];
    relations?: Relation[];
}

interface DatabaseTable {
    uuid: string;
    id?: number;
    name: string;
    title: string;
    database_uuid?: string;
    database_id?: number | null;
    data?: DatabaseTableData;
    order: number;
}

interface DatabaseTableSlice {
    databaseTable: DatabaseTable[];
    selectedDatabaseTableUuid: string | null;

    addNewDatabaseTable: (data: DatabaseTable) => void;
    setSelectedDatabaseTableUuid: (uuid: string | null) => void;
    updateDatabaseTableStructure: (field: Field[]) => void;
    updateDatabaseTableName: (name: string, title?: string) => void;
    updateDatabaseTableSort: (data: Sort[]) => void;
    updateDatabaseTableRelation: (relation: Relation[]) => void;
    deleteDatabaseTable: () => void;
}

export { DatabaseTableDataType };
export type { DatabaseTable, DatabaseTableData, Relation, Field };
export default DatabaseTableSlice;
