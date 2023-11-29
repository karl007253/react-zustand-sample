import { RaphaelBaseElement, RaphaelElement, RaphaelPath } from "raphael";
import { nanoid } from "nanoid";
import { cloneDeep } from "lodash";
import React from "react";
import createPaper from "./Paper";
import createElement from "./Element";
import { computeConnectionPoints, wrapText, draggable } from "./Helper";
import {
    defaultY,
    distanceY,
    defaultWidth,
    defaultHeight,
    global,
    NodeSelectedProps,
    DataFunctionFormatWithSetProps,
    AttrProps,
    ComputeConnectionPointsProps,
    PointCoordinateProps,
    CoordinateProps,
    RaphaelPaperWithIdProps,
    RaphaelPaperWithEventsAndConnectionOptionsAndPathOptionsProps,
    RaphaelPaperWithEventsAndConnectionOptionsProps,
    RaphaelPaperWithEventsProps,
    RaphaelSetWithIdProps,
    DragEndProps,
} from "./Variables";
import { getActionFormatVariableByParameter } from "../../../helper/Function";
import {
    CombinedActionFormat,
    CombinedActionFormatParameterProps,
    ConnectionProps,
    DataFunctionFormatProps,
} from "../../data/Functions";

type ConnectionPointsProps = {
    point: PointCoordinateProps;
    textPos: CoordinateProps;
    circlePos: CoordinateProps;
};

type CircleOptionsProps = {
    zoomFlow: boolean | undefined;
    subFlow?: boolean;
    isFirstItemDeleted?: boolean;
    parentConnectionName?: string;
    totalConnections: number;
    connectionText?: string;
    // isPresetValue: boolean;
};

type CreateCircleDataProps = {
    from: Partial<DataFunctionFormatWithSetProps>;
    to: Partial<DataFunctionFormatWithSetProps>;
    sibling: Partial<DataFunctionFormatWithSetProps> | null;
};

type CreateCircleOptionsProps = CoordinateProps & {
    attr: AttrProps;
    data: CreateCircleDataProps;
    opt: Partial<RaphaelPaperWithEventsAndConnectionOptionsAndPathOptionsProps>;
};

type NodeWithCircleProps = Node & {
    parentData: DataFunctionFormatProps;
    options: {
        connectionText: string;
    };
    data: DataFunctionFormatProps;
};

/**
 * Removes the glow of a previous element
 */
const removeGlow = () => {
    // Remove the previous glow
    if (global.glowElement) {
        global.glowElement.remove();
    }
};

/**
 * Glows an element
 * @param {Raphael Element} element
 */
const glow = (
    element: RaphaelSetWithIdProps | RaphaelElement | RaphaelPath
) => {
    // Remove the previous glow
    removeGlow();

    // Stores the glow element in a global variable
    global.glowElement = element.glow({
        width: 11,
        fill: true,
        color: "gray",
        opacity: 0.5,
    });
};

/**
 * Set the selected node/circle
 */
const setSelected = (paperId: string, selection: NodeSelectedProps) => {
    if (typeof selection === "object") {
        const node = global.nodes[paperId];
        node.selected = {
            ...node.selected,
            ...selection,
            is_circle_selected: selection.circle !== undefined,
        };
    }

    // set selectedNode for glow reference
    global.selectedNode = (selection.node ?? selection.circle) || null;
};

/**
 * Glow node if selected
 * @param {Raphael Set} set
 * @param {string} uuid
 * @returns {object}
 */
const glowNodeIfSelected = (
    set: RaphaelSetWithIdProps | RaphaelElement | RaphaelPath,
    uuid: string
) => {
    // check if node is selected
    if (global.selectedNode === uuid) {
        glow(set); // add glow
    }
};

/**
 * Create a node
 * @param {Raphael} paper
 * @param {string} type
 * @param {object} data
 * @param {object} options
 */
