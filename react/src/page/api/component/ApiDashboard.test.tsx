import { act, render, screen, waitFor, within } from "@testing-library/react";
import {
    Api,
    ParameterType,
} from "../../../common/zustand/interface/ApiInterface";
import {
    Folder,
    FolderType,
} from "../../../common/zustand/interface/FolderInterface";
import useStore from "../../../common/zustand/Store";
import ApiDashboard from "./ApiDashboard";
import {
    AuthType,
    Configuration,
    ConfigurationType,
} from "../../../common/zustand/interface/ConfigurationInterface";

const mockFolderList: Folder[] = [
    {
        uuid: "id-folder-1",
        type: FolderType.API,
        name: "api",
        title: "api",
        order: 0,
        id: 1,
    },
];

const mockApiList: Api[] = [
    {
        uuid: "id-endpoint-1",
        folder_uuid: "id-folder-1",
        name: "endpoint-1",
        title: "endpoint-1",
        data: {},
        order: 0,
        id: 1,
    },
    {
        uuid: "id-endpoint-2",
        folder_uuid: "id-folder-1",
        name: "endpoint-2",
        title: "endpoint-2",
        data: {
            get: {
                result: {
                    type: ParameterType.JSON,
                    parameter: [],
                },
            },
        },
        order: 0,
        id: 2,
    },
    {
        uuid: "id-endpoint-3",
        folder_uuid: "id-folder-1",
        name: "endpoint-3",
        title: "endpoint-3",
        data: {},
        order: 0,
        id: 3,
    },
];

const mockConfiguration: Configuration[] = [
    {
        uuid: "id-config-basic-auth",
        id: 1,
        type: ConfigurationType.API,
        name: "Configuration Basic Auth",
        title: "Configuration Basic Auth",
        order: 0,
        data: {
            authType: AuthType.BASIC_AUTH,
            dbConnection: "",
            tableReference: "",
            username: "",
            password: "",
        },
    },
    {
        uuid: "id-config-oauth2",
        id: 1,
        type: ConfigurationType.API,
        name: "Configuration OAuth2",
        title: "Configuration OAuth2",
        order: 0,
        data: {
            authType: AuthType.OAUTH2,
            dbConnection: "",
            tableReference: "",
            username: "",
            password: "",
            tableTokenReference: "",
        },
    },
];

const mockApiListWithConfiguration: (
    configUuid: string | undefined
) => Api[] = (configUuid) => [
    {
        uuid: "id-endpoint-1",
        name: "endpoint-1",
        order: 0,
        configuration_uuid: configUuid,
    },
];

const createButtonPlaceholder = () => {
    return screen.getByRole("button", {
        name: "placeholder-image common.button.create",
    });
};

const getHeaderButtonByType = (type: "create" | "rename" | "delete") => {
    return screen.queryByRole("button", { name: `header-${type}-button` });
};

const renderApiDashboard = async (useMockData = false) => {
    await waitFor(() => {
        if (useMockData) {
            useStore.setState(
                {
                    api: mockApiList,
                    folder: mockFolderList,
                    action: [],
                    scheduler: [],
                    database: [],
                    databaseTable: [],
                    configuration: mockConfiguration,
                    updateApiResult: jest.fn(),
                    updateFolderSort: jest.fn(),
                    updateApiSort: jest.fn(),
                },
                true
            );
        }

        render(<ApiDashboard />);
    });
};

describe("Api: ApiDashboard", () => {
    describe("without API", () => {
        // render module without data
        beforeEach(() => renderApiDashboard());

        it("should have the create button placeholder on initial render", () => {
            // ensure button placeholder exist
            expect(createButtonPlaceholder()).toBeInTheDocument();

            // ensure header won't be showing
            expect(
                screen.queryByText("api.dashboard.header.title")
            ).not.toBeInTheDocument();
        });
    });

    describe("with API", () => {
        // render module with data
        beforeEach(() => renderApiDashboard(true));

        it("should have header title", async () => {
            // ensure header title exist
            expect(
                within(
                    screen.getByLabelText("api-dashboard-header-title")
                ).getByText("api.dashboard.header.title")
            ).toBeInTheDocument();
        });

        it("should have authentication select on header", () => {
            // ensure authentication label is there
            expect(
                screen.getByRole("combobox", {
                    name: "auth-dropdown",
                })
            ).toBeInTheDocument();
        });

        it("should show only create button if no api is selected", () => {
            // ensure header create button exist
            expect(getHeaderButtonByType("create")).toBeInTheDocument();

            // ensure other edit buttons doesn't exist
            expect(getHeaderButtonByType("rename")).not.toBeInTheDocument();
            expect(getHeaderButtonByType("delete")).not.toBeInTheDocument();
        });

        it("should show other buttons if an api is selected ", async () => {
            act(() => {
                // use first api on mock list
                useStore.setState({
                    selectedApiUuid: mockApiList[0].uuid,
                    selectedApiFolderUuid: null,
                });
            });

            // ensure all buttons exist
            expect(getHeaderButtonByType("create")).toBeInTheDocument();
            expect(getHeaderButtonByType("rename")).toBeInTheDocument();
            expect(getHeaderButtonByType("delete")).toBeInTheDocument();
        });

        it("should hide rename and delete buttons if folder without parent is selected", async () => {
            act(() => {
                // use first folder on mock list
                useStore.setState({
                    selectedApiUuid: null,
                    selectedApiFolderUuid: mockFolderList[0].uuid,
                });
            });

            // ensure header create button exist
            expect(getHeaderButtonByType("create")).toBeInTheDocument();

            // ensure that rename and delete buttons exist
            expect(getHeaderButtonByType("rename")).not.toBeInTheDocument();
            expect(getHeaderButtonByType("delete")).not.toBeInTheDocument();
        });

        it("should show the api viewer", () => {
            // ensure the rctree exists
            expect(screen.getByRole("tree")).toBeInTheDocument();
        });

        it("should render the authentication information button visible when configuration with OAuth2 is selected", async () => {
            // Load a state with pre-selected configuration
            act(() => {
                const apiList =
                    mockApiListWithConfiguration("id-config-oauth2");
                useStore.setState({
                    api: apiList,
                    selectedApiUuid: apiList[0].uuid,
                });
            });
            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: "auth-info-button" })
                ).toHaveClass("visible");
            });
        });

        it("should render the authentication information button invisible when configuration with Basic Auth is selected", async () => {
            // Load a state with pre-selected configuration
            act(() => {
                const apiList = mockApiListWithConfiguration(
                    "id-config-basic-auth"
                );
                useStore.setState({
                    api: apiList,
                    selectedApiUuid: apiList[0].uuid,
                });
            });
            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: "auth-info-button" })
                ).toHaveClass("invisible");
            });
        });

        it("should render the authentication information button invisible when not selecting authentication items from dropdown", async () => {
            // Load a state with pre-selected configuration
            act(() => {
                const apiList = mockApiListWithConfiguration(undefined);
                useStore.setState({
                    api: apiList,
                    selectedApiUuid: apiList[0].uuid,
                });
            });
            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: "auth-info-button" })
                ).toHaveClass("invisible");
            });
        });
        // TODO: Add breadcrumb test case
    });

    // TODO: For further testing
    // Add more test cases in the process of implementing other features
});
