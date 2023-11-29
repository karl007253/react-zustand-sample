import ActionFormat from "../../component/event-flow/data/Functions";
import { Sort } from "../../data/Type";
import { HttpResponse } from "../../helper/HttpRequest";
import { Service } from "./ServiceInterface";

/**
 * TODO:
 * Please be reminded that all the interfaces are just a temporary baseline.
 * Please feel free to modify them in future development to fit your need.
 */
enum SchedulerStatus {
    ENABLED = "enabled",
    DISABLED = "disabled",
}

interface SchedulerContent {
    action?: ActionFormat[];
}

interface SchedulerData {
    status?: SchedulerStatus;
    action?: ActionFormat[];
    main?: SchedulerContent;
}

interface Scheduler {
    uuid: string;
    id?: number;
    configuration_id?: number | null;
    configuration_uuid?: string;
    name: string;
    order: number;
    title?: string | null;
    folder_uuid?: string;
    folder_id?: number | null;
    data?: SchedulerData;
    updated_at?: string;
    updated_by?: string;
}

interface SchedulerTestRequestPayload {
    application: {
        code: string;
    };
    socket: {
        channelName: string;
    };
    action: ActionFormat[];
    service: Service[];
}

type SchedulerTestResponse = HttpResponse<null>;

interface SchedulerSlice {
    scheduler: Scheduler[];
    selectedSchedulerUuid: string | null;
    currentSchedulerSocketChannelName: { [uuid: string]: string | undefined };
    setSelectedSchedulerUuid: (uuid: string | null) => void;
    addNewScheduler: (data: Scheduler) => void;
    deleteScheduler: () => void;
    setSelectedSchedulerConfiguration: (configUuid?: string) => void;
    updateSchedulerSort: (data: Sort[]) => void;
    updateSchedulerName: (name: string, title?: string) => void;
    updateSchedulerStatus: (status: SchedulerStatus) => void;
    updateSchedulerAction: (action: ActionFormat[]) => void;
    updateSchedulerSocketChannelName: (
        uuid: string,
        channelName?: string
    ) => void;
    runSchedulerTest: (
        socketChannelName: string,
        applicationCode?: string
    ) => Promise<HttpResponse<SchedulerTestResponse>>;
}

export { SchedulerStatus };
export type {
    Scheduler,
    SchedulerData,
    SchedulerTestRequestPayload,
    SchedulerTestResponse,
};
export default SchedulerSlice;
