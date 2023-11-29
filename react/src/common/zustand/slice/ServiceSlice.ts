import { StateCreator } from "zustand";
import produce from "immer";
import { cloneDeep } from "lodash";
import ServiceSlice, {
    Service,
    ServiceType,
    Sort,
} from "../interface/ServiceInterface";

const createServiceSlice: StateCreator<
    ServiceSlice,
    [["zustand/devtools", never]],
    [],
    ServiceSlice
> = (setState, getState) => ({
    service: [],

    addNewService: (data) => {
        const { service } = getState();

        setState(
            {
                service: [...service, data],
            },
            false,
            "addNewService"
        );
    },

    updateServiceOrder: (data: Sort[]) => {
        const { service } = getState();
        const newServiceArray = service
            .map((el) => {
                const newData = data.find((item) => item.uuid === el.uuid);

                return newData
                    ? {
                          ...el,
                          order: newData.order,
                      }
                    : el;
            })
            .sort((a, b) => a.order - b.order);

        setState(
            {
                service: newServiceArray,
            },
            false,
            "updateServiceOrder"
        );
    },

    deleteService: (uuid) => {
        const { service } = getState();

        // Get the deleted service data
        let deletedService!: Service | null;

        // Get all service except for the deleted one
        let newServiceArray = service.filter((item) => {
            if (item.uuid === uuid) {
                deletedService = item;
            }
            return item.uuid !== uuid;
        });

        // Need to delete all referenced data to the deleted service
        if (deletedService?.type === ServiceType.DatabaseConnector) {
            newServiceArray = newServiceArray.map((item) => {
                // Empty those DatabaseTable that are using this connector
                const updatedData = cloneDeep(item);
                if (
                    updatedData.type === ServiceType.DatabaseTable &&
                    updatedData.data?.attribute.connector ===
                        deletedService?.name
                ) {
                    updatedData.data.attribute.connector = "";
                    updatedData.data.attribute.table = "";
                }

                return updatedData;
            });
        }

        setState(
            {
                service: newServiceArray,
            },
            false,
            "deleteService"
        );
    },

    updateServiceName: (uuid, name, title) => {
        const { service } = getState();

        setState(
            {
                service: produce(service, (draft) => {
                    // Get the selected service
                    const index = draft.findIndex((a) => a.uuid === uuid);

                    const selectedService = draft[index];

                    // Get the old service name
                    // We're gonna use this to update all services that are dependent to this service
                    const oldServiceName = selectedService?.name;

                    // Update the name and title
                    draft[index] = {
                        ...selectedService,
                        name,
                        title: title || name,
                    };

                    // Find all DatabaseTable service that is using this DatabaseConnector
                    if (
                        selectedService?.type === ServiceType.DatabaseConnector
                    ) {
                        draft.forEach((item, idx) => {
                            // Check if type is DatabaseTable and the name of connector use is the same as the old service name of the selected service
                            if (
                                item.type === ServiceType.DatabaseTable &&
                                item.data?.attribute.connector ===
                                    oldServiceName
                            ) {
                                // Update the connector to the new one
                                draft[idx] = {
                                    ...item,
                                    data: {
                                        ...item.data,
                                        attribute: {
                                            ...item.data.attribute,
                                            connector: name,
                                        },
                                    },
                                };
                            }
                        });
                    }
                }),
            },
            false,
            "updateServiceName"
        );
    },

    updateServiceData: (uuid, field, data) => {
        const { service } = getState();

        setState(
            {
                service: produce(service, (draft) => {
                    // Get the selected service
                    const index = draft.findIndex((d) => d.uuid === uuid);

                    // Get the selectedService
                    const selectedService = draft[index];

                    // Replace the selectedService in service list with a new service data
                    draft[index] = {
                        ...selectedService,
                        data: {
                            ...selectedService.data,
                            attribute: {
                                ...selectedService.data.attribute,
                                [field]: data,
                            },
                        },
                    };

                    // Find all DatabaseTable service that is using this DatabaseConnector
                    if (
                        selectedService.type ===
                            ServiceType.DatabaseConnector &&
                        field === "database"
                    ) {
                        draft.forEach((item, idx) => {
                            // Check if type is DatabaseTable and the name of connector use is the same as the selected service
                            if (
                                item.type === ServiceType.DatabaseTable &&
                                item.data?.attribute.connector ===
                                    selectedService.name
                            ) {
                                draft[idx] = {
                                    ...item,
                                    data: {
                                        ...item.data,
                                        attribute: {
                                            ...item.data.attribute,
                                            table: "", // Empty the table field
                                        },
                                    },
                                };
                            }
                        });
                    }
                }),
            },
            false,
            "updateServiceData"
        );
    },
});

export default createServiceSlice;
