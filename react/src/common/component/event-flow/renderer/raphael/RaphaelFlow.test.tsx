import { render, screen } from "@testing-library/react";
import { getDataFunctions } from "../../../helper/Function";
import ActionFormat from "../../data/Functions";

import RaphaelFlow from "./RaphaelFlow";
import { defaultX, defaultY, distanceX, distanceY } from "./Variables";

describe("Component: RaphaelFlow", () => {
    const mockHandleFunction = jest.fn();
    const functions: ActionFormat[] = [
        {
            function: "gotoPage2",
            parameter: {
                p: "pg2",
            },
            uuid: "uuid1",
        },
        {
            function: "gotoPage3",
            parameter: {
                p: "pg3",
            },
            uuid: "uuid2",
        },
    ];

    // Initial coordinates
    const x = defaultX;
    const y = defaultY;
    let paperWidth = 300;
    let paperHeight = 400;
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

    beforeEach(() =>
        render(
            <RaphaelFlow
                data={result.functions}
                width={paperWidth}
                height={paperHeight}
                index={0}
                subFlow={false}
                zoomFlow={false}
                totalXcoordinate={1}
                onNodeClick={mockHandleFunction}
                onNodeCircleClick={mockHandleFunction}
                onNodeDoubleClick={mockHandleFunction}
                onNodeCircleFunctionDrop={mockHandleFunction}
                onNodeCircleRightClick={mockHandleFunction}
                onNodeDragMove={mockHandleFunction}
                onNodeDragEnd={mockHandleFunction}
            />
        )
    );

    it("should have Start element", async () => {
        const searchText = "Start";

        const searchResult = await screen.findAllByText(
            new RegExp(searchText, "i")
        );
        expect(searchResult.length).toBeGreaterThan(0);
    });

    it("should have End element", async () => {
        const searchText = "End";

        const searchResult = await screen.findAllByText(
            new RegExp(searchText, "i")
        );
        expect(searchResult.length).toBeGreaterThan(0);
    });
});
