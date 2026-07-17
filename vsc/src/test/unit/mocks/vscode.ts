// Mock factories for VS Code API objects used in unit tests.
// These satisfy the vscode.Disposable interface shape without importing 'vscode'.

export interface MockDisposable {
  dispose(): void;
  /** Whether dispose() has been called at least once. */
  disposed: boolean;
  /** Number of times dispose() has been called. */
  callCount: number;
}

export function createMockDisposable(): MockDisposable {
  const self: MockDisposable = {
    disposed: false,
    callCount: 0,
    dispose() {
      self.disposed = true;
      self.callCount++;
    },
  };
  return self;
}

export interface MockOutputChannel {
  appendLine(line: string): void;
  dispose(): void;
  /** All lines appended via appendLine. */
  lines: string[];
  /** Whether dispose() has been called. */
  disposed: boolean;
}

export function createMockOutputChannel(): MockOutputChannel {
  const self: MockOutputChannel = {
    lines: [],
    disposed: false,
    appendLine(line: string) {
      self.lines.push(line);
    },
    dispose() {
      self.disposed = true;
    },
  };
  return self;
}
