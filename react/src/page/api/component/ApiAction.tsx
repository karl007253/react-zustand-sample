import {
    ApiData,
    DataType,
    ParameterType,
    Request,
} from "../../../common/zustand/interface/ApiInterface";
import useStore from "../../../common/zustand/Store";

import EventFlowPanel from "../../../common/component/EventFlowPanel";
import {
    GlobalActionFormat,
    ActionResultParameter,
} from "../../../common/component/event-flow/data/Functions";

type ApiActionProps = {
    tab: keyof Request;
    requestMethod: keyof ApiData;
};

const ApiAction = ({ tab, requestMethod }: ApiActionProps) => {
    const {
        action,
        addNewAction,
        updateApiAction,
        updateAction,
        selectedApiUuid,
        selectedApi,
    } = useStore((state) => ({
        action: state.action,
        addNewAction: state.addNewAction,
        updateApiAction: state.updateApiAction,
        updateAction: state.updateAction,
        selectedApiUuid: state.selectedApiUuid,
        selectedApi: state.api.find(
            (item) => item.uuid === state.selectedApiUuid
        ),
    }));

    const functions = selectedApi?.data?.[requestMethod]?.action || [];

    const globalFunctions = action.map(
        (item) => item.data || {}
    ) as GlobalActionFormat[];

    const getResultParameters = (): ActionResultParameter[] => {
        const result = selectedApi?.data?.[requestMethod]?.result;

        return result?.type === ParameterType.TEXT
            ? ([
                  {
                      name: result.type,
                      type: DataType.STRING,
                  },
              ] as ActionResultParameter[])
            : (result?.parameter || []).map((item) => ({
                  name: item.field,
                  type: item.type,
              }));
    };

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

    return tab === "action" ? (
        <EventFlowPanel
            functions={functions}
            globalFunctions={globalFunctions}
            onUpdateAction={(newFunctions) =>
                updateApiAction(requestMethod, newFunctions)
            }
            onUpdateGlobal={handleUpdateGlobal}
            actionResultParameter={getResultParameters()}
            switchRightPanelTabMain={`${selectedApiUuid}-${requestMethod}`}
        />
    ) : null;
};

export default ApiAction;
