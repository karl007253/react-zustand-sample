import useStore from "../../../common/zustand/Store";

import EventFlowPanel from "../../../common/component/EventFlowPanel";
import { GlobalActionFormat } from "../../../common/component/event-flow/data/Functions";

type SchedulerActionProps = {
    tab: string;
};

const SchedulerAction = ({ tab }: SchedulerActionProps) => {
    const {
        action,
        addNewAction,
        updateAction,
        selectedSchedulerUuid,
        selectedScheduler,
        updateSchedulerAction,
    } = useStore((state) => ({
        action: state.action,
        addNewAction: state.addNewAction,
        updateAction: state.updateAction,
        selectedSchedulerUuid: state.selectedSchedulerUuid,
        selectedScheduler: state.scheduler.find(
            (item) => item.uuid === state.selectedSchedulerUuid
        ),
        updateSchedulerAction: state.updateSchedulerAction,
    }));

    const globalFunctions = action.map(
        (item) => item.data || {}
    ) as GlobalActionFormat[];

    const handleUpdateGlobal = (newGlobalFunctions: GlobalActionFormat[]) => {
        newGlobalFunctions.forEach((global) => {
            // Check if existing
            const actionGlobal = action.find(
                (item) => item.uuid === global.uuid
            );

            const { uuid } = global;

            if (actionGlobal) {
                updateAction(uuid, global);
            } else {
                addNewAction({
                    uuid,
                    name: global.function,
                    title: global.function,
                    data: global,
                    order: 0,
                });
            }
        });
    };

    return tab === "scheduler.dashboard.menu.tabs.secondary.action" ? (
        <EventFlowPanel
            functions={selectedScheduler?.data?.action ?? []}
            globalFunctions={globalFunctions}
            onUpdateAction={updateSchedulerAction}
            onUpdateGlobal={handleUpdateGlobal}
            switchRightPanelTabMain={selectedSchedulerUuid ?? ""}
        />
    ) : null;
};

export default SchedulerAction;
