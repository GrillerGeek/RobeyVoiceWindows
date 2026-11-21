// Build-time inventory from locked installed sources. This is not an SPDX
// attestation or a claim that every conservative dependency-graph entry ships.
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "src-tauri/resources/licenses");
mkdirSync(output, { recursive: true });
const digest = (path) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const json = (path) => JSON.parse(readFileSync(path, "utf8"));
const legalName = /^(licen[cs]e|copying|notice|copyright)([._-]|$)/i;
const legalFiles = (directory, depth = 0) => {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isFile() && legalName.test(entry.name)) files.push(path);
    else if (
      entry.isDirectory() &&
      depth > 0 &&
      ![".git", "node_modules", "target", "build"].includes(entry.name)
    )
      files.push(...legalFiles(path, depth - 1));
  }
  return files.sort();
};
const findPackage = (name, from) => {
  let cursor = from;
  while (true) {
    const candidate = join(cursor, "node_modules", name, "package.json");
    if (existsSync(candidate)) return realpathSync(candidate);
    const parent = dirname(cursor);
    if (parent === cursor) return undefined;
    cursor = parent;
  }
};

const seen = new Set();
const frontend = [];
const missing = [];
const visit = (name, from, optional = false) => {
  const path = findPackage(name, from);
  if (!path) {
    if (!optional)
      throw new Error(`Required installed dependency missing: ${name}`);
    return;
  }
  if (seen.has(path)) return;
  seen.add(path);
  const pkg = json(path);
  const directory = dirname(path);
  const supplemental = join(
    root,
    "licenses/frontend",
    `${pkg.name.replaceAll("/", "__")}-${pkg.version}`,
  );
  const files = [
    ...legalFiles(directory),
    ...(existsSync(supplemental) ? legalFiles(supplemental) : []),
  ];
  if (!files.length) missing.push(`${pkg.name}@${pkg.version}`);
  frontend.push({ pkg, directory, files });
  const dependencies = {
    ...pkg.dependencies,
    ...pkg.optionalDependencies,
    ...pkg.peerDependencies,
  };
  for (const dependency of Object.keys(dependencies).sort())
    visit(
      dependency,
      directory,
      dependency in (pkg.optionalDependencies ?? {}) ||
        dependency in (pkg.peerDependencies ?? {}),
    );
};
for (const name of Object.keys(
  json(join(root, "package.json")).dependencies,
).sort()) {
  // This plugin is imported by vite.config.ts only; its bundler/compiler graph
  // is build tooling rather than JavaScript distributed to the WebView.
  if (name !== "@tailwindcss/vite") visit(name, root);
}
if (missing.length)
  throw new Error(
    `Missing actual frontend license texts: ${missing.join(", ")}`,
  );
frontend.sort((a, b) =>
  `${a.pkg.name}@${a.pkg.version}`.localeCompare(
    `${b.pkg.name}@${b.pkg.version}`,
  ),
);
const frontendText = [
  "Robey Voice frontend production dependency graph (conservative inventory)",
  "Some platform bridges or transitive entries can be tree-shaken. The @tailwindcss/vite plugin and its compiler graph are build tooling and are excluded.",
];
for (const { pkg, directory, files } of frontend) {
  frontendText.push(
    `\n=== ${pkg.name} ${pkg.version} ===`,
    `Declared license: ${JSON.stringify(pkg.license ?? pkg.licenses ?? null)}`,
    `Repository: ${JSON.stringify(pkg.repository ?? null)}`,
  );
  for (const file of files)
    frontendText.push(
      `--- ${relative(directory, file).replaceAll("\\", "/")} (SHA256 ${digest(file)}) ---`,
      readFileSync(file, "utf8"),
    );
}
writeFileSync(
  join(output, "FRONTEND-DEPENDENCIES.txt"),
  `${frontendText.join("\n")}\n`,
);

const catalog = json(join(root, "src-tauri/src/catalog/catalog.json"));
writeFileSync(
  join(output, "MODEL-REFERENCES.json"),
  `${JSON.stringify(
    {
      scope:
        "Catalog references only. User-selected transcription weights are downloaded separately and are not covered by Handy's MIT license or included in this installer. Consult each pinned repository model card and license before use or redistribution.",
      models: catalog.models.map((model) => ({
        id: model.id,
        repository: model.repository,
        revision: model.revision,
        license: model.license,
        source: `https://huggingface.co/${model.repository}/tree/${model.revision}`,
      })),
    },
    null,
    2,
  )}\n`,
);
copyFileSync(join(root, "LICENSE"), join(output, "HANDY-MIT.txt"));

if (!process.argv.includes("--frontend-only")) {
  const command = spawnSync(
    "cargo",
    [
      "metadata",
      "--locked",
      "--format-version",
      "1",
      "--manifest-path",
      "src-tauri/Cargo.toml",
      "--filter-platform",
      "x86_64-pc-windows-msvc",
    ],
    { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
  if (command.status !== 0)
    throw new Error(`Locked Cargo metadata failed: ${command.stderr}`);
  const metadata = JSON.parse(command.stdout);
  const native = [
    "Vendored native dependency license/notice texts from exact locked Cargo package sources.",
    "See RUST-DEPENDENCIES.html for the complete selected Windows crate graph, including build dependencies. Vendored text inventory is intentionally conservative and can include native backends not linked on Windows.",
  ];
  let foundTranscribe = false;
  for (const pkg of metadata.packages
    .filter((pkg) => pkg.name.endsWith("-sys"))
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const directory = dirname(pkg.manifest_path);
    const files = legalFiles(directory, 6);
    native.push(
      `\n=== ${pkg.name} ${pkg.version} ===`,
      `Source: ${pkg.source}`,
      `Declared license: ${pkg.license}`,
    );
    for (const file of files) {
      if (statSync(file).size > 2 * 1024 * 1024)
        throw new Error(`Unexpectedly large native notice: ${file}`);
      native.push(
        `--- ${relative(directory, file).replaceAll("\\", "/")} (SHA256 ${digest(file)}) ---`,
        readFileSync(file, "utf8"),
      );
    }
    if (pkg.name === "transcribe-cpp-sys") {
      foundTranscribe = files.some(
        (path) =>
          relative(directory, path).replaceAll("\\", "/") === "ggml/LICENSE",
      );
      const notice = join(directory, "THIRD-PARTY-LICENSES.md");
      if (!existsSync(notice))
        throw new Error("transcribe.cpp native notices missing");
      native.push(readFileSync(notice, "utf8"));
    }
  }
  if (!foundTranscribe)
    throw new Error("Locked native ggml license was not inventoried");
  writeFileSync(
    join(output, "NATIVE-DEPENDENCIES.txt"),
    `${native.join("\n")}\n`,
  );
}
console.log(
  `Inventoried ${frontend.length} installed frontend dependencies; notices written to package resources.`,
);
