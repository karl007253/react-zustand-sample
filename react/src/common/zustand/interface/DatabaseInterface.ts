import { Sort } from "../../data/Type";

/**
 * TODO:
 * Please be reminded that all the interfaces are just a temporary baseline.
 * Please feel free to modify them in future development to fit your need.
 */

enum Engine {
    INNODB = "InnoDB",
}

enum Encoding {
    UTF8 = "utf8",
}

interface DatabaseData {
    engine?: Engine;
    encoding?: Encoding;
    host?: string;
    port?: string;
    username?: string;
    password?: string;
}

interface Database {
    uuid: string;
    id?: number;
    name: string;
    title: string;
    data?: DatabaseData;
    order: number;
    updated_at?: string;
    updated_by?: string;
}

interface DatabaseSlice {
    database: Database[];
    selectedDatabaseUuid: string | null;

    addNewDatabase: (data: Database) => void;
    setSelectedDatabaseUuid: (uuid: string | null) => void;
    updateDatabaseName: (name: string, title?: string) => void;
    updateDatabaseSort: (data: Sort[]) => void;
    updateDatabaseConfiguration: (data: DatabaseData) => void;
    deleteDatabase: () => void;
}

export { Encoding, Engine };
export type { Database, DatabaseData };
export default DatabaseSlice;
