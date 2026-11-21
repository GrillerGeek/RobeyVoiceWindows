# Robey Voice Windows preview specification

Date: 2026-11-21  
Owner: Jason Robey  
Intended first user: Angie  
Document type: plain implementation specification; no IDD Product, linked Expectations, lifecycle state, or human acceptance is implied.

## Purpose and authority

Deliver a first branded Windows x64 preview of a subscription-free, local dictation app based on Handy. Angie should be able to install it, download a local speech model, press a configurable shortcut, speak, and receive text in an ordinary Windows text field. Preserve Handy's capture → shortcut/session control → VAD → local transcription engine → paste/clipboard → history pipeline.

Owner authorization: “Let's do it. Let's go ahead and create a version based on handy for Angie.” Prior confirmed direction authorizes an owned, subscription-free local app and autonomous first-pass identity, icon, and theme choices for later review. It does not establish Angie's hardware, preferred appearance, successful installation, or acceptance.

The following are engineering assumptions for this bounded preview, open to later review:

- Windows 11 x64 on an Intel or AMD PC; English interface and English dictation by default. Windows ARM64, Windows 10, macOS, and Linux are outside this preview's acceptance target.
- Product name **Robey Voice**, app identifier **com.jasonrobey.robeyvoice.windows**, version **0.1.0**, source repository **GrillerGeek/RobeyVoiceWindows**. Keep the internal Cargo package/binary `handy`, library `handy_app_lib`, and resulting `handy.exe` names to limit churn; public product metadata, installation paths, shortcuts, and distributable names must identify Robey Voice.
- A distinct microphone/wave icon and restrained teal accent, with the inherited system light/dark theme behavior. These are first-pass choices, not owner-approved final visual design.
- An unsigned NSIS `.exe` installer is sufficient for the preview; MSI is not required. Windows signing remains pending: no Windows signing credentials are available. The installer must not invoke Handy's Azure signing command or imply a verified publisher.
- Initial model download and missing WebView2 runtime setup may need internet access. Dictation after model installation must work offline without an account, subscription, API key, cloud credentials, or paid service.
- Angie's CPU, RAM, GPU, microphone, workplace policies, target applications, desired hotkey, and accuracy/latency preferences remain unverified. Do not invent minimum hardware or performance claims.

## Source baseline and implementation surfaces

Base this preview on Handy **v0.10.1**, commit **aca8985190c3ad7f361d8a80cb30f179513ed690**. Record any subsequent source changes in build provenance; do not silently float the upstream baseline.

Inspected repository evidence:

