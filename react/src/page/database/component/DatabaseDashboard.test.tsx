import {
    act,
    fireEvent,
    render,
    waitFor,
    screen,
} from "@testing-library/react";
import useStore from "../../../common/zustand/Store";
import { Database } from "../../../common/zustand/interface/DatabaseInterface";
import { DatabaseTable } from "../../../common/zustand/interface/DatabaseTableInterface";

import DatabaseDashboard from "./DatabaseDashboard";
import { DATABASE_PARENT } from "../../../common/data/Constant";

const mockDatabaseList: Database[] = [
    {
        id: 1,
        uuid: "DATABASE-db-1",
        name: "database-1",
        title: "database-1",
        order: 0,
    },
    {
        id: 2,
        uuid: "DATABASE-db-2",
        name: "database-2",
        title: "database-2",
        order: 0,
    },
];

const mockDatabaseTableList: DatabaseTable[] = [
    {
        id: 1,
        uuid: "TABLE-table-1",
        database_uuid: "DATABASE-db-1",
        name: "table-1",
        title: "table-1",
        order: 0,
    },
    {
        id: 2,
        uuid: "TABLE-table-2",
        database_uuid: "DATABASE-db-1",
        name: "table-2",
        title: "table-2",
        order: 0,
    },
];

const getHeaderButtonByType = (
    type: "create" | "rename" | "delete" | "configuration"
) => {
    return screen.queryByRole("button", { name: `header-${type}-button` });
};

const renderDatabaseDashboard = async () => {
    await waitFor(() => {
        useStore.setState(
            {
                database: mockDatabaseList,
                databaseTable: mockDatabaseTableList,
                updateDatabaseSort: jest.fn(),
                updateDatabaseTableSort: jest.fn(),
            },
            true
        );

        render(<DatabaseDashboard />);
    });
};

describe("Database: DatabaseDashboard", () => {
    beforeEach(() => renderDatabaseDashboard());

    it("should have a button to view the item list mode", () => {
        // Ensure the button is clickable
        expect(
            screen.getByRole("button", { name: "common.button.create" })
        ).toBeEnabled();
    });

    it("should show the database page header after click the create button", () => {
        act(() => {
            fireEvent.click(getHeaderButtonByType("create") as HTMLElement);
        });

        expect(screen.getByText("page.title.database")).toBeInTheDocument();
    });

    it("should show only create button if no database/table is selected", () => {
        // ensure header create button exist
        expect(getHeaderButtonByType("create")).toBeInTheDocument();

        // ensure other edit buttons doesn't exist
        expect(getHeaderButtonByType("rename")).not.toBeInTheDocument();
        expect(getHeaderButtonByType("delete")).not.toBeInTheDocument();
    });

    it("should show other buttons if a database/table is selected", async () => {
        await act(async () => {
            useStore.setState({
                selectedDatabaseUuid: mockDatabaseList[0].uuid,
            });
        });

        // ensure all buttons exist
        expect(getHeaderButtonByType("create")).toBeInTheDocument();
        expect(getHeaderButtonByType("rename")).toBeInTheDocument();
        expect(getHeaderButtonByType("delete")).toBeInTheDocument();
    });

    it("should show the configuration button if a database is selected", async () => {
        await act(async () => {
            useStore.setState({
                selectedDatabaseUuid: mockDatabaseList[0].uuid,
                selectedDatabaseTableUuid: null,
            });
        });

        expect(getHeaderButtonByType("configuration")).toBeInTheDocument();
    });

    it("should show the configuration button if root database is selected", async () => {
        await waitFor(() => {
            useStore.setState({
                selectedDatabaseUuid: DATABASE_PARENT,
                selectedDatabaseTableUuid: null,
            });
        });

        expect(getHeaderButtonByType("configuration")).toBeInTheDocument();
    });

    it("should not show the configuration button if a database is not selected", async () => {
        await waitFor(() => {
            useStore.setState({
                selectedDatabaseUuid: null,
                selectedDatabaseTableUuid: null,
            });
        });

        expect(getHeaderButtonByType("configuration")).not.toBeInTheDocument();
    });

    it("should show the database viewer", () => {
        // ensure the rctree exists
        expect(screen.getByRole("tree")).toBeInTheDocument();
    });
});
