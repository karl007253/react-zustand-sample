import generateUniqueId from "./UniqueId";

class Socket {
    // Socket instance pool to store all opened socket by its channel name. T
    // This gives ability to control previously opened connection without having to re-initialize it every time
    socketCache: { [channelName: string]: WebSocket } = {};

    /**
     * Generate a unique channel name for the socket.
     * @return {string} a channel name as string with format "socket-<unique-nano-id>".
     */
    // eslint-disable-next-line class-methods-use-this
    uniqueChannelName(): string {
        return generateUniqueId("socket");
    }

    /**
     * Obtain the socket server endpoint URL.
     *
     * @param {string} channelName the socket channel name to listen
     * @return {string} the URL string
     */
    // eslint-disable-next-line class-methods-use-this
    socketUrl(channelName: string): string {
        const baseUrl = process.env.REACT_APP_SOCKET_URL;
        if (!baseUrl) {
            throw new Error("Socket server URL is not configured");
        }
        return `${baseUrl}/v1/ws/${channelName}`;
    }

    /**
     * Start listening to the socket server.
     *
     * @param {(string) => void} receive operation to do when socket message is received.
     * @param {() => void} onOpen an event that is triggered when the socket connection opens.
     * @param {() => void} onClose an event that is triggered when the socket connection closes.
     * @param {string} inputChannelName the channel name specified by user.
     * @param {string | string[]} protocols the protocols that will be pass as an argument when creating an instance of WebSocket
     * @returns {object}
     */
    listen({
        onReceive,
        onOpen,
        onClose,
        inputChannelName,
        protocols,
    }: {
        onReceive: (message: string) => void;
        onOpen?: () => void;
        onClose?: () => void;
        inputChannelName?: string;
        protocols?: string | string[];
    }): {
        channelName: string;
        close: () => void;
    } {
        // Get the channel from the input or generate if not provided
        const channelName =
            inputChannelName && inputChannelName !== ""
                ? inputChannelName
                : this.uniqueChannelName();

        const socket = new WebSocket(this.socketUrl(channelName), protocols);

        // Cache the websocket connection instance
        this.socketCache[channelName] = socket;

        socket.onmessage = (event) => {
            onReceive(event.data);
        };

        if (onOpen) {
            socket.onopen = onOpen;
        }

        if (onClose) {
            socket.onclose = onClose;
        }

        return {
            channelName,
            close: () => socket.close(),
        };
    }

    close(channelName: string, cleanUp = false): void {
        const socket = this.socketCache[channelName];
        if (socket) {
            if (cleanUp) {
                socket.onclose = null;
            }

            socket.close();
            delete this.socketCache[channelName];
        }
    }
}

// A singleton of socket instance to use in this project.
// Purpose is to allow mockable implementation during unit testing.
const socketInstance = new Socket();

export { socketInstance, Socket };
