// import { globalVariables } from "../../../../data/Variables";
import {
    RaphaelAxisAlignedBoundingBox,
    RaphaelBaseElement,
    RaphaelElement,
    RaphaelPath,
} from "raphael";
import {
    CoordinateProps,
    global,
    PointCoordinateProps,
    ComputeConnectionPointsProps,
    RaphaelSetWithIdProps,
    DragEndProps,
} from "./Variables";

type PointProps = {
    top: CoordinateProps;
    bottom: CoordinateProps;
    left: CoordinateProps;
    right: CoordinateProps;
};

type PointsProps = {
    from: PointProps;
    to?: PointProps;
};

type DraggableEventsProps = {
    move: () => void;
    start: () => void;
    end: (param: DragEndProps) => void;
    click: (param: React.MouseEvent) => void;
    dblclick: (param: React.MouseEvent) => void;
};

/**
 * Generates id base from time and random numbers
 * @param {string} name
 * @returns {string}
 */
export const generateId = (name: string) => {
    return `${(name ? `${name}-` : "") + new Date().getTime()}-${Math.random()
        .toFixed(10)
        .replace(".", "")}`;
};

/**
 * Wrap the text and then put a newline after each line
 * @param {string} text The text that will be wrap
 * @param {number} maxChar The maximum characters per line
 * @param {number} limit The maximum limit of characters
 */
export const wrapText = (text: string, maxChar = 20, limit = 35) => {
    let currentText = text;
    // truncate the text if its length is greater than the limit
    if (currentText.length > limit) {
        currentText = `${currentText.substring(0, limit)}...`;
    }

    const results = [];
    const txt = currentText.split("");
    let count = 0;

    if (maxChar >= txt.length) {
        return currentText;
    }

    let length = maxChar;
    while (true) {
        const tmp = txt.slice(count, length);
        results.push(tmp.join(""));

        if (length >= txt.length) {
            break;
        }

        // get the last length for the next position
        count = length;

        length += maxChar;
        if (length > txt.length) {
            length = txt.length;
        }
    }

    return results.join("\n");
};

/**
 * Add drag events to Raphael Element
 * @param {RaphaelElement} element
 * @param {object} events
 */
export const draggable = (
    element: RaphaelSetWithIdProps | RaphaelElement | RaphaelPath,
    events: DraggableEventsProps
) => {
    let lx = 0;
    let ly = 0;
    let ox = 0;
    let oy = 0;
    let firstClick: number | undefined;
    let secondClick: number | undefined;
    let moved = false;

    // to reset the element's position
    const resetElement = () => {
        lx = 0;
        ly = 0;
        ox = 0;
        oy = 0;
        firstClick = undefined;
        secondClick = undefined;
        moved = false;

        // unknown as from where the items come(?)
        (element as any).items.forEach(
            (item: RaphaelBaseElement /* , i: number */) => {
                // for (var i in element.items) {
                item.transform("");
                // (element as any).items[i].transform("");
            }
        );
    };

    // triggers when the element is moving
    const move = function (dx: number, dy: number /* , x, y, event */) {
        // bring this element behind other elements
        element.toBack();

        lx = dx + ox;
        ly = dy + oy;
        element.transform(`t${lx},${ly}`);

        // to know if the object is dragging or not
        moved = !!(dx || dy);

        // transparent
        element.attr({ opacity: 0.6 });

        if (moved && typeof events.move === "function") {
            events.move();
        }
    };

    // triggers when the element has started to drag
    const start = function (/* x, y, event */) {
        if (typeof events.start === "function") {
            events.start();
        }
    };

    // triggers when the element is already finished dragging
    const end = function (event: React.DragEvent) {
        ox = lx;
        oy = ly;

        element.attr({ opacity: 1 });
        element.toFront();

        if (moved) {
            if (typeof events.end === "function") {
                // Return the function to reset the elements
                events.end({ resetElement, event });
            }
        } else if (
            typeof events.click === "function" ||
            typeof events.dblclick === "function"
        ) {
            if (!firstClick) {
                firstClick = new Date().getTime() / 1000;
            } else {
                secondClick = new Date().getTime() / 1000;
            }

            // This is the workaround for click and double click
            if (firstClick && secondClick) {
                const diff = secondClick - firstClick;
                if (diff <= 0.5) {
                    firstClick = 0;
                    secondClick = 0;
                    events.dblclick(event);
                } else {
                    firstClick = 0;
                    secondClick = 0;
                    events.click(event);
                }
            } else {
                setTimeout(function () {
                    firstClick = 0;
                    secondClick = 0;
                }, 1000);
                events.click(event);
            }
        }
    };

    element.undrag();
    // TODO: fix error "Type instantiation is excessively deep and possibly infinite."
    (element as any).drag(move, start, end);
};

/**
 * Get the connection point between from and to shape object
 * @param {object} from
 * @param {object} to
 * @returns {object}
 */
const getConnectionPoint = (
    from: RaphaelAxisAlignedBoundingBox,
    to?: RaphaelAxisAlignedBoundingBox
) => {
    const points: PointsProps = {
        from: {
            top: { x: from.x + from.width / 2, y: from.y - 1 },
            bottom: { x: from.x + from.width / 2, y: from.y + from.height + 1 },
            left: { x: from.x - 1, y: from.y + from.height / 2 },
            right: { x: from.x + from.width + 1, y: from.y + from.height / 2 },
        },
    };

    if (to) {
        points.to = {
            top: { x: to.x + to.width / 2, y: to.y - 1 },
            bottom: { x: to.x + to.width / 2, y: to.y + to.height + 1 },
            left: { x: to.x - 1, y: to.y + to.height / 2 },
            right: { x: to.x + to.width + 1, y: to.y + to.height / 2 },
        };
    }

    return points;
};

