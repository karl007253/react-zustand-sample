import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";

import useStore from "../../../../common/zustand/Store";
import {
    Folder,
    FolderType,
} from "../../../../common/zustand/interface/FolderInterface";
import { Scheduler } from "../../../../common/zustand/interface/SchedulerInterface";

import SchedulerRename from "./SchedulerRename";

const mockHandleClose = jest.fn();

const mockFolderList: Folder[] = [
    {
        uuid: "id-folder-1",
        type: FolderType.SCHEDULER,
        name: "folder-1",
        title: "folder-1",
        order: 0,
        id: 1,
    },
    {
        uuid: "id-folder-2",
        type: FolderType.SCHEDULER,
        name: "folder-2",
        title: "folder-2",
        order: 1,
        id: 2,
    },
];

const mockSchedulerList: Scheduler[] = [
    {
        uuid: "id-endpoint-1",
        folder_uuid: "id-folder-1",
        name: "endpoint-1",
        title: "endpoint-1",
        order: 0,
        id: 1,
    },
    {
        uuid: "id-endpoint-2",
        folder_uuid: "id-folder-1",
        name: "endpoint-2",
        title: "endpoint-2",
        order: 0,
        id: 2,
    },
];

const nameInput = (selectValue = false) => {
    const input = screen.getByLabelText(
        "scheduler.dashboard.modal.rename.form.label.name"
    ) as HTMLInputElement;

    // Select all value
    if (selectValue) {
        input.select();
    }

    return input;
};

const submitButton = () => {
    return screen.getByRole("button", { name: "common.button.rename" });
};

const enterFormFieldsAndSubmit = (name: string) => {
    if (name) {
        userEvent.type(nameInput(), name);
    }

    userEvent.click(submitButton());
};

const formWithInputAndSubmit = (input: HTMLInputElement, value: string) => {
    if (value) {
        userEvent.type(input, value);
    }

    userEvent.click(submitButton());
};

const renderSchedulerRename = async () => {
    await waitFor(() => {
        // Initial state
        const state = useStore.getState();

        useStore.setState(
            {
                ...state,
                scheduler: mockSchedulerList,
                folder: mockFolderList,
            },
            true
        );

        render(
            <MemoryRouter>
                <SchedulerRename show handleClose={mockHandleClose} />
                <ToastContainer />
            </MemoryRouter>
        );
    });
};

describe("Component: Modal - SchedulerRename", () => {
    const uuid = "id-endpoint-1";

    const { setSelectedSchedulerUuid, setSelectedSchedulerFolderUuid } =
        useStore.getState();

    beforeEach(() => renderSchedulerRename());

    it("should have a Modal title", () => {
        expect(
            screen.getByText("scheduler.dashboard.modal.rename.title")
        ).toBeInTheDocument();
    });

    it("should have a cancel button that triggers handleClose", () => {
        userEvent.click(
            screen.getByRole("button", { name: "common.button.cancel" })
        );

        expect(mockHandleClose).toBeCalledTimes(1);
    });

    it("should submit form successfully when validation has passed", async () => {
        await waitFor(() => {
            setSelectedSchedulerUuid(uuid);
        });

        const mockName = "test-scheduler-rename";

        enterFormFieldsAndSubmit(mockName);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "scheduler.dashboard.modal.rename.form.message.success.action"
            );
        });
    });

    describe("should fail to submit if", () => {
        beforeEach(async () => {
            // Set the selected scheduler uuid
            await waitFor(() => {
                setSelectedSchedulerUuid(uuid);
            });
        });

        it("new scheduler name is empty", async () => {
            // Cannot pass an empty string
            // So need to set a selection range in the input textbox
            // And then pass {backspace} to clear everything that is selected in the input
            formWithInputAndSubmit(nameInput(true), "{backspace}");

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "scheduler.dashboard.modal.rename.form.error.required.name"
                );
            });
        });

        it("new scheduler name has empty spaces", async () => {
            enterFormFieldsAndSubmit("test spacing");

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameSpace"
                );
            });
        });

        it("new scheduler action name already exist", async () => {
            // Clear everything then replace with "endpoint-2"
            const mockName = "{backspace}endpoint-2";

            // Submit the input with value
            formWithInputAndSubmit(nameInput(true), mockName);

            // ensure an error will show
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameExist"
                );
            });
        });

        it("new folder name already exist", async () => {
            // Set the selected folder uuid
            await waitFor(() => {
                setSelectedSchedulerFolderUuid("id-folder-1");
            });

            // Clear everything then replace with "folder-2"
            const mockName = "{backspace}folder-2";

            // Submit the input with value
            formWithInputAndSubmit(nameInput(true), mockName);

            // ensure an error will show
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameExist"
                );
            });
        });
    });
});
