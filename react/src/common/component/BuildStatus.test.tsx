import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// eslint-disable-next-line import/no-extraneous-dependencies
import WS from "jest-websocket-mock";

import { socketInstance } from "../helper/Socket";
import { mockedHttpRequest } from "../helper/HttpRequest";
import BuildStatus from "./BuildStatus";

const appId = "167333766127887";

const socketMessageContainer = () => {
    return screen.getByLabelText("socket-message-main");
};

const mockRender = async () => {
    render(
        <MemoryRouter initialEntries={[`/module/${appId}/scheduler`]}>
            <Routes>
                <Route
                    path="/module/:appid/scheduler"
                    element={<BuildStatus />}
                />
            </Routes>
        </MemoryRouter>
    );
};

describe("Component: BuildStatus", () => {
    let socketServer: WS;

    beforeEach(async () => {
        // Set the environment variable
        process.env.REACT_APP_SOCKET_URL = "ws://localhost";

        // Create an instance of mock socket server
        socketServer = new WS(socketInstance.socketUrl(appId));

        // Create a mocked instance of socket object
        const mockedSocket = socketInstance as jest.Mocked<
            typeof socketInstance
        >;

        // Modify the channel name generation to return a constant value (since the current behavior is to generate unique random name)
        mockedSocket.uniqueChannelName = jest.fn(() => {
            return appId;
        });

        // Mock the response from application info api
        mockedHttpRequest.get.mockImplementation(() => {
            return Promise.resolve({
                data: {
                    app: {},
                },
                success: true,
            });
        });

        await waitFor(() => {
            mockRender();
        });
    });

    afterEach(() => {
        // Cleanup and close the WS server instance
        WS.clean();
    });

    it("should have a normal message displayed", async () => {
        const message = "sample normal message";
        const className = "normal";

        await waitFor(() => {
            socketServer.send(`{"type":"${className}","message":"${message}"}`);
        });

        // Ensure that there is normal class name
        expect(socketMessageContainer()).toHaveClass(className);

        // Ensure that the message is displayed
        expect(socketMessageContainer()).toHaveTextContent(message);
    });

    it("should have a success message displayed", async () => {
        const message = "sample success message";
        const className = "success";

        await waitFor(() => {
            socketServer.send(`{"type":"${className}","message":"${message}"}`);
        });

        // Ensure that there is success class name
        expect(socketMessageContainer()).toHaveClass(className);

        // Ensure that the message is displayed
        expect(socketMessageContainer()).toHaveTextContent(message);
    });

    it("should have a failure message displayed", async () => {
        const message = "sample failed message";
        const className = "failed";

        await waitFor(() => {
            socketServer.send(`{"type":"${className}","message":"${message}"}`);
        });

        // Ensure that there is failed class name
        expect(socketMessageContainer()).toHaveClass(className);

        // Ensure that the message is displayed
        expect(socketMessageContainer()).toHaveTextContent(message);
    });

    it("should display the plain text message as normal message", async () => {
        const message = "plain text message";
        const className = "normal";

        await waitFor(() => {
            socketServer.send(message);
        });

        // Ensure that there is normal class name
        expect(socketMessageContainer()).toHaveClass(className);

        // Ensure that the message is displayed
        expect(socketMessageContainer()).toHaveTextContent(message);
    });

    // TODO: Unit test for reconnection
});
