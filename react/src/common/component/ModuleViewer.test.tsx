import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { useTranslation } from "react-i18next";
import ModuleViewer, { TreeData } from "./ModuleViewer";

// Mock Data
const mockupData: TreeData[] = [
    {
        key: "0",
        title: "node 0",
        children: [
            { key: "0-0", title: "node 0-0" },
            { key: "0-1", title: "node 0-1" },
            {
                key: "0-2",
                title: "node 0-2",
                children: [
                    { key: "9-a-b", title: "yoman" },
                    { key: "0-2-0", title: "node 0-2-0" },
                    { key: "0-2-1", title: "node 0-2-1" },
                    { key: "0-2-2", title: "node 0-2-2" },
                ],
            },
            { key: "0-3", title: "node 0-3" },
            { key: "0-4", title: "node 0-4" },
            { key: "0-5", title: "node 0-5" },
            { key: "0-6", title: "node 0-6" },
            { key: "0-7", title: "node 0-7" },
            { key: "0-8", title: "node 0-8" },
            {
                key: "0-9",
                title: "node 0-9",
                children: [
                    { key: "0-9-0", title: "node 0-9-0" },
                    {
                        key: "0-9-1",
                        title: "node 0-9-1",
                        children: [
                            { key: "0-9-1-0", title: "node 0-9-1-0" },
                            { key: "0-9-1-1", title: "node 0-9-1-1" },
                            { key: "0-9-1-2", title: "node 0-9-1-2" },
                            { key: "0-9-1-3", title: "node 0-9-1-3" },
                            { key: "0-9-1-4", title: "node 0-9-1-4" },
                        ],
                    },
                    {
                        key: "0-9-2",
                        title: "node 0-9-2",
                        children: [
                            { key: "0-9-2-0", title: "node 0-9-2-0" },
                            { key: "0-9-2-1", title: "node 0-9-2-1" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        key: "1",
        title: "node 1",
        children: [
            {
                key: "1-0",
                title: "node 1-0",
                children: [
                    { key: "1-0-0", title: "node 1-0-0" },
                    {
                        key: "1-0-1",
                        title: "node 1-0-1",
                        children: [
                            { key: "1-0-1-0", title: "node 1-0-1-0" },
                            { key: "1-0-1-1", title: "node 1-0-1-1" },
                        ],
                    },
                    { key: "1-0-2", title: "node 1-0-2" },
                ],
            },
        ],
    },
];

describe("Component: ModuleViewer", () => {
    const handleSelect = jest.fn();
    const { t } = useTranslation();

    beforeEach(() => {
        render(
            <ModuleViewer
                treeData={mockupData}
                expandedKeys={["0"]}
                autoExpandParent
                onSelect={handleSelect}
            />,
            { wrapper: MemoryRouter }
        );
    });

    it("should have the input form", () => {
        expect(
            screen.getByPlaceholderText(t("module.search.placeholder"))
        ).toBeInTheDocument();
    });

    it("should show the tree list", () => {
        expect(screen.getByRole("tree")).toBeInTheDocument();
    });

    it("should show tree data with '0' key", () => {
        expect(screen.getByText("node 0")).toBeInTheDocument();
    });

    it("should show the children of tree data with '0' key", () => {
        expect(screen.getByText("node 0-0")).toBeInTheDocument();
        expect(screen.getByText("node 0-1")).toBeInTheDocument();
    });

    it("should be able to change the search keyword and collapse the tree branch that does not include the searched value in it's children", () => {
        const searchInput = screen.getByPlaceholderText(
            t("module.search.placeholder")
        );

        fireEvent.change(searchInput, { target: { value: "1-0-2" } });
        expect(
            screen.getByPlaceholderText(t("module.search.placeholder"))
        ).toHaveValue("1-0-2");
        expect(screen.queryByText("node 0-0")).not.toBeInTheDocument();
    });

    it("should be able to select a tree data from the tree", () => {
        const nodeContent = screen.getByText("node 0-0");
        expect(nodeContent).toBeInTheDocument();

        fireEvent.click(nodeContent);
        expect(handleSelect).toBeCalled();
    });
});
