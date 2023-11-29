import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { act } from "react-dom/test-utils";
import useStore from "../../../../common/zustand/Store";
import DatabaseCreate from "./DatabaseCreate";

const nameInput = () => {
    return screen.getByLabelText(
        "database.dashboard.modal.create.form.label.name"
    );
};

const submitButton = () => {
    return screen.getByRole("button", { name: "common.button.create" });
};

const enterFormFieldsAndSubmit = (name: string) => {
    if (name) {
        act(() => {
            userEvent.type(nameInput(), name);
        });
    }
    act(() => {
        userEvent.click(submitButton());
    });
};

describe("Component: Modal - DatabaseCreate", () => {
    const mockHandleClose = jest.fn();
    beforeEach(async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <DatabaseCreate show handleClose={mockHandleClose} />
                    <ToastContainer />
                </MemoryRouter>
            );
        });
    });

    it("should have a Modal title", async () => {
        await waitFor(() => {
            expect(
                screen.getByText(
                    "database.dashboard.modal.create.title.database"
                )
            ).toBeInTheDocument();
        });
    });

    it("should have a cancel button that triggers handleClose", async () => {
        userEvent.click(
            screen.getByRole("button", { name: "common.button.cancel" })
        );
        await waitFor(() => expect(mockHandleClose).toBeCalledTimes(1));
    });

    it("should submit form successfully when validation has passed", async () => {
        const mockName = "test-database-name";
        await waitFor(() => {
            enterFormFieldsAndSubmit(mockName);
        });

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "database.dashboard.modal.create.form.message.success"
            );
        });
    });

    describe("should fail to submit if", () => {
        it("database name is empty", async () => {
            await waitFor(() => {
                enterFormFieldsAndSubmit("");
            });

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "database.dashboard.modal.create.form.error.required.name"
                );
            });
        });

        it("database name has empty spaces", async () => {
            await waitFor(() => {
                enterFormFieldsAndSubmit("test spacing");
            });

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameSpace"
                );
            });
        });

        it("database name must not contain special characters", async () => {
            const mockName = "test-name-!@#$%^&*()";

            await waitFor(() => {
                enterFormFieldsAndSubmit(mockName);
            });

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.specialCharactersDetected"
                );
            });
        });

        it("database name already exist", async () => {
            const mockName = "test-duplicate-database-name";

            await act(async () => {
                enterFormFieldsAndSubmit(mockName);
            });

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "database.dashboard.modal.create.form.message.success"
                );
            });

            // After creating the database it will automatically set it as the selected database
            // need to set both selectedDatabaseUuid and selectedDatabaseTableUuid to null so that it will check the
            // name from the database list
            act(() =>
                useStore.setState({
                    selectedDatabaseUuid: null,
                    selectedDatabaseTableUuid: null,
                })
            );

            await act(async () => {
                enterFormFieldsAndSubmit(mockName);
            });

            await waitFor(() => {
                expect(screen.getByRole("alert")).not.toHaveTextContent(
                    "common.error.nameExist"
                );
            });
        });

        it("table name already exist", async () => {
            const mockName = "test-duplicate-table-name";
            await act(async () => {
                enterFormFieldsAndSubmit(mockName);
            });

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "database.dashboard.modal.create.form.message.success.table"
                );
            });

            await act(async () => {
                enterFormFieldsAndSubmit(mockName);
            });

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameExist"
                );
            });
        });
    });
});
