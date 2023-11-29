import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import useStore from "./common/zustand/Store";
import Route from "./Route";
import { mockedHttpRequest } from "./common/helper/HttpRequest";
import { Status } from "./common/zustand/interface/UserInterface";

// to resolve error: Not implemented: HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = jest.fn();

// to resolve error: Failed to create chart: can't acquire context from the given item
jest.mock("react-chartjs-2", () => ({
    Line: () => null,
}));

/**
 * Render requested page
 * @param {string} path initial path to be accessed
 */
const renderRouteWithInitialPath = (path: string) => {
    render(
        <MemoryRouter initialEntries={[path]}>
            <Route />
            <ToastContainer />
        </MemoryRouter>
    );
};

describe("Routes", () => {
    it("should redirect user to the Not Found Page when an invaid route is attempted", () => {
        renderRouteWithInitialPath("/a-random-url");

        // Expecting a document title of "Page Not Found" when an invalid route is attempted
        expect(document.title).toEqual(
            "page.title.not.found - page.title.default"
        );
    });

    it("should not have an error message being prompted when a valid app is provided in url", async () => {
        act(() => {
            // Ensure mockUpdateApiHeader is reset to 0 call, by assigning a new jest.fn() in each test
            useStore.setState(
                {
                    user: {
                        details: null,
                        status: Status.AUTHENTICATED,
                    },
                },
                false,
                "introspect"
            );
        });
        // Mock GET API request to indicate successful application data fetching
        mockedHttpRequest.get.mockImplementation(() =>
            Promise.resolve({
                data: {
                    configuration: [],
                    folder: [],
                    api: [],
                    database: [],
                    scheduler: [],
                    app: {},
                    releasesAndBuild: [],
                },
            })
        );

        // Render page with a valid app id
        await waitFor(() => {
            renderRouteWithInitialPath("/dashboard/12345");
        });

        // Expecting no error is found in a toast
        expect(
            screen.queryByText("common.error.application.not.found")
        ).not.toBeInTheDocument();
    });

    it("should prompt an error message if app id is not found in url", async () => {
        // Render page without any app id
        renderRouteWithInitialPath("/dashboard/");

        // Expecting a document title of "Page Not Found" when accessing dashboard without appid
        expect(document.title).toEqual(
            "page.title.not.found - page.title.default"
        );
    });

    it("should prompt an error message if invalid app is provided in url", async () => {
        act(() => {
            // Ensure mockUpdateApiHeader is reset to 0 call, by assigning a new jest.fn() in each test
            useStore.setState(
                {
                    user: {
                        details: null,
                        status: Status.AUTHENTICATED,
                    },
                },
                false,
                "introspect"
            );
        });

        // Mock GET API request to indicate failure in fetching application data
        mockedHttpRequest.get.mockImplementation(() => Promise.reject());

        // Render page with an invalid app id
        renderRouteWithInitialPath("/dashboard/0");

        // Expecting an error message is shown in toast
        expect(
            await screen.findByText("common.error.application.not.found")
        ).toBeInTheDocument();
    });
});
