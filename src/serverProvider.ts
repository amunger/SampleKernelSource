import { Event, CancellationToken, EventEmitter } from "vscode";
import {
    JupyterServer,
    JupyterServerConnectionInformation,
    JupyterServerProvider,
} from "./api";

export class MyServerProvider implements JupyterServerProvider {
    private _onDidChangeServers = new EventEmitter<void>();
    onDidChangeServers = this._onDidChangeServers.event;

    async getJupyterServers(
        token: CancellationToken
    ): Promise<JupyterServer[]> {
        const server: JupyterServer = {
            id: "",
            label: "",
            resolveConnectionInformation: function (
                token: CancellationToken
            ): Promise<JupyterServerConnectionInformation> {
                throw new Error("Function not implemented.");
            },
        };

        return [server];
    }
}
