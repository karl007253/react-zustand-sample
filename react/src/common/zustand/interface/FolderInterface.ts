import { Sort } from "../../data/Type";
import { SchedulerStatus } from "./SchedulerInterface";
/**
 * TODO:
 * Please be reminded that all the interfaces are just a temporary baseline.
 * Please feel free to modify them in future development to fit your need.
 */
enum FolderType {
    API = "api",
    SCHEDULER = "scheduler",
}

interface FolderData {
    status?: SchedulerStatus;
}

interface Folder {
    uuid: string;
    id?: number;
    configuration_id?: number | null;
    configuration_uuid?: string;
    name: string;
    title?: string | null;
    folder_uuid?: string;
    folder_id?: number | null;
    type?: FolderType;
    order: number;
    data?: FolderData;
}

interface FolderSlice {
    folder: Folder[];
    selectedApiFolderUuid: string | null;
    selectedSchedulerFolderUuid: string | null;

    addNewFolder: (data: Folder) => void;
    updateFolderSort: (data: Sort[]) => void;
    setSelectedApiFolderUuid: (uuid: string) => void;
    setSelectedSchedulerFolderUuid: (uuid: string) => void;
    deleteFolder: (type: FolderType) => void;
    updateFolderName: (uuid: string, name: string, title?: string) => void;
    updateFolderStatus: (status: SchedulerStatus) => void;
}

export { FolderType };
export type { Folder };
export default FolderSlice;
