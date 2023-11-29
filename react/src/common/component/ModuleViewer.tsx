import {
    BaseSyntheticEvent,
    CSSProperties,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { Container, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import Tree from "rc-tree";
import {
    AllowDropOptions,
    DraggableConfig,
    DraggableFn,
} from "rc-tree/lib/Tree";
import { NodeDragEventParams } from "rc-tree/lib/contextTypes";
import { DataNode, EventDataNode, Key } from "rc-tree/lib/interface";

import "rc-tree/assets/index.css";

// The default property of a treeData to be use in filtering node
const defaultFilterBy = "title";

type TreeData = {
    key: string;
    title: string;
    parent?: string;
    children?: TreeData[];
};

type ModuleViewerState = {
    treeData: DataNode[] | TreeData[] | undefined;
    autoExpandParent: boolean | undefined;
    expandedKeys: Key[] | undefined;
    searchInput: string;
};

type ModuleViewerProps = {
    treeData?: DataNode[] | TreeData[];
    searchInput?: string;
    filterTreeNodeBy?: string;
    selectedKeys?: Key[];
    expandedKeys?: Key[];
    autoExpandParent?: boolean;
    className?: string;
    style?: CSSProperties;
    draggable?: DraggableFn | boolean | DraggableConfig;
    allowDropAnywhere?: boolean;
    handleTreeRef?: (e: Tree<DataNode> | null) => void;
    onSearchInputChange?: (event: BaseSyntheticEvent) => void;
    onExpand?: (
        expandedKeys: Key[],
        info: {
            node: EventDataNode<DataNode>;
            expanded: boolean;
            nativeEvent: MouseEvent;
        }
    ) => void;
    onSelect?: (
        selectedKeys: Key[],
        info: {
            event: "select";
            selected: boolean;
            node: EventDataNode<DataNode>;
            selectedNodes: DataNode[];
            nativeEvent: MouseEvent;
        }
    ) => void;
    onDrop?: (data: DataNode[]) => void;
};

// Whether to allow drop on a node
const allowDrop = (
    { dragNode, dropNode, dropPosition }: AllowDropOptions,
    allowDropAnywhere: boolean
): boolean => {
    const targetNode: TreeData = dropNode as TreeData;
    const sourceNode: TreeData = dragNode as TreeData;

    // drop position -1 meaning it will be dropped on top of the node (smaller order/index)
    // drop position 0 meaning it will be dropped on inside the node (becoming a children)
    // drop position 1 meaning it will be dropped on below of the node (larger order/index)

    // If allowed to drop anywhere
    //   The target node can have a children
    if (allowDropAnywhere) {
        return (
            (dropPosition !== 0 && targetNode.parent !== undefined) || // This will prevent dragging a node to the main node (which don't have a parent)
            (dropPosition === 0 && Array.isArray(targetNode.children))
        );
    }

    // If cannot drop anywhere
    //   Can drop only on its own family (parent, sibling)
    //   If it is a child, must be the same parent
    //   Or if it is a parent, must be the children of the parent
    return (
        ((dropPosition !== 0 && targetNode.parent !== undefined) || // This will prevent dragging a node to the main node (which don't have a parent)
            (dropPosition === 0 &&
                Array.isArray(targetNode.children) &&
                !Array.isArray(sourceNode.children))) &&
        (targetNode.key === sourceNode.parent ||
            targetNode.parent === sourceNode.parent)
    );
};

/** a function for detecting a node drop event */
const drop = (
    info: NodeDragEventParams<DataNode, HTMLDivElement> & {
        dragNode: EventDataNode<DataNode>;
        dragNodesKeys: Key[];
        dropPosition: number;
        dropToGap: boolean;
    },
    state: ModuleViewerState,
    setState: Dispatch<SetStateAction<ModuleViewerState>>,
    complete?: (data: DataNode[]) => void
) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
        data: DataNode[],
        key: Key,
        callback: (item: DataNode, index: number, arr: DataNode[]) => void
    ) => {
        data?.forEach((item, index, arr) => {
            if (item.key === key) {
                callback(item, index, arr);
                return;
            }
            if (item.children) {
                loop(item.children, key, callback);
            }
        });
    };
    const data = [...(state.treeData ?? [])];

    // Find dragObject
    let dragObj: DataNode = {
        key: "",
    };
    loop(data, dragKey, (item, index, arr) => {
        arr?.splice(index, 1);
        dragObj = item;
    });

    if (dropPosition === 0) {
        // Drop on the content
        loop(data, dropKey, (item) => {
            // eslint-disable-next-line no-param-reassign
            item.children = item.children ?? [];
            item.children.unshift(dragObj);
        });
    } else {
        // Drop on the gap (insert before or insert after)
        let ar: DataNode[] = [];
        let i = 0;
        loop(data, dropKey, (item, index, arr) => {
            ar = arr;
            i = index;
        });
        if (dropPosition === -1) {
            ar.splice(i, 0, dragObj);
        } else {
            ar.splice(i + 1, 0, dragObj);
        }
    }

    setState((val) => {
        return {
            ...val,
            treeData: data,
        };
    });

    if (complete) {
        complete(data);
    }
};