| Surface | Source and implication |
| --- | --- |
| Project rules and pipeline | `AGENTS.md`: Tauri 2, Rust managers, React/TypeScript, translated UI strings, shared notice mechanism, single-instance behavior. Preserve these patterns. |
| Build prerequisites | `BUILD.md`: Windows MSVC C++ tools, Rust, Bun, CMake, and Vulkan SDK; upstream production signing depends on its release environment. |
| App/bundle identity | `package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, `src-tauri/tauri.windows.conf.json`: currently Handy identity/version, Azure signing command, upstream updater key/feed, Windows resource mapping. Audit all effective merged configuration. |
| Windows installer | `src-tauri/nsis/installer.nsi`: registration/uninstall identifiers, shortcuts, portable option, WebView2 setup. Separate Robey Voice's installation and registration from Handy. |
| Updater paths | `src-tauri/src/settings.rs`, `src-tauri/src/lib.rs`, `src/components/update-checker/UpdateChecker.tsx`: stored opt-in, backend trigger/tray checks, frontend checks/install calls. A false default alone is insufficient. |
| Data and defaults | `src-tauri/src/settings.rs`, `src-tauri/src/portable.rs`: settings/history/model paths, portable data, initial shortcuts, microphone, retention, language, and post-processing settings. |
| Native packaging reference | `.github/workflows/build.yml`: x64 Vulkan/SPIRV setup, app-local VC++ and transcription DLL staging, installer payload audits and `--list-devices` smoke check. Adapt these checks to the selected NSIS target; MSI is not required. |

This is a branding, configuration, packaging, and verification change. Set the canonical product identity in common Tauri configuration. Retain the existing local engines, model catalog/download manager, recording implementation, clipboard/paste behavior, history database, and error notices. Preserve Windows `transcribe-libs` staging and the existing x64 dynamic CPU/Vulkan backends. Limit Rust changes to identity/configuration enforcement, safe defaults, and directly necessary integration fixes. The existing `HANDY_DISABLE_UPDATER` hard-lock may be set unconditionally early in Windows bootstrap, before any cached updater-state lookup, to enforce the preview policy; remove the upstream updater feed/key and signing command independently. Do not redesign the backend.

## Expected first-use behavior and defaults

1. Installer and Start menu clearly identify Robey Voice 0.1.0. A first launch opens onboarding; it must not silently record or enroll the app in startup.
2. Explain local processing, initial model download, where local history lives, and how to choose a microphone and shortcut using existing onboarding/settings surfaces.
3. Default to English UI and English recognition, system-default microphone, microphone active only for requested recording, VAD enabled, translation disabled, cloud post-processing disabled, auto-submit disabled, startup disabled, and inherited local history limit of five entries with the corresponding inherited recording-retention setting. Explain that history can include local recordings and provide existing deletion controls.
4. Use inherited Windows `Ctrl+Space` and hold-or-toggle shortcut behavior initially; display it and preserve rebinding. Conflict handling must remain visible and recoverable. No guarantee that Handy and Robey Voice can share the same hotkey simultaneously.
5. Keep the inherited curated local model chooser rather than adding a new download service. Require an explicit model download/selection; display model name, download size, and progress from the catalog. Record the model/version used for validation. Prefer a CPU-capable recommended model; do not require a dedicated GPU. Preserve accelerator selection and a working CPU option.
6. After onboarding, recording feedback, tray access, settings, history, copy, retry, and cancellation remain available through the inherited flow. Local dictation must never depend on configuring a post-processing provider. Existing optional advanced provider settings may remain, disabled by default and clearly optional; validation of them is outside this preview.
7. Updates are manual for this preview. Show a clear disabled/manual-update state and, if useful, a user-clicked link to the Robey Voice repository. Never fetch or install Handy updates, including on a persisted update opt-in.

## Measurable Expectations

These are acceptance criteria to verify during implementation, not claims of completed work.

| ID | Required result | Evidence required |
| --- | --- | --- |
| E1 Identity | App/bundle metadata, Windows executable product metadata, installer, Start menu, uninstall entry, window title, tray/about/footer, and principal onboarding screens identify Robey Voice 0.1.0 with the distinct icon. Version declarations agree. Internal Cargo/library/executable filenames may remain inherited; Handy references remain where legally required or accurately describing attribution. | Targeted identity/config audit plus installed Windows screenshots and metadata inspection. |
| E2 Isolation | Robey Voice can be installed alongside Handy without replacing its executable, installation directory, uninstall registration, startup entry, single-instance target, WebView2 profile, settings, history, recordings, models, or cache. Robey Voice defaults to its own identifier-derived data paths. No automatic import/migration or model-cache sharing. Inherited portable mode, if retained, stays inside its separate installation's data directory. | Native side-by-side install/relaunch/uninstall checklist; before/after synthetic markers in both apps' stores; record resolved data paths and prove Handy markers remain unchanged. |
| E3 Local defaults | A fresh synthetic profile has the defaults listed above; ordinary transcription asks for no account, subscription, API key, or cloud credentials. Post-processing remains off through restart. | Defaults/persistence checks plus a first-run Windows walkthrough. |
| E4 Pipeline | With a downloaded supported model and a working microphone, five consecutive short synthetic English dictations in an ordinary non-elevated Windows text editor produce nonempty text, retain a corresponding recoverable history entry within the configured limit, and return to idle without a crash. Rebinding, hold/toggle, and cancellation remain functional. | Native interactive recording of test steps/results with synthetic phrases, model ID, CPU/GPU mode, hardware, and observed timing. Accuracy/latency suitability is recorded separately for Angie. |
| E5 Offline | With model and runtime installed, block network access for Robey Voice and repeat three synthetic dictations, copy a history result, and relaunch successfully. No audio or transcript is sent to a service during the core flow. | Native offline test results and a focused call-path/network audit. Online model downloads and optional user-clicked links must be distinguished from dictation traffic. |
| E6 Updater disabled | With no environment override and a seeded Robey Voice profile containing `update_checks_enabled: true`, startup, tray/menu/manual triggers, frontend checks, and install actions cannot contact an updater or install an update. The effective bundle contains neither Handy's updater endpoint/key nor its signing command. No updater artifacts or latest-manifest publishing is enabled. | Regression coverage of effective forced-off state and all exposed entry points, configuration audit, and observed Windows launch behavior. Setting the stored default to false or requiring an environment variable does not satisfy this criterion. |
| E7 Failure recovery | Microphone denial/disconnect, missing model, interrupted download, shortcut conflict, and paste failure produce an actionable notice/state rather than success or a stuck recording. Generated text remains recoverable when paste cannot complete; cancellation does not paste stale text. | Focused tests where practical plus native manual cases below. Reuse the existing notice architecture. |
| E8 Native package | Native Windows x64 CI builds the release NSIS installer without signing secrets, includes VAD/resources and required transcription/ggml/Vulkan and app-local VC++ runtime DLLs, installs/extracts it in a temporary directory, and successfully runs the packaged `handy.exe --list-devices`. At least a CPU device is available; missing GPU support is reported without implying microphone/paste validation. MSI is not required. | Successful CI run URL and logs, payload audit, installer artifact, SHA256, and build provenance. A frontend build, cross-compilation on Mac, or unbundled binary alone is insufficient. |
| E9 Notices and rights | Preserve the complete Handy MIT license including CJ Pais copyright and permission text; include accessible upstream attribution and the applicable licenses/notices for shipped dependencies, bundled runtimes, VAD, icon assets, and downloaded model references. Do not imply all models or dependencies share Handy's MIT license. | License/notice inventory in source and distributed package, with verified sources and no unlicensed borrowed branding. |
| E10 Honest delivery | Delivery states actual build/test outcomes, unsigned status, supported preview platform, required downloads, known limitations, and remaining Windows/Angie checks. Angie acceptance stays pending until she actually reviews/uses the app. | Handoff/build-status document referencing exact source and artifact hashes, with completed, failed, blocked, and unverified checks separated. |

## Concrete edge cases

| Case | Required outcome and check |
| --- | --- |
| Handy already installed/running | Install Robey Voice in a distinct location; launch each independently and modify synthetic settings in each. Neither process routes CLI/single-instance control to the other. Resolve shared shortcut contention by visible rebinding. Uninstall Robey Voice and verify Handy and its data remain usable. |
| Persisted updater opt-in | Seed only Robey Voice's synthetic settings with `update_checks_enabled: true`; start with no `HANDY_DISABLE_UPDATER` variable. Exercise check events, tray/menu actions, and frontend controls. All remain effectively disabled, with no upstream request/install path. Restart and repeat. |
| Microphone access denied or device removed | Deny Windows microphone access or disconnect the chosen test microphone. Attempt recording, then restore permission/device and retry. Show actionable permission/device guidance, release the recording state, and recover without reinstalling or bypassing Windows controls. |
| No model; download offline/interrupted | Start with an empty Robey Voice model directory, then deny network or cancel a download. Show model setup/retry state; incomplete files must not count as a ready model. A later successful download enables dictation. Do not attempt cloud fallback. |
| Paste into an elevated/restricted app | From a normal-user Robey Voice process, target a higher-integrity or input-restricted test field. Do not elevate, bypass input restrictions, or claim insertion succeeded without evidence. Preserve the generated result in history/copy controls and provide recovery guidance for manual paste into an allowed target. If the platform cannot reliably detect delivery failure, document that limitation and always make the result recoverable. |
| CPU-only PC or unusable Vulkan device | Select the inherited CPU option and transcribe synthetic speech without a discrete GPU. Report accelerator/model loading failures visibly; no assertion that all GPUs are supported. |
| Shortcut already claimed, rapid cancel/retry | Use a conflicting binding and then a free binding. Show the conflict and accept a new shortcut. Cancel a recording and immediately start a new one; no stale result may paste into the new target. |
| Unsigned installer / missing WebView2 | Preserve normal Windows security prompts and accurately disclose the unsigned publisher state. Document runtime setup/download needs. If device policy blocks installation, report the block and preserve its evidence; do not instruct users or automation to disable security controls. |

## Boundaries

The following boundary statements are normative and must be carried verbatim into the implementation report:

- Do not read, copy, record, upload, or include personal audio, personal transcripts, or another app's real user data in implementation, tests, artifacts, screenshots, or logs. Use synthetic fixtures and a deliberately configured test profile.
- Do not read, copy, publish, request, or embed secrets, tokens, API keys, signing credentials, private certificates, or another application's stored credentials.
- Do not bypass microphone permissions, Windows security prompts, integrity/elevation boundaries, organizational policies, or other operating-system protections.
- Do not enable an upstream automatic update feed, install Handy updates, reuse Handy's signing identity, or publish artifacts as Handy.
- Do not replace or migrate Handy installations or data, share its live data stores, or modify unrelated applications or host configuration as part of this preview.
- Do not add a subscription, mandatory account, cloud transcription dependency, telemetry service, backend redesign, or new external service requirement for local dictation.
- Do not claim native Windows build, installation, microphone, shortcut, paste, performance, or Angie acceptance from work performed only on this Mac, source inspection, frontend mocks, or CI package smoke checks.
- Do not declare macOS, Linux, Windows ARM64, or other inherited platform paths supported or verified by this preview. Preserve inherited code where practical without broadening this delivery's claims.

## Deliverables and validation gates

1. **Reviewable source change** in the dedicated Robey Voice Windows repository, including identity/version/icon/theme, safe local defaults, isolated data/installation, hard-disabled updater paths, Windows preview CI, and preserved licensing. Record baseline and final source commits. Existing lockfiles remain authoritative; document necessary dependency changes rather than upgrading incidentally.
2. **Native Windows x64 preview build workflow** using a Windows runner and the MSVC target, adapted from the inspected upstream setup. Provision the required build tools and VAD resource, stage native runtime libraries, remove upstream signing credentials/commands, disable updater artifact generation, and build only the selected NSIS installer for this preview. Do not retain inherited release jobs that require upstream secrets or publish to upstream destinations. Retaining unused macOS/Linux source is sufficient; running their release matrices is outside scope.
3. **Installer and evidence bundle**: actual `.exe` installer from a successful native Windows CI run; SHA256 of the exact delivered installer; repository/source commit; Handy baseline; workflow run URL/status; Windows runner/image and observed tool versions; lockfile hashes; model/VAD resource provenance and integrity information available from their sources; packaged runtime audit and `--list-devices` output; unsigned status. Do not fabricate an artifact, checksum, provenance attestation, or successful run when CI is pending/failed. Provenance is a factual build manifest unless a real attestation was generated.
4. **Validation report** mapping E1–E10 and every edge case to evidence or an explicit pending/failed/blocked result. Run the relevant frontend build/lint/format checks, translation key checks, Rust formatting/clippy checks, and meaningful existing/targeted regression tests for changed behavior. Preserve existing tests; do not treat UI mocks as native pipeline acceptance. Record environmental blockers and any baseline failures separately from introduced failures.
5. **Short Angie handoff** with download location, checksum verification, unsigned-install disclosure, initial download/runtime needs, local-history/privacy behavior, microphone/shortcut/model setup, a short ordinary-app dictation walkthrough, recovery through history/copy, manual update instructions, uninstall/data-retention behavior, and known limitations. Use source/build status truthfully if an installer is not yet available.

Gate order:

- **Source/configuration gate:** implement and inspect bounded changes; relevant checks pass or limitations are explicitly recorded. Passing this gate does not prove a Windows installer exists.
- **Native packaging gate:** successful native Windows CI build, payload audit, device enumeration, artifact hash/provenance. Passing this gate permits describing a built preview installer; it does not prove interactive dictation works on Angie's machine.
- **Native interactive gate:** a Windows 11 x64 tester verifies first run, five synthetic dictations, offline behavior, recovery cases, and side-by-side installation. Record hardware/model/results. This remains pending until actually performed.
- **Human acceptance gate:** Angie reviews name/icon/theme, confirms her actual machine and target apps, completes onboarding and dictation on her own machine, and judges shortcut comfort, transcription quality, timing, and usability. Only Angie/Jason can record that acceptance. No agent-generated checklist can substitute for it.

## Out of scope and unresolved human checks

No custom speech engine, new model host, remote backend, billing, account system, Windows signing procurement, unattended security-prompt handling, application-store/winget submission, automatic updater infrastructure, or broad upstream refactor. Optional cloud post-processing and non-Windows platform behavior remain inherited and unverified, with no effect on the mandatory local flow.

Before describing the preview as suitable for Angie, confirm her Windows version/architecture and hardware, ability to install unsigned software under her device policies, preferred microphone and target apps, comfort with local history/recording retention, shortcut choice, desired appearance, and observed recognition/timing. These are pending human checks; they do not block authoring or the authorized bounded first implementation and native CI work.

Document completion means this specification exists. It is neither an implementation report nor evidence that a build, release, Windows test, or Angie acceptance has occurred.
