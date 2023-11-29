import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { truncate } from "lodash";
import { toast } from "react-toastify";

import { socketInstance } from "../helper/Socket";
import { getCookies } from "../helper/Cookies";
import httpRequest, { HttpResponse } from "../helper/HttpRequest";

import { API_TOKEN } from "../data/Constant";
import useToast from "../hooks/Toast";

import { ApplicationResponseModel } from "../zustand/interface/ApplicationInterface";

type SocketListenerOptions = {
    maxReconnectionRetries: number;
    currentRetries?: number;
    reconnectAfter?: number;
};

type BuildingStatus = {
    message: string;
    longMessage: string;
    className: string;
};

/**
 * Creates a connection to socket server
 * @param {string} channelName The channel name to use when connecting to socket server
 * @param {(message: string) => void} onMessageReceived The callback function that will be triggered when a message is received from socket server
 * @returns {() => void}
 */
const websocketListen = (
    channelName: string,
    onMessageReceived: (message: string) => void,
    options: SocketListenerOptions
): (() => void) => {
    // Get the currentRetries from the options
    let currentRetries = options.currentRetries ?? 0;
    let reconnectAfter = options.reconnectAfter ?? 2000;

    const onClose = () => {
        if (options.maxReconnectionRetries <= currentRetries) {
            // Add another second once the currentRetries reaches the maximum reconnection retries
            reconnectAfter += 1000;

            // Reset to zero
            currentRetries = 0;
        }

        // Reconnect after few seconds
        setTimeout(() => {
            websocketListen(channelName, onMessageReceived, {
                ...options,
                reconnectAfter,
                currentRetries: currentRetries + 1,
            });
        }, reconnectAfter);
    };

    // Get the token from cookie
    const token = getCookies(API_TOKEN);

    socketInstance.listen({
        onReceive: onMessageReceived,
        onClose,
        inputChannelName: channelName,
        protocols: token,
    });

    // Close the connection and remove the onclose event
    return () => socketInstance.close(channelName, true);
};

/**
 * Process the message received from socket server
 * @param {string} message The message that was received from socket server
 * @param {(status: BuildingStatus) => void} buildStatus The callback function to run to set the BuildingStatus object
 */
const processMessage = (
    message: string,
    buildStatus: (status: BuildingStatus) => void
) => {
    let type = "normal";
    let msg = "";
    let longMessage = "";

    // Parse the message
    try {
        const parsedMsg = JSON.parse(message);
        type = parsedMsg?.type || "normal";
        msg = parsedMsg?.message || "";
    } catch {
        // The message is not a json
        msg = message;
    }

    if (msg) {
        const limit = 40;

        // Add title to the element so that when it is hovered it will display the whole text
        if (msg.length > limit) {
            longMessage = msg;
        }

        msg = truncate(msg, { length: 40 });

        buildStatus({
            className: type,
            longMessage,
            message: msg,
        });
    }
};

const BuildStatus = () => {
    const toastMessage = useToast(true);
    const location = useLocation();

    // Get the appid from params
    // Use this as the channel name
    const { appid } = useParams();

    const [buildingStatus, setBuildingStatus] = useState<BuildingStatus>({
        // The message that is displayed in the header (can be truncated)
        message: "",

        // The whole message to be displayed as a tooltip
        longMessage: "",

        // The css class name, use by diplaying the message
        className: "",
    });

    // Reconnects to socket server whenever the page changes
    useEffect(() => {
        // Web socket listener for the status of building the app
        const close = websocketListen(
            appid as string,
            (message: string) => {
                processMessage(message, (status: BuildingStatus) => {
                    setBuildingStatus(status);
                });
            },
            { maxReconnectionRetries: 5 }
        );

        // Web socket listener for wide broadcast
        const closeBroadcast = websocketListen(
            process.env.REACT_APP_SOCKET_BROADCAST_CHANNEL as string,
            (message: string) => {
                // Call the api to get the build_status of the app
                httpRequest
                    .get<void, HttpResponse<ApplicationResponseModel>>(
                        `/v1/applications/${appid}`
                    )
                    .then((data) => {
                        // Check the build status of the app, if 'force_failed'
                        if (
                            data.success &&
                            data.data.app.build_status === "force_failed"
                        ) {
                            processMessage(
                                message,
                                (status: BuildingStatus) => {
                                    setBuildingStatus(status);
                                }
                            );
                        }
                    })
                    .catch((error) => {
                        toastMessage(
                            Array.isArray(error) ? error.join(" ") : error,
                            toast.TYPE.ERROR
                        );
                    });
            },
            { maxReconnectionRetries: 5 }
        );

        // Close the connections when the component is unmounted
        return () => {
            close();
            closeBroadcast();
        };
    }, [location.pathname]);

    return (
        <div
            aria-label="socket-message-main"
            className={`socket ${buildingStatus.className}`}
        >
            <span title={buildingStatus.longMessage}>
                {buildingStatus.message}
            </span>
        </div>
    );
};

export default BuildStatus;
