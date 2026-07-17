// ESM loader hook that intercepts .html imports and returns an empty string module.
// Usage: node --experimental-strip-types --import ./src/test/unit/html-loader.mjs ...

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Register a data URL hook inline so we can stay single-file.
register(
  'data:text/javascript,' + encodeURIComponent(`
export async function load(url, context, nextLoad) {
  if (url.endsWith('.html') || url.includes('.html?')) {
    // Return a minimal template with {{message}} placeholder so
    // getProxyLoadingHtml() in templates.ts can inject "OpenCode".
    return { format: 'module', source: 'export default "<!DOCTYPE html>\\\\n<html><head></head><body>{{message}}</body></html>";', shortCircuit: true };
  }
  return nextLoad(url, context);
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.html') || specifier.includes('.html?')) {
    const resolved = await nextResolve(specifier, context);
    return { ...resolved, format: 'module', shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
`.trim()),
  pathToFileURL(import.meta.url)
);