const createNode = (
    paper: RaphaelPaperWithIdProps,
    type: string,
    data: Partial<DataFunctionFormatWithSetProps>,
    options: RaphaelPaperWithEventsAndConnectionOptionsProps /* = {} */
) => {
    const currentData: Partial<DataFunctionFormatWithSetProps> = data;
    // Save the data to storage node
    global.nodes[paper.id || ""].list[currentData?.id || ""] = currentData;

    // Create set
    const set = createElement(paper, "set");

    // Compute for the x coordinate
    const { position } = currentData;
    const x =
        options.totalXcoordinate <= 1
            ? (options.width - defaultWidth) / 2 +
              (options.width > 300 ? -50 : 90)
            : position?.x;
    const cursor = type === "ellipse" ? "default" : "move";

    // Process comment
    const isComment = currentData.name === "comment";
    const actionParameter = getActionFormatVariableByParameter(
        currentData.data as CombinedActionFormat,
        "parameter"
    ) as CombinedActionFormatParameterProps;
    const comment = isComment ? (actionParameter?.value as string) : "";
    const text = isComment && comment ? wrapText(comment) : currentData.name;

    // Handles the click event of the node
    const handleClick = (e: React.MouseEvent) => {
        // This prevents the event from bubbling to children elements
        if (e) {
            e.stopPropagation(); // check e for programmatically triggerClick case
        }

        glow(set);

        // Set this node as selected
        // Use the function uuid
        setSelected(paper.id || "", { node: currentData?.data?.uuid });

        if (typeof options?.events?.onNodeClick === "function") {
            options.events.onNodeClick({
                data: currentData as DataFunctionFormatProps,
            });
        }
    };

    // Handles the double click event of the node
    const handleDoubleClick = (e: React.MouseEvent) => {
        // This prevents the event from bubbling to children elements
        e.stopPropagation();

        if (typeof options?.events?.onNodeDoubleClick === "function") {
            options.events.onNodeDoubleClick({
                data: currentData as CombinedActionFormat,
                options: { flowIndex: options.index },
            });
        }
    };

    // Triggers when the node is being drag
    const handleDragMove = () => {
        if (typeof options?.events?.onNodeDragMove === "function") {
            // Pass the data and element being drag
            options.events.onNodeDragMove({
                data: currentData as CombinedActionFormat,
                element: set,
            });
        }
    };

    // Triggers when the node started to drag
    const handleDragStart = () => {
        removeGlow();

        if (typeof options?.events?.onNodeDragStart === "function") {
            // Pass the data and element being drag
            options.events.onNodeDragStart({
                data: currentData as CombinedActionFormat,
                element: set,
            });
        }
    };

    // Triggers when the node has stop dragging
    const handleDragEnd = ({ resetElement, event }: DragEndProps) => {
        // Trigger the drag end event
        if (typeof options?.events?.onNodeDragEnd === "function") {
            // Pass the data and element being drag
            options.events.onNodeDragEnd({
                data: currentData as CombinedActionFormat,
                element: set,
            });
        }

        if (global.draggedFunctionInsideIsHovering) {
            // reset to false
            global.draggedFunctionInsideIsHovering = false;

            // If the target is circle then trigger the event for circle function drop
            // typecast as NodeWithCircleProps for custom attribute like parentData
            if (event.target instanceof Node) {
                if (event.target.nodeName === "circle") {
                    const parent = (event.target as NodeWithCircleProps)
                        .parentData;
                    const parentOptions =
                        (event.target as NodeWithCircleProps).options || {};
                    const parentList = parent.parent_list || [];
                    const eventData = (event.target as NodeWithCircleProps)
                        .data;

                    // Check if the parent of this target function is not the function being dragged and the function itself
                    if (
                        typeof options?.events?.onNodeCircleFunctionDrop ===
                            "function" &&
                        parentList.indexOf(currentData.id || "") === -1 &&
                        currentData.id !== parent.id
                    ) {
                        // Get the "connectionText" from the parent's options
                        options.events.onNodeCircleFunctionDrop(
                            {
                                parent,
                                data: eventData,
                                draggedFunction:
                                    currentData as DataFunctionFormatProps,
                                type: "move",
                                options: {
                                    connectionText:
                                        parentOptions.connectionText || "",
                                },
                            } /* ,
                            { resetElement } */
                        );
                        return;
                    }
                }
            }
        }

        // Reset the element back to its original position
        resetElement();

        // Set this node selected (if selected)
        glowNodeIfSelected(set, currentData?.data?.uuid || "");
    };

    // Select which type of shape to create
    switch (type) {
        case "ellipse": {
            const attr = { fill: "#fff", stroke: "#aaa", "stroke-width": 2 };
            (set as RaphaelSetWithIdProps).push(
                createElement(paper, "ellipse", {
                    ...position,
                    attr,
                    x,
                    rx: 35,
                    ry: 17,
                }) as RaphaelElement
            );
            break;
        }
        case "rect": {
            const attr: AttrProps = {
                cursor,
                fill: isComment ? "#f9f902" : "#fff",
                stroke: "#aaa",
                "stroke-width": 2,
            };
            const rectElement = createElement(paper, "rect", {
                attr,
                x: (x || 0) - 90,
                y: (position?.y || 0) - 20,
                width: defaultWidth,
                height: defaultHeight,
                r: 5,
            }) as RaphaelElement;
            (set as RaphaelSetWithIdProps).push(rectElement);

            // Display tooltip if this is a comment
            if (isComment) {
                rectElement.node.innerHTML = `<title>${comment}</title>`;
            }

            break;
        }
        default:
            break;
    }

    // The text to display
    const attr = {
        cursor,
        fill: "#919191",
        "font-size": 12,
        "font-style": isComment ? "italic" : "",
    };
    const textElement = createElement(paper, "text", {
        ...position,
        attr,
        x,
        text,
    }) as RaphaelElement;
    (set as RaphaelSetWithIdProps).push(textElement);

    // Display tooltip if this is a comment
    if (isComment) {
        const title = document.createElement("title");
        title.innerText = comment;
        textElement.node.appendChild(title);
    }

    // Add the Raphael "set"
    // Use for computing the connection points
    // TODO: fix error "Type instantiation is excessively deep and possibly infinite."
    (currentData as any).set = set;

    // Draggable if this node is not ellipse
    if (type !== "ellipse") {
        // Set this node selected (if selected)
        glowNodeIfSelected(set, currentData?.data?.uuid || "");

        // TODO: fix error "Type instantiation is excessively deep and possibly infinite."
        (set as any).dblclick(handleDoubleClick);
        (set as any).click(handleClick);

        // Node draggable
        draggable(set, {
            move: handleDragMove,
            start: handleDragStart,
            end: handleDragEnd,
            click: handleClick,
            dblclick: handleDoubleClick,
        });
    }
};

