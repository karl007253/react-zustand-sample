import { useState, useEffect } from "react";
import { Col, Card } from "react-bootstrap";

import { DataNode, EventDataNode, Key } from "rc-tree/lib/interface";

import generateUniqueId from "../../../common/helper/UniqueId";

import useStore from "../../../common/zustand/Store";
import { Api } from "../../../common/zustand/interface/ApiInterface";
import { Folder } from "../../../common/zustand/interface/FolderInterface";

import ModuleViewer, { TreeData } from "../../../common/component/ModuleViewer";

import { FOLDER_PREFIX, API_PREFIX } from "../../../common/data/Constant";
import { Sort } from "../../../common/data/Type";

const getType = (name: string): string => {
    if (name.indexOf(FOLDER_PREFIX) === 0) {
        return FOLDER_PREFIX;
    }
    if (name.indexOf(API_PREFIX) === 0) {
        return API_PREFIX;
    }
    return "";
};

const flattenList = (data: DataNode[], parent?: string) => {
    const result: { [name: string]: Sort[] } = {
        [API_PREFIX]: [],
        [FOLDER_PREFIX]: [],
    };

    for (let i = 0; i < data.length; i++) {
        const item: DataNode = data[i];
        const key: string = item.key.toString();

        if (getType(key) === FOLDER_PREFIX) {
            result[FOLDER_PREFIX].push({ parent, uuid: key, order: i + 1 });
        } else {
            result[API_PREFIX].push({ parent, uuid: key, order: i + 1 });
        }

        if (item.children) {
            const cResult = flattenList(item.children, key);

            result[FOLDER_PREFIX] = [
                ...result[FOLDER_PREFIX],
                ...cResult[FOLDER_PREFIX],
            ];

            result[API_PREFIX] = [
                ...result[API_PREFIX],
                ...cResult[API_PREFIX],
            ];
        }
    }

    return result;
};

const getChildren = (data: Api[] | Folder[], parent?: string): TreeData[] => {
    type ApiFolder = Api & Folder;
    // Sort the data
    data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const treeData: TreeData[] = [];
    for (let i = 0; i < data.length; i++) {
        const item: ApiFolder = data[i];
        if (parent && parent === item.folder_uuid) {
            // Get the children of this folder
            const children: TreeData[] = getChildren(data, item.uuid);

            // Check if folder
            if (getType(item.uuid) === FOLDER_PREFIX && children.length === 0) {
                children.push({
                    key: generateUniqueId(),
                    title: "~",
                });
            }

            treeData.push({
                parent,
                key: item.uuid,
                title: item.name,
                children: children.length > 0 ? children : undefined,
            });
        }
    }

    return treeData;
};

const formatToTreeData = (apis: Api[], folders: Folder[]): TreeData[] => {
    type ApiFolder = (Api & Folder)[];
    const treeData: TreeData[] = [];

    for (let i = 0; i < folders.length; i++) {
        const folder: Folder = folders[i];

        // Get all parent folders
        if (!folder.folder_uuid) {
            // Filter folders with folder uuid
            const data: ApiFolder = [...folders, ...apis].filter(
                (item) => item.folder_uuid !== undefined
            );

            const children: TreeData[] = getChildren(data, folder.uuid);

            // TODO: find a way to handle empty folder
            // Check if empty
            if (children.length === 0) {
                // Add a dummy entry to make the node a folder
                children.push({
                    key: generateUniqueId(),
                    title: "~",
                });
            }

            treeData.push({
                key: folder.uuid,
                title: folder.name,
                children,
            });
        }
    }

    return treeData;
};

const ApiList = () => {
    const {
        apiList,
        folderList,
        selectedApiUuid,
        selectedApiFolderUuid,
        setSelectedApiUuid,
        setSelectedApiFolderUuid,
        updateFolderSort,
        updateApiSort,
    } = useStore((state) => ({
        apiList: state.api,
        folderList: state.folder.filter((a) => a.type === "api"),
        selectedApiUuid: state.selectedApiUuid,
        selectedApiFolderUuid: state.selectedApiFolderUuid,
        setSelectedApiUuid: state.setSelectedApiUuid,
        setSelectedApiFolderUuid: state.setSelectedApiFolderUuid,
        updateFolderSort: state.updateFolderSort,
        updateApiSort: state.updateApiSort,
    }));

    const selected = (selectedApiFolderUuid as Key) || (selectedApiUuid as Key);

    const [state, setState] = useState<{
        autoExpandParent: boolean;
        expandedKeys: Key[];
    }>({
        autoExpandParent: true,
        expandedKeys: [selected],
    });

    // TODO: This should be in ModuleViewer
    useEffect(() => {
        // Update the expandedKeys so the selected node is automatically opened
        setState((item) => ({
            ...item,
            expandedKeys: [...item.expandedKeys, selected],
        }));
    }, [selected]);

    // Format the apis and folders into tree format
    const data = formatToTreeData(apiList, folderList);

    const updateSort = (dataTree: DataNode[]) => {
        // Convert to flat list
        const result = flattenList(dataTree);

        updateFolderSort(result[FOLDER_PREFIX]);
        updateApiSort(result[API_PREFIX]);
    };

    // Updates the sorting whenever there is a folder/api is added
    useEffect(() => {
        updateSort(data);
    }, [folderList.length, apiList.length]);

    const handleSelect = (
        selectedKeys: Key[],
        info: {
            event: "select";
            selected: boolean;
            node: EventDataNode<DataNode>;
            selectedNodes: DataNode[];
            nativeEvent: MouseEvent;
        }
    ) => {
        const key = info.node.key.toString();
        switch (getType(key)) {
            case FOLDER_PREFIX:
                setSelectedApiFolderUuid(key);
                break;
            case API_PREFIX:
                setSelectedApiUuid(key);
                break;
            default:
        }
    };

    // TODO: This should be in ModuleViewer
    const handleExpand = (expandedKeys: Key[]) =>
        setState(() => ({ expandedKeys, autoExpandParent: false }));

    const handleDrop = (dataTree: DataNode[]) => updateSort(dataTree);

    return (
        <Col md={2}>
            <Card className="module-list">
                <ModuleViewer
                    className="api-tree-container"
                    treeData={data}
                    allowDropAnywhere
                    autoExpandParent={state.autoExpandParent}
                    expandedKeys={state.expandedKeys}
                    selectedKeys={[selected]}
                    onExpand={handleExpand}
                    onSelect={handleSelect}
                    onDrop={handleDrop}
                />
            </Card>
        </Col>
    );
};

export default ApiList;
