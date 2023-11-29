import { useEffect, useState, useRef } from "react";
import { findLastKey, isEmpty } from "lodash";
import createNodes from "./Node";
import { global } from "./Variables";
import { DataFunctionFormatProps } from "../../data/Functions";
import {
    onNodeCircleFunctionDropProps,
    onNodeCircleClickProps,
    onNodeClickProps,
    onNodeDoubleClickProps,
    onNodeDragProps,
    onNodeCircleRightClickProps,
} from "../Renderer";

type RaphaelFlowProps = {
    data: DataFunctionFormatProps[];
    width: number;
    height: number;
    index: number;
    subFlow: boolean;
    zoomFlow: boolean | undefined;
    totalXcoordinate: number;
    onNodeClick: (param: onNodeClickProps) => void;
    onNodeCircleClick: (param: onNodeCircleClickProps) => void;
    onNodeDoubleClick: (param: onNodeDoubleClickProps) => void;
    onNodeCircleFunctionDrop: (param: onNodeCircleFunctionDropProps) => void;
    onNodeCircleRightClick: (param: onNodeCircleRightClickProps) => void;
    onNodeDragMove: (param: onNodeDragProps) => void;
    onNodeDragEnd: (param: onNodeDragProps) => void;
};

/**
 * Renders a flow chart using Raphael JS
 */
const RaphaelFlow = ({
    data,
    width,
    height,
    index,
    subFlow,
    zoomFlow,
    totalXcoordinate,
    onNodeClick,
    onNodeCircleClick,
    onNodeDoubleClick,
    onNodeCircleFunctionDrop,
    onNodeCircleRightClick,
    onNodeDragMove,
    onNodeDragEnd,
}: RaphaelFlowProps) => {
    const [paperId, setPaperId] = useState<string | undefined>();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get the old paper id
        let oldPaperId = paperId;

        // check history of papers
        if (!paperId && !isEmpty(global.papers)) {
            oldPaperId = findLastKey(global.papers);
        }

        // const container = ReactDOM.findDOMNode(ref.current);
        const container = ref.current;
        if (!container) {
            return;
        }

        // Store the prev id
        let paperRefID;
        if (container.id) {
            paperRefID = container.id;
        }

        const paper = createNodes(container, {
            data,
            width,
            height,
            index,
            subFlow,
            zoomFlow,
            totalXcoordinate,
            onNodeClick,
            onNodeCircleClick,
            onNodeDoubleClick,
            onNodeCircleFunctionDrop,
            onNodeCircleRightClick,
            onNodeDragMove,
            onNodeDragEnd,
            oldPaperId,
        });

        if (paperRefID && global.papers[paperRefID]) {
            // Remove the previous
            global.papers[paperRefID].remove();

            // Remove nodes
            delete global.nodes[paperRefID];
            delete global.papers[paperRefID];
        }

        // Set the new paper id
        setPaperId(paper.id);
    }, [JSON.stringify(data)]);

    return (
        <div className="react-raphael-flow">
            <div ref={ref} />
        </div>
    );
};

export default RaphaelFlow;
