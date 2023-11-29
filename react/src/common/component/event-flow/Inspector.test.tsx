import { render, screen } from "@testing-library/react";
import ActionFormat, {
    SelectedSubFlowsProps,
    GlobalActionFormat,
} from "./data/Functions";

import Inspector from "./Inspector";

describe("Component: Inspector", () => {
    const mockFunction = jest.fn();
    const mockArray: SelectedSubFlowsProps[] = [];
    const mockFunctions: ActionFormat[] = [
        {
            function: "log",
            parameter: {
                message: "sample",
            },
            uuid: "uuid1",
            res: {
                info: {
                    version: 2,
                },
                params: {
                    message: "string",
                },
            },
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
    const mockSelectedFunction = {
        data: {
            function: "log",
            parameter: {
                message: "sample",
            },
            uuid: "uuid1",
            res: {
                info: {
                    version: 2,
                },
                params: {
                    message: "string",
                },
            },
        },
        flowIndex: 0,
    };

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

    describe("selectedFunction is not null", () => {
        beforeEach(() =>
            render(
                <Inspector
                    type="action"
                    functions={mockFunctions}
                    onUpdate={mockFunction}
                    selectedFunction={mockSelectedFunction}
                    setSelectedFunction={mockFunction}
                    selectedSubFlows={mockArray}
                    setSelectedSubFlows={mockFunction}
                    globalFunctions={mockGlobalFunctions}
                    selectedGlobalFunction={null}
                    onUpdateGlobal={mockFunction}
                />
            )
        );

        it("should have Copy button", () => {
            expect(
                screen.getByRole("button", {
                    name: "common.button.copy",
                })
            ).toBeInTheDocument();
        });

        it("should have Paste button", () => {
            expect(
                screen.getByRole("button", {
                    name: "common.button.paste",
                })
            ).toBeInTheDocument();
        });

        it("should have a name of the function in the inspector header", () => {
            const name = `${
                (mockSelectedFunction.data as ActionFormat).function
            } eventFlow.inspector.header.title`;
            expect(screen.getByRole("tab", { name })).toBeInTheDocument();
        });
    });

    describe("selectedFunction is null", () => {
        beforeEach(() =>
            render(
                <Inspector
                    type="action"
                    functions={mockFunctions}
                    onUpdate={mockFunction}
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
        it("should display no parameters if selectedFunction is null ", () => {
            const noParameters = "eventFlow.inspector.message.noParameters";
            expect(screen.getByText(noParameters)).toBeInTheDocument();
        });
    });
});
