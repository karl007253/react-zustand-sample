import { render, screen } from "@testing-library/react";
import ActionFormat, {
    SelectedSubFlowsProps,
    GlobalActionFormat,
} from "./data/Functions";

import EventFlow from "./EventFlow";

describe("Component: EventFlow", () => {
    const mockFunction = jest.fn();
    const mockObject = {};
    const mockArray: SelectedSubFlowsProps[] = [];
    const mockFunctions: ActionFormat[] = [
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
    ];
    const mockGlobalFunctions: GlobalActionFormat[] = [
        {
            function: "global1",
            parameter: {},
            process: [
                {
                    function: "log",
                    parameter_type: {},
                    parameter: {},
                    uuid: "Global-log-1",
                },
            ],
            result: "",
            uuid: "Global-1",
        },
        {
            function: "global2",
            parameter: {},
            process: [
                {
                    function: "Variable.set",
                    parameter_type: {},
                    parameter: {
                        key: "keytest",
                        value: "value-test",
                    },
                    uuid: "Global-Variable.set-2",
                },
            ],
            result: "",
            uuid: "Global-2",
        },
    ];

    beforeEach(() =>
        render(
            <EventFlow
                onUpdate={mockFunction}
                functions={mockFunctions}
                functionLists={mockObject}
                selectedFunction={null}
                setSelectedFunction={mockFunction}
                selectedSubFlows={mockArray}
                setSelectedSubFlows={mockFunction}
                globalFunctions={mockGlobalFunctions}
                selectedGlobalFunction={null}
                onUpdateGlobal={mockFunction}
            />
        )
    );

    it("should have event-flow-main div", () => {
        expect(screen.getByTestId("event-flow-main")).toBeInTheDocument();
    });
});
