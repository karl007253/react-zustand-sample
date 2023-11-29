import { render, screen } from "@testing-library/react";

import { useTranslation } from "react-i18next";
import Action from "./Action";
import ActionFormat from "./data/Functions";

describe("Component: Action", () => {
    const { t } = useTranslation();
    const mockIndex = 1;
    const mockFunction = jest.fn();
    const mockObject = {};
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
    const mockSelectedParentFunction = {
        function_uuid: "",
        connection_name: "",
        flowIndex: 0,
    };

    beforeEach(() =>
        render(
            <Action
                index={mockIndex}
                onUpdate={mockFunction}
                functions={mockFunctions}
                functionLists={mockObject}
                action={mockFunction}
                selectedParentFunction={mockSelectedParentFunction}
                handleCircleClicked={mockFunction}
                title={t("eventFlow.action.title")}
                fitWidth={false}
                zoom={[]}
                setZoom={mockFunction}
            />
        )
    );

    it("should have title Main for the non-subflow Action", () => {
        const title = t("eventFlow.action.title");
        expect(screen.getByText(title)).toBeInTheDocument();
    });
});
