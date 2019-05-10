// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { spawnSync, execSync, exec } from "child_process";

var devicesName: string[]= [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "adb-commands" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.helloWorld",
    () => {
		const deviceListResult = execSync("adb devices");
		const deviceListString = deviceListResult.toLocaleString();
		var list = deviceListString.split(/\r?\n/);
		var deviceStatus = [];
		var devI = 0;
		for (var i = 1; i < list.length; i++) {
		  if (list[i] !== "") {
			  var dev = list[i].split(/\s+/);
			  devicesName[devI] = dev[0];
			  deviceStatus[devI] = dev[1];
			  devI++;
		  }
		}
		const options: { [key: string]: (context: vscode.ExtensionContext) => Promise<void> } = {
		  showDeviceList,
	  };
	  const quickPick = vscode.window.createQuickPick();
	  quickPick.items = Object.keys(options).map(label => ({ label }));
	  quickPick.onDidChangeSelection(selection => {
		  if (selection[0]) {
			  options[selection[0].label](context)
				  .catch(console.error);
		  }
	  });
	  quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
    }
  );

  context.subscriptions.push(disposable);
}

async function showDeviceList() {
	let i = 0;
	const result = await vscode.window.showQuickPick(devicesName, {
		placeHolder: 'Select a device',
		onDidSelectItem: item => vscode.window.showInformationMessage(`Focus ${++i}: ${item}`)
	});
	vscode.window.showInformationMessage(`Got: ${result}`);
}
// this method is called when your extension is deactivated
export function deactivate() {}
