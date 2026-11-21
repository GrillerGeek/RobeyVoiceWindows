// Independent contract audit. Run: node --test tests/robey-voice-config.test.mjs
// Only standard Tauri base/Windows configuration is merged here. Final CLI/env
// overrides and native runtime behavior require the evidence in the coverage map.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const json = async (path) => JSON.parse(await read(path));
const object = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Tauri JSON merge-patch semantics: objects recurse; null deletes; arrays and
// scalar values replace. This is config composition, not application behavior.
function merge(base, patch) {
  if (!object(patch)) return patch;
  const result = object(base) ? { ...base } : {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) delete result[key];
    else result[key] = merge(result[key], value);
  }
  return result;
}

async function windowsConfig() {
  const base = await json("src-tauri/tauri.conf.json");
  try {
    return merge(base, await json("src-tauri/tauri.windows.conf.json"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return base;
  }
}

test("E1: public Windows product identity and isolated identifier", async () => {
  const config = await windowsConfig();
  assert.equal(config.productName, "Robey Voice");
  assert.equal(config.identifier, "com.jasonrobey.robeyvoice.windows");
  const main = config.app?.windows?.find(
    (window) => !window.label || window.label === "main",
  );
  // The Spec permits creating the native window at runtime. Its native title
  // remains N1 evidence when no declarative main window is present.
  if (main) assert.match(main.title, /Robey Voice/);
  assert.ok(config.bundle?.icon?.length, "the product must declare its icon");
});

test("E1: frontend, bundle and Cargo package declare preview version 0.1.0", async () => {
  assert.equal((await json("package.json")).version, "0.1.0");
  assert.equal((await windowsConfig()).version, "0.1.0");
  const cargo = await read("src-tauri/Cargo.toml");
  const packageSection = cargo.match(
    /^\[package\]\s*\n([\s\S]*?)(?=^\[|$(?![\s\S]))/m,
  )?.[1];
  assert.ok(packageSection, "Cargo package declaration must be present");
  assert.match(packageSection, /^version\s*=\s*"0\.1\.0"\s*(?:#.*)?$/m);
});

test("E6: effective Windows bundle cannot generate updater artifacts", async () => {
  const config = await windowsConfig();
  assert.ok(
    config.bundle?.createUpdaterArtifacts === false ||
      config.bundle?.createUpdaterArtifacts === undefined,
    "updater artifacts must remain disabled, including v1Compatible",
  );
});

test("E6: effective Windows bundle has no updater endpoint or public key", async () => {
  const updater = (await windowsConfig()).plugins?.updater;
  assert.ok(
    updater?.endpoints === undefined || updater.endpoints.length === 0,
    "manual preview must not configure an automatic update feed",
  );
  assert.ok(
    updater?.pubkey === undefined || updater.pubkey === "",
    "preview must not retain an updater signing key",
  );
});

test("E6/E8: effective Windows installer has no signing command", async () => {
  const windows = (await windowsConfig()).bundle?.windows;
  assert.ok(
    windows?.signCommand === undefined || windows.signCommand === null,
    "unsigned preview must not invoke an inherited signing identity",
  );
});

test("E9: complete upstream MIT permission and CJ Pais copyright survive", async () => {
  const names = (await readdir(fileURLToPath(root))).filter((name) =>
    /^licen[cs]e(?:\.(?:md|txt))?$/i.test(name),
  );
  assert.ok(names.length > 0, "source must include an accessible license");
  const license = (await Promise.all(names.map(read))).join("\n");
  assert.match(license, /copyright[^\n]*CJ Pais/i);
  const normalized = license.replace(/\s+/g, " ").trim();
  for (const paragraph of [
    'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
    "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
    'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
  ]) {
    assert.ok(normalized.includes(paragraph), "complete MIT text must survive");
  }
});