/** a function that opens/closes the tree node */
const expand = (
    keys: Key[],
    setState: Dispatch<SetStateAction<ModuleViewerState>>
): boolean => {
    setState((val) => {
        return {
            ...val,
            expandedKeys: keys,
            autoExpandParent: false,
        };
    });

    return true;
};

/** a function for filtering if the property name match with search input */
const filterByPropertyName = (
    propertyName: string | number | undefined,
    state: ModuleViewerState,
    searchText?: string
): boolean => {
    if (
        typeof propertyName === "string" &&
        propertyName.includes(searchText ?? state.searchInput) &&
        state.searchInput.length !== 0
    ) {
        return true;
    }
    if (
        typeof propertyName === "number" &&
        propertyName.toString().includes(searchText ?? state.searchInput) &&
        state.searchInput.length !== 0
    ) {
        return true;
    }
    return false;
};

/** a function for checking if the selected property matched with search input has string type */
const filterTreeNode = (
    treeNode: EventDataNode<DataNode>,
    filterTreeNodeBy: string,
    state: ModuleViewerState
): boolean => {
    type objType = keyof typeof treeNode;
    const objKey = filterTreeNodeBy as objType;
    if (typeof treeNode[objKey] === "string") {
        return filterByPropertyName(treeNode[objKey] as string, state);
    }
    return false;
};

/** a callback function for detecting text input change */
const onSearchInputChangeDefault = (
    event: BaseSyntheticEvent,
    filterTreeNodeBy: string,
    state: ModuleViewerState,
    setState: Dispatch<SetStateAction<ModuleViewerState>>
) => {
    const tempArray: Key[] = [];

    const loopFindItem = (data: DataNode[] | TreeData[] | undefined) => {
        data?.map((item) => {
            type objType = keyof typeof item;
            const objKey = filterTreeNodeBy as objType;
            if (
                filterByPropertyName(
                    item?.[objKey] as string,
                    state,
                    event?.target?.value
                )
            ) {
                tempArray.push(item.key);
            }
            if (item.children) {
                loopFindItem(item.children);
            }
            return null;
        });
    };

    loopFindItem(state.treeData);

    setState((val) => {
        if (event?.target?.value.length > 0) {
            return {
                ...val,
                searchInput: event?.target?.value,
                expandedKeys: tempArray,
                autoExpandParent: true,
            };
        }
        return {
            ...val,
            searchInput: "",
            expandedKeys: [],
            autoExpandParent: false,
        };
    });
};

/**
 * A callback function used for getting rc-tree ref
 *
 * @callback handleTreeRef
 * @param {Tree<DataNode> | null} event
 */

/**
 * A callback function for detecting text input change
 *
 * @callback onSearchInputChange
 * @param {BaseSyntheticEvent} event
 */

/**
 * A callback function for detecting open/close of parent node
 *
 * @callback onExpand
 * @param {Key[]} expandedKeys
 * @param {EventDataNode<DataNode>} info.node
 * @param {boolean} info.expanded
 * @param {MouseEvent} info.nativeEvent
 */

/**
 * A callback function for detecting node selection
 *
 * @callback onSelect
 * @param {Key[]} selectedKeys
 * @param {string} info.event
 * @param {boolean} info.selected
 * @param {EventDataNode<DataNode>} info.node
 * @param {DataNode[]} info.selectedNodes
 * @param {MouseEvent} info.nativeEvent
 */

/**
 * A callback function that triggers whenever a node is drop
 *
 * @callback onDrop
 * @param {DataNode[]} data
 */

