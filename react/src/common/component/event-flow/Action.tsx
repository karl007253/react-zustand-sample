/* eslint no-underscore-dangle: 0 */
import React, { useState } from "react";
import produce from "immer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

// TODO: Don't import anything outside event-flow folder
import { getDataFunctions } from "../helper/Function";

import {
    defaultX,
    defaultY,
    distanceX,
    distanceY,
} from "./renderer/raphael/Variables";
import EventFlowFunctionLists from "./modals/EventFlowFunctionLists";
import { NodeDataProps, ParentFunctionProps } from "./EventFlow";
import {
    CombinedActionFormat,
    DataFunctionFormatProps,
    FunctionListsProps,
} from "./data/Functions";
import Renderer, {
    onNodeCircleFunctionDropProps,
    onNodeCircleClickProps,
    onNodeClickProps,
    onNodeDoubleClickProps,
    onNodeDragProps,
    onNodeCircleRightClickProps,
} from "./renderer/Renderer";

// TODO: Don't import anything outside event-flow folder
//       EventFlowPanel component is the one using eventflow, not the eventflow using EventFlowPanel
import { ShapeClickedDataProps } from "../EventFlowPanel";
import ZoomSelect, { ZoomPercentage } from "./ZoomSelect";

type ActionProps = {
    index: number;
    onUpdate: (index: number, data: NodeDataProps, type?: string) => void;
    functions: CombinedActionFormat[];
    functionLists: FunctionListsProps;
    action: (data: ShapeClickedDataProps | null) => void;
    selectedParentFunction: ParentFunctionProps | null;
    handleCircleClicked: (data: ParentFunctionProps) => void;
    title: string;
    fitWidth: boolean;
    // Zoom
    zoom: ZoomPercentage[];
    setZoom: (zoom: ZoomPercentage[]) => void;
};

/**
 * Action component to render the function in a flowchart
 */
