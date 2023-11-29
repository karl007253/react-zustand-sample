import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useStore from "../../../../common/zustand/Store";
import ApiModuleCreate, { ApiType } from "./ApiCreate";

// type input
const typeSelectInput = () => {
    return screen.getByLabelText("api.dashboard.modal.create.form.label.type");
};

// name input
const nameInput = () => {
    return screen.getByLabelText("api.dashboard.modal.create.form.label.name");
};

// submit button
const submitButton = () => {
    return screen.getByRole("button", { name: "common.button.create" });
};

const enterFormFieldsAndSubmit = (type: ApiType, name: string) => {
    // trigger select event to type
    userEvent.selectOptions(typeSelectInput(), type);

    // trigger type event to name input
    if (name) {
        userEvent.type(nameInput(), name);
    }

    // then trigger submit button
    userEvent.click(submitButton());
};

describe("Component: Modal - ApiModuleCreate", () => {
    // mock handle close
    const mockHandleClose = jest.fn();

    beforeEach(() => {
        render(
            <MemoryRouter>
                <ApiModuleCreate show handleClose={mockHandleClose} />
                <ToastContainer />
            </MemoryRouter>
        );
    });

    it("should have a Modal title", () => {
        expect(
            screen.getByText("api.dashboard.modal.create.title")
        ).toBeInTheDocument();
    });

    it("should have a cancel button that triggers handleClose", () => {
        // trigger click event
        userEvent.click(
            screen.getByRole("button", { name: "common.button.cancel" })
        );

        // ensure mock function is called
        expect(mockHandleClose).toBeCalledTimes(1);
    });

    it("should submit form successfully when validation has passed", async () => {
        // prepare api name
        const mockName = "test-api-name";

        // change input field values
        enterFormFieldsAndSubmit(ApiType.ACTION, mockName);

        // ensure alert is there with right message
        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "api.dashboard.modal.create.form.message.success.action"
            );
        });
    });

    describe("should fail to submit if", () => {
        it("api name is empty", async () => {
            // add first name data
            enterFormFieldsAndSubmit(ApiType.FOLDER, "");

            // ensure a require message will show
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modal.create.form.error.required.name"
                );
            });
        });

        it("api name has empty spaces", async () => {
            // add first name data
            enterFormFieldsAndSubmit(ApiType.FOLDER, "test spacing");

            // ensure a require message will show
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "common.error.nameSpace"
                );
            });
        });

        it("api's action name already exist", async () => {
            // prepare api name
            const mockName = "test-duplicate-name";

            // add first name data
            enterFormFieldsAndSubmit(ApiType.ACTION, mockName);

            // ensure a success alert triggers
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modal.create.form.message.success.action"
                );
            });

            // add data with the same mock name
            enterFormFieldsAndSubmit(ApiType.ACTION, mockName);

            // ensure an error will show
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modal.create.form.error.nameExist"
                );
            });
        });

        it("api's folder name already exist", async () => {
            // prepare api name
            const mockName = "test-duplicate-name";

            // add first name data
            enterFormFieldsAndSubmit(ApiType.FOLDER, mockName);

            // ensure a success alert triggers
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modal.create.form.message.success.folder"
                );
            });

            // Flow:
            // After creating a folder, it will automatically set it as selected folder
            // so in this scenario we will unselect it by "setSelectedFolder"
            // for us to be able to trigger the "create api" under the same directory
            await waitFor(() =>
                useStore.setState({ selectedApiFolderUuid: null })
            );

            // add data with the same mock name
            enterFormFieldsAndSubmit(ApiType.FOLDER, mockName);

            // ensure an error will show
            await waitFor(() => {
                expect(screen.getByRole("alert")).toHaveTextContent(
                    "api.dashboard.modal.create.form.error.nameExist"
                );
            });
        });
    });
});
