import {
    CSSProperties,
    PropsWithChildren,
    RefObject,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { Stack } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual, isEmpty, cloneDeep } from "lodash";

import { faSlidersH, faTimes } from "@fortawesome/free-solid-svg-icons";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { VariableSizeGrid, areEqual } from "react-window";
import { GUTTER_SIZE, SERVICE_PREFIX } from "../../../common/data/Constant";
import {
    Service,
    ServiceDataValue,
    ServiceType,
    Sort,
} from "../../../common/zustand/interface/ServiceInterface";
import { serviceElementStructure } from "../../../common/data/Service";

import useStore from "../../../common/zustand/Store";
import generateUniqueId from "../../../common/helper/UniqueId";
import ServiceCard from "./ServiceCard";
import useDebounce from "../../../common/hooks/Debounce";

type UpdateAttributesProps = {
    isName: boolean;
    uuid: string;
    field: string;
    data: string;
};

type ListSortableElementProps = {
    sortEnabled: boolean;
    style?: CSSProperties;
    onDelete: (uuid: string, indexRow: number, indexCol: number) => void;
    onCopy: (uuid: string) => void;
    toggleClick: (
        uuid: string,
        indexRow: number,
        indexCol: number,
        removeIndex?: boolean
    ) => void;
    onUpdateAttributes: (
        isName: boolean,
        uuid: string,
        field: string,
        data: string
    ) => void;
    indexComp: number;
    active: boolean;
    key: string;
    uuid: string;
    indexRow: number;
    indexCol: number;
    setHeight: (
        index: number,
        indexRow: number,
        indexCol: number,
        size: number
    ) => void;
};

type ServiceGridProps = {
    sortEnabled: boolean;
    listRef: RefObject<
        VariableSizeGrid<
            {
                uuid: string;
                order: number;
            }[]
        >
    >;
    containerSize: {
        width: number;
        height: number;
    };
    services: {
        uuid: string;
        order: number;
    }[];
    activeServComponentsIndex: { [index: string]: boolean };
    onDelete: (uuid: string, indexRow: number, indexCol: number) => void;
    onCopy: (uuid: string) => void;
    toggleClick: (
        uuid: string,
        indexRow: number,
        indexCol: number,
        removeIndex?: boolean
    ) => void;
    onUpdateAttributes: (
        isName: boolean,
        uuid: string,
        field: string,
        data: string
    ) => void;
    setHeight: (
        index: number,
        indexRow: number,
        indexCol: number,
        size: number
    ) => void;
    getHeight: (index: number) => number;
};

const propsAreEqual = (
    prev: Readonly<PropsWithChildren<ServiceGridProps>>,
    next: Readonly<PropsWithChildren<ServiceGridProps>>
) => {
    // Don't rerender only if every array data is true
    const dontRerender = [];

    // comparing services data
    if (
        isEqual(prev.services, next.services) &&
        !isEmpty(prev.services) &&
        !isEmpty(next.services)
    ) {
        dontRerender.push(true);
    } else {
        dontRerender.push(false);
    }

    // comparing activeServComponentsIndex data
    if (
        isEqual(
            prev.activeServComponentsIndex,
            next.activeServComponentsIndex
        ) &&
        !isEmpty(prev.activeServComponentsIndex) &&
        !isEmpty(next.activeServComponentsIndex)
    ) {
        dontRerender.push(true);
    } else {
        dontRerender.push(false);
    }

    // comparing containerSize data
    if (
        isEqual(prev.containerSize, next.containerSize) &&
        !isEmpty(prev.containerSize) &&
        !isEmpty(next.containerSize)
    ) {
        dontRerender.push(true);
    } else {
        dontRerender.push(false);
    }

    // comparing sortEnabled data
    if (isEqual(prev.sortEnabled, next.sortEnabled)) {
        dontRerender.push(true);
    } else {
        dontRerender.push(false);
    }

    if (dontRerender.indexOf(false) > -1) {
        return false;
    }
    return true;
};

