import { act, render, screen, waitFor, within } from "@testing-library/react";
import useStore from "../../../common/zustand/Store";
import {
    Folder,
    FolderType,
} from "../../../common/zustand/interface/FolderInterface";
import SchedulerDashboard from "./SchedulerDashboard";
import {
    Scheduler,
    SchedulerStatus,
} from "../../../common/zustand/interface/SchedulerInterface";

const mockFolderList: Folder[] = [
    {
        uuid: "id-folder-1",
        type: FolderType.SCHEDULER,
        name: "folder-1",
        title: "folder-1",
        order: 0,
        id: 1,
        data: {
            status: SchedulerStatus.ENABLED,
        },
    },
    {
        uuid: "id-folder-2",
        type: FolderType.SCHEDULER,
        name: "folder-2",
        title: "folder-2",
        folder_uuid: "id-folder-1",
        order: 1,
        id: 2,
        data: {
            status: SchedulerStatus.ENABLED,
        },
    },
    {
        uuid: "id-folder-3",
        type: FolderType.SCHEDULER,
        name: "folder-3",
        title: "folder-3",
        folder_uuid: "id-folder-2",
        order: 1,
        id: 3,
        data: {
            status: SchedulerStatus.DISABLED,
        },
    },
];

const mockSchedulerList: Scheduler[] = [
    {
        uuid: "id-scheduler-1",
        folder_uuid: "id-folder-2",
        name: "scheduler-1",
        title: "scheduler-1",
        data: {
            status: SchedulerStatus.DISABLED,
        },
        order: 1,
    },
    {
        uuid: "id-scheduler-2",
        folder_uuid: "id-folder-3",
        name: "scheduler-2",
        title: "scheduler-2",
        data: {
            status: SchedulerStatus.ENABLED,
        },
        order: 1,
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

const renderSchedulerDashboard = async (useMockData = false) => {
    await waitFor(() => {
        if (useMockData) {
            useStore.setState({
                api: [],
                scheduler: mockSchedulerList,
                folder: mockFolderList,
                updateSchedulerSort: jest.fn(),
            });
        }

        render(<SchedulerDashboard />);
    });
};

describe("Scheduler: SchedulerDashboard ", () => {
    describe("without Scheduler", () => {
        // render module without data
        beforeEach(() => renderSchedulerDashboard());

        it("should have the create button placeholder on initial render", () => {
            // ensure button placeholder exist
            expect(createButtonPlaceholder()).toBeInTheDocument();

            // Ensure create button exists
            expect(
                screen.getByRole("button", { name: "common.button.create" })
            ).toBeInTheDocument();

            // ensure header won't be showing
            expect(
                screen.queryByText("scheduler.dashboard.header.title")
            ).not.toBeInTheDocument();
        });
    });

    describe("with Scheduler", () => {
        // render module without data
        beforeEach(() => renderSchedulerDashboard(true));

        it("should have header title", async () => {
            // ensure header title exist
            expect(
                within(
                    screen.getByLabelText("scheduler-dashboard-header-title")
                ).getByText("scheduler.dashboard.header.title")
            ).toBeInTheDocument();
        });

        it("should have configuration select on header", () => {
            // ensure configuration label is there
            expect(
                screen.getByRole("combobox", {
                    name: "config-dropdown",
                })
            ).toBeInTheDocument();
        });

        it("should show only create button if no scheduler is selected", () => {
            // ensure header create button exist
            expect(getHeaderButtonByType("create")).toBeInTheDocument();

            // ensure other edit buttons doesn't exist
            expect(getHeaderButtonByType("rename")).not.toBeInTheDocument();
            expect(getHeaderButtonByType("delete")).not.toBeInTheDocument();
        });

        it("should show other buttons if an scheduler is selected ", async () => {
            act(() => {
                // use first scheduler on mock list
                useStore.setState({
                    selectedSchedulerUuid: mockSchedulerList[0].uuid,
                    selectedSchedulerFolderUuid: null,
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
                    selectedSchedulerUuid: null,
                    selectedSchedulerFolderUuid: mockFolderList[0].uuid,
                });
            });

            // ensure header create button exist
            expect(getHeaderButtonByType("create")).toBeInTheDocument();

            // ensure that rename and delete buttons exist
            expect(getHeaderButtonByType("rename")).not.toBeInTheDocument();
            expect(getHeaderButtonByType("delete")).not.toBeInTheDocument();
        });

        it("should show the scheduler viewer", () => {
            // ensure the rctree exists
            expect(screen.getByRole("tree")).toBeInTheDocument();
        });

        it("should have a switch button with a value of disabled if parent folder of scheduler 2 is disabled", async () => {
            // scheduler-2 initial status is enabled, it will show disabled if parent folder disabled
            await waitFor(() => {
                // select the scheduler-2
                useStore.setState({
                    selectedSchedulerUuid: mockSchedulerList[1].uuid,
                    selectedSchedulerFolderUuid: null,
                });
            });

            // ensure setting switch button exist and off/disabled
            const container = screen.getByLabelText("scheduler-setting-toggle");
            expect(container.lastChild).toHaveClass("switch btn off");
        });

        it("should have a switch button with a value of disabled (scheduler 1 status is disabled) if parent folder of scheduler 1 is enabled", async () => {
            // scheduler-1 initial status is disabled, it will show disabled if parent folder enabled and root folder enabled
            await waitFor(() => {
                // select the scheduler-1
                useStore.setState({
                    selectedSchedulerUuid: mockSchedulerList[0].uuid,
                    selectedSchedulerFolderUuid: null,
                });
            });

            // ensure setting switch button exist and off/disabled
            const container = screen.getByLabelText("scheduler-setting-toggle");
            expect(container.lastChild).toHaveClass("switch btn off");
        });

        it("should have a switch button with a value of enabled (folder 2 status is enabled) if parent and root folder of folder 2 is enabled", async () => {
            // folder-2 initial status is enabled, it will show enabled if parent folder enabled and root folder enabled
            await waitFor(() => {
                // select the folder-2
                useStore.setState({
                    selectedSchedulerFolderUuid: mockFolderList[1].uuid,
                    selectedSchedulerUuid: null,
                });
            });

            // ensure setting switch button exist and on/enabled
            const container = screen.getByLabelText("scheduler-setting-toggle");
            expect(container.lastChild).toHaveClass("switch btn on");
        });
    });

    // TODO: For further testing
    // Add more test cases in the process of implementing other features
});
