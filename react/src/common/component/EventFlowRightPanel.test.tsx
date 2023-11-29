import { render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import ActionFormat, {
    SelectedSubFlowsProps,
} from "./event-flow/data/Functions";

import EventFlowRightPanel from "./EventFlowRightPanel";

describe("Component: EventFlowRightPanel", () => {
    const { t } = useTranslation();
    const mockFunction = jest.fn();
    const functionLists = {};
    const mockArray: SelectedSubFlowsProps[] = [];
    const mockFunctions: ActionFormat[] = [
        {
            function: "log",
            parameter: {
                message: "testing",
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

    beforeEach(() =>
        render(
            <EventFlowRightPanel
                functions={mockFunctions}
                functionLists={functionLists}
                onUpdate={mockFunction}
                selectedFunction={null}
                setSelectedFunction={mockFunction}
                selectedSubFlows={mockArray}
                setSelectedSubFlows={mockFunction}
                globalFunctions={[]}
                selectedGlobalFunction={null}
                setSelectedGlobalFunction={mockFunction}
                onUpdateGlobal={mockFunction}
                onTabChange={mockFunction}
            />
        )
    );

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
});
