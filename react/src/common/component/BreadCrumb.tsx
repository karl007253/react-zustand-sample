import { Breadcrumb } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import useStore from "../zustand/Store";

import { Api } from "../zustand/interface/ApiInterface";
import { Database } from "../zustand/interface/DatabaseInterface";
import { DatabaseTable } from "../zustand/interface/DatabaseTableInterface";
import { Folder } from "../zustand/interface/FolderInterface";
import { Scheduler } from "../zustand/interface/SchedulerInterface";

type SelectedItem = Api | Folder | Database | DatabaseTable | Scheduler;

type BreadCrumbProps = {
    selectedItem: SelectedItem | null;
    module: "api" | "database" | "scheduler";
    rootPath?: string;
};

const BreadCrumb = ({ selectedItem, module, rootPath }: BreadCrumbProps) => {
    const { t } = useTranslation();

    const { folder, database } = useStore((state) => ({
        folder: state.folder,
        database: state.database,
    }));

    const isApi = (p: unknown): p is Api & Folder => module === "api";
    const isDatabase = (p: unknown): p is DatabaseTable =>
        module === "database";
    const isScheduler = (p: unknown): p is Scheduler => module === "scheduler";

    const buildPath = (item: SelectedItem) => {
        let indexes = [item];

        if ((isApi(item) || isScheduler(item)) && item.folder_uuid) {
            // find folder data within folder
            const folderData = folder.find((f) => f.uuid === item?.folder_uuid);

            // add it to indexes
            indexes = [item, ...buildPath(folderData as Folder | Scheduler)];
        } else if (isDatabase(item) && item.database_uuid) {
            // find the database of this table
            const databaseData = database.find(
                (f) => f.uuid === item?.database_uuid
            );

            // add it to indexes
            indexes = [item, ...buildPath(databaseData as Database)];
        }

        return indexes;
    };

    return (
        <Breadcrumb className="text-sm text-granite-gray py-3 py-md-0">
            <span className="me-1">{t("api.dashboard.header.label.path")}</span>
            {rootPath && (
                <Breadcrumb.Item key="PARENT_BREADCRUMB" active>
                    {rootPath}
                </Breadcrumb.Item>
            )}
            {selectedItem &&
                buildPath(selectedItem)
                    .reverse()
                    .map((data) => (
                        <Breadcrumb.Item key={data?.uuid} active>
                            {data?.name}
                        </Breadcrumb.Item>
                    ))}
        </Breadcrumb>
    );
};

export default BreadCrumb;