/**
 * Computes the connection point
 * @param {object} from
 * @param {object} to
 * @param {string} text The text to display in this connection
 * @param {object} options The options that will be use computing the points
 * @returns {object}
 */
export const computeConnectionPoints = (
    from: RaphaelBaseElement,
    to: RaphaelBaseElement,
    text: string,
    options: ComputeConnectionPointsProps
) => {
    // Make sure options is an object
    let newOptions = options;
    newOptions = options || {};

    // Get the connection point of two elements
    const fromBBox = from.getBBox();
    const toBBox = to.getBBox();
    const points = getConnectionPoint(fromBBox, toBBox);
    const siblingPoints = newOptions.sibling
        ? getConnectionPoint(newOptions.sibling.getBBox())
        : null;

    // Object use to plot the points
    const point: PointCoordinateProps = {
        A: { x: "", y: "" },
        A1: { x: "", y: "" },
        A2: { x: "", y: "" },
        A3: { x: "", y: "" },
        B: { x: "", y: "" },
    };

    // Circle and text position
    const circlePos: CoordinateProps = { x: "", y: "" };
    const textPos: CoordinateProps = { x: "", y: "" };

    if (
        newOptions.totalValidConnections > 1 &&
        !text &&
        newOptions.parentConnectionName &&
        newOptions.parentConnectionName !== "yes"
    ) {
        point.A.x = points.from.right.x;
        point.A.y = points.from.right.y;

        if (points.to) {
            point.B.x = points.to.top.x;
            point.B.y = points.to.top.y;
        }

        point.A1.x = siblingPoints?.from.top.x || "";
        point.A1.y = point.A.y;
        point.A2.x = point.A1.x;
        if (siblingPoints && siblingPoints.from) {
            point.A2.y =
                (point.A1.y as number) +
                ((siblingPoints.from.top.y as number) - (point.A.y as number)) /
                    2;
        } else {
            point.A2.y =
                (point.A1.y as number) + (0 - (point.A.y as number)) / 2;
        }
        point.A3.x = point.B.x;
        point.A3.y = point.A2.y;

        // circle position
        circlePos.x = point.B.x;
        circlePos.y = point.A3.y + ((point.B.y as number) - point.A3.y) / 2 - 5;
    } else {
        if (text && text !== "yes" && newOptions.connectionCounter !== 0) {
            if (fromBBox.x < toBBox.x) {
                point.A.x = points.from.right.x;
                point.A.y = points.from.right.y;
            } else {
                point.A.x = points.from.left.x;
                point.A.y = points.from.left.y;
            }

            if (points.to) {
                point.B.x = points.to.top.x;
                point.B.y = points.to.top.y;
            }

            // compute points between point A and B
            point.A1.x = point.B.x;
            point.A1.y = point.A.y;
        } else {
            point.A.x = points.from.bottom.x;
            point.A.y = points.from.bottom.y;

            if (points.to) {
                point.B.x = points.to.top.x;
                point.B.y = points.to.top.y;
            }

            // compute points between point A and B
            point.A1.x = point.A.x;
            point.A1.y =
                (point.A.y as number) +
                ((point.B.y as number) - (point.A.y as number)) / 2 -
                5;
        }

        point.A2.x = point.B.x;
        point.A2.y = point.A1.y;

        // circle position
        if (point.A.x !== point.B.x) {
            circlePos.x = point.A2.x;
            circlePos.y =
                (point.A2.y as number) +
                ((point.B.y as number) - (point.A2.y as number)) / 2 -
                (text ? 15 : 5);
        } else {
            circlePos.x = point.A.x;
            circlePos.y =
                (point.A.y as number) +
                ((point.B.y as number) - (point.A.y as number)) / 2 -
                20;
        }
    }

    // text position
    textPos.x = (circlePos.x as number) + 25;
    textPos.y = circlePos.y;

    return { point, circlePos, textPos };
};

// Raphael's programmatically trigger click node
export const triggerClickOnRaphaelNodeByUuid = (uuid: string) => {
    // trigger click event on Node to highlight/glow it from global.nodes
    const selectedNode = Object.values(global.nodes).find((node) => {
        return node.selected.node === uuid;
    });
    const selectedList =
        selectedNode &&
        Object.values(selectedNode.list).find((list) => {
            return list?.data?.uuid === uuid;
        });
    const element =
        selectedList &&
        selectedList?.set &&
        Object.values(selectedList?.set).find((set) => {
            return set.events;
        });
    if (element) {
        for (let i = 0, len = element.events.length; i < len; i++) {
            if (element.events[i].name === "click") {
                element.events[i].f();
            }
        }
    }
};

// // return actionRefs scroll property
// export const getScrollPropertyOnActionRefs = () => {
//     var scroll = {"top": {}, "left": {}}
//     Object.keys(globalVariables.actionRefs).forEach((index)=> {
//         scroll['top'][index] = globalVariables.actionRefs[index].scrollTop
//         scroll['left'][index] = globalVariables.actionRefs[index].scrollLeft
//     })
//     return scroll;
// }

//  // HACK: prevents autoscroll to the bottom after selecting functions on a big flow
//  export const setScrollPropertyOnActionRefs = (scroll) => {
//     Object.keys(globalVariables.actionRefs).forEach((index)=> {
//         setTimeout(() => {
//             if(globalVariables.actionRefs[index]){
//                 globalVariables.actionRefs[index].scrollTop = scroll['top'][index]
//                 globalVariables.actionRefs[index].scrollLeft = scroll['left'][index]
//             }
//         }, 100);
//     })
// }
