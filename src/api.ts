import { CancellationToken, Event, Uri } from "vscode";

export interface JupyterServerConnectionInformation {
    /**
     * Base Url of the Jupyter Server.
     * E.g. http://localhost:8888 or http://remoteServer.com/hub/user/, etc.
     */
    readonly baseUrl: Uri;
    /**
     * Jupyter auth Token.
     */
    readonly token?: string;
    /**
     * Authorization header to be used when connecting to the server.
     */
    readonly authorizationHeader?: Record<string, string>;
    /**
     * The local directory that maps to the remote directory of the Jupyter Server.
     * E.g. assume you start Jupyter Notebook with --notebook-dir=/foo/bar,
     * and you have a file named /foo/bar/sample.ipynb, /foo/bar/sample2.ipynb and the like.
     * Then assume the mapped local directory will be /users/xyz/remoteServer and the files sample.ipynb and sample2.ipynb
     * are in the above local directory.
     *
     * Using this setting one can map the local directory to the remote directory.
     * In this case the value of this property would be /users/xyz/remoteServer.
     *
     * Note: A side effect of providing this value is the session names are generated the way they are in Jupyter Notebook/Lab.
     * I.e. the session names map to the relative path of the notebook file.
     * As a result when attempting to create a new session for a notebook/file, Jupyter will
     * first check if a session already exists for the same file and same kernel, and if so, will re-use that session.
     */
    readonly mappedRemoteNotebookDir?: Uri;
    /**
     * Returns the sub-protocols to be used. See details of `protocols` here https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket
     * Useful if there is a custom authentication scheme that needs to be used for WebSocket connections.
     * Note: The client side npm package @jupyterlab/services uses WebSockets to connect to remote Kernels.
     */
    readonly webSocketProtocols?: string[];
}

/**
 * Represents a Jupyter Server displayed in the list of Servers.
 */
export interface JupyterServer {
    /**
     * Unique identifier for this server.
     */
    readonly id: string;
    /**
     * A human-readable string representing the name of the Server. This can be read and updated by the extension.
     */
    label: string;
    /**
     * Returns the connection information for this server.
     */
    resolveConnectionInformation(token: CancellationToken): Promise<JupyterServerConnectionInformation>;
}

/**
 * Provider of Jupyter Servers.
 */
export interface JupyterServerProvider {
    /**
     * Event fired when the list of servers changes.
     * Note: the getJupyterServers method will not be called unless changes are detected.
     */
    onDidChangeServers: Event<void>;
    /**
     * Returns the list of servers.
     */
    getJupyterServers(token: CancellationToken): Promise<JupyterServer[]>;
}
/**
 * Represents a reference to a Jupyter Server command. Provides a title which
 * will be used to represent a command in the UI and, optionally,
 * an array of arguments which will be passed to the command handler
 * function when invoked.
 */
export interface JupyterServerCommand {
    /**
     * Title of the command, like `save`.
     */
    title: string;
    /**
     * A human-readable string which is rendered less prominent in a separate line.
     */
    detail?: string;
    /**
     * The identifier of the actual command handler.
     * @see {@link commands.registerCommand}
     */
    command: string;
    /**
     * A tooltip for the command, when represented in the UI.
     */
    tooltip?: string;
    /**
     * Arguments that the command handler should be
     * invoked with.
     */
    arguments?: unknown[];
}
/**
 * Provider of Jupyter Server Commands.
 * Each command allows the user to perform an action.
 * The return value of the command should be of the form Promise<JupyterServer | 'back' | undefined>
 * The returned value have the following meaning:
 * - JupyterServer  : The Jupyter Server object that was created
 * - 'back'         : Go back to the previous screen
 * - undefined|void : Do nothing
 */
export interface JupyterServerCommandProvider {
    /**
     * Default command to be used when there are no servers. This can be read and updated by the extension.
     * If not set, and there are not servers, then the user will be prompted to select a command from a list of commands returned by `getCommands`.
     */
    selected?: JupyterServerCommand;
    /**
     * Returns a list of commands to be displayed to the user.
     */
    getCommands(token: CancellationToken): Promise<JupyterServerCommand[]>;
}
export interface JupyterServerCollection {
    /**
     * Unique identifier of the Server Collection.
     */
    readonly id: string;
    /**
     * A human-readable string representing the collection of the Servers. This can be read and updated by the extension.
     */
    label: string;
    /**
     * A link to a resource containing more information. This can be read and updated by the extension.
     */
    documentation?: Uri;
    /**
     * Provider of Jupyter Servers. This can be read and updated by the extension.
     */
    serverProvider?: JupyterServerProvider;
    /**
     * Provider of Commands. This can be read and updated by the extension.
     */
    commandProvider?: JupyterServerCommandProvider;
    /**
     * Removes this Server Collection.
     */
    dispose(): void;
}
export interface JupyterAPI {
    /**
     * Creates a Jupyter Server Collection that can be displayed in the Notebook Kernel Picker.
     */
    createJupyterServerCollection(id: string, label: string): Promise<JupyterServerCollection>;
}