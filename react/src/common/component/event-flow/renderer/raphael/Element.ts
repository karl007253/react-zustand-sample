import Raphael, { RaphaelElement, RaphaelPath } from "raphael";
import { generateId } from "./Helper";
import {
    AttrProps,
    RaphaelPaperWithIdProps,
    RaphaelSetWithIdProps,
} from "./Variables";

type ElementProps = {
    x?: string | number;
    y?: string | number;
    rx?: number;
    ry?: number;
    r?: number;
    d?: (string | number)[] | string;
    width?: number;
    height?: number;
    text?: string;
    updatePosition?: boolean;
    attr?: AttrProps;
};

/**
 * Updates the props of an element
 * @param {Raphael Element} element
 * @param {object} props
 */
const updateElementProps = (
    element: RaphaelSetWithIdProps | RaphaelElement | RaphaelPath,
    props: ElementProps
) => {
    const currentElement = element;
    if (currentElement) {
        // Fix matrix bug
        // element.matrix = Raphael.matrix();
        currentElement.matrix = Raphael.matrix(0, 0, 0, 0, 0, 0); // mock using 0 as matrix parameter
        // currentElement.attr("transform", "");
        currentElement.attr({ transform: "" });

        // Loop through all props
        if (props) {
            Object.keys(props).forEach((i) => {
                // for (let i in props) {
                const prop = props[i as keyof ElementProps];
                switch (i) {
                    case "attr": {
                        if (prop) {
                            currentElement.attr(prop as AttrProps);
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
        }
    }
};

/**
 * Creates an element from a paper (Raphael)
 * @param {Raphael} paper
 * @param {string} type
 * @param {object} props
 * @returns {Raphael Element}
 */
const createElement = (
    paper: RaphaelPaperWithIdProps,
    type: string,
    props?: ElementProps
) => {
    let element: RaphaelSetWithIdProps | RaphaelElement | RaphaelPath = {} as
        | RaphaelSetWithIdProps
        | RaphaelElement
        | RaphaelPath;

    switch (type) {
        case "set": {
            element = paper.set();
            element.id = generateId("set");
            break;
        }
        case "ellipse": {
            if (props) {
                const { x, y, rx, ry } = props;
                if (
                    typeof x === "number" &&
                    typeof y === "number" &&
                    typeof rx === "number" &&
                    typeof ry === "number"
                ) {
                    element = paper.ellipse(x, y, rx, ry);
                }
            }

            break;
        }
        case "circle": {
            if (props) {
                const { x, y, r } = props as ElementProps;
                if (
                    typeof x === "number" &&
                    typeof y === "number" &&
                    typeof r === "number"
                ) {
                    element = paper.circle(x, y, r);
                }
            }
            break;
        }
        case "rect": {
            if (props) {
                const { x, y, width, height, r } = props as ElementProps;
                if (
                    typeof x === "number" &&
                    typeof y === "number" &&
                    typeof width === "number" &&
                    typeof height === "number" &&
                    typeof r === "number"
                ) {
                    element = paper.rect(x, y, width, height, r);
                }
            }
            break;
        }
        case "text": {
            if (props) {
                const { x, y, text } = props as ElementProps;
                if (
                    typeof x === "number" &&
                    typeof y === "number" &&
                    typeof text === "string"
                ) {
                    element = paper.text(x, y, text);

                    // Check if need to update the x and y position
                    if ((props as ElementProps)?.updatePosition) {
                        // Get the text Length
                        // let textLength = parseInt(element.node.textLength.baseVal.value / 2);
                        const textLength =
                            element.node instanceof SVGTextElement
                                ? Math.round(
                                      (element.node as SVGTextElement)
                                          .textLength.baseVal.value / 2
                                  )
                                : 0;

                        // update the x and y
                        element.attr({
                            x:
                                textLength +
                                parseInt(
                                    (element.attr("x") || "").toString(),
                                    10
                                ),
                            y: parseInt(
                                (element.attr("y") || "").toString(),
                                10
                            ),
                        });
                    }
                }
            }
            break;
        }
        case "path": {
            if (props) {
                let { d } = props;
                if (!d || d.length === 0) {
                    d = "M0,0L0,0Z";
                }
                element = paper.path(d as string);
            }
            break;
        }
        default:
            break;
    }

    if (props) {
        updateElementProps(element, props);
    }

    return element;
};

export default createElement;
