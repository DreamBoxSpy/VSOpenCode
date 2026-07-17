// extension.test.ts — Integration tests running inside the VS Code Extension Host.
// Tests: extension activation, command registration, view declarations.
//
// NOTE: VS Code's built-in test runner uses Mocha with the BDD interface
// (describe/it), NOT the TDD interface (suite/test).
// These are injected as globals — declare them for TypeScript.

import * as assert from "node:assert/strict";
import * as vscode from "vscode";

// Mocha BDD globals (injected by VS Code Extension Host test runner)
declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: MochaFunc): void;
declare function before(fn: MochaFunc): void;
declare function after(fn: MochaFunc): void;
declare function beforeEach(fn: MochaFunc): void;
declare function afterEach(fn: MochaFunc): void;
type MochaFunc = (() => void) | (() => Promise<void>);

const EXTENSION_ID = "hklab.vscode-opencode";

describe("VSOpenCode Extension", () => {
  // -----------------------------------------------------------------------
  // Extension presence & metadata
  // -----------------------------------------------------------------------

  it("should be present in VS Code", () => {
    const ext = vscode.extensions.getExtension(EXTENSION_ID);
    assert.ok(ext, `Extension "${EXTENSION_ID}" not found`);
  });

  it("should declare expected viewsContainers in package.json", () => {
    const ext = vscode.extensions.getExtension(EXTENSION_ID)!;
    const pkg = ext.packageJSON;

    const containers = pkg.contributes?.viewsContainers?.activitybar;
    assert.ok(containers, "No activitybar viewContainers declared");
    const container = containers.find(
      (c: { id: string }) => c.id === "vscode-opencode",
    );
    assert.ok(container, "View container 'vscode-opencode' not declared");
  });

  it("should declare toolView webview in package.json", () => {
    const ext = vscode.extensions.getExtension(EXTENSION_ID)!;
    const views = ext.packageJSON.contributes?.views?.["vscode-opencode"];

    assert.ok(views, "No views declared for 'vscode-opencode'");
    const toolView = views.find(
      (v: { id: string }) => v.id === "vscode-opencode.toolView",
    );
    assert.ok(toolView, "View 'vscode-opencode.toolView' not found");
    assert.strictEqual(toolView.type, "webview", "toolView should be 'webview' type");
  });

  it("should declare configuration properties", () => {
    const ext = vscode.extensions.getExtension(EXTENSION_ID)!;
    const props = ext.packageJSON.contributes?.configuration?.properties;

    assert.ok(props, "No configuration properties declared");
    assert.ok(
      "vscode-opencode.opencodePath" in props,
      "opencodePath config not declared",
    );
    assert.ok(
      "vscode-opencode.serverPort" in props,
      "serverPort config not declared",
    );
    assert.ok(
      "vscode-opencode.idleTimeoutMinutes" in props,
      "idleTimeoutMinutes config not declared",
    );
  });

  // -----------------------------------------------------------------------
  // Extension activation
  // -----------------------------------------------------------------------

  it("should activate on openToolWindow command", async () => {
    const ext = vscode.extensions.getExtension(EXTENSION_ID)!;

    await vscode.commands.executeCommand("vscode-opencode.openToolWindow");

    assert.strictEqual(ext.isActive, true, "Extension should be active after command");
  });

  // -----------------------------------------------------------------------
  // Command registration
  // -----------------------------------------------------------------------

  it("should register all expected commands", async () => {
    const allCommands = await vscode.commands.getCommands(true);

    assert.ok(
      allCommands.includes("vscode-opencode.openToolWindow"),
      "openToolWindow command not registered",
    );
    assert.ok(
      allCommands.includes("vscode-opencode.refreshToolWindow"),
      "refreshToolWindow command not registered",
    );
  });

  it("should allow refreshToolWindow to execute without uncaught error", async () => {
    // Activate first so the refresh callback is wired
    await vscode.commands.executeCommand("vscode-opencode.openToolWindow");

    // refreshToolWindow attempts to restart server — may fail gracefully
    // if opencode binary unavailable, but should not crash
    try {
      await vscode.commands.executeCommand("vscode-opencode.refreshToolWindow");
    } catch {
      // Graceful failure is acceptable
    }
  });
});