/**
 * Checks whether an element will have a circle or not
 * @param {CircleOptionsProps} options
 * @returns {boolean}
 */
const hasCircle = (options: CircleOptionsProps) => {
    const subFlow = !!options.subFlow;
    const zoomFlow = !!options.zoomFlow;

    // With circle, if:
    // - not a zoomflow
    // - not a subflow
    // - if it is a subflow, it must be children of the parent function which has callback
    // - if it is a zoomflow, it must be children of the parent function which has callback
    // - there's a connection
    // - not on the first node, except on the flowIndex 0 (main flow) while also not inside a zoom flow
    // - not a presetValue

    return (
        (!options.isFirstItemDeleted ||
            options.connectionText ||
            (zoomFlow && options.parentConnectionName) ||
            (subFlow && options.parentConnectionName) ||
            options.totalConnections > 0) &&
        // - make circle not visible on presetValue or on the subflow if it's not the children of a shape with callback
        !(
            subFlow /* || options.isPresetValue */ &&
            !zoomFlow &&
            !options.parentConnectionName &&
            options.totalConnections === 0
        )
    );
};

/**
 * Creates a circle in the connection arrow
 * @param {Raphael} paper
 * @param {Raphael Set} set
 * @param {object} options
 */
const createCircle = (
    paper: RaphaelPaperWithIdProps,
    set: RaphaelSetWithIdProps | RaphaelElement | RaphaelPath,
    options: CreateCircleOptionsProps
) => {
    const { data, opt, ...rest } = options;
    const { from, to, sibling } = data;
    const parent = sibling || from;
    const circleId = `c-${parent?.data?.uuid}`; // if undefined, its the first circle

    // Creates the circle element
    const element = createElement(paper, "circle", { ...rest, r: 10 });

    // Handles the click event for the circle
    const handleClick = (e: React.MouseEvent) => {
        // This prevents the event from bubbling to children elements
        e.stopPropagation();

        glow(element);

        // Set the selection
        // Use the function uuid
        setSelected(paper.id || "", { circle: circleId });

        if (typeof opt?.events?.onNodeCircleClick === "function") {
            // If no sibling then get the "from" data
            opt.events.onNodeCircleClick({
                parent: parent as DataFunctionFormatProps,
                options: { connectionText: opt.connectionText || "" },
            });
        }
    };

    // Handles the drop event for the circle
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        // Change the color of the circle back to "#8a8a8a"
        element.attr({ fill: "#8a8a8a" });

        if (
            typeof opt?.events?.onNodeCircleFunctionDrop === "function" &&
            e.dataTransfer.getData("Origin") === "Function"
        ) {
            const draggedFunctionName = e.dataTransfer.getData("Text");
            const currentParent = sibling || from;
            opt.events.onNodeCircleFunctionDrop({
                draggedFunctionName,
                parent: currentParent as DataFunctionFormatProps,
                data: to as DataFunctionFormatProps,
                type: "new",
                options: { connectionText: opt.connectionText || "" },
            });

            // unset selectedNode to clear glow
            global.selectedNode = null;
        }
    };

    // Handles the drag over
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        element.attr({ fill: "red" });
    };

    // Handles the drag complete of a circle
    const handleDragEnd = () => {
        // Change the color of the circle back to "#8a8a8a"
        element.attr({ fill: "#8a8a8a" });
    };

    // Event that fires when this circle is hovered in
    const handleHoverIn = () => {
        global.draggedFunctionInsideIsHovering = true;
    };

    // Event that fires when this circle is hovered out
    const handleHoverOut = () => {
        global.draggedFunctionInsideIsHovering = false;
    };

    // Handles the right click event of a circle
    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        glow(element);

        if (typeof opt?.events?.onNodeCircleRightClick === "function") {
            // If no sibling then get the "from" data
            opt.events.onNodeCircleRightClick({
                parent: (sibling
                    ? sibling.data
                    : from.data) as CombinedActionFormat,
                options: { connectionText: opt.connectionText || "" },
            });
        }
    };

    // TODO: fix error "Type instantiation is excessively deep and possibly infinite."
    (element as any).unclick();
    (element as any).click(handleClick);
    element.hover(handleHoverIn, handleHoverOut);

    // Drag and drop events
    (element as any).node.addEventListener("drop", handleDrop);
    (element as any).node.addEventListener("dragover", handleDragOver);
    (element as any).node.addEventListener("dragleave", handleDragEnd);
    (element as any).node.addEventListener("contextmenu", handleRightClick);

    // Save the data here to be use for checking if the function can be added (paste) in this node
    (element as any).node.parentData = sibling || from;
    (element as any).node.data = to;
    (element as any).node.options = { connectionText: opt.connectionText };

    // Set this node selected (if selected)
    glowNodeIfSelected(element, circleId);

    // Add to the set
    (set as RaphaelSetWithIdProps).push(element as RaphaelElement);
};

