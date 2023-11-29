import { StateCreator } from "zustand";
import produce from "immer";
import SchedulerSlice, {
    SchedulerTestRequestPayload,
} from "../interface/SchedulerInterface";
import { Sort } from "../../data/Type";
import FolderSlice from "../interface/FolderInterface";
import ApplicationSlice from "../interface/ApplicationInterface";
import ServiceSlice from "../interface/ServiceInterface";
import { javaTesterHttpRequest } from "../../helper/HttpRequest";

const createSchedulerSlice: StateCreator<
    SchedulerSlice & FolderSlice & ApplicationSlice & ServiceSlice,
    [["zustand/devtools", never]],
    [],
    SchedulerSlice
> = (setState, getState) => ({
    scheduler: [],
    selectedSchedulerUuid: null,
    currentSchedulerSocketChannelName: {},

    addNewScheduler: (data) => {
        const { scheduler } = getState();

        setState(
            {
                scheduler: [...scheduler, data],
                dataHasChanged: true,
            },
            false,
            "addNewScheduler"
        );
    },

    setSelectedSchedulerConfiguration: (newConfigUUID?: string) => {
        const {
            scheduler,
            selectedSchedulerUuid,
            folder,
            selectedSchedulerFolderUuid,
        } = getState();

        if (selectedSchedulerUuid) {
            // Update Scheduler List
            const newSchedulerArray = scheduler.map((el) =>
                // Update Selected Scheduler inside Scheduler List
                el.uuid === selectedSchedulerUuid
                    ? { ...el, configuration_uuid: newConfigUUID }
                    : el
            );

            setState(
                {
                    scheduler: newSchedulerArray,
                    dataHasChanged: true,
                },
                false,
                "setSelectedSchedulerConfiguration"
            );
        } else if (selectedSchedulerFolderUuid) {
            // Update Folder List
            const newFolderArray = folder.map((el) =>
                el.uuid === selectedSchedulerFolderUuid
                    ? { ...el, configuration_uuid: newConfigUUID }
                    : el
            );

            setState(
                {
                    folder: newFolderArray,
                    dataHasChanged: true,
                },
                false,
                "setSelectedSchedulerFolderConfiguration"
            );
        }
    },

    setSelectedSchedulerUuid: (uuid) => {
        // set selected SCHEDULER
        setState(
            {
                selectedSchedulerUuid: uuid,
                selectedSchedulerFolderUuid: null, // Ensure no Scheduler folder is selected when an Scheduler is selected
            },
            false,
            "setSelectedScheduler"
        );
    },

    deleteScheduler: () => {
        const { scheduler, selectedSchedulerUuid } = getState();

        // Make sure there is a selected scheduler
        if (selectedSchedulerUuid) {
            // Get all schedulers except for the selected one
            const newSchedulerArray = scheduler.filter(
                (item) => item.uuid !== selectedSchedulerUuid
            );

            // Find the parent folder_uuid of the selected scheduler
            const parentFolderUuid = scheduler.find(
                ({ uuid }) => uuid === selectedSchedulerUuid
            )?.folder_uuid;

            setState(
                {
                    scheduler: newSchedulerArray,
                    selectedSchedulerUuid: null,
                    selectedSchedulerFolderUuid: parentFolderUuid ?? null,
                    dataHasChanged: true,
                },
                false,
                "deleteScheduler"
            );
        }
    },

    updateSchedulerSort: (data: Sort[]) => {
        const { scheduler } = getState();

        const newSchedulerArray = scheduler.map((el) => {
            const newData = data.find((item) => item.uuid === el.uuid);

            return newData
                ? {
                      ...el,
                      order: newData.order,
                      folder_uuid: newData.parent,
                  }
                : el;
        });

        setState(
            {
                scheduler: newSchedulerArray,
                dataHasChanged: true,
            },
            false,
            "updateSchedulerSort"
        );
    },

    updateSchedulerName: (name, title) => {
        const { scheduler, selectedSchedulerUuid } = getState();

        setState(
            {
                scheduler: produce(scheduler, (draft) => {
                    // Get the selected scheduler
                    const index = draft.findIndex(
                        (a) => a.uuid === selectedSchedulerUuid
                    );

                    const selectedScheduler = draft[index];

                    // Update the name and title
                    draft[index] = {
                        ...selectedScheduler,
                        name,
                        title: title || name,
                    };
                }),
                dataHasChanged: true,
            },
            false,
            "updateSchedulerName"
        );
    },

    updateSchedulerStatus: (status) => {
        const { scheduler, selectedSchedulerUuid } = getState();

        setState(
            {
                scheduler: produce(scheduler, (draft) => {
                    // Get the selected scheduler
                    const index = draft.findIndex(
                        (a) => a.uuid === selectedSchedulerUuid
                    );

                    const selectedScheduler = draft[index];

                    // Update the status
                    draft[index] = {
                        ...selectedScheduler,
                        data: {
                            ...selectedScheduler.data,
                            status,
                        },
                    };
                }),
            },
            false,
            "updateSchedulerStatus"
        );
    },

    updateSchedulerAction: (action) => {
        const { scheduler, selectedSchedulerUuid } = getState();

        setState(
            {
                scheduler: produce(scheduler, (draft) => {
                    // Get the selected scheduler
                    const index = draft.findIndex(
                        (a) => a.uuid === selectedSchedulerUuid
                    );

                    const selectedScheduler = draft[index];

                    // Update the status
                    draft[index] = {
                        ...selectedScheduler,
                        data: {
                            ...selectedScheduler.data,
                            action,
                        },
                    };
                }),
            },
            false,
            "updateSchedulerAction"
        );
    },

    updateSchedulerSocketChannelName: (uuid, channelName) => {
        const { selectedSchedulerUuid, currentSchedulerSocketChannelName } =
            getState();

        if (selectedSchedulerUuid) {
            setState(
                {
                    currentSchedulerSocketChannelName: {
                        ...currentSchedulerSocketChannelName,
                        [uuid]: channelName,
                    },
                },
                false,
                "updateSchedulerSocketChannelName"
            );
        }
    },

    runSchedulerTest: async (socketChannelName, applicationCode) => {
        const { scheduler, selectedSchedulerUuid, service } = getState();

        const selectedScheduler = scheduler.find(
            (s) => s.uuid === selectedSchedulerUuid
        );

        if (!selectedScheduler || !selectedScheduler.data?.action) {
            // No scheduler selected. Most likely the run button is not even shown. Ignore.
            throw new Error("No scheduler is selected");
        }

        const payload: SchedulerTestRequestPayload = {
            application: {
                code: applicationCode ?? "",
            },
            socket: {
                channelName: socketChannelName,
            },
            action: selectedScheduler.data?.action,
            service,
        };

        // call test endpoint with the payload
        return javaTesterHttpRequest.post("test/scheduler", payload);
    },
});

export default createSchedulerSlice;
