import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import ServiceInputFields from "./ServiceInputFields";

import {
    Service,
    ServiceType,
} from "../../../common/zustand/interface/ServiceInterface";

const serviceList: Service[] = [
    {
        id: 1,
        name: "service1",
        title: "service1",
        type: ServiceType.RestConnector,
        data: {
            attribute: {
                url: "yes",
            },
        },
        order: 1,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCH",
    },
    {
        id: 2,
        name: "service2",
        title: "service2",
        type: ServiceType.DatabaseTable,
        data: {
            attribute: {
                database: "database1",
            },
        },
        order: 2,
        uuid: "SERVICE-DupxzqA2yzoOOlTiEwgCO",
    },
];

describe("Component: ServiceInputFields", () => {
    it("should be able to find an input text and number input spinner of the RestConnector service", () => {
        render(
            <ServiceInputFields
                index={1}
                service={serviceList[0]}
                services={serviceList}
                onUpdateAttributes={() => {
                    return true;
                }}
            />,
            { wrapper: MemoryRouter }
        );

        expect(
            screen.getByRole("textbox", {
                name: "service1name",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("spinbutton", {
                name: "service1timeout",
            })
        ).toBeInTheDocument();
    });

    it("should be able to find an input text and combobox input of the DatabaseTable service", () => {
        render(
            <ServiceInputFields
                index={1}
                service={serviceList[1]}
                services={serviceList}
                onUpdateAttributes={() => {
                    return true;
                }}
            />,
            { wrapper: MemoryRouter }
        );

        expect(
            screen.getByRole("textbox", {
                name: "service2name",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("combobox", {
                name: "service2connector",
            })
        ).toBeInTheDocument();
    });
});
