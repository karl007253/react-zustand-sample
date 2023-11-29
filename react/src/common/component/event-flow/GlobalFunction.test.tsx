import { render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";

import GlobalFunction from "./GlobalFunction";

describe("Component: GlobalFunction", () => {
    const { t } = useTranslation();
    const mockFunction = jest.fn();
    // mock globalFunctions
    const globalFunctions = [
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

    const selectedGlobalFunction = {
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
        uuid: "Global-1",
    };

    describe("globalFunctions is not empty", () => {
        beforeEach(() =>
            render(
                <GlobalFunction
                    globalFunctions={globalFunctions}
                    onUpdateGlobal={mockFunction}
                    selectedGlobalFunction={selectedGlobalFunction}
                    setSelectedGlobalFunction={mockFunction}
                />
            )
        );

        it("should have the input form", () => {
            expect(
                screen.getByPlaceholderText(t("common.text.search"))
            ).toBeInTheDocument();
        });

        it("should have Add button", () => {
            expect(
                screen.getByRole("button", {
                    name: "common.button.add",
                })
            ).toBeInTheDocument();
        });

        it("should have Delete button", () => {
            expect(
                screen.getByRole("button", {
                    name: "common.button.delete",
                })
            ).toBeInTheDocument();
        });

        it("should have Tree with global functions in it", () => {
            expect(
                screen.getByText(globalFunctions[0].function)
            ).toBeInTheDocument();
        });
    });

    describe("globalFunctions is empty", () => {
        beforeEach(() =>
            render(
                <GlobalFunction
                    globalFunctions={[]}
                    onUpdateGlobal={mockFunction}
                    selectedGlobalFunction={null}
                    setSelectedGlobalFunction={mockFunction}
                />
            )
        );

        it("should have no global function text if globalFunctions is empty", () => {
            expect(
                screen.getByText(t("eventFlow.tabs.global.noGlobalFunctions"))
            ).toBeInTheDocument();
        });
    });
});
