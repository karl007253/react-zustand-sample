/* eslint-disable no-restricted-syntax */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CardSummary from "./CardSummary";

import { Api } from "../../../common/zustand/interface/ApiInterface";
import { Database } from "../../../common/zustand/interface/DatabaseInterface";
import { Scheduler } from "../../../common/zustand/interface/SchedulerInterface";

interface mockListInterface {
    type: string;
    data: Api[] | Database[] | Scheduler[];
}

// Prepare mock data
const mockList: mockListInterface[] = [
    {
        type: "api",
        data: [
            {
                uuid: "id-api-1",
                folder_uuid: "id-folder-1",
                name: "api-1",
                title: "api-1",
                data: {},
                order: 0,
                id: 1,
                updated_at: "2023-03-06T21:31:21.490962+07:00",
            },
            {
                uuid: "id-api-2",
                folder_uuid: "id-folder-1",
                name: "api-2",
                title: "api-2",
                data: {},
                order: 0,
                id: 2,
                updated_at: "2023-03-07T21:31:21.490962+07:00",
            },
            {
                // latest updated data
                uuid: "id-api-3",
                folder_uuid: "id-folder-1",
                name: "api-3",
                title: "api-3",
                data: {},
                order: 0,
                id: 3,
                updated_at: "2023-03-08T21:31:21.490962+07:00",
            },
        ],
    },
    {
        type: "database",
        data: [
            {
                uuid: "id-database-1",
                name: "database-1",
                title: "database-1",
                order: 0,
                id: 1,
                updated_at: "2023-03-06T21:31:21.490962+07:00",
            },
            {
                uuid: "id-database-2",
                name: "database-2",
                title: "database-2",
                order: 0,
                id: 2,
                updated_at: "2023-03-07T21:31:21.490962+07:00",
            },
            {
                // latest updated data
                uuid: "id-database-3",
                name: "database-3",
                title: "database-3",
                order: 0,
                id: 3,
                updated_at: "2023-03-08T21:31:21.490962+07:00",
            },
        ],
    },
    {
        type: "scheduler",
        data: [
            {
                uuid: "id-scheduler-1",
                folder_uuid: "id-folder-2",
                name: "scheduler-1",
                title: "scheduler-1",
                data: {},
                order: 0,
                id: 1,
                updated_at: "2023-03-06T21:31:21.490962+07:00",
            },
            {
                uuid: "id-scheduler-2",
                folder_uuid: "id-folder-2",
                name: "scheduler-2",
                title: "scheduler-2",
                data: {},
                order: 0,
                id: 2,
                updated_at: "2023-03-07T21:31:21.490962+07:00",
            },
            {
                // latest updated data
                uuid: "id-scheduler-3",
                folder_uuid: "id-folder-2",
                name: "scheduler-3",
                title: "scheduler-3",
                data: {},
                order: 0,
                id: 3,
                updated_at: "2023-03-08T21:31:21.490962+07:00",
            },
        ],
    },
];

describe("Dashboard: CardSummary", () => {
    mockList.forEach((mockData: mockListInterface) => {
        describe(`Type: ${mockData.type.toUpperCase()}`, () => {
            // render module
            beforeEach(() => {
                render(
                    <CardSummary
                        title={`dashboard.summary.title.${mockData.type}`}
                        img="api"
                        url=""
                        dataArray={
                            [...mockData.data] as
                                | Api[]
                                | Database[]
                                | Scheduler[]
                        }
                    />,
                    {
                        wrapper: MemoryRouter,
                    }
                );
            });

            it(`should have a Summary Class Name on CardSummary Layout title ${mockData.type.toUpperCase()}`, () => {
                const { container } = render(
                    <CardSummary
                        title={`dashboard.summary.title.${mockData.type}`}
                        img={mockData.type}
                        url=""
                        dataArray={
                            [...mockData.data] as
                                | Api[]
                                | Database[]
                                | Scheduler[]
                        }
                    />,
                    {
                        wrapper: MemoryRouter,
                    }
                );
                const summaryClass =
                    container.getElementsByClassName("summary");
                expect(summaryClass.length).toBe(1);
            });

            it(`should show the correct ${mockData.type} data total`, () => {
                expect(
                    screen.getByTestId(
                        `data-length-dashboard.summary.title.${mockData.type}`
                    )
                ).toHaveTextContent(String(mockData.data.length));
            });

            it(`should show the correct latest updated ${mockData.type}`, () => {
                expect(
                    screen.getByTestId(
                        `data-open-recent-dashboard.summary.title.${mockData.type}`
                    )
                ).toHaveTextContent(
                    `dashboard.summary.openRecent ${
                        mockData.data[mockData.data.length - 1].name
                    }`
                );
            });
        });
    });
});
