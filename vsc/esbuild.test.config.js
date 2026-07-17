const esbuild = require("esbuild");
const path = require("path");
const glob = require("glob");

const isWatch = process.argv.includes("--watch");

/**
 * esbuild configuration for integration test files.
 * Compiles test runner and all e2e test files to dist/test/.
 */
const testEntries =
  glob.sync("src/test/e2e/**/*.ts", { cwd: __dirname });

/** @type {esbuild.BuildOptions} */
const testConfig = {
  entryPoints: testEntries.map((f) => path.resolve(__dirname, f)),
  bundle: true,
  platform: "node",
  target: "ES2022",
  format: "cjs",
  outdir: path.resolve(__dirname, "dist", "test"),
  external: ["vscode"],
  sourcemap: true,
};

async function build() {
  const configs = [testConfig];
  if (isWatch) {
    const contexts = await Promise.all(
      configs.map((cfg) => esbuild.context(cfg)),
    );
    await Promise.all(contexts.map((ctx) => ctx.watch()));
    console.log("[esbuild] Watching test files...");
  } else {
    await Promise.all(configs.map((cfg) => esbuild.build(cfg)));
    console.log("[esbuild] Test build complete.");
  }
}

build().catch((err) => {
  console.error("[esbuild] Test build failed:", err);
  process.exit(1);
});
