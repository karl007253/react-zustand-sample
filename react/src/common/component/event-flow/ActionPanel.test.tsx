import { render, screen } from "@testing-library/react";

import ActionPanel from "./ActionPanel";
import ActionFormat, { SelectedSubFlowsProps } from "./data/Functions";

describe("Component: ActionPanel", () => {
    const mockFunction = jest.fn();
    const mockObject = {};
    const mockArray: SelectedSubFlowsProps[] = [];
    const mockFunctions: ActionFormat[][] = [
        [
            {
                function: "gotoPage2",
                parameter: {
                    p: "pg2",
                },
                uuid: "uuid1",
            },
            {
                function: "Control.conditional",
                parameter: {
                    yesCallback: [
                        {
                            function: "div",
                            parameter: {},
                            uuid: "uuid2b",
                        },
                    ],
                    noCallback: [
                        {
                            function: "multi",
                            parameter: {},
                            uuid: "uuid2c",
                        },
                    ],
                },
                uuid: "uuid2",
            },
        ],
    ];
    const mockSelectedParentFunction = {
        function_uuid: "",
        connection_name: "",
        flowIndex: 0,
    };

    beforeEach(() =>
        render(
            <ActionPanel
                onUpdate={mockFunction}
                functions={mockFunctions}
                functionLists={mockObject}
                action={mockFunction}
                selectedParentFunction={mockSelectedParentFunction}
                handleCircleClicked={mockFunction}
                loading={false}
                selectedSubFlows={mockArray}
                zoom={[]}
                setZoom={mockFunction}
            />
        )
    );

    it("should have action-panel div", () => {
        expect(screen.getByTestId("action-panel")).toBeInTheDocument();
    });
});
