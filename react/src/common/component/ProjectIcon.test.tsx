import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import userEvent from "@testing-library/user-event";
import ProjectIcon from "./ProjectIcon";
import useStore from "../zustand/Store";
import { ApplicationDetails } from "../zustand/interface/ApplicationInterface";
import { HttpResponse } from "../helper/HttpRequest";
import { APP_ICON_MAX_SIZE } from "../data/Constant";

const mockApplicationData: ApplicationDetails = {
    id: 1,
    application_code: "1234567890",
    application_type_id: 1,
    application_type_name: "Client",
    user_id: 1,
    appname: "test",
    description: "test",
    compiler: "cordova",
    icon: "current-app-icon.png",
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

const defaultAppIconName = "app-icon.png";
const fileSizeLimit = APP_ICON_MAX_SIZE;

const testImageFile = new File(["flower"], "flower.jpg", {
    type: "image/jpeg",
});

const testTextFile = new File(["flower"], "flower.txt", {
    type: "text/plain",
});

const testLargeFile = new File(["flower"], "flower.jpg", {
    type: "image/jpeg",
});

// Modify the size property of the large file to be slightly over the file size limit
Object.defineProperty(testLargeFile, "size", { value: fileSizeLimit + 1 });

// We have to mock useParams() hook since this components rely on the supplied appId from the URL
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({
        appid: "123",
    }),
}));

describe("Component: ProjectIcon", () => {
    beforeEach(() => {
        useStore.setState({
            applicationData: mockApplicationData,
        });
        render(
            <MemoryRouter>
                <ProjectIcon />
                <ToastContainer />
            </MemoryRouter>
        );
    });

    const appIconImage = () => screen.getByLabelText("app-icon-image");

    it("should have the back-end icon label", () => {
        expect(screen.getByText("module.logo.title")).toBeInTheDocument();
    });

    it("should have its input elements hidden from view", () => {
        expect(screen.getByLabelText("app-icon-field")).not.toBeVisible();
    });

    it("should have the current app icon if exists", () => {
        // Ensure the icon is shown. Note that extra arguments have been added into the link.
        expect(appIconImage()).toHaveAttribute(
            "src",
            expect.stringMatching(`${mockApplicationData.icon}\\?t=\\d+`)
        );
    });

    it("should have the default app icon if not exists", () => {
        // Load application settings, but without icon
        act(() => {
            useStore.setState({
                applicationData: {
                    ...mockApplicationData,
                    icon: null,
                },
            });
        });
        expect(appIconImage()).toHaveAttribute("src", defaultAppIconName);
    });

    it("should have default icon if the linked image fails to load", () => {
        // Trigger image load error on the img element
        fireEvent.error(appIconImage());

        // Now, ensure the icon is changed to the default one
        expect(appIconImage()).toHaveAttribute("src", defaultAppIconName);
    });

    it("should have the new app icon on successful upload", async () => {
        const appIconInputField = screen.getByLabelText("app-icon-field");

        // This is the mock implementation of a successful icon upload function.
        const uploadIconFunction = jest.fn(
            async (applicationCode: string, file: File) => {
                return {
                    success: true,
                    data: file.name,
                    message: "Upload success",
                } as HttpResponse<string>;
            }
        );

        // Override the function inside the app's state.
        act(() => {
            useStore.setState({
                uploadAppIcon: uploadIconFunction,
            });
        });

        // Simulate user upload
        userEvent.upload(appIconInputField, testImageFile);

        // Ensure the upload icon function is triggered internally
        expect(uploadIconFunction).toHaveBeenCalled();

        // Ensure the icon is changed with the new app icon
        await waitFor(() => {
            expect(appIconImage()).toHaveAttribute(
                "src",
                expect.stringMatching(`${testImageFile.name}\\?t=\\d+`)
            );
        });
    });

    it("should keep the icon unchanged on failing upload", async () => {
        const appIconInputField = screen.getByLabelText("app-icon-field");

        // This is the mock implementation of a failing icon upload function.
        const uploadIconFunction = jest.fn(async () => {
            return {
                success: false,
                data: "",
                message: "Upload failed",
            } as HttpResponse<string>;
        });

        // Override the function inside the app's state.
        act(() => {
            useStore.setState({
                uploadAppIcon: uploadIconFunction,
            });
        });

        // Ensure the current app icon is shown
        expect(appIconImage()).toHaveAttribute(
            "src",
            expect.stringMatching(`${mockApplicationData.icon}\\?t=\\d+`)
        );

        // Simulate user upload
        userEvent.upload(appIconInputField, testImageFile);

        // Ensure the upload icon function is triggered internally
        expect(uploadIconFunction).toHaveBeenCalled();

        // Ensure the icon is still unchanged
        await waitFor(() => {
            expect(appIconImage()).toHaveAttribute(
                "src",
                expect.stringMatching(`${mockApplicationData.icon}\\?t=\\d+`)
            );
        });
    });

    it("should show error message if file type is not supported", async () => {
        const appIconInputField = screen.getByLabelText("app-icon-field");

        // Simulate user uploading an unsupported file (text file instead of image).
        userEvent.upload(appIconInputField, testTextFile);

        // Ensure an alert with supposed error message to be shown.
        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "module.error.icon.fileTypeNotSupported"
            );
        });
    });

    it("should show error message if file is over the size limit", async () => {
        const appIconInputField = screen.getByLabelText("app-icon-field");

        // Ensure the supplied file is over the limit
        expect(testLargeFile.size).toBeGreaterThan(fileSizeLimit);

        // Simulate user uploading an unsupported file (text file instead of image).
        userEvent.upload(appIconInputField, testLargeFile);

        // Ensure an alert with supposed error message to be shown.
        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "module.error.icon.overFileSize"
            );
        });
    });

    it("should not show any error message if user have not selected a file", async () => {
        const appIconInputField = screen.getByLabelText("app-icon-field");

        // Simulate user uploading no files.
        //
        // Note: This scenario will less likely to occur in real usage since depending on OS support,
        // user will not be able to continue unless one file is selected.
        // However the implementation will handle the error if such situation appears to happen.
        //
        // Note 2: This inspection-disabling statement below is to allow "undefined" value to
        // simulate user uploading no files.
        //
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        userEvent.upload(appIconInputField, undefined);

        // Ensure an alert with supposed error message to be shown.
        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(
                "module.error.icon.noFileSelected"
            );
        });
    });
});
