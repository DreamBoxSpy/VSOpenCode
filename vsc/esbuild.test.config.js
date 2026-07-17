const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

const isWatch = process.argv.includes("--watch");

/**
 * Recursively find all .ts files in a directory.
 */
function findTsFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findTsFiles(fullPath));
    } else if (entry.name.endsWith(".ts")) {
      results.push(fullPath);
    }
  }
  return results;
}

const e2eDir = path.resolve(__dirname, "src", "test", "e2e");
const testEntries = fs.existsSync(e2eDir) ? findTsFiles(e2eDir) : [];

if (testEntries.length === 0) {
  console.log("[esbuild] No e2e test files found, skipping test build.");
  process.exit(0);
}

/** @type {esbuild.BuildOptions} */
const testConfig = {
  entryPoints: testEntries,
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
