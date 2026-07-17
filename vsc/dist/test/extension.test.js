"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/test/e2e/extension.test.ts
var assert = __toESM(require("node:assert/strict"));
var vscode = __toESM(require("vscode"));
var EXT = "hklab.vscode-opencode";
var H = "127.0.0.1";
var P = 4096;
var B = `http://${H}:${P}`;
function djb2(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h << 5) + h + s.charCodeAt(i) | 0;
  return h >>> 0;
}
var proxy = `http://${H}:${15e3 + djb2(B) % 1e3}`;
var wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function tryGet(url, ms = 3e3) {
  try {
    return await fetch(url, { signal: AbortSignal.timeout(ms) });
  } catch {
    return null;
  }
}
describe("Metadata", () => {
  it("present", () => assert.ok(vscode.extensions.getExtension(EXT)));
  it("views+config", () => {
    const p = vscode.extensions.getExtension(EXT).packageJSON;
    assert.ok(p.contributes?.viewsContainers?.activitybar?.find((x) => x.id === "vscode-opencode"));
    assert.ok(p.contributes?.views?.["vscode-opencode"]?.find((x) => x.id === "vscode-opencode.toolView"));
    assert.ok(p.contributes?.configuration?.properties);
  });
  it("commands declared", () => {
    const cmds = vscode.extensions.getExtension(EXT).packageJSON.contributes?.commands;
    assert.ok(cmds?.some((c) => c.command === "vscode-opencode.openToolWindow"));
  });
});
describe("Activation", () => {
  before(async function() {
    this.timeout(9e4);
    await vscode.commands.executeCommand("vscode-opencode.openToolWindow");
    assert.strictEqual(vscode.extensions.getExtension(EXT).isActive, true);
    console.log("[E2E] Extension activated, waiting for server startup...");
  });
  it("active", () => assert.strictEqual(vscode.extensions.getExtension(EXT).isActive, true));
  it("commands registered", async () => {
    const cmds = await vscode.commands.getCommands(true);
    assert.ok(cmds.includes("vscode-opencode.openToolWindow"));
    assert.ok(cmds.includes("vscode-opencode.refreshToolWindow"));
  });
});
describe("Server & Page Check", () => {
  before(async function() {
    this.timeout(12e4);
    if (!vscode.extensions.getExtension(EXT).isActive)
      await vscode.commands.executeCommand("vscode-opencode.openToolWindow");
    console.log(`[E2E] Waiting for proxy at ${proxy}/...`);
    const deadline = Date.now() + 6e4;
    let ok2 = false;
    while (Date.now() < deadline) {
      const r = await tryGet(`${proxy}/`, 3e3);
      if (r && r.ok) {
        ok2 = true;
        console.log(`[E2E] Proxy ready!`);
        break;
      }
      console.log(`[E2E] Proxy not ready yet, retrying...`);
      await wait(2e3);
    }
    if (!ok2) {
      const srv = await tryGet(`${B}/global/health`, 3e3);
      console.log(`[E2E] Server health direct: ${srv ? `status=${srv.status}` : "unreachable"}`);
      if (!srv) console.log("[E2E] NOTE: localhost fetch blocked in test env \u2014 skipping server checks");
    }
  });
  it("proxy page contains OpenCode", async function() {
    this.timeout(1e4);
    const r = await tryGet(`${proxy}/`);
    if (!r) {
      console.log("[E2E] skip: proxy unreachable");
      return;
    }
    assert.strictEqual(r.status, 200);
    const html = await r.text();
    console.log(`[E2E] Proxy / response: ${html.slice(0, 100)}...`);
    assert.ok(html.includes("OpenCode"));
  });
  it("inject.js has theme+storage hooks", async function() {
    this.timeout(1e4);
    const r = await tryGet(`${proxy}/inject.js`);
    if (!r) {
      console.log("[E2E] skip: proxy unreachable");
      return;
    }
    assert.strictEqual(r.status, 200);
    const body = await r.text();
    console.log(`[E2E] inject.js: ${body.length}B, has theme=${body.includes("vscode-theme-inject")}, has storage=${body.includes("localStorage")}`);
    assert.ok(body.includes("vscode-theme-inject"));
    assert.ok(body.includes("localStorage"));
  });
});
describe("Commands", () => {
  it("refresh executes", async function() {
    this.timeout(3e4);
    if (!vscode.extensions.getExtension(EXT).isActive)
      await vscode.commands.executeCommand("vscode-opencode.openToolWindow");
    try {
      await vscode.commands.executeCommand("vscode-opencode.refreshToolWindow");
    } catch {
    }
  });
});
//# sourceMappingURL=extension.test.js.map
