import {
    RaphaelAttributes,
    RaphaelBaseElement,
    RaphaelPaper,
    RaphaelSet,
} from "raphael";
import { DataFunctionFormatProps } from "../../data/Functions";
import {
    onNodeCircleFunctionDropProps,
    onNodeCircleClickProps,
    onNodeClickProps,
    onNodeDoubleClickProps,
    onNodeDragProps,
    onNodeCircleRightClickProps,
} from "../Renderer";

export type DragEndProps = {
    resetElement: () => void;
    event: React.DragEvent;
};

type PathOptionProps = {
    isFirstItemDeleted?: boolean;
    type?: string;
};

type ConnectionOptionsProps = {
    connectionCounter?: number;
    connectionText?: string;
};

type RaphaelPaperEventProps = {
    onNodeClick?: (param: onNodeClickProps) => void;
    onNodeCircleClick?: (param: onNodeCircleClickProps) => void;
    onNodeDoubleClick?: (param: onNodeDoubleClickProps) => void;
    onNodeCircleFunctionDrop?: (param: onNodeCircleFunctionDropProps) => void;
    onNodeCircleRightClick?: (param: onNodeCircleRightClickProps) => void;
    onNodeDragStart?: (param: onNodeDragProps) => void;
    onNodeDragMove?: (param: onNodeDragProps) => void;
    onNodeDragEnd?: (param: onNodeDragProps) => void;
};

type RaphaelPaperEventsProps = {
    events?: RaphaelPaperEventProps;
};

export type RaphaelPaperBaseProps = {
    data: DataFunctionFormatProps[];
    width: number;
    height: number;
    index: number;
    subFlow: boolean;
    zoomFlow: boolean | undefined;
    totalXcoordinate: number;
    oldPaperId: string | undefined;
};

export type RaphaelPaperWithEventsProps = RaphaelPaperBaseProps &
    RaphaelPaperEventProps;
export type RaphaelPaperWithEventsAndConnectionOptionsProps =
    RaphaelPaperBaseProps & ConnectionOptionsProps & RaphaelPaperEventsProps;
export type RaphaelPaperWithEventsAndConnectionOptionsAndPathOptionsProps =
    RaphaelPaperWithEventsAndConnectionOptionsProps & PathOptionProps;

type IdProps = {
    id?: string;
};
export type RaphaelPaperWithIdProps = RaphaelPaper<"SVG" | "VML"> & IdProps;
export type RaphaelSetWithIdProps = RaphaelSet & IdProps;

export type ComputeConnectionPointsProps = {
    sibling?: RaphaelBaseElement;
    totalConnections: number;
    totalValidConnections: number;
    connectionCounter: number;
    parentConnectionName?: string;
};

export type CoordinateProps = {
    x: string | number;
    y: string | number;
};

export type PointCoordinateProps = {
    A: CoordinateProps;
    A1: CoordinateProps;
    A2: CoordinateProps;
    A3: CoordinateProps;
    B: CoordinateProps;
};

export type AttrProps = {
    [key: string]: string | number;
};

export type RaphaelAttributesCustomProps = RaphaelAttributes & {
    updatePosition?: boolean;
    attr: AttrProps;
};

type PaperProps = {
    remove: () => void;
};
type PapersProps = {
    [key: string]: PaperProps;
};

export type DataFunctionFormatWithSetProps = DataFunctionFormatProps & {
    set: RaphaelBaseElement;
};

type NodeListrops = {
    [key: string]:
        | DataFunctionFormatWithSetProps
        | Partial<DataFunctionFormatWithSetProps>;
};

export type NodeSelectedProps = {
    circle?: string;
    is_circle_selected?: boolean;
    node?: string;
};

type NodeProps = {
    list: NodeListrops;
    selected: NodeSelectedProps;
};

type NodesProps = {
    [key: string]: NodeProps;
};

type GlobalProps = {
    papers: PapersProps;
    nodes: NodesProps;
    draggedFunctionInsideIsHovering: boolean;
    selectedNode: string | null;
    glowElement: RaphaelBaseElement | null;
};

// Global variables
export const global: GlobalProps = {
    // Raphael paper instances
    papers: {},

    // Node data
    nodes: {},

    // flag for accepting drag end value from the dragged function, when hovering inside
    // the connector circle, used only on drag function within eventflow
    draggedFunctionInsideIsHovering: false,

    selectedNode: null,

    glowElement: null,
};

// Default x & y coordinate
export const defaultX = 120;
export const defaultY = 50;

// Distance between shapes x & y axis
// distance from top left and top left of the other shape
export const distanceX = 200;
export const distanceY = 120;

// width/height + distance between shapes
export const distanceWithWidth = 210;
export const distanceWithHeight = 120;

export const defaultWidth = 180;
export const defaultHeight = 40;
