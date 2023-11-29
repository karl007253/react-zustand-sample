import { Stack } from "react-bootstrap";

import { serviceElementStructure } from "../../../common/data/Service";
import { ServiceType } from "../../../common/zustand/interface/ServiceInterface";

// serviceListing list all the available services to be dragged
const serviceListing = () => {
    const handleDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        key: string
    ) => {
        e.dataTransfer?.setData("key", key);
    };
    const serviceList: JSX.Element[] | null = [];

    Object.keys(ServiceType).forEach((key) => {
        const service =
            serviceElementStructure[key as keyof typeof ServiceType];
        serviceList.push(
            <li key={service.title}>
                <div
                    className="service-component"
                    onDragStart={(e) => handleDragStart(e, key)}
                    draggable
                >
                    {service.title}
                </div>
            </li>
        );
    });
    return serviceList;
};

const ServiceLeftPanel = () => {
    return (
        <div className="service-left-panel-container">
            <Stack
                direction="vertical"
                className="service-left-list-container gx-0"
            >
                <ul className="service-left-list">{serviceListing()}</ul>
            </Stack>
        </div>
    );
};

export default ServiceLeftPanel;
