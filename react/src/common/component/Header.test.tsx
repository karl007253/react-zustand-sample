import { render, screen, waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { mockedHttpRequest } from "../helper/HttpRequest";
import {
    ApplicationDetails,
    ApplicationResponseModel,
    StorageInfo,
    StorageInfoMemory,
} from "../zustand/interface/ApplicationInterface";
import { ServiceType } from "../zustand/interface/ServiceInterface";

import useStore from "../zustand/Store";
import Header from "./Header";

// Mock Data
const mockApplicationData: ApplicationDetails = {
    id: 1,
    application_code: "163066112782698",
    application_type_id: 1,
    application_type_name: "Client",
    user_id: 1,
    appname: "test",
    description: "test",
    compiler: "cordova",
    icon: "app_icon.png",
    is_published: false,
    is_locked: false,
    theme: "classic",
    version: 1,
    version_name: null,
    build_status: null,
    last_build_at: null,
    created_at: "2021-09-03T16:25:27.904+07:00",
    created_by: null,
    updated_at: "2021-09-03T16:25:27.904+07:00",
    updated_by: null,
};

const mockRender = async () => {
    // set mock data
    useStore.setState({
        applicationData: mockApplicationData,
        storageInfo: null,
        api: [],
        folder: [],
        configuration: [],
        action: [],
        database: [],
        databaseTable: [],
        scheduler: [],
        service: [],
        getApplicationByApplicationCode: jest
            .fn()
            .mockImplementationOnce(() => Promise.resolve()),
    });

    await act(async () => {
        render(<Header />, {
            wrapper: MemoryRouter,
        });
    });
};

describe("Component: Header", () => {
    describe("with configuration", () => {
        beforeEach(() => {
            process.env.REACT_APP_MAIN_FRONTEND_URL = "http://localhost";
            mockRender();
        });

        it("should have logo with the link of home page", () => {
            expect(
                screen.getByRole("link", { name: "common.logo.icon.alt" })
            ).toHaveAttribute("href", "http://localhost");
        });
    });

    describe("without configuration", () => {
        beforeEach(() => {
            // Set undefined to the configuration
            process.env = {
                ...process.env,
                REACT_APP_MAIN_FRONTEND_URL: undefined,
            };
            mockRender();
        });

        it("should have logo with the link of home page", () => {
            expect(
                screen.getByRole("link", { name: "common.logo.icon.alt" })
            ).toHaveAttribute("href", "/");
        });
    });

    describe("buttons", () => {
        beforeEach(() => mockRender());

        it("should have the app name", () => {
            const appName = screen.getByText(mockApplicationData.appname);

            // ensure name exist on the component
            expect(appName).toBeInTheDocument();
        });

        it("should have the app version", () => {
            const appVersion = screen.getByText("header.version.label");

            // ensure version exist on the component
            expect(appVersion).toBeInTheDocument();
        });

        it("should have a button for saving the project", () => {
            // Ensure the button is clickable
            expect(
                screen.getByRole("button", { name: "header.button.save" })
            ).toBeEnabled();
        });

        it("should have a button for building the project", () => {
            // Ensure the button is clickable
            expect(
                screen.getByRole("button", { name: "header.button.build" })
            ).toBeEnabled();
        });

        it("should have a button for downloading the built file", () => {
            expect(
                screen.getByRole("button", { name: "header.button.download" })
            ).toBeInTheDocument();
        });

        it("should have a button for showing the help", () => {
            // Ensure the button is clickable
            expect(
                screen.getByRole("button", { name: "header.button.help" })
            ).toBeEnabled();
        });

        it("should trigger getStorageInfoByApplicationCode when pressing the save button", async () => {
            // Initial global state
            const initialState = useStore.getState();

            const mockStorageInfoMemory: StorageInfoMemory = {
                max: 100,
                used: 0,
                free: 100,
            };

            const mockedFinalData: Partial<StorageInfo> = {
                memory: mockStorageInfoMemory,
            };

            // Prepare the response we want to get from axios
            const mockedResponse: AxiosResponse = {
                data: mockedFinalData,
                status: 200,
                statusText: "Success",
                headers: {},
                config: {},
            };
            const getStorageInfoByApplicationCode: jest.Mock = jest.fn(() => {
                act(() => {
                    useStore.setState(
                        {
                            storageInfo: {
                                memory: mockStorageInfoMemory,
                            },
                        },
                        true,
                        "getApplicationStorageInfo"
                    );
                });
                return Promise.resolve(mockedResponse);
            });

            // Expect the initial value to be empty
            expect(initialState.storageInfo).toBeNull();

            // Triggering clicking save button
            userEvent.click(
                screen.getByRole("button", { name: "header.button.save" })
            );
            // Make the mock return the custom axios response
            mockedHttpRequest.get.mockResolvedValueOnce(mockedResponse);

            // Ensure getStorageInfoByApplicationCode is not called immediately
            expect(getStorageInfoByApplicationCode).toHaveBeenCalledTimes(0);
            const data = await getStorageInfoByApplicationCode();

            // Ensure getStorageInfoByApplicationCode is called
            await waitFor(() => {
                expect(getStorageInfoByApplicationCode).toHaveBeenCalledTimes(
                    1
                );
                expect(data).toEqual(mockedResponse);
                expect(useStore.getState().storageInfo?.memory).toMatchObject(
                    mockStorageInfoMemory
                );
            });
        });

        it("should trigger patchApplication when pressing the save button", async () => {
            // Initial global state
            const initialState = useStore.getState();

            const mockedFinalData: Partial<ApplicationResponseModel> = {
                api: [
                    {
                        id: 1,
                        uuid: "API-1",
                        name: "API-1",
                        order: 1,
                    },
                ],
                folder: [],
                configuration: [],
                action: [],
                database: [],
                database_table: [],
                scheduler: [],
                service: [],
            };
            // Prepare the response we want to get from axios
            const mockedResponse: AxiosResponse = {
                data: mockedFinalData,
                status: 200,
                statusText: "OK",
                headers: {},
                config: {},
            };
            const patchApplication: jest.Mock = jest.fn(() => {
                act(() => {
                    useStore.setState(
                        {
                            api: [
                                {
                                    id: 1,
                                    uuid: "API-1",
                                    name: "API-1",
                                    order: 1,
                                },
                            ],
                            folder: [],
                            configuration: [],
                            action: [],
                            database: [
                                {
                                    id: 1,
                                    uuid: "DATABASE-1",
                                    name: "DATABASE-1",
                                    order: 1,
                                    title: "DATABASE-1",
                                },
                            ],
                            databaseTable: [],
                            scheduler: [
                                {
                                    id: 1,
                                    uuid: "SCHEDULER-1",
                                    name: "SCHEDULER-1",
                                    order: 1,
                                    title: "SCHEDULER-1",
                                },
                            ],
                            service: [
                                {
                                    id: 1,
                                    type: ServiceType.RestConnector,
                                    uuid: "SERVICE-1",
                                    name: "SERVICE-1",
                                    order: 1,
                                    data: {
                                        attribute: {
                                            sample: "sample",
                                        },
                                    },
                                },
                            ],
                        },
                        true,
                        "patchApplication"
                    );
                });
                return Promise.resolve(mockedResponse);
            });

            // Expect the initial value to be empty
            expect(initialState.storageInfo).toBeNull();
            expect(initialState.api).toHaveLength(0);
            expect(initialState.folder).toHaveLength(0);
            expect(initialState.configuration).toHaveLength(0);
            expect(initialState.action).toHaveLength(0);
            expect(initialState.database).toHaveLength(0);
            expect(initialState.databaseTable).toHaveLength(0);
            expect(initialState.scheduler).toHaveLength(0);
            expect(initialState.service).toHaveLength(0);

            // Triggering clicking save button
            userEvent.click(
                screen.getByRole("button", { name: "header.button.save" })
            );
            // Make the mock return the custom axios response
            mockedHttpRequest.patch.mockResolvedValueOnce(mockedResponse);
            // Ensure patchApplication is not called immediately
            expect(patchApplication).toHaveBeenCalledTimes(0);
            const data = await patchApplication();
            // Ensure patchApplication is called upon completion of user typing
            await waitFor(() => {
                expect(patchApplication).toHaveBeenCalledTimes(1);
                expect(data).toEqual(mockedResponse);
                expect(useStore.getState().api).toHaveLength(1);
                expect(useStore.getState().folder).toHaveLength(0);
                expect(useStore.getState().configuration).toHaveLength(0);
                expect(useStore.getState().action).toHaveLength(0);
                expect(useStore.getState().database).toHaveLength(1);
                expect(useStore.getState().databaseTable).toHaveLength(0);
                expect(useStore.getState().scheduler).toHaveLength(1);
                expect(useStore.getState().service).toHaveLength(1);
            });
        });
    });
});
