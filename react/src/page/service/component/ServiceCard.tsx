import { CSSProperties, useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars, faCopy } from "@fortawesome/free-solid-svg-icons";

import { serviceElementStructure } from "../../../common/data/Service";
import { GUTTER_SIZE } from "../../../common/data/Constant";

import ServiceInputFields from "./ServiceInputFields";
import ServiceDuplicateModal from "./modals/ServiceDuplicateModal";
import ServiceDeleteModal from "./modals/ServiceDeleteModal";
import useStore from "../../../common/zustand/Store";

type ServiceCardProps = {
    sortEnabled: boolean;
    active: boolean;
    index: number;
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
    setHeight: (
        index: number,
        indexRow: number,
        indexCol: number,
        size: number
    ) => void;
    indexRow: number;
    indexCol: number;
};

const ServiceCard = ({
    sortEnabled,
    active,
    index,
    style,
    indexRow,
    indexCol,
    onDelete,
    onCopy,
    toggleClick,
    onUpdateAttributes,
    setHeight,
}: ServiceCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [copyModalVisible, setCopyVisibility] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteVisibility] = useState<boolean>(false);

    const { services } = useStore((state) => ({
        services: [...state.service]?.sort((a, b) => a.order - b.order) || [],
    }));

    const service = services?.[index];

    const showCopyModal = (
        event: React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => {
        event.stopPropagation();
        setCopyVisibility(true);
    };
    const hideCopyModal = () => setCopyVisibility(false);
    const showDeleteModal = (
        event: React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => {
        event.stopPropagation();
        setDeleteVisibility(true);
    };
    const hideDeleteModal = () => setDeleteVisibility(false);

    const component = serviceElementStructure[service?.type];

    useEffect(() => {
        const containerHeight =
            cardRef?.current?.getBoundingClientRect()?.height ??
            35 + GUTTER_SIZE;

        setHeight(index, indexRow, indexCol, containerHeight);
    }, [setHeight, indexRow, active]);

    const onDeleteService = (uuid: string) => {
        onDelete(uuid, indexRow, indexCol);
    };

    if (!component) return null;

    return (
        <div ref={cardRef} style={style} className="service-card-container">
            <Stack
                onClick={() =>
                    sortEnabled
                        ? {}
                        : toggleClick(service.uuid, indexRow, indexCol, false)
                }
                direction="horizontal"
                className={`service-card-head-tab ${
                    sortEnabled && `service-pointer-cursor`
                }`}
            >
                <div className="service-card-tab-title">
                    {component?.title} - {service?.name}{" "}
                </div>
                <div className="service-card-tab-icon">
                    {sortEnabled ? (
                        <FontAwesomeIcon
                            className="service-card-icon"
                            icon={faBars}
                            size="xs"
                            cursor="all-scroll"
                        />
                    ) : (
                        <div>
                            <FontAwesomeIcon
                                title="Duplicate Service"
                                className="service-card-icon"
                                icon={faCopy}
                                size="xs"
                                cursor="all-scroll"
                                onClick={showCopyModal}
                            />

                            <FontAwesomeIcon
                                title="Delete Service"
                                className="service-card-icon ms-2"
                                icon={faTimes}
                                size="xs"
                                cursor="all-scroll"
                                onClick={showDeleteModal}
                            />
                        </div>
                    )}
                </div>
            </Stack>

            {active && (
                <div className="service-card-form-container">
                    <ServiceInputFields
                        service={service}
                        index={index}
                        services={services}
                        onUpdateAttributes={onUpdateAttributes}
                    />
                </div>
            )}

            <ServiceDuplicateModal
                show={copyModalVisible}
                handleClose={hideCopyModal}
                onCopy={onCopy}
                service={service}
            />
            <ServiceDeleteModal
                show={deleteModalVisible}
                handleClose={hideDeleteModal}
                onDelete={onDeleteService}
                service={service}
            />
        </div>
    );
};

export default ServiceCard;
