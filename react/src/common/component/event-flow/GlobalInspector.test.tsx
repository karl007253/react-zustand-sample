import { render, screen } from "@testing-library/react";
import {
    CombinedGlobalActionFormat,
    GlobalActionFormat,
} from "./data/Functions";
import GlobalInspector from "./GlobalInspector";

const mockGlobalFunctions: CombinedGlobalActionFormat[] = [
    {
        uuid: "global-1",
        function: "global1",
        parameter: {
            param1: "string",
            param2: "string",
        },
        process: [],
        result: "vResult",
    },
    {
        uuid: "global-2",
        function: "global2",
        parameter: {},
        process: [],
        result: "vResult2",
    },
];

const mockSelectedGlobalFunction: GlobalActionFormat =
    mockGlobalFunctions[0] as GlobalActionFormat;

describe("Component: GlobalInspector", () => {
    let container: HTMLElement;
    const handleGlobalFunctionChange = jest.fn();
    const handleSelectGlobalFunction = jest.fn();

    beforeEach(() => {
        const result = render(
            <GlobalInspector
                globalFunctionList={mockGlobalFunctions}
                globalFunction={mockSelectedGlobalFunction}
                setSelectedGlobalFunction={handleSelectGlobalFunction}
                onUpdate={handleGlobalFunctionChange}
            />
        );

        container = result.container;
    });

    it("should have a header inspector", () => {
        expect(
            screen.getByText("eventFlow.inspector.header.title")
        ).toBeInTheDocument();
    });

    it("should have name and result field", () => {
        expect(
            screen.getByRole("textbox", { name: "global-name" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("textbox", { name: "global-result" })
        ).toBeInTheDocument();
    });

    it("should have a add button for parameters", () => {
        expect(
            screen.getByRole("button", {
                name: "eventFlow.inspector.button.addGlobal",
            })
        ).toBeInTheDocument();
    });

    it("should have 2 global parameters", () => {
        expect(
            container.getElementsByClassName("global-parameters").length
        ).toBe(2);
    });

    // TODO: More unit test for parameters
});