/**
 * Wrapper component with search bar and rc-tree (3rd party module for displaying tree directory) inside it
 *
 * there are 2 ways to use this component. By using the default functionality inside this component and passing treeData from the parent
 * and then getting the result by using a ref passed from the parent component
 *
 * or
 *
 * by passing treeData, events (onDrop, onSelect, onExpand) from the parent component, this is the reccommended way because we can modify the data only as needed
 *
 * @example
 * ```
 * ParentComponent.tsx
 * ```
 *
 * const mockupData = {
 *      key: "0",
 *      title: "node 0",
 *      children: [
 *          { key: "0-0", title: "node 0-0" },
 *          { key: "0-1", title: "node 0-1" },
 *      ]
 * }
 *
 * // this event function will be triggered whenever the user dropped a data after sorting it:
 * const onDrop = (data) => {}
 *
 * // this event function will be triggered whenever the user clicking on the close / expand
 * // button beside parent node directory:
 * const onExpand = (keys, info) => {}
 *
 * // this event function will be triggered whenever the user clicking on a node:
 * const onSelect = (selectedKeys, info) => {}
 *
 * return (
 *    <ModuleViewer
 *        className="tree-container"
 *        treeData={mockupData}
 *        allowDropAnywhere
 *        expandedKeys={state.expandedKeys}
 *        autoExpandParent={state.autoExpandParent}
 *        onDrop={onDrop}
 *        onExpand={onExpand}
 *        onSelect={onSelect}
 *    />
 * )
 *
 * NOTE: To customize the icons use by rctree, create a class in common/assets/sass/component/module/_item-list.scss
 *       then use that in the <ModuleViewer /> component
 * e.g.
 * .<name of the class> {
 *    @include rctree-icon-changer(
 *      $width-open: 15px,
 *      $height-open: 15px,
 *      $background-image-open: url(/path/to/the/opened-image),
 *      $width-close: 15px,
 *      $height-close: 15px,
 *      $background-image-close: url(/path/to/the/closed-image),
 *      $width-document: 15px,
 *      $height-document: 15px,
 *      $background-image-document: url(/path/to/the/document-image),
 *    )
 * }
 *
 * @param {DataNode[] | TreeData[]} treeData The list of data that will be rendered in tree.
 * @param {string} searchInput The search text that will be use to filter nodes
 * @param {string} filterTreeNodeBy The property of an object in tree that will be use for filtering the list. e.g. data[key]
 * @param {Key[]} selectedKeys List of keys that are selected
 * @param {Key[]} expandedKeys List of opened node keys
 * @param {boolean} autoExpandParent If this true, then the parent node is open whenever one its child is one of the expanded keys in "expandedKeys" param
 * @param {string} className Custom class for rc-tree component. Could be use to change the icons of of the tree
 * @param {CSSProperties} style Custom style for rc-tree component
 * @param {boolean} draggable Flag for enabling sorting
 * @param {boolean} allowDropAnywhere Flag for enabling/disabling dropping a node to any node
 * @param {handleTreeRef} handleTreeRef A callback function used for getting rc-tree ref
 * @param {onSearchInputChange} onSearchInputChange - A callback function that triggers whenever there is a change in the search input textbox
 * @param {onExpand} onExpand A callback function that triggers whenever the node is opening/closing
 * @param {onSelect} onSelect A callback function that triggers whenever a node is selected
 * @param {onDrop} onDrop A callback function that triggers whenever a node is drop
 */
const ModuleViewer = ({
    treeData,
    searchInput,
    filterTreeNodeBy = "title",
    selectedKeys,
    expandedKeys,
    autoExpandParent,
    className = "",
    style,
    draggable,
    allowDropAnywhere,
    handleTreeRef,
    onSearchInputChange,
    onExpand,
    onSelect,
    onDrop,
}: ModuleViewerProps) => {
    const { t } = useTranslation();
    const treeRef = useRef<Tree<DataNode>>(null);
    const [state, setState] = useState<ModuleViewerState>({
        treeData,
        autoExpandParent: autoExpandParent ?? true,
        expandedKeys: expandedKeys ?? [],
        searchInput: searchInput ?? "",
    });

    useEffect(() => {
        if (handleTreeRef) {
            handleTreeRef(treeRef.current);
        }
    }, []);

    useEffect(() => {
        setState((val) => {
            return {
                ...val,
                treeData,
                expandedKeys,
                autoExpandParent,
                searchInput: searchInput ?? "",
            };
        });

        // TODO: find a way to handle empty folder
        // need this timeout to set the display styling of placeholder element to none
        // the reason why an empty placeholder element need to be added on empty parents
        // because by default childless component in rctree will be counted as a leaf node
        // so it cannot accept a child
        setTimeout(() => {
            const element = document.getElementsByClassName("rc-tree-title");

            for (let index = 0; index < element.length; index++) {
                const data = element[index];

                if (data.innerHTML === "~") {
                    const parentNode = data.parentNode as HTMLElement;
                    const grandParentNode =
                        parentNode.parentNode as HTMLElement;
                    grandParentNode.style.display = "none";
                }
            }
        }, 50);
    }, [autoExpandParent, expandedKeys, searchInput, treeData]);

    return (
        <>
            <Container className="module-search">
                <Form.Control
                    className="module-search-input"
                    type="text"
                    placeholder={t("module.search.placeholder")}
                    value={state.searchInput}
                    onChange={(e) =>
                        onSearchInputChange
                            ? onSearchInputChange(e)
                            : onSearchInputChangeDefault(
                                  e,
                                  filterTreeNodeBy ?? defaultFilterBy,
                                  state,
                                  setState
                              )
                    }
                />
                <FontAwesomeIcon
                    className="module-search-icon"
                    icon={faSearch}
                />
            </Container>
            <Tree
                ref={treeRef}
                expandedKeys={state.expandedKeys}
                autoExpandParent={state.autoExpandParent}
                draggable={draggable ?? true}
                selectedKeys={selectedKeys}
                style={style}
                className={className}
                treeData={state.treeData}
                filterTreeNode={(treeNode) =>
                    filterTreeNode(
                        treeNode,
                        filterTreeNodeBy ?? defaultFilterBy,
                        state
                    )
                }
                allowDrop={(data) =>
                    allowDrop(data, allowDropAnywhere ?? false)
                }
                onExpand={(keys, info) =>
                    expand(keys, setState) && onExpand && onExpand(keys, info)
                }
                onDrop={(info) => drop(info, state, setState, onDrop)}
                onSelect={onSelect}
            />
        </>
    );
};

export type { TreeData };
export default ModuleViewer;
