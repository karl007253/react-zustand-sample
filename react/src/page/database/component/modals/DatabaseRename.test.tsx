import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import useStore from "../../../../common/zustand/Store";
import { DatabaseTable } from "../../../../common/zustand/interface/DatabaseTableInterface";
import {
    Database,
    Encoding,
    Engine,
} from "../../../../common/zustand/interface/DatabaseInterface";

import DatabaseRename from "./DatabaseRename";

const mockHandleClose = jest.fn();

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
    {
        uuid: "DATABASE-qsZjOmC7fbf1hXbp1qnjb",
        name: "Database2",
        title: "Database2",
        order: 1,
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
    {
        uuid: "TABLE-BamnNezfvTmgssrLiZuHx",
        name: "table1b",
        title: "table1b",
        order: 1,
        database_uuid: "DATABASE-jtSn6Rtd5dWpi8rNbuMke",
    },
];

const nameInput = (selectValue = false) => {
    const input = screen.getByLabelText(
        "database.dashboard.modal.rename.form.label.name"
    ) as HTMLInputElement;

    if (selectValue) {
        input.select();
    }

    return input;
};

const submitButton = () => {
    return screen.getByRole("button", { name: "common.button.rename" });
};

const enterFormFieldsAndSubmit = (
    value: string,
    input?: HTMLInputElement | undefined
) => {
    if (value) {
        userEvent.type(input ?? nameInput(), value);
    }
    userEvent.click(submitButton());
};

const renderDatabaseRename = async () => {
    await waitFor(() => {
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
                <DatabaseRename show handleClose={mockHandleClose} />
                <ToastContainer />
            </MemoryRouter>
        );
    });
};

describe("Component: Modal - DatabaseRename", () => {
    const { setSelectedDatabaseUuid, setSelectedDatabaseTableUuid } =
        useStore.getState();

    beforeEach(() => renderDatabaseRename());

    it("should have a Modal title", async () => {
        await waitFor(() => {
            setSelectedDatabaseUuid("DATABASE-jtSn6Rtd5dWpi8rNbuMke");
        });

        expect(
            screen.getByText("database.dashboard.modal.rename.title.database")
        ).toBeInTheDocument();
    });

    it("should have a cancel button that triggers handleClose", () => {
        userEvent.click(
            screen.getByRole("button", { name: "common.button.cancel" })
        );
        expect(mockHandleClose).toBeCalledTimes(1);
    });

    it("should submit form successfully when validation has passed", async () => {
        const mockName = "test-database-name";

        enterFormFieldsAndSubmit(mockName);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "database.dashboard.modal.rename.form.message.success"
            );
        });
    });

    describe("should fail to submit if", () => {
        it("database name is empty", async () => {
            // Clear by {backspace} because there's a text in the input (the currently selected database/table)
            enterFormFieldsAndSubmit("{backspace}", nameInput(true));

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "database.dashboard.modal.rename.form.error.required.name"
                );
            });
        });

        it("database name has empty spaces", async () => {
            enterFormFieldsAndSubmit("test spacing");

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameSpace"
                );
            });
        });

        it("database name must not contain special characters", async () => {
            const mockName = "test-name-!@#$%^&*()";

            await waitFor(() =>
                setSelectedDatabaseUuid("DATABASE-jtSn6Rtd5dWpi8rNbuMke")
            );

            enterFormFieldsAndSubmit(mockName, nameInput(true));

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.specialCharactersDetected"
                );
            });
        });

        it("database name already exist", async () => {
            // Clear by {backspace} then replace with "Database2"
            const mockName = "{backspace}Database2";

            await waitFor(() =>
                setSelectedDatabaseUuid("DATABASE-jtSn6Rtd5dWpi8rNbuMke")
            );

            enterFormFieldsAndSubmit(mockName, nameInput(true));

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameExist"
                );
            });
        });

        it("table name already exist", async () => {
            // Clear by {backspace} then replace with "table1b"
            const mockName = "{backspace}table1b";

            await waitFor(() =>
                setSelectedDatabaseTableUuid("TABLE-MDYGsDchpjlIGWuigKc6P")
            );

            enterFormFieldsAndSubmit(mockName, nameInput(true));

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameExist"
                );
            });
        });
    });
});
