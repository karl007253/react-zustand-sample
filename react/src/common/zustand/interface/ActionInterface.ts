import { GlobalActionFormat } from "../../component/event-flow/data/Functions";

interface Action {
    uuid: string;
    id?: number;
    name: string;
    title?: string;
    data?: GlobalActionFormat;
    order: number;
}

interface ActionSlice {
    action: Action[];

    addNewAction: (data: Action) => void;
    updateAction: (uuid: string, data: GlobalActionFormat) => void;
}

export type { Action };
export default ActionSlice;
