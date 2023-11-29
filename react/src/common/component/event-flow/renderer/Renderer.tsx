import {
    CombinedActionFormat,
    DataFunctionFormatProps,
} from "../data/Functions";
import RaphaelFlow from "./raphael/RaphaelFlow";

export type onNodeCircleFunctionDropProps = {
    parent: DataFunctionFormatProps;
    data: DataFunctionFormatProps;
    type: string;
    options: {
        connectionText: string;
    };
    draggedFunction?: DataFunctionFormatProps;
    draggedFunctionName?: string;
};

export type onNodeCircleClickProps = {
    parent: DataFunctionFormatProps;
    options: {
        connectionText: string;
    };
};

export type onNodeCircleRightClickProps = {
    parent: CombinedActionFormat;
    options: {
        connectionText: string;
    };
};

export type onNodeClickProps = {
    data: DataFunctionFormatProps;
};

export type onNodeDoubleClickProps = {
    data: CombinedActionFormat;
    options: {
        flowIndex: number;
    };
};

export type onNodeDragProps = {
    data: CombinedActionFormat;
    element: unknown;
};

type RendererProps = {
    type: string;
    data: unknown[];
    options: unknown;
    onNodeClick: (param: onNodeClickProps) => void;
    onNodeCircleClick: (param: onNodeCircleClickProps) => void;
    onNodeDoubleClick: (param: onNodeDoubleClickProps) => void;
    onNodeCircleFunctionDrop: (param: onNodeCircleFunctionDropProps) => void;
    onNodeCircleRightClick: (param: onNodeCircleRightClickProps) => void;
    onNodeDragMove: (param: onNodeDragProps) => void;
    onNodeDragEnd: (param: onNodeDragProps) => void;
};

type RaphaelOptionProps = {
    width: number;
    height: number;
    index: number;
    subFlow: boolean;
    zoomFlow: boolean | undefined;
    totalXcoordinate: number;
};

/**
 * Renders a flow chart using Raphael JS
 */
const Renderer = ({
    type,
    data,
    options,
    onNodeClick,
    onNodeCircleClick,
    onNodeDoubleClick,
    onNodeCircleFunctionDrop,
    onNodeCircleRightClick,
    onNodeDragMove,
    onNodeDragEnd,
}: RendererProps) => {
    switch (type) {
        case "raphael": {
            const {
                width,
                height,
                index,
                subFlow,
                zoomFlow,
                totalXcoordinate,
            } = options as RaphaelOptionProps;
            const currentData = data as DataFunctionFormatProps[];
            return (
                <RaphaelFlow
                    data={currentData}
                    width={width}
                    height={height}
                    index={index}
                    subFlow={subFlow}
                    zoomFlow={zoomFlow}
                    totalXcoordinate={totalXcoordinate}
                    onNodeClick={onNodeClick}
                    onNodeCircleClick={onNodeCircleClick}
                    onNodeDoubleClick={onNodeDoubleClick}
                    onNodeCircleFunctionDrop={onNodeCircleFunctionDrop}
                    onNodeCircleRightClick={onNodeCircleRightClick}
                    onNodeDragMove={onNodeDragMove}
                    onNodeDragEnd={onNodeDragEnd}
                />
            );
        }

        default: {
            const {
                width,
                height,
                index,
                subFlow,
                zoomFlow,
                totalXcoordinate,
            } = options as RaphaelOptionProps;
            const currentData = data as DataFunctionFormatProps[];
            return (
                <RaphaelFlow
                    data={currentData}
                    width={width}
                    height={height}
                    index={index}
                    subFlow={subFlow}
                    zoomFlow={zoomFlow}
                    totalXcoordinate={totalXcoordinate}
                    onNodeClick={onNodeClick}
                    onNodeCircleClick={onNodeCircleClick}
                    onNodeDoubleClick={onNodeDoubleClick}
                    onNodeCircleFunctionDrop={onNodeCircleFunctionDrop}
                    onNodeCircleRightClick={onNodeCircleRightClick}
                    onNodeDragMove={onNodeDragMove}
                    onNodeDragEnd={onNodeDragEnd}
                />
            );
        }
    }
};

export default Renderer;
