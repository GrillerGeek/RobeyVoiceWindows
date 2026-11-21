# Robey Voice Windows preview

**Local dictation for Windows 11 x64 on Intel or AMD PCs, with manual updates.**

Robey Voice 0.1.0 is a branded preview based on Handy. Press a configurable shortcut, speak, and receive text in an ordinary Windows text field using a local speech model. Local dictation requires no account, subscription, API key, or cloud credentials. Initial model download and installation of a missing WebView2 runtime need internet access. Optional cloud post-processing is off by default and is outside this preview's validation.

## Preview Status

Source/configuration checks passed 7/7 and the browser suite passed 13/13. [Native run 44927384462](https://github.com/GrillerGeek/RobeyVoiceWindows/actions/runs/44927384462) successfully built and audited an unsigned installer from `e0c4233952f98d754db7207052e25948186bee4d`. Independent audit passed 116 factual checks with no blocking packaging findings; artifact checksums, source/run, runtime payload and shipped notices were verified. CI used a temporary portable installation and synthetic CPU file transcription. Windows 11 microphone, shortcut, paste, offline, side-by-side behavior and Angie acceptance remain pending. See the [validation report](docs/robey-voice-windows-validation.md) and [execution report](docs/robey-voice-windows-execution-report.md) for scope and remaining checks.

- Intended platform: Windows 11 x64 on Intel or AMD. A dedicated GPU is not required by the intended CPU-capable flow; hardware performance remains unverified.
- Package: unsigned NSIS `.exe` preview only. No Windows publisher signing credentials are available. An Apple signing certificate cannot sign a Windows publisher identity.
- Updates: manual only. The preview disables updater checks and installation, including saved opt-in settings. A user-clicked link may open this fork's releases page.
- Windows 10, Windows ARM64, macOS, and Linux are outside this preview's acceptance target.

## Quick Start

[v0.1.0-preview.1](https://github.com/GrillerGeek/RobeyVoiceWindows/releases/tag/v0.1.0-preview.1) was published on 2026-11-21 at 18:06:42 UTC. The public installer is named [`RobeyVoice-0.1.0-windows-x64-setup.exe`](https://github.com/GrillerGeek/RobeyVoiceWindows/releases/download/v0.1.0-preview.1/RobeyVoice-0.1.0-windows-x64-setup.exe); the downloaded public file was verified as 16,415,893 bytes with SHA256 `21a50c13f4f625459e02f64cb6699eb22635b8880f0dcb27ba0b772fcd5203f5`. All seven public asset sizes/digests match the prepared files, and the release tag resolves to exact built source `e0c4233952f98d754db7207052e25948186bee4d`. The release also carries the evidence ZIP, source archive, BUILD-FACTS and checksum manifests. Product/file version is 0.1.0. See the [release notes](docs/robey-voice-windows-release-notes.md).

Download the installer and follow [Angie's setup guide](docs/angie-setup.md): verify the file, install under normal Windows policies, allow microphone access, choose a local model, and try a short sentence in normal, non-elevated Notepad. If unsigned software is blocked, stop and report the message to Jason. Do not disable security protections.

## How It Works

1. Use the inherited Windows `Ctrl+Space` shortcut. Hold to record and release to stop, or tap to toggle; hold-only and toggle-only modes and rebinding remain available.
2. Speak while recording feedback is active.
3. The inherited capture, session control, VAD, and local transcription engine process the recording.
4. The app attempts to paste the result into the focused text field. History and copy controls provide recovery when insertion cannot complete.

The inherited curated model chooser shows model names, download sizes and progress. Choose and download a supported CPU-capable model explicitly; no transcription weights ship in the installer. GPU availability and model timing depend on the actual machine. Recognition quality, timing, and target-app compatibility remain to be tested with Angie.

## Local Data and Defaults

A fresh profile defaults to English UI and English recognition, the system microphone, requested recording only, VAD enabled, and translation, cloud post-processing, automatic submission, and startup disabled. The inherited history limit is five entries with recording retention set to follow that limit. History can contain transcripts and local recordings; use the existing history deletion and model deletion controls to manage them.

Installed data uses the private identifier `com.jasonrobey.robeyvoice.windows`. On Windows the expected app-data root is `%APPDATA%\com.jasonrobey.robeyvoice.windows`, containing `settings_store.json`, `history.db`, `recordings`, `models`, `webview`, and `huggingface\hub`. Use the app's Open App Data Folder control to locate the actual directory. The build keeps model discovery/downloads inside its own Hugging Face cache; it does not automatically migrate or share Handy's settings, history, models, or cache.

The inherited portable option keeps data under `Data` beside that separate installation's executable, including WebView and Hugging Face cache. Installed/portable isolation, simultaneous launch, and uninstall behavior still require native verification. Keep separate installation folders and choose different shortcuts when running Handy alongside Robey Voice. The internal Cargo package/binary and library remain `handy` / `handy_app_lib`, but canonical Tauri `mainBinaryName: "robey-voice"` gives the packaged process the unique filename `robey-voice.exe`. This separation is required so installer running-process checks do not target Handy; actual install, upgrade and uninstall isolation still require native verification.

Normal uninstall offers an app-data deletion checkbox. Leaving it unchecked retains local data; selecting it requests removal of this app's identifier-derived roaming/local folders. Portable mode has no normal uninstall registration: its `Data` remains in its own folder until that folder is deliberately removed. Native retention/deletion checks remain pending. See [setup and removal](docs/angie-setup.md).

## Troubleshooting

- **No microphone:** check Windows microphone permissions and the selected input in settings; restore the device and retry.
- **No model or interrupted download:** return to model setup and retry when online. A model must finish downloading before use; there is no cloud fallback.
- **Shortcut conflict:** choose a free binding in settings, especially if Handy is also running.
- **Text did not appear:** open History, copy the result, and paste into an allowed normal-user target. Some restricted or elevated fields reject input, and delivery detection may be incomplete. Do not elevate or bypass restrictions.
- **Install/runtime blocked:** preserve the exact error and stop. Jason must resolve the authorized distribution or runtime issue.

## Development

See [BUILD.md](BUILD.md) for the frozen dependency setup and dedicated native Windows workflow. The [plain preview specification](docs/robey-voice-windows-spec.md) defines E1–E10 and the eight edge cases. Source/build checks are separate from native interactive validation and human acceptance.

## Attribution and Licenses

Robey Voice derives from [Handy](https://github.com/cjpais/Handy) v0.10.1, commit `aca8985190c3ad7f361d8a80cb30f179513ed690`, by CJ Pais and contributors. This fork is not an official Handy distribution and does not imply upstream endorsement. Upstream links here identify the source and contribution context, not Robey Voice downloads.

Handy's complete MIT copyright, permission text, and disclaimer are preserved unchanged in [LICENSE](LICENSE), including Copyright (c) 2025 CJ Pais. Original Jason Robey microphone/wave artwork, its SVG source and PNG/ICO derivatives are separately **GPL-3.0-only**; this artwork notice does not relicense Handy code. The original SVG is in [src/assets/robey-voice.svg](src/assets/robey-voice.svg) and bundled as `resources/brand/robey-voice.svg`.

Dependencies, native runtimes, fonts, VAD, and user-downloaded speech models retain their own licenses. The bundle is not exclusively MIT. See [third-party notices](src-tauri/resources/licenses/THIRD-PARTY-NOTICES.txt) and [GPL artwork terms](src-tauri/resources/licenses/GPL-3.0-only.txt). The Windows workflow generates the locked Rust/frontend/native inventories and includes notices in the package; CI generated and packaged the inventories; independent audit verified all 13 shipped notice files. Two MIT metadata-only source-text gaps remain disclosed distributor follow-ups, not legal certification.
