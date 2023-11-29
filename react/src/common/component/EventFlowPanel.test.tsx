import { render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import ActionFormat, { GlobalActionFormat } from "./event-flow/data/Functions";

import EventFlowPanel from "./EventFlowPanel";

const mockFunctions: ActionFormat[] = [
    {
        uuid: "log-1",
        function: "log",
        parameter: { message: "lorem ipsum" },
        parameter_type: {},
    },
    {
        uuid: "toobject-1",
        function: "Conversion.toObject",
        parameter: {},
        parameter_type: {},
    },
];

const mockGlobalFunctions: GlobalActionFormat[] = [
    {
        function: "global1",
        parameter: {
            param1: "string",
        },
        process: [
            {
                uuid: "global-log-1",
                function: "log",
                parameter: {},
                parameter_type: {},
            },
        ],
        result: "",
        uuid: "global1-1",
    },
];

describe("Component: EventFlowPanel", () => {
    let container: HTMLElement;

    const { t } = useTranslation();

    const onUpdateAction = jest.fn();
    const onUpdateGlobal = jest.fn();

    beforeEach(() => {
        const result = render(
            <EventFlowPanel
                functions={mockFunctions}
                globalFunctions={mockGlobalFunctions}
                onUpdateAction={onUpdateAction}
                onUpdateGlobal={onUpdateGlobal}
            />
        );

        container = result.container;
    });

    it("should have two tabs", () => {
        expect(
            screen.getByRole("tab", {
                name: t("eventFlow.tabs.action.title"),
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("tab", {
                name: t("eventFlow.tabs.global.title"),
            })
        ).toBeInTheDocument();
    });

    it("should have a function list", () => {
        expect(container.getElementsByClassName("funclist").length).toBe(1);
    });

    // TODO : add more test cases as we continue developing event flow
});