const ServiceDraggableSortable = memo(
    ({
        sortEnabled,
        onDelete,
        onCopy,
        onUpdateAttributes,
        toggleClick,
        indexComp,
        active,
        style,
        indexRow,
        indexCol,
        uuid,
        setHeight,
    }: ListSortableElementProps) => {
        const { attributes, listeners, setNodeRef, transform, transition } =
            useSortable({ id: uuid });

        const sortableStyle = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        if (!sortEnabled) {
            return (
                <ServiceCard
                    active={active}
                    sortEnabled={sortEnabled}
                    key={uuid}
                    index={indexComp}
                    toggleClick={toggleClick}
                    onDelete={onDelete}
                    onCopy={onCopy}
                    onUpdateAttributes={onUpdateAttributes}
                    style={{
                        ...style,
                        left: parseInt(String(style?.left), 10) + GUTTER_SIZE,
                        top: parseInt(String(style?.top), 10) + GUTTER_SIZE,
                        width: parseInt(String(style?.width), 10) - GUTTER_SIZE,
                        height: undefined,
                    }}
                    setHeight={setHeight}
                    indexRow={indexRow}
                    indexCol={indexCol}
                />
            );
        }

        return (
            <div
                ref={setNodeRef}
                style={{
                    ...sortableStyle,
                    ...style,
                    left: parseInt(String(style?.left), 10) + GUTTER_SIZE,
                    top: parseInt(String(style?.top), 10) + GUTTER_SIZE,
                    width: parseInt(String(style?.width), 10) - GUTTER_SIZE,
                    height: parseInt(String(style?.height), 10) - GUTTER_SIZE,
                }}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...attributes}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...listeners}
            >
                <ServiceCard
                    active={active}
                    sortEnabled={sortEnabled}
                    key={uuid}
                    index={indexComp}
                    toggleClick={toggleClick}
                    onDelete={onDelete}
                    onCopy={onCopy}
                    onUpdateAttributes={onUpdateAttributes}
                    setHeight={setHeight}
                    indexRow={indexRow}
                    indexCol={indexCol}
                />
            </div>
        );
    },
    areEqual
);

const ServiceGrid = memo(
    ({
        sortEnabled,
        listRef,
        containerSize,
        services,
        activeServComponentsIndex,
        onDelete,
        onCopy,
        onUpdateAttributes,
        toggleClick,
        setHeight,
        getHeight,
    }: ServiceGridProps) => {
        return (
            <VariableSizeGrid
                className="service-sortable-grid"
                ref={listRef}
                columnCount={3}
                columnWidth={() => {
                    return containerSize.width / 3 - GUTTER_SIZE;
                }}
                height={containerSize.height}
                rowCount={Math.ceil(services.length / 3)}
                rowHeight={getHeight}
                width={containerSize.width}
                itemData={services}
            >
                {function GridComponents({
                    data,
                    columnIndex,
                    rowIndex,
                    style,
                }) {
                    const combinedIndex = rowIndex * 3 + columnIndex;

                    if (data?.[combinedIndex] === undefined) {
                        return null;
                    }
                    return (
                        <ServiceDraggableSortable
                            active={
                                activeServComponentsIndex?.[
                                    data?.[combinedIndex]?.uuid
                                ] ?? false
                            }
                            sortEnabled={sortEnabled ?? false}
                            key={data?.[combinedIndex]?.uuid}
                            uuid={data?.[combinedIndex]?.uuid}
                            indexComp={combinedIndex}
                            toggleClick={toggleClick}
                            onDelete={onDelete}
                            onCopy={onCopy}
                            onUpdateAttributes={onUpdateAttributes}
                            style={style}
                            indexRow={rowIndex}
                            indexCol={columnIndex}
                            setHeight={setHeight}
                        />
                    );
                }}
            </VariableSizeGrid>
        );
    },
    propsAreEqual
);

// generateUniqueIncrementalName generates unique incremental name
const generateUniqueIncrementalName = (
    services: Service[],
    defaultName: string
) => {
    let counter = 1;
    let name = defaultName + counter;
    let flag = true;
    while (flag) {
        // eslint-disable-next-line
        if (!services.find((s) => s.name === name)) {
            flag = false;
            break;
        }
        counter += 1;
        name = defaultName + counter;
    }
    return name;
};

