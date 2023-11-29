import { StateCreator } from "zustand";
import produce from "immer";

import ActionSlice from "../interface/ActionInterface";

const createActionSlice: StateCreator<
    ActionSlice,
    [["zustand/devtools", never]],
    [],
    ActionSlice
> = (setState, getState) => ({
    action: [],

    addNewAction: (data) => {
        const { action } = getState();

        setState(
            {
                action: [...action, data],
            },
            false,
            "addNewAction"
        );
    },

    updateAction: (uuid, data) => {
        const { action } = getState();

        setState(
            {
                action: produce(action, (draft) => {
                    const index = draft.findIndex((item) => item.uuid === uuid);

                    if (index !== -1) {
                        const actionGlobal = draft[index];

                        draft[index] = {
                            ...actionGlobal,
                            name: data.function,
                            title: data.function,
                            data,
                        };
                    }
                }),
            },
            false,
            "updateAction"
        );
    },
});

export default createActionSlice;