/**
 * Creates a path (connection arrow)
 * @param {Raphael} paper
 * @param {object} from
 * @param {object} to
 * @param {object} options
 */
const createPath = (
    paper: RaphaelPaperWithIdProps,
    from: Partial<DataFunctionFormatWithSetProps>,
    to: Partial<DataFunctionFormatWithSetProps>,
    options: Partial<RaphaelPaperWithEventsAndConnectionOptionsAndPathOptionsProps> /* = {} */
) => {
    // If there's no "from" and "to" node then exit
    if (!(from && to)) {
        return;
    }

    // Create set
    const set = createElement(paper, "set");

    const parentConnectionName = to.parent_connection_name;
    const sibling = to.sibling
        ? global.nodes[paper.id || ""].list[to.sibling]
        : null;
    const firstSibling = to.first_sibling
        ? global.nodes[paper.id || ""].list[to.first_sibling]
        : null;

    // Options for computing connection point
    const opt: ComputeConnectionPointsProps = {
        sibling: firstSibling?.set,

        totalConnections: from.total_connections || 0,
        totalValidConnections: 0,
        connectionCounter: options.connectionCounter || 0,

        // callbacks (yes/no/<or other callback name>)
        parentConnectionName,
    };

    // Get the total valid connection of the parent shape
    if (from?.connections) {
        Object.keys(from.connections).forEach((i) => {
            // for (let i in from.connections) {
            if (
                (from?.connections?.[i as keyof ConnectionProps]?.length ?? 0) >
                0
            ) {
                opt.totalValidConnections += 1;
                // opt.totalValidConnections++;
            }
        });
    }

    const { point, textPos, circlePos } = computeConnectionPoints(
        from.set as RaphaelBaseElement,
        to.set as RaphaelBaseElement,
        options.connectionText || "",
        opt
    ) as ConnectionPointsProps;
    const d = [
        "M",
        point.A.x,
        point.A.y,
        "L",
        point.A1.x,
        point.A1.y,
        point.A2.x,
        point.A2.y,
        point.A3.x,
        point.A3.y,
        point.B.x,
        point.B.y,
    ];

    const attr = {
        color: "#000",
        fill: "none",
        stroke: "#8a8a8a",
        "stroke-width": 2,
    };
    (set as RaphaelSetWithIdProps).push(
        createElement(paper, "path", { attr, d }) as RaphaelElement
    );

    // Generate an arrow heads
    const lineArrow = 5;
    const pathArrow = [
        "M",
        (point.B.x as number) - lineArrow,
        (point.B.y as number) - lineArrow,
        "L",
        point.B.x,
        point.B.y,
        (point.B.x as number) + lineArrow,
        (point.B.y as number) - lineArrow,
    ];
    (set as RaphaelSetWithIdProps).push(
        createElement(paper, "path", { attr, d: pathArrow }) as RaphaelElement
    );

    // Connection text
    if (options.connectionText) {
        // Updates the x and y position
        const updatePosition = true;

        const currentAttr = { fill: "#000", "font-size": 12 };
        (set as RaphaelSetWithIdProps).push(
            createElement(paper, "text", {
                ...textPos,
                attr: currentAttr,
                updatePosition,
                text: options.connectionText,
            }) as RaphaelElement
        );
    }

    const circleOptions: CircleOptionsProps = {
        zoomFlow: options.zoomFlow,
        subFlow: options.subFlow,
        isFirstItemDeleted: options.isFirstItemDeleted,
        parentConnectionName: opt.parentConnectionName,
        totalConnections: opt.totalConnections,
        connectionText: options.connectionText,
        // isPresetValue: options.eventSelected === "presetValue", // isPresetValue
    };

    // Check if this path has circle
    if (hasCircle(circleOptions)) {
        const currentAttr = {
            fill: "#8a8a8a",
            color: "#000",
            stroke: "#8a8a8a",
            cursor: "hand",
            "z-index": 100,
        };
        createCircle(paper, set, {
            ...circlePos,
            attr: currentAttr,
            opt: options,
            data: { from, to, sibling },
        });
    }
};

