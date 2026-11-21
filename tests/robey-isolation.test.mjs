import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

// Independent E1/E2 contract from Spec SHA256:
// c432fffe941085bf58a7938c0140996b5e08d1ba0c160c562d7498c74d274f00.
// This checks declared packaged process identity only. Native install, silent
// install, upgrade and uninstall must separately prove Handy is never targeted
// or terminated. No executable or installer is run by this test.
const root = new URL("../", import.meta.url);
const json = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));
const object = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

function merge(base, patch) {
  if (!object(patch)) return patch;
  const result = object(base) ? { ...base } : {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) delete result[key];
    else result[key] = merge(result[key], value);
  }
  return result;
}

async function normalWindowsConfig() {
  const base = await json("src-tauri/tauri.conf.json");
  try {
    return merge(base, await json("src-tauri/tauri.windows.conf.json"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return base;
  }
}

test("E1/E2: normal Windows bundle declares unique packaged process identity", async () => {
  const config = await normalWindowsConfig();
  assert.equal(
    config.mainBinaryName,
    "robey-voice",
    "canonical Tauri mainBinaryName must package robey-voice.exe",
  );
});
