# Visual Studio OpenCode

A Visual Studio 2022 extension that integrates [OpenCode](https://opencode.ai) as a tool window via WebView2.

## Features

- **WebView2 Tool Window** — OpenCode web interface embedded directly in VS
- **Auto Server Detection** — Dynamically resolves `opencode serve` port from process output
- **Session Management** — Creates or finds sessions per project via OpenCode HTTP API
- **Workspace Isolation** — localStorage interception provides per-project data isolation
- **Project Sidebar Injection** — Injects project path into OpenCode localStorage for sidebar visibility
- **VS Theme Integration** — Syncs WebView appearance with Visual Studio color theme in real-time
- **HTTP Proxy Layer** — Intercepts `*.vsoc-app` requests and proxies to the actual OpenCode server
- **Server Controller** — Decoupled server lifecycle; survives tool window close (5-min idle timeout)
- **Smart Shutdown** — Waits for agent to finish before shutting down; cancels on tool window re-open
- **Process Binding** — OpenCode server process is automatically terminated with Visual Studio
- **Error Recovery** — Connection monitoring with styled error page and retry mechanism
- **Multi-language** — EN / zh-Hans via .NET satellite assemblies
- **Solution Auto-refresh** — Detects solution/folder changes and reconnects

## Requirements

| Component | Version |
|-----------|---------|
| Visual Studio | 2022 (17.0+) |
| OpenCode CLI | — installed and in PATH |
| .NET SDK | 10.0+ (for build) |

> **Note**: The extension targets .NET Framework 4.7.2 runtime, but building from source requires the .NET 10 SDK.

## Installation

1. Download the `.vsix` from [Releases](https://github.com/DreamBoxSpy/VSOpenCode/releases)
2. Close all VS instances, double-click the `.vsix`
3. Open VS → **View → Other Windows → OpenCode**

## Build

### In Visual Studio

```
Open VSOpenCode.sln → Build → F5 (experimental instance)
```

### CLI

```bash
dotnet build src/VSOpenCode/VSOpenCode.csproj -c Release
```

The built `.vsix` is at `src/VSOpenCode/bin/Release/net472/VSOpenCode.vsix`.

## Architecture

```
VSOpenCodePackage
├── ServerController (singleton, shared across windows)
│   ├── OpenCodeServerService     → opencode serve process lifecycle
│   │   └── ProcessBinding        → child process auto-termination
│   ├── OpenCodeSessionService    → /session, /project HTTP API
│   ├── ConnectionMonitor         → periodic health checks
│   └── 5-min idle shutdown timer
│
├── OpenCodeToolWindow            → ToolWindowPane
│   └── OpenCodeToolWindowControl → UserControl
│       ├── WebView2              → renders OpenCode web UI
│       │   └── WebView2HostBridge (COM)  → JS ↔ .NET interop
│       ├── WebResourceRequested  → HTTP proxy (vsoc-app → real server)
│       ├── ProjectRootResolver   → DTE / git root detection
│       ├── VSColorTheme          → theme sync with VS environment colors
│       ├── ErrorPage.html         → embedded resource (error display)
│       ├── LoadingPage.html        → embedded resource (loading screen)
│       └── Inject.js              → theme CSS injection + localStorage isolation + project setup
│
└── ShowOpenCodeWindowCommand     → View > Other Windows menu
```

### Interfaces

```
IOpenCodeServerService
IOpenCodeSessionService
IConnectionMonitor
IProjectRootResolver
```

## Project Structure

```
src/VSOpenCode/
├── Commands/           # VS menu command registration
├── Models/             # API DTOs (Session, Project, Health, Path, Server)
├── Services/           # Server, session, connection, project resolver
│   ├── IOpenCodeServerService.cs
│   ├── IOpenCodeSessionService.cs
│   ├── IConnectionMonitor.cs
│   ├── IProjectRootResolver.cs
│   ├── ServerController.cs
│   ├── OpenCodeServerService.cs
│   ├── OpenCodeSessionService.cs
│   ├── ConnectionMonitor.cs
│   ├── ProjectRootResolver.cs
│   └── ProcessBinding.cs
├── Resources/          # Embedded resources & localization
│   ├── ErrorPage.html
│   ├── LoadingPage.html
│   ├── Inject.js
│   ├── Icon.png
│   ├── Strings.resx
│   ├── Strings.zh-Hans.resx
│   └── StringsHelper.cs
├── Controls/           # WPF user controls directory
├── Properties/         # AssemblyInfo
└── VSOpenCodePackage.cs
```

## How It Works

1. **Startup**: The package loads in background, initializes `ServerController`, and registers the menu command.
2. **Tool Window Open**: `OpenCodeToolWindowControl.StartAsync()` resolves the project root via `ProjectRootResolver`, then calls `ServerController.StartAsync()` to launch `opencode serve` and create/find a session.
3. **Navigation**: `ServerController.GetSessionUrl()` generates a virtual `http://opencode.vsoc-app/{b64-project}/session/{id}` URL. WebView2 loads this URL.
4. **HTTP Proxy**: The `WebResourceRequested` handler intercepts all `*.vsoc-app` requests and proxies them to the real OpenCode HTTP server, stripping CSP headers that would block WebView2 rendering.
5. **Theme Injection**: `Inject.js` runs on every page load, calling the COM `WebView2HostBridge` to read VS theme colors, then builds and injects CSS custom properties. VS theme changes trigger real-time re-injection.
6. **Workspace Isolation**: `Inject.js` intercepts `localStorage.getItem/setItem` to shard OpenCode state per project path, preventing workspace data leakage.
7. **Connection Monitoring**: `ConnectionMonitor` pings `/global/health` every 5s. On disconnect, shows a styled error page with retry. On reconnect, navigates back to the session.
8. **Shutdown**: When the tool window closes, a 5-minute idle countdown starts. If the agent is busy, it waits. If the window re-opens, the countdown is cancelled.

## License

MIT
