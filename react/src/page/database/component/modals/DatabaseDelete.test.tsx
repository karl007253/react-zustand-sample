import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useStore from "../../../../common/zustand/Store";
import DatabaseDelete from "./DatabaseDelete";
import {
    Database,
    Encoding,
    Engine,
} from "../../../../common/zustand/interface/DatabaseInterface";
import { DatabaseTable } from "../../../../common/zustand/interface/DatabaseTableInterface";

const mockDatabaseList: Database[] = [
    {
        uuid: "DATABASE-jtSn6Rtd5dWpi8rNbuMke",
        name: "Database1",
        title: "Database1",
        order: 0,
        data: {
            engine: Engine.INNODB,
            encoding: Encoding.UTF8,
        },
    },
];

const mockDatabaseTableList: DatabaseTable[] = [
    {
        uuid: "TABLE-MDYGsDchpjlIGWuigKc6P",
        name: "table1a",
        title: "table1a",
        order: 0,
        database_uuid: "DATABASE-jtSn6Rtd5dWpi8rNbuMke",
    },
];

const deleteButton = () => {
    return screen.getByRole("button", { name: "common.button.yes" });
};

describe("Component: Modal - DatabaseDelete", () => {
    const mockHandleClose = jest.fn();
    beforeEach(() => {
        const state = useStore.getState();

        useStore.setState(
            {
                ...state,
                database: mockDatabaseList,
                databaseTable: mockDatabaseTableList,
            },
            true
        );

        render(
            <MemoryRouter>
                <DatabaseDelete show handleClose={mockHandleClose} />
                <ToastContainer />
            </MemoryRouter>
        );
    });

    it("should have a Modal title", async () => {
        await waitFor(() =>
            useStore.setState({
                selectedDatabaseUuid: null,
                selectedDatabaseTableUuid: "TABLE-MDYGsDchpjlIGWuigKc6P",
            })
        );

        expect(
            screen.getByText("database.dashboard.modal.delete.title.table")
        ).toBeInTheDocument();

        await waitFor(() =>
            useStore.setState({
                selectedDatabaseTableUuid: null,
                selectedDatabaseUuid: "DATABASE-jtSn6Rtd5dWpi8rNbuMke",
            })
        );

        expect(
            screen.getByText("database.dashboard.modal.delete.title.database")
        ).toBeInTheDocument();
    });

    it("should have a 'no' button that triggers handleClose", () => {
        userEvent.click(
            screen.getByRole("button", { name: "common.button.no" })
        );
        expect(mockHandleClose).toBeCalledTimes(1);
    });

    it("should successfully delete a table", async () => {
        await waitFor(() =>
            useStore.setState({
                selectedDatabaseUuid: null,
                selectedDatabaseTableUuid: "TABLE-MDYGsDchpjlIGWuigKc6P",
            })
        );

        userEvent.click(deleteButton());

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "database.dashboard.modal.delete.form.message.success.table"
            );
        });
    });

    it("should successfully delete a database", async () => {
        await waitFor(() =>
            useStore.setState({
                selectedDatabaseTableUuid: null,
                selectedDatabaseUuid: "DATABASE-jtSn6Rtd5dWpi8rNbuMke",
            })
        );

        userEvent.click(deleteButton());

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "database.dashboard.modal.delete.form.message.success.database"
            );
        });
    });
});
