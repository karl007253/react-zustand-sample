import { useState, useEffect } from "react";
import { Card, Col } from "react-bootstrap";
import { DataNode, EventDataNode, Key } from "rc-tree/lib/interface";

import generateUniqueId from "../../../common/helper/UniqueId";
import useStore from "../../../common/zustand/Store";
import ModuleViewer, { TreeData } from "../../../common/component/ModuleViewer";

import { Database } from "../../../common/zustand/interface/DatabaseInterface";
import { DatabaseTable } from "../../../common/zustand/interface/DatabaseTableInterface";
import {
    DATABASE_PREFIX,
    TABLE_PREFIX,
    DATABASE_PARENT,
} from "../../../common/data/Constant";
import { Sort } from "../../../common/data/Type";

const getType = (name: string): string => {
    if (name.indexOf(DATABASE_PREFIX) === 0) {
        return DATABASE_PREFIX;
    }
    if (name.indexOf(TABLE_PREFIX) === 0) {
        return TABLE_PREFIX;
    }
    return "";
};

const flattenList = (data: DataNode[], parent?: string) => {
    const result: { [name: string]: Sort[] } = {
        [DATABASE_PREFIX]: [],
        [TABLE_PREFIX]: [],
    };

    for (let i = 0; i < data.length; i++) {
        const item: DataNode = data[i];
        const key: string = item.key.toString();

        if (getType(key) === DATABASE_PREFIX) {
            result[DATABASE_PREFIX].push({ parent, uuid: key, order: i + 1 });
        } else {
            result[TABLE_PREFIX].push({ parent, uuid: key, order: i + 1 });
        }

        if (item.children) {
            const cResult = flattenList(item.children, key);

            result[DATABASE_PREFIX] = [
                ...result[DATABASE_PREFIX],
                ...cResult[DATABASE_PREFIX],
            ];

            result[TABLE_PREFIX] = [
                ...result[TABLE_PREFIX],
                ...cResult[TABLE_PREFIX],
            ];
        }
    }

    return result;
};

const getChildren = (data: DatabaseTable[], parent?: string): TreeData[] => {
    // Sort the data
    data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const treeData: TreeData[] = [];
    for (let i = 0; i < data.length; i++) {
        const item: DatabaseTable = data[i];
        if (parent && parent === item.database_uuid) {
            treeData.push({
                parent,
                key: item.uuid,
                title: item.name,
            });
        }
    }

    return treeData;
};

const formatToTreeData = (
    databases: Database[],
    databaseTables: DatabaseTable[]
): TreeData[] => {
    const treeData: TreeData[] = [];

    for (let i = 0; i < databases.length; i++) {
        const database: Database = databases[i];

        const children: TreeData[] = getChildren(
            // Create a new array (by spread operator) from databaseTables
            // so that it won't directly edit the variable from global state
            [...databaseTables],

            database.uuid
        );

        // TODO: find a way to handle empty database
        // Check if empty
        if (children.length === 0) {
            // Add a dummy entry to make the node a database
            children.push({
                key: generateUniqueId(),
                title: "~",
            });
        }

        treeData.push({
            key: database.uuid,
            title: database.name,
            children,
        });
    }

    return treeData;
};

const DatabaseList = () => {
    const {
        database,
        databaseTable,
        updateDatabaseSort,
        updateDatabaseTableSort,
        setSelectedDatabaseUuid,
        setSelectedDatabaseTableUuid,
        selectedDatabaseUuid,
        selectedDatabaseTableUuid,
    } = useStore((state) => ({
        database: state.database,
        databaseTable: state.databaseTable,
        updateDatabaseSort: state.updateDatabaseSort,
        updateDatabaseTableSort: state.updateDatabaseTableSort,
        setSelectedDatabaseUuid: state.setSelectedDatabaseUuid,
        setSelectedDatabaseTableUuid: state.setSelectedDatabaseTableUuid,
        selectedDatabaseUuid: state.selectedDatabaseUuid,
        selectedDatabaseTableUuid: state.selectedDatabaseTableUuid,
    }));

    const selected =
        (selectedDatabaseUuid as Key) || (selectedDatabaseTableUuid as Key);

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

    const treeChildren = formatToTreeData(database, databaseTable);

    const treeData: DataNode[] | TreeData[] | undefined = [
        {
            key: DATABASE_PARENT,
            title: "database",
            children:
                treeChildren.length > 0
                    ? treeChildren
                    : [
                          {
                              key: "DATABASE_CHILDREN",
                              title: "~",
                          },
                      ],
        },
    ];

    const updateSort = (dataTree: DataNode[]) => {
        // Convert to flat list
        const result = flattenList(dataTree);

        updateDatabaseSort(result[DATABASE_PREFIX]);
        updateDatabaseTableSort(result[TABLE_PREFIX]);
    };

    // Updates the sorting whenever there's a new database and table added
    useEffect(() => {
        updateSort(treeData);
    }, [database.length, databaseTable.length]);

    const handleDrop = (dataTree: DataNode[]) => updateSort(dataTree);

    const handleExpand = (expandedKeys: Key[]) =>
        setState(() => ({ expandedKeys, autoExpandParent: false }));

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
        // reselecting a selected node will unselect it
        if (selectedKeys.length === 0) {
            if (selectedDatabaseUuid) {
                setSelectedDatabaseUuid(null);
            }
            if (selectedDatabaseTableUuid) {
                setSelectedDatabaseTableUuid(null);
            }
            return;
        }

        const key = info.node.key.toString();
        switch (getType(key)) {
            case DATABASE_PREFIX:
                setSelectedDatabaseUuid(key);
                break;
            case TABLE_PREFIX:
                setSelectedDatabaseTableUuid(key);
                break;
            default:
        }
    };

    return (
        <Col md={2}>
            <Card className="module-list">
                <ModuleViewer
                    treeData={treeData}
                    className="database-tree-container"
                    onDrop={handleDrop}
                    onExpand={handleExpand}
                    onSelect={handleSelect}
                    selectedKeys={[selected]}
                    allowDropAnywhere={false}
                    expandedKeys={state.expandedKeys}
                    autoExpandParent={state.autoExpandParent}
                />
            </Card>
        </Col>
    );
};

export default DatabaseList;
