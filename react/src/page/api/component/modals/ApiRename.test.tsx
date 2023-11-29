import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";

import useStore from "../../../../common/zustand/Store";
import {
    Folder,
    FolderType,
} from "../../../../common/zustand/interface/FolderInterface";
import { Api } from "../../../../common/zustand/interface/ApiInterface";

import ApiRename from "./ApiRename";

const mockHandleClose = jest.fn();

const mockFolderList: Folder[] = [
    {
        uuid: "id-folder-1",
        type: FolderType.API,
        name: "folder-1",
        title: "folder-1",
        order: 0,
        id: 1,
    },
    {
        uuid: "id-folder-2",
        type: FolderType.API,
        name: "folder-2",
        title: "folder-2",
        order: 1,
        id: 2,
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
        data: {},
        order: 0,
        id: 2,
    },
];

const nameInput = (selectValue = false) => {
    const input = screen.getByLabelText(
        "api.dashboard.modal.rename.form.label.name"
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

const renderApiRename = async () => {
    await waitFor(() => {
        // Initial state
        const state = useStore.getState();

        useStore.setState(
            {
                ...state,
                api: mockApiList,
                folder: mockFolderList,
            },
            true
        );

        render(
            <MemoryRouter>
                <ApiRename show handleClose={mockHandleClose} />
                <ToastContainer />
            </MemoryRouter>
        );
    });
};

describe("Component: Modal - ApiRename", () => {
    const uuid = "id-endpoint-1";

    const { setSelectedApiUuid, setSelectedApiFolderUuid } =
        useStore.getState();

    beforeEach(() => renderApiRename());

    it("should have a Modal title", () => {
        expect(
            screen.getByText("api.dashboard.modal.rename.title")
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
            setSelectedApiUuid(uuid);
        });

        const mockName = "test-api-rename";

        enterFormFieldsAndSubmit(mockName);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "api.dashboard.modal.rename.form.message.success.action"
            );
        });
    });

    describe("should fail to submit if", () => {
        beforeEach(async () => {
            // Set the selected api uuid
            await waitFor(() => {
                setSelectedApiUuid(uuid);
            });
        });

        it("new api name is empty", async () => {
            // Cannot pass an empty string
            // So need to set a selection range in the input textbox
            // And then pass {backspace} to clear everything that is selected in the input
            formWithInputAndSubmit(nameInput(true), "{backspace}");

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modal.rename.form.error.required.name"
                );
            });
        });

        it("new api name has empty spaces", async () => {
            enterFormFieldsAndSubmit("test spacing");

            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameSpace"
                );
            });
        });

        it("new api action name already exist", async () => {
            // Clear everything then replace with "endpoint-2"
            const mockName = "{backspace}endpoint-2";

            // Submit the input with value
            formWithInputAndSubmit(nameInput(true), mockName);

            // ensure an error will show
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modal.rename.form.error.nameExist"
                );
            });
        });

        it("new folder name already exist", async () => {
            // Set the selected folder uuid
            await waitFor(() => {
                setSelectedApiFolderUuid("id-folder-1");
            });

            // Clear everything then replace with "folder-2"
            const mockName = "{backspace}folder-2";

            // Submit the input with value
            formWithInputAndSubmit(nameInput(true), mockName);

            // ensure an error will show
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modal.rename.form.error.nameExist"
                );
            });
        });
    });
});
