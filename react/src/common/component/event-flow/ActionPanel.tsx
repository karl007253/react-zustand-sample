import { useTranslation } from "react-i18next";
import Action from "./Action";
import { NodeDataProps, ParentFunctionProps } from "./EventFlow";
import EventFlowLoader from "./EventFlowLoader";
import { ZoomPercentage } from "./ZoomSelect";

// Combination of new and old action format
import {
    CombinedActionFormat,
    FunctionListsProps,
    SelectedSubFlowsProps,
} from "./data/Functions";
import { ShapeClickedDataProps } from "../EventFlowPanel";

type ActionPanelProps = {
    onUpdate: (index: number, data: NodeDataProps, type?: string) => void;
    functions: CombinedActionFormat[][];
    functionLists: FunctionListsProps;
    action: (data: ShapeClickedDataProps | null) => void;
    selectedParentFunction: ParentFunctionProps | null;
    handleCircleClicked: (data: ParentFunctionProps) => void;
    loading: boolean;
    selectedSubFlows: SelectedSubFlowsProps[];
    // Zoom
    zoom: ZoomPercentage[];
    setZoom: (zoom: ZoomPercentage[]) => void;
};

type ActionsProps = {
    index: number;
    key: string;
    functions: CombinedActionFormat[];
    title: string;
};

const ActionPanel = ({
    onUpdate,
    functions,
    functionLists,
    action,
    selectedParentFunction,
    handleCircleClicked,
    loading,
    selectedSubFlows,
    zoom,
    setZoom,
}: ActionPanelProps) => {
    const { t } = useTranslation();
    // prepare new array for actions
    const actions: ActionsProps[] = [];

    const fitWidth = functions.length <= 1;

    if (functions.length > 0) {
        functions.forEach((func: CombinedActionFormat[], index: number) => {
            let key = "";
            func.forEach((item: CombinedActionFormat) => {
                key += (item.uuid || "") + index;
            });

            actions.push({
                index,
                key,
                functions: func,
                title:
                    index === 0
                        ? t("eventFlow.action.title")
                        : `${selectedSubFlows[index - 1].function}:${
                              selectedSubFlows[index - 1].param
                          }`,
            });
        });
    } else {
        actions.push({
            key: "blank",
            index: 0,
            functions: [],
            title: t("eventFlow.action.title"),
        });
    }

    return (
        <>
            <EventFlowLoader loading={loading} />
            <div
                className="row flex-nowrap h-100 w-100"
                data-testid="action-panel"
            >
                {actions.map((actionData) => {
                    return actionData.key === "blank" ? (
                        <div key="blank" />
                    ) : (
                        <Action
                            key={actionData?.key}
                            index={actionData.index}
                            onUpdate={onUpdate}
                            functions={actionData.functions}
                            functionLists={functionLists}
                            action={action}
                            selectedParentFunction={selectedParentFunction}
                            handleCircleClicked={handleCircleClicked}
                            title={actionData.title}
                            fitWidth={fitWidth}
                            zoom={zoom}
                            setZoom={setZoom}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default ActionPanel;
