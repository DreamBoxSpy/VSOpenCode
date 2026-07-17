// runTest.ts — Entry point for VS Code extension integration tests.
// Downloads a portable VS Code, launches the extension, and runs the test suite.
// Uses @vscode/test-electron which handles downloading, launching, and cleanup.

import { runTests } from "@vscode/test-electron";
import * as path from "node:path";

async function main(): Promise<void> {
  try {
    // The folder containing the Extension Manifest package.json
    const extensionDevelopmentPath = path.resolve(__dirname, "../../../");

    // The path to the test runner script
    const extensionTestsPath = path.resolve(__dirname, "./index");

    // Download VS Code, unzip it, and run the integration test
    // Platform-specific VS Code executable paths
    const platform = process.platform;
    const vscodePath = platform === "win32"
      ? "C:\\Users\\29676_e262f0s\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"
      : platform === "darwin"
        ? "/Applications/Visual Studio Code.app/Contents/MacOS/Electron"
        : "code";

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      vscodeExecutablePath: vscodePath,
      launchArgs: [
        "--disable-extensions",          // speed up launch
        "--skip-welcome",                // skip welcome page
        "--skip-release-notes",          // skip release notes
        "--disable-workspace-trust",     // skip workspace trust dialog
        "--allow-localhost-loopback",    // allow localhost access in test env
        "--user-data-dir", path.resolve(__dirname, "../../../.vscode-test/user-data"),
      ],
    });
  } catch (err) {
    console.error("Integration tests failed:", err);
    process.exit(1);
  }
}

main();
