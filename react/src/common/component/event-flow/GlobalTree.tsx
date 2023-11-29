import { useState, useEffect } from "react";
import Tree from "rc-tree";
import { DataNode, EventDataNode, Key } from "rc-tree/lib/interface";
import { CombinedActionFormat, GlobalActionParameter } from "./data/Functions";

type GlobalTreeDataNode = {
    key: string;
    title: string;
    parameter: GlobalActionParameter;
    process: CombinedActionFormat[];
    result?: string;
};

type GlobalTreeProps = {
    treeData: GlobalTreeDataNode[] | undefined;
    filterText?: string;
    clearSelected?: boolean;
    className?: string;
    onSelect?: ({
        key,
        title,
        parameter,
        process,
        result,
    }: GlobalTreeDataNode) => void;
};

const GlobalTree = ({
    treeData,
    className,
    onSelect,
    clearSelected,
    filterText,
}: GlobalTreeProps) => {
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        if (clearSelected) {
            setSelected([]);
        }
    }, [clearSelected]);

    // a function for filtering if the property name match with search input
    const filterByPropertyName = (
        propertyName: string | number | undefined,
        searchText: string
    ): boolean => {
        if (
            typeof propertyName === "string" &&
            propertyName.includes(searchText) &&
            searchText.length !== 0
        ) {
            return true;
        }
        if (
            typeof propertyName === "number" &&
            propertyName.toString().includes(searchText) &&
            searchText.length !== 0
        ) {
            return true;
        }
        return false;
    };

    // a function for checking if the selected property matched with search input has string type
    const filterTreeNode = (
        treeNode: EventDataNode<DataNode>,
        filterTreeNodeBy: string,
        searchText: string
    ): boolean => {
        type objType = keyof typeof treeNode;
        const objKey = filterTreeNodeBy as objType;
        if (typeof treeNode[objKey] === "string") {
            return filterByPropertyName(treeNode[objKey] as string, searchText);
        }
        return false;
    };

    const handleSelect = (
        _selectedKeys: Key[],
        info: {
            event: "select";
            selected: boolean;
            node: EventDataNode<GlobalTreeDataNode>;
            selectedNodes: DataNode[];
            nativeEvent: MouseEvent;
        }
    ) => {
        const key = info.node.key.toString();
        const title = info.node.title?.toString() || "";
        const parameter = info.node.parameter || {};
        const process =
            (info.node as EventDataNode<GlobalTreeDataNode>)?.process || [];
        const result = info.node.result ?? "";

        // Update the selected keys
        setSelected([key]);

        if (onSelect) {
            onSelect({
                key,
                title,
                parameter,
                process,
                result,
            });
        }
    };

    return (
        <Tree
            draggable={false}
            className={className}
            treeData={treeData}
            selectedKeys={selected}
            filterTreeNode={(treeNode) =>
                filterTreeNode(treeNode, "title", filterText ?? "")
            }
            onSelect={handleSelect}
        />
    );
};

export type { GlobalTreeDataNode };
export default GlobalTree;
