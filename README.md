# VSOpenCode

OpenCode integrations for Visual Studio and Visual Studio Code.

## Packages

| Package | Directory | Description |
|---------|-----------|-------------|
| [OpenCode for Visual Studio](./vs/README.md) | [`vs/`](./vs/) | VS 2022 extension — WebView2 tool window |
| [OpenCode for VS Code](./vsc/README.md) | [`vsc/`](./vsc/) | VS Code extension (under development) |

## Build

### Visual Studio Extension

```bash
dotnet build vs/VSOpenCode.csproj -c Release
```

The built `.vsix` is at `vs/bin/Release/net472/VSOpenCode.vsix`.

## License

MIT — see [LICENSE](./LICENSE)
