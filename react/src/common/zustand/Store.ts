import create from "zustand";
import { devtools } from "zustand/middleware";

import createApplicationSlice from "./slice/ApplicationSlice";
import createFolderSlice from "./slice/FolderSlice";
import createApiSlice from "./slice/ApiSlice";
import createDatabaseSlice from "./slice/DatabaseSlice";
import createDatabaseTableSlice from "./slice/DatabaseTableSlice";
import createSchedulerSlice from "./slice/SchedulerSlice";
import createConfigurationSlice from "./slice/ConfigurationSlice";
import createActionSlice from "./slice/ActionSlice";
import createServiceSlice from "./slice/ServiceSlice";
import createDatabaseTableContentSlice from "./slice/DatabaseTableContentSlice";
import createAuditSlice from "./slice/AuditSlice";

import ApplicationSlice from "./interface/ApplicationInterface";
import DatabaseSlice from "./interface/DatabaseInterface";
import DatabaseTableSlice from "./interface/DatabaseTableInterface";
import ApiSlice from "./interface/ApiInterface";
import SchedulerSlice from "./interface/SchedulerInterface";
import FolderSlice from "./interface/FolderInterface";
import AuditSlice from "./interface/AuditInterface";
import ConfigurationSlice from "./interface/ConfigurationInterface";
import ActionSlice from "./interface/ActionInterface";
import ServiceSlice from "./interface/ServiceInterface";
import DatabaseTableContentSlice from "./interface/DatabaseTableContentInterface";
import UserSlice from "./interface/UserInterface";
import createUserSlice from "./slice/UserSlice";

// to create store with all the slices
const useStore = create<
    ApplicationSlice &
        ConfigurationSlice &
        FolderSlice &
        ApiSlice &
        DatabaseSlice &
        DatabaseTableSlice &
        ActionSlice &
        SchedulerSlice &
        DatabaseTableContentSlice &
        AuditSlice &
        UserSlice &
        ServiceSlice
>()(
    devtools((...data) => ({
        ...createApplicationSlice(...data),
        ...createConfigurationSlice(...data),
        ...createFolderSlice(...data),
        ...createApiSlice(...data),
        ...createDatabaseSlice(...data),
        ...createDatabaseTableSlice(...data),
        ...createSchedulerSlice(...data),
        ...createActionSlice(...data),
        ...createServiceSlice(...data),
        ...createDatabaseTableContentSlice(...data),
        ...createAuditSlice(...data),
        ...createUserSlice(...data),
    }))
);

export default useStore;