const Action = ({
    index,
    onUpdate,
    functions,
    functionLists,
    action,
    selectedParentFunction,
    handleCircleClicked,
    title,
    fitWidth,
    zoom,
    setZoom,
}: ActionProps) => {
    const [
        eventFlowFunctionListsModalVisible,
        setEventFlowFunctionListsVisibility,
    ] = useState<boolean>(false);
    const showEventFlowFunctionListsModal = () =>
        setEventFlowFunctionListsVisibility(true);
    const hideEventFlowFunctionListsModal = () =>
        setEventFlowFunctionListsVisibility(false);

    const onEventFlowFunctionListsClick = (functionName: string) => {
        onUpdate(index, {
            parentUuid: selectedParentFunction?.function_uuid || "#none",
            connectionName: selectedParentFunction?.connection_name || "",
            functionName,
        });

        hideEventFlowFunctionListsModal();
    };

    // Initial coordinates
    const x = defaultX;
    const y = defaultY;

    // mock variables
    // Default paper width and height
    let paperWidth = 300;
    let paperHeight = 400;
    const defaultActionWidth = "340px";
    const width = fitWidth ? "100%" : defaultActionWidth;
    const isZoomFlow = false;

    // zoom levels
    const MAX_ZOOM = "200";
    const MIN_ZOOM = "40";
    const zoomOptions = [
        MAX_ZOOM,
        "180",
        "160",
        "140",
        "120",
        "100",
        "80",
        "60",
        MIN_ZOOM,
    ];

    const getCurrentZoomPercent = () => {
        return zoom.find((item) => item.index === index)?.percentage ?? "100";
    };

    const updateZoom = (value: string) => {
        setZoom(
            produce(zoom, (draft) => {
                const idx = draft.findIndex((item) => item.index === index);

                if (idx !== -1) {
                    draft[idx] = {
                        index,
                        percentage: value,
                    };
                }
            })
        );
    };

    const handleZoomIn = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        // Find the current zoom value
        const currentZoom = getCurrentZoomPercent();

        const value = parseInt(currentZoom, 10) + 20;
        if (value <= parseInt(MAX_ZOOM, 10)) {
            updateZoom(value.toString());
        }
    };

    const handleZoomOut = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        // Find the current zoom value
        const currentZoom = getCurrentZoomPercent();

        const value = parseInt(currentZoom, 10) - 20;
        if (value >= parseInt(MIN_ZOOM, 10)) {
            updateZoom(value.toString());
        }
    };

    const onNodeClick = (param: onNodeClickProps) => {
        const { data } = param;

        action({
            data: data.data as CombinedActionFormat,
            flowIndex: index,
        });
    };

    const onNodeCircleClick = (param: onNodeCircleClickProps) => {
        // Set the selected parent function
        // #none - no parent

        const { parent, options } = param;

        handleCircleClicked({
            function_uuid: parent?.data?.uuid || "#none",
            connection_name: options.connectionText,
            flowIndex: index,
        });

        // Reset Inspector selection
        action(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onNodeDoubleClick = (param: onNodeDoubleClickProps) => {
        console.log("onNodeDoubleClick");
    };

    const dropFunction = (param: onNodeCircleFunctionDropProps) => {
        switch (param.type) {
            case "new": {
                const { parent, options } = param;
                const connectionName = options.connectionText || ""; // yes/no connection name

                onUpdate(
                    index,
                    {
                        parentUuid: parent?.data?.uuid || "#none",
                        connectionName,
                        functionName: param.draggedFunctionName,
                    },
                    "new"
                );

                break;
            }
            case "move": {
                const { draggedFunction, parent, options } = param;
                const { data } = draggedFunction as DataFunctionFormatProps;
                const connectionName = options.connectionText || ""; // yes/no connection name

                onUpdate(
                    index,
                    {
                        parentUuid: parent?.data?.uuid || "#none",
                        connectionName,
                        functionData: data as CombinedActionFormat,
                    },
                    "move"
                );

                break;
            }

            default:
                break;
        }
    };

    const onNodeCircleFunctionDrop = (param: onNodeCircleFunctionDropProps) => {
        dropFunction(param);
    };

    const onNodeCircleRightClick = (param: onNodeCircleRightClickProps) => {
        const { parent, options } = param;

        handleCircleClicked({
            function_uuid: parent?.uuid || "#none",
            connection_name: options.connectionText,
            flowIndex: index,
        });

        showEventFlowFunctionListsModal();
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onNodeDragMove = (param: onNodeDragProps) => {
        console.log("onNodeDragMove");
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onNodeDragEnd = (param: onNodeDragProps) => {
        console.log("onNodeDragEnd");
    };

    // Put the computation here so that the computation of height and width can be retrieved from this function
    const result = getDataFunctions(functions, {
        coord: { x, y: y + distanceY },
        distanceX,
        distanceY,
    });

    const { dimension } = result;

    if (result.functions.length > 0) {
        // Add the dimension of Start shape
        dimension.width.push(x);
        dimension.height.push(y);
    }

    // If the total width/height is greater than the default then use it
    paperWidth =
        dimension.width.total > paperWidth ? dimension.width.total : paperWidth;
    paperHeight =
        dimension.height.total > paperHeight
            ? dimension.height.total
            : paperHeight;

    return (
        <div
            className="pe-0 d-flex flex-column position-relative"
            style={{
                width,
            }}
        >
            <div className="eventflow-panel-title">{title}</div>

            <div className="overflow-auto action_hover border-end-anti-flash-white h-100">
                <div
                    className={`paper-container-${index}`}
                    style={{ zoom: `${getCurrentZoomPercent()}%` }}
                >
                    <Renderer
                        type="raphael"
                        data={result.functions}
                        options={{
                            width: paperWidth,
                            height: paperHeight,
                            index,
                            subFlow: index > 0,
                            zoomFlow: isZoomFlow,
                            totalXcoordinate: dimension.x.total,
                        }}
                        onNodeClick={onNodeClick}
                        onNodeCircleClick={onNodeCircleClick}
                        onNodeDoubleClick={onNodeDoubleClick}
                        onNodeCircleFunctionDrop={onNodeCircleFunctionDrop}
                        onNodeCircleRightClick={onNodeCircleRightClick}
                        onNodeDragMove={onNodeDragMove}
                        onNodeDragEnd={onNodeDragEnd}
                    />
                </div>
            </div>

            {/* footer controls */}
            <div className="flow-controls">
                <div>{title}</div>
                <ul>
                    <li>
                        <button
                            type="button"
                            className="border-0 bg-transparent opacity-50"
                            onClick={handleZoomOut}
                        >
                            <FontAwesomeIcon
                                className="module-search-icon"
                                icon={faMinus}
                            />
                        </button>
                    </li>
                    <li>
                        <ZoomSelect
                            value={getCurrentZoomPercent()}
                            options={zoomOptions}
                            action={updateZoom}
                        />
                    </li>
                    <li>
                        <button
                            type="button"
                            className="border-0 bg-transparent opacity-50"
                            onClick={handleZoomIn}
                        >
                            <FontAwesomeIcon
                                className="module-search-icon"
                                icon={faPlus}
                            />
                        </button>
                    </li>
                </ul>
            </div>

            <EventFlowFunctionLists
                show={eventFlowFunctionListsModalVisible}
                handleClose={hideEventFlowFunctionListsModal}
                functionLists={functionLists}
                onClick={onEventFlowFunctionListsClick}
            />
        </div>
    );
};

export default React.memo(Action);
