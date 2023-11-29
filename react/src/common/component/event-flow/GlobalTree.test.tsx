import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GlobalTree, { GlobalTreeDataNode } from "./GlobalTree";

const handleSelect = jest.fn();

// mock data
const treeData: GlobalTreeDataNode[] = [
    {
        key: "global-1",
        title: "globalFunction1",
        parameter: {},
        process: [],
    },
    {
        key: "global-2",
        title: "globalFunction2",
        parameter: {},
        process: [],
    },
    {
        key: "global-3",
        title: "globalFunction3",
        parameter: {},
        process: [],
    },
    {
        key: "other",
        title: "other",
        parameter: {},
        process: [],
    },
];

const renderTree = async (searchText = "") => {
    await waitFor(() => {
        render(
            <GlobalTree
                filterText={searchText}
                treeData={treeData}
                onSelect={handleSelect}
            />,
            { wrapper: MemoryRouter }
        );
    });
};

describe("Component: GlobalTree", () => {
    describe("without filter text", () => {
        beforeEach(() => renderTree());

        it("should have a tree list", () => {
            expect(screen.getByRole("tree")).toBeInTheDocument();
        });

        it("should be able to select an item from the tree", () => {
            const item = screen.getByText("globalFunction1");
            expect(item).toBeInTheDocument();

            fireEvent.click(item);
            expect(handleSelect).toBeCalled();
        });
    });

    describe("with filter text", () => {
        beforeEach(() => renderTree("globalFunction1"));

        it("should be able to filter an item from the tree", () => {
            // The filtered item have the "filter-node" class
            expect(
                screen.queryByText("globalFunction1")?.parentElement
                    ?.parentElement
            ).toHaveClass("filter-node");

            // The filtered item don't have the "filter-node" class
            expect(
                screen.queryByText("globalFunction2")?.parentElement
                    ?.parentElement
            ).not.toHaveClass("filter-node");
        });
    });
});