/**
 * Get the selected node/circle (function uuid)
 * @param {string} paperId
 * @returns {object}
 */
// const getSelected = (paperId: string) => {
//     return global.nodes[paperId].selected;
// };

/**
 * Get the previous selected node/circle using the previous paper id
 * @param {string} id
 * @returns {object}
 */
const getPreviousSelected = (id: string) => {
    let result = { node: "", circle: "" };

    if (typeof global.nodes[id] !== "undefined") {
        result = { ...result, ...global.nodes[id].selected };
    }

    return result;
};

/**
 * Create nodes recursively
 * @param {Raphael} paper
 * @param {array} data
 * @param {object} parent
 * @param {object} options
 */
const createNodesRecursive = (
    paper: RaphaelPaperWithIdProps,
    data: DataFunctionFormatProps[],
    parent: Partial<DataFunctionFormatProps>,
    options: RaphaelPaperWithEventsAndConnectionOptionsProps /* = {} */
) => {
    let connectionText = options.connectionText || "";

    // Get the global nodes
    const nodes = global.nodes[paper.id || ""].list;

    data.forEach((dataRow, i) => {
        // for (let i in data) {
        const node = cloneDeep(data[i]);

        const type = node.end ? "ellipse" : "rect";
        createNode(paper, type, node, { ...options, connectionText });

        // Get the "from" data
        const from = node.fromId ? nodes[node.fromId] : parent;

        // delete the first circle of a flow except the main flow without zoom flow, and the end circle without parent and fromId
        const isFirstItemDeleted = !!(
            (i === 0 &&
                (options.zoomFlow || options.index !== 0 || options.subFlow)) ||
            (node && node.end === true && !node.parent && !node.fromId)
        );

        // Create a path between parent and current node
        createPath(paper, from, node, {
            ...options,
            type,
            isFirstItemDeleted,
            connectionText,
        });

        // Counts the connection
        // This is not the total number of connection
        let connectionCounter = 0;

        Object.keys(node.connections).forEach((n) => {
            // for (let n in node.connections) {
            const opt = {
                ...options,
                connectionText: n,
                connectionCounter,
            };

            createNodesRecursive(
                paper,
                node.connections[
                    n as keyof ConnectionProps
                ] as DataFunctionFormatProps[],
                node,
                opt
            );

            // Increment the counter
            connectionCounter += 1;
            // connectionCounter++;
        });

        // Remove the connection text for the next shape
        // Only the first shape in the list will use this
        connectionText = "";
    });
};

