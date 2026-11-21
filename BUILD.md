# Build Instructions

This guide covers the Robey Voice 0.1.0 Windows x64 preview. Handy v0.10.1 at `aca8985190c3ad7f361d8a80cb30f179513ed690` is the fixed upstream baseline. Keep existing lockfiles authoritative; do not upgrade dependencies incidentally.

## Prerequisites

- Windows x64 build host with Visual Studio 2022 or Build Tools and the x64 MSVC C++ workload, Windows SDK, and licensed x64 CRT/OpenMP redistributable directories.
- Rust stable, target `x86_64-pc-windows-msvc`, rustfmt and clippy.
- Bun 1.4.5, CMake on PATH, Vulkan SDK 1.4.309.0 with `glslc`, and vcpkg SPIRV-Headers (`spirv-headers:x64-windows`).
- Git and internet access for locked dependencies/build tools. Native build dependencies are separate from end-user hardware requirements; a dedicated GPU is not required for the intended CPU flow.

The canonical native environment is the dedicated Windows Server 2022 GitHub runner. End-user acceptance targets Windows 11 x64 on Intel or AMD; the hosted runner does not prove Windows 11 interactive behavior. macOS/Linux source is inherited, outside this preview's support and validation scope.

## Source and Frontend Setup

```powershell
git clone https://github.com/GrillerGeek/RobeyVoiceWindows.git
cd RobeyVoiceWindows
bun install --frozen-lockfile
bun run build
bun run lint
bun run check:translations
bun run check:model-languages
bun run check:catalog
node --test tests/robey-voice-config.test.mjs
```

Check out the exact source commit listed in the delivered build manifest when reproducing an artifact. The final build/source commit is pending; the application implementation checkpoint is `8ee2c10`, UI tests are at `5a26243`, and packaging/source changes are through `b3b27c3` before these docs.

For frontend-only work, use `bun run dev` or `bun run preview`. The existing browser tests run with `bun run test:playwright` after installing the matching Playwright browser. These exercise browser code and mocks, not native dictation.

For native development, after provisioning the prerequisites and runtime staging inputs, use:

```powershell
bun run tauri dev
bun run tauri build --target x86_64-pc-windows-msvc --bundles nsis -- --locked
```

The common `src-tauri/tauri.conf.json` and normal platform merge from `tauri.windows.conf.json` are canonical. Do not use an additional `--config` or `TAURI_CONFIG` profile to obtain a passing build. The inherited `build.rs` stages the native `transcribe-libs` payload; a raw `handy.exe` without its resources and runtime DLLs is not a distributable app. The internal filename remains inherited while public product metadata identifies Robey Voice.

## Native Preview Workflow

Run [`.github/workflows/robey-windows.yml`](.github/workflows/robey-windows.yml) with `workflow_dispatch` in `GrillerGeek/RobeyVoiceWindows` at the intended source ref. This is a manual build, not an automatic release publisher. A successful run is still pending.

The workflow:

1. Selects the source, Bun, Rust/MSVC components and Vulkan SDK; installs locked frontend dependencies.
2. Runs [`robey-windows-setup.ps1`](scripts/robey-windows-setup.ps1) to verify the tracked VAD hash, locate licensed Visual Studio CRT/OpenMP redistributables, provision SPIRV-Headers and export staging/build inputs to later CI steps. This script uses GitHub runner environment files; it is not a standalone end-user installer.
3. Runs frontend/configuration checks and Rust formatting, library tests and clippy with locked resolution.
4. Generates full Rust, frontend and native license inventories with pinned cargo-about and [`robey-license-inventory.mjs`](scripts/robey-license-inventory.mjs). Missing license evidence fails the build.
5. Builds only the unsigned x64 NSIS installer through the normal merged configuration. No upstream Azure signing command, signing credentials, updater artifacts, or latest-manifest/release publishing is used.
6. Runs [`robey-windows-audit.ps1`](scripts/robey-windows-audit.ps1) against the actual installer payload and packaged `handy.exe --list-devices`. This must find the required resources/native and app-local VC++ DLLs and a CPU device. Device enumeration is not a transcription, microphone or paste test.
7. Runs [`robey-windows-manifest.ps1`](scripts/robey-windows-manifest.ps1) and uploads `robey-voice-windows-x64`, containing the installer, `BUILD-FACTS.json`, `SHA256SUMS.txt`, evidence and notices. The manifest records facts, not a signed attestation. Failure diagnostics use a separate failure artifact.

The build verifies the existing bundled Silero VAD `silero-vad-v6.2-F32.gguf` SHA256 `0d871a800c420fdd5d1b17a3aea4296d1c39608f0ff4a9295eb76457eb1c88e6`. It does not silently download or replace this resource. Speech transcription weights are downloaded later by the user's explicit model selection. See the [Silero notice](src-tauri/resources/licenses/SILERO-NOTICE.txt) and model references in the generated inventory.

No Windows signing credentials are available; the preview has no verified publisher signature. An Apple certificate is not applicable to Windows publisher signing. Do not add signing workarounds or suppress Windows prompts. If installation is blocked by device policy, record the block and stop.

## Validation and Provenance

The [validation report](docs/robey-voice-windows-validation.md) distinguishes passed local checks, environmental blockers and unverified native/human gates. Record the exact source commit, workflow run URL/status, runner image and tool versions, installer name/SHA256, lockfile/resource hashes, payload audit and device output from the actual native artifact before delivery. All are pending until produced; neither a frontend build nor a Mac build substitutes for them.

Useful checks on a provisioned native development host:

```powershell
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo test --locked --manifest-path src-tauri/Cargo.toml --target x86_64-pc-windows-msvc --lib
cargo clippy --locked --manifest-path src-tauri/Cargo.toml --target x86_64-pc-windows-msvc --all-targets
bun run test:keyboard
bun src/components/settings/history/clipboard.test.ts
bun src/components/update-checker/portableInstaller.test.ts
```

Use formatting checks scoped to tracked/changed files when task-local caches are present; do not run repository-wide write-formatting over private runtime outputs. Preserve existing tests. The Mac baseline's rustfmt check was blocked because that component was absent; native Rust checks have not yet run.

Keep Handy's complete MIT [LICENSE](LICENSE), separate GPL-3.0-only original artwork/source, and all dependency/model/runtime notices. A successful source MIT assertion is not a complete distributed-package license audit.
