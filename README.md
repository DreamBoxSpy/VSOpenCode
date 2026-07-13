# Visual Studio OpenCode

A Visual Studio extension that integrates [OpenCode](https://opencode.ai) into Visual Studio via WebView2.

## Features

- Open OpenCode's web interface directly inside a Visual Studio tool window
- Automatic OpenCode Server lifecycle management
- Session persistence per project/solution
- Multi-language support (English, Simplified Chinese)

## Requirements

- Visual Studio 2022 (17.0+)
- [OpenCode](https://opencode.ai) CLI installed
- WebView2 Runtime (included with VS 2022)

## Getting Started

1. Install the VSIX extension
2. Open a solution or Git repository in Visual Studio
3. Go to **View → Other Windows → OpenCode**
4. The OpenCode web interface will load in the tool window

## Development

### Prerequisites

- Visual Studio 2022 with VS Extension Development workload
- .NET Framework 4.8 SDK

### Build

```bash
msbuild src/VSOpenCode/VSOpenCode.csproj /p:Configuration=Release
```

### Debug

Open `VSOpenCode.sln` in Visual Studio and press F5. This launches an experimental instance of Visual Studio with the extension loaded.

## Project Structure

```
src/VSOpenCode/
├── Models/          # Data models (Session, PathInfo, etc.)
├── Services/        # Server management, session API, connection monitoring
├── Commands/        # VS command handlers
├── Controls/        # WPF user controls (ToolWindow, ErrorPage)
├── Resources/       # Localization strings
└── Properties/      # Assembly metadata
```

## License

MIT