/**
 * Create nodes
 * @param {HTMLDivElement} container
 * @param {object} options
 * @returns {Raphael}
 */
const createNodes = (
    container: HTMLDivElement,
    options: RaphaelPaperWithEventsProps
) => {
    const startX = 200;

    const prevSelected = getPreviousSelected(options.oldPaperId || "");

    // Create the paper for all the nodes
    const paper = createPaper(container, options);

    // Clear the storage for this paper
    if (paper.id) {
        global.nodes[paper.id] = {
            // List of nodes
            list: {},

            // Selected node/circle
            selected: prevSelected,
        };
    }

    // Get the events and the rest of options assign to "rest" variable
    const {
        onNodeClick,
        onNodeCircleClick,
        onNodeDoubleClick,
        onNodeCircleFunctionDrop,
        onNodeCircleRightClick,
        onNodeDragStart,
        onNodeDragMove,
        onNodeDragEnd,
        ...rest
    } = options;

    const events = {
        onNodeClick,
        onNodeCircleClick,
        onNodeDoubleClick,
        onNodeCircleFunctionDrop,
        onNodeCircleRightClick,
        onNodeDragStart,
        onNodeDragMove,
        onNodeDragEnd,
    };

    // Create start node
    const startData = {
        id: nanoid(),
        name: "Start",
        position: { x: startX, y: defaultY },
        connections: {},
    };
    createNode(paper, "ellipse", startData, { ...rest });

    if (options.data.length > 0) {
        // Loop through all data
        createNodesRecursive(paper, options.data, startData, {
            ...rest,
            events,
        });
    } else {
        const type = "ellipse";

        // Create end node
        const endData = {
            id: nanoid(),
            name: "End",
            position: { x: startX, y: defaultY + distanceY },
            connections: {},
        };
        createNode(paper, type, endData, { ...rest });

        // Create a path between parent and current node
        createPath(paper, startData, endData, { type, events });
    }

    return paper;
};

export default createNodes;
