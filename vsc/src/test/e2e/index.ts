// index.ts — VS Code Extension Host test runner.
// Sets up Mocha, loads test files, and reports results.
// This is the file passed as --extensionTestsPath to VS Code.

import * as path from "node:path";
import Mocha from "mocha";

export function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "bdd",
    color: true,
    timeout: 30000,
    reporter: "spec",
  });

  // Load our bundled test file
  mocha.addFile(path.resolve(__dirname, "extension.test.js"));

  return new Promise<void>((resolve, reject) => {
    try {
      mocha.run((failures: number) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
