# Robey Voice 0.1.0 Windows preview

Intended release identifier: `v0.1.0-preview.1`. App/file version: 0.1.0. Exact installer source: `e0c4233952f98d754db7207052e25948186bee4d`.

Local dictation preview for Windows 11 x64 on Intel or AMD PCs, based on Handy v0.10.1. Core dictation requires no account, subscription, API key or paid service. Initial model download and setup of a missing WebView2 runtime need internet access. Cloud post-processing is optional and off by default; updates are manual. Ctrl+Space supports hold/toggle and rebinding. Local history defaults to five entries and can include recordings; review/delete them through the app's controls.

**Unsigned:** no verified Windows publisher signature. Preserve normal security prompts; if device policy blocks installation, stop and report it without disabling protections.

[Native run 44927384462](https://github.com/GrillerGeek/RobeyVoiceWindows/actions/runs/44927384462) passed NSIS build, silent temporary portable installation into a path with spaces, runtime/payload/CPU audit and synthetic CPU file transcription. Rust: 342 passed, 0 failed, 20 ignored; fmt/clippy passed with clippy warnings. Configuration checks passed 7/7 and browser tests 13/13. Independent artifact audit passed 116 factual checks with no blocking packaging findings.

Assets prepared for this release:

- `Robey Voice_0.1.0_x64-setup.exe` — 16,415,893 bytes; SHA256 `21a50c13f4f625459e02f64cb6699eb22635b8880f0dcb27ba0b772fcd5203f5`.
- `RobeyVoice-0.1.0-windows-x64-evidence.zip` — unchanged official CI ZIP, 16,525,597 bytes; SHA256 `003e1862560e9121de82c5af985d75e029c960a0eac5dc902d22fcfeb233690e`.
- `RobeyVoice-0.1.0-source-e0c4233.tar.gz`, `BUILD-FACTS.json`, `artifact-audit-report.md`, original CI `SHA256SUMS.txt`, and release-file `RELEASE-SHA256SUMS.txt`.

Native Windows 11 desktop installation/policy, microphone, shortcut, paste, offline dictation, real side-by-side install/upgrade/uninstall, recovery and Angie/Jason acceptance remain pending. CI portable installation and a synthetic CPU file probe do not establish those results or hardware suitability. Windows ARM64, Windows 10, macOS and Linux are outside this preview's acceptance target.

Handy's complete MIT/CJ Pais license remains intact. Jason's original icon artwork/source is GPL-3.0-only; dependencies, runtimes, VAD and models retain their terms. Two upstream MIT source-text gaps are disclosed distributor follow-ups, not legal certification. See `docs/angie-setup.md` and the validation/execution reports for setup, evidence and remaining checks. Later documentation-only main commits do not change this installer source.
