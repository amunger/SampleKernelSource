// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { JupyterAPI, JupyterServerProvider } from "./api";
import { MyServerProvider } from "./serverProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(
        'Congratulations, your extension "kernelsource" is now active!'
    );

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        "kernelsource.addKernels",
        async () => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            console.log("KERNELSOURCE: Adding kernel provider");
            const jupyterExtension =
                vscode.extensions.getExtension("ms-toolsai.jupyter");
            if (jupyterExtension) {
                const jupyterAPI = jupyterExtension.exports as JupyterAPI;
                await addKernels(jupyterAPI);
            } else {
                console.log("KERNELSOURCE: Jupyter extension is not activated");
            }
        }
    );

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

const serverCollectionId = "kernelSource123";

async function addKernels(jupyterApi: JupyterAPI) {
    const collection = await jupyterApi.createJupyterServerCollection(
        serverCollectionId,
        "My Kernel Source"
    );
    collection.serverProvider = new MyServerProvider();
}