const ServiceRightPanel = () => {
    const [activeServComponentsIndex, setActiveServiceComponentsIndex] =
        useState<{ [index: string]: boolean }>({});
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [sortEnabled, setSortEnabled] = useState(false);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const elementRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<
        VariableSizeGrid<
            {
                uuid: string;
                order: number;
            }[]
        >
    >(null);
    const rowHeightMap = useRef<{
        [index: number]: { [index: number]: number };
    }>({});
    const setHeight = useCallback(
        (index: number, indexRow: number, indexCol: number, size: number) => {
            const heightMap = {
                ...rowHeightMap.current,
                [indexRow]: {
                    ...rowHeightMap.current?.[indexRow],
                    [indexCol]: size + GUTTER_SIZE,
                },
            };
            rowHeightMap.current = heightMap;
            listRef.current?.resetAfterRowIndex(index, true);
        },
        []
    );
    const getHeight = (index: number): number => {
        let sortedRowHeight = 35 + GUTTER_SIZE;

        if (!isEmpty(rowHeightMap.current) && rowHeightMap.current?.[index]) {
            Object.keys(rowHeightMap.current?.[index]).forEach((key) => {
                const element =
                    rowHeightMap.current?.[index]?.[key as unknown as number];
                if (element > sortedRowHeight) sortedRowHeight = element;
            });
        }

        return sortedRowHeight;
    };
    const [updatedAttributesValueRef, setUpdatedAttributesValueRef] =
        useState<UpdateAttributesProps>({
            isName: true,
            uuid: "",
            field: "",
            data: "",
        });

    const debouncedUpdateAttributes = useDebounce(updatedAttributesValueRef);

    const {
        services,
        addNewService,
        updateServiceOrder,
        updateServiceName,
        updateServiceData,
        deleteService,
    } = useStore((state) => ({
        services: state.service,
        addNewService: state.addNewService,
        updateServiceOrder: state.updateServiceOrder,
        updateServiceName: state.updateServiceName,
        updateServiceData: state.updateServiceData,
        deleteService: state.deleteService,
    }));
    const sortedServices =
        [...services].sort((a, b) => a.order - b.order) || [];

    useEffect(() => {
        if (debouncedUpdateAttributes === null) return;
        if (debouncedUpdateAttributes.isName) {
            // If there's no name then don't update
            if (debouncedUpdateAttributes.data) {
                updateServiceName(
                    debouncedUpdateAttributes.uuid,
                    debouncedUpdateAttributes.data,
                    debouncedUpdateAttributes.data
                );
            }
        } else {
            updateServiceData(
                debouncedUpdateAttributes.uuid,
                debouncedUpdateAttributes.field ?? "",
                debouncedUpdateAttributes.data ?? ""
            );
        }
    }, [debouncedUpdateAttributes]);

    // handleDragOver handle event prevent default on drag over drop target
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const newServiceType = e.dataTransfer?.getData("key");
        const service =
            serviceElementStructure[newServiceType as keyof typeof ServiceType];
        const serviceAtrributes: ServiceDataValue = {};

        Object.keys(service.attribute).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(service.attribute, key)) {
                const element = service.attribute[key];
                serviceAtrributes[key] = element.value ?? "";
            }
        });

        const serviceData: Service = {
            uuid: generateUniqueId(SERVICE_PREFIX),
            type: newServiceType as ServiceType,
            name: generateUniqueIncrementalName(services, service.name),
            order:
                sortedServices.length === 0
                    ? 1
                    : sortedServices[sortedServices.length - 1].order + 1,
            title: generateUniqueIncrementalName(services, service.title),
            data: {
                attribute: serviceAtrributes,
            },
        };

        addNewService(serviceData);
    };

    const toggleClick = (
        uuid: string,
        indexRow: number,
        indexCol: number,
        removeIndex = false
    ) => {
        setActiveServiceComponentsIndex((prevState) => {
            // NOTE: need to clonedeep or else the deletion could affect react memo comparison
            let newState = cloneDeep(prevState);

            // if exist remove it from activeComponents
            if (prevState[uuid] || removeIndex) {
                delete newState[uuid];
            } else {
                // Otherwise, add the uuid to list
                newState = {
                    ...prevState,
                    [uuid]: true,
                };
            }

            return { ...newState };
        });

        // for rerendering the row below the clicked one
        // settimout or else some services card might not be rendered correctly
        setTimeout(() => {
            listRef.current?.resetAfterIndices({
                columnIndex: indexCol,
                rowIndex: indexRow,
            });
        }, 200);
    };

    useEffect(() => {
        const element = elementRef?.current;

        if (!element) return undefined;

        const observer = new ResizeObserver(() => {
            // change the containerSize when the element is resized
            setContainerSize({
                width: element?.getBoundingClientRect()?.width ?? 0,
                height: element?.getBoundingClientRect()?.height ?? 0,
            });
            listRef.current?.resetAfterIndices({
                columnIndex: 0,
                rowIndex: 0,
            });
        });

        observer.observe(element);
        return () => {
            // Cleanup the observer by unobserving all elements
            observer.disconnect();
        };
    }, []);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!sortEnabled || !active || !over) return;

            if (active.id !== over?.id) {
                const oldIndex = sortedServices
                    .map((item) => item.uuid)
                    .indexOf(String(active?.id));
                const newIndex = sortedServices
                    .map((item) => item.uuid)
                    .indexOf(String(over?.id));

                const tempServiceData = cloneDeep(sortedServices);
                const draggedServiceData = cloneDeep(tempServiceData[oldIndex]);
                tempServiceData.splice(oldIndex, 1);
                tempServiceData.splice(newIndex, 0, draggedServiceData);
                const serviceSortData: Sort[] = tempServiceData.map(
                    (s, index) => {
                        return {
                            uuid: s.uuid,
                            order: index + 1,
                        };
                    }
                );
                updateServiceOrder(serviceSortData);
            }
        },
        [sortedServices, sortEnabled]
    );

    const onCopyService = (uuid: string) => {
        const copiedService = sortedServices?.find(
            (item) => item.uuid === uuid
        );

        if (copiedService) {
            const newName = generateUniqueIncrementalName(
                sortedServices,
                copiedService.name
            );
            const serviceData: Service = {
                uuid: generateUniqueId(SERVICE_PREFIX),
                name: newName,
                order: sortedServices.length + 1,
                title: newName,
                type: copiedService.type,
                data: copiedService.data,
            };

            addNewService(serviceData);
        }
    };

    const onDeleteService = (
        uuid: string,
        indexRow: number,
        indexCol: number
    ) => {
        toggleClick(uuid, indexRow, indexCol, true);
        deleteService(uuid);
    };

    const onUpdateAttributes = (
        isName: boolean,
        uuid: string,
        field: string,
        data: string
    ) => {
        setUpdatedAttributesValueRef({ isName, uuid, field, data });
    };

    const handleSortClick = () => {
        // clear active service components
        setActiveServiceComponentsIndex({});

        // toggle sortEnabled
        // settimout or else some services card might not be rendered correctly
        setTimeout(() => {
            setSortEnabled((prev) => !prev);
            listRef.current?.resetAfterIndices({
                columnIndex: 0,
                rowIndex: 0,
            });
        }, 200);
    };

    const serviceOrderAndUUID = sortedServices.map((item) => {
        return { uuid: item.uuid, order: item.order };
    });

    return (
        <Stack
            direction="vertical"
            className="service-right-panel-container"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <Stack
                direction="horizontal"
                className="service-right-header-container"
            >
                <em className="service-right-header-text">
                    {sortedServices.length} Service(s)
                </em>

                {sortedServices.length ? (
                    <FontAwesomeIcon
                        className="service-right-header-icon"
                        title={`${sortEnabled ? "Disable" : "Enable"} Sort`}
                        size="xs"
                        onClick={handleSortClick}
                        icon={sortEnabled ? faTimes : faSlidersH}
                    />
                ) : null}
            </Stack>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sortedServices.map((item) => item.uuid)}
                    strategy={rectSortingStrategy}
                >
                    <div
                        data-testid="service-grid"
                        className="service-sortable-container"
                        ref={elementRef}
                    >
                        <ServiceGrid
                            sortEnabled={sortEnabled}
                            listRef={listRef}
                            containerSize={containerSize}
                            activeServComponentsIndex={
                                activeServComponentsIndex
                            }
                            services={serviceOrderAndUUID}
                            toggleClick={toggleClick}
                            onDelete={onDeleteService}
                            onCopy={onCopyService}
                            onUpdateAttributes={onUpdateAttributes}
                            setHeight={setHeight}
                            getHeight={getHeight}
                        />
                    </div>
                </SortableContext>
            </DndContext>
        </Stack>
    );
};

export default ServiceRightPanel;
