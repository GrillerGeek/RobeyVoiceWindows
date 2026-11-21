# Robey Voice Windows execution plan

Started: 2026-11-21. Mode: bounded feature implementation, based on Handy v0.10.1.
Status: independent RED accepted; implementation next.

## Context and authority

Jason requested: “Let's do it. Let's go ahead and create a version based on handy for Angie.” Earlier instructions authorize autonomous implementation, branding choices, sub-agents, committing and delivery. This work has its own fork, https://github.com/GrillerGeek/RobeyVoiceWindows, and does not modify the working Mac application.

The source baseline is `aca8985190c3ad7f361d8a80cb30f179513ed690` (Handy v0.10.1). The working branch is `robey/windows-preview`. Initial checkout was clean and detached at that release; the only initial authored file is the specification. The fork's upstream main currently has two later upstream commits; they are not silently included in the preview baseline.

The authoritative plain specification is [robey-voice-windows-spec.md](../../robey-voice-windows-spec.md), SHA256 `3594471308ced7b1ee39695923065b659b9e623104e32799dc5e88be5f27a47f`. This is a new non-IDD project: no IDD Product or lifecycle statuses are invented. A separate specification author produced it from the owner's authorized outcome and explicitly labeled engineering assumptions. The independent architecture consultation reviewed it and returned ready for independent tests and bounded implementation. Human acceptance remains pending.

## Assumptions and decisions

- First target: Windows 11 x64, Intel/AMD, English UI and dictation. Angie's machine and applications have not been inspected.
- Product Robey Voice, version 0.1.0, identifier `com.jasonrobey.robeyvoice.windows`. Reuse our owned waveform/microphone brand with a teal accent; final appearance is for owner review.
- Preserve Handy's Tauri/Rust/React recording, local transcription, shortcuts, paste and history. Keep inherited internal `handy.exe`, Cargo and library names; public product identity changes.
- Canonical fork identity belongs in the normal common Tauri configuration; the Windows overlay retains runtime resource placement.
- Local dictation requires no app account, subscription or API key. Initial model/runtime downloads can require internet. Optional advanced providers remain off by default and outside acceptance scope.
- Disable updates structurally and at bootstrap, including persisted opt-in. Remove upstream feed/key, updater artifacts and signing command. Manual updates point to our repository.
- A distinct identifier alone is insufficient for isolation: own HF cache roots are required in installed and portable modes, with no prior/shared-cache discovery or deletion.
- First installer is NSIS .exe, unsigned. No Windows signing procurement or security bypass is authorized. Apple notarization does not establish Windows publisher signing.
- Native Windows CI will establish packaging and CPU-loader evidence. Interactive microphone, hotkey, paste, offline operation and Angie acceptance are separate human gates.
- Canonical build configuration is `src-tauri/tauri.conf.json` recursively merged with `src-tauri/tauri.windows.conf.json`; no additional CLI configuration overlay or `TAURI_CONFIG` profile is part of this preview. The dedicated workflow is `.github/workflows/robey-windows.yml`, with installer artifact `robey-voice-windows-x64`.

## Host capabilities and review surface

Host: Codex on macOS; actual delegation: `collaboration.spawn_agent` with fresh `fork_turns: none`, four concurrent slots including the orchestrator. Model/effort overrides are unset; trusted observed worker model metadata is unavailable, recorded as unknown. Role restrictions are instructions, not enforced read isolation.

Terminal, Git, GitHub CLI/connector, web research and CUA are available. GitHub Actions is enabled on the new public fork. No Windows desktop is currently attached. Browser capability exists; upstream Playwright configuration and mocks exist, but frontend toolchain/browser availability must be verified before claiming UI checks. Dependencies/build tools are task-local; no personal microphone/audio/data is used.

Canonical review surface: this repository's Markdown Spec, plan, reports and source diff. No hosted review Page has been created or sharing widened. Source and owner conversation carry actual authority; a generated review surface cannot approve its own proposal. Required input delivery uses bounded visible reads; truncated results are re-read narrowly. Worker input delivery remains unknown where host-visible worker tool output is not exposed, rather than being certified from worker assertions.

## Boundaries, verbatim from the specification

- Do not read, copy, record, upload, or include personal audio, personal transcripts, or another app's real user data in implementation, tests, artifacts, screenshots, or logs. Use synthetic fixtures and a deliberately configured test profile.
- Do not read, copy, publish, request, or embed secrets, tokens, API keys, signing credentials, private certificates, or another application's stored credentials.
- Do not bypass microphone permissions, Windows security prompts, integrity/elevation boundaries, organizational policies, or other operating-system protections.
- Do not enable an upstream automatic update feed, install Handy updates, reuse Handy's signing identity, or publish artifacts as Handy.
- Do not replace or migrate Handy installations or data, share its live data stores, or modify unrelated applications or host configuration as part of this preview.
- Do not add a subscription, mandatory account, cloud transcription dependency, telemetry service, backend redesign, or new external service requirement for local dictation.
- Do not claim native Windows build, installation, microphone, shortcut, paste, performance, or Angie acceptance from work performed only on this Mac, source inspection, frontend mocks, or CI package smoke checks.
- Do not declare macOS, Linux, Windows ARM64, or other inherited platform paths supported or verified by this preview. Preserve inherited code where practical without broadening this delivery's claims.

## Checklist and dispatch sequence

- [x] Read project guidance; pin upstream release; preserve clean baseline and independent Mac repository.
- [x] Create dedicated GitHub fork and verify Actions availability.
- [x] Author plain specification with assumptions, measurable Expectations, edge cases and human gates.
- [x] Independent pre-plan architecture and specification feasibility review.
- [x] Prepare task-local Bun/dependencies; record baseline checks without upgrading lockfiles.
- [x] Independent test author receives only Spec expectations/defaults/edges/boundaries and existing test conventions, with no implementation proposals or inherited transcript.
- [x] Run new acceptance tests; inspect actual RED classification; freeze accepted test files/hashes.
- [ ] Implement minimal identity, branding, local defaults, cache isolation and update enforcement; preserve frozen tests.
- [ ] Add a native Windows x64 build/audit workflow without inherited signing/publication dependencies.
- [ ] Verify GREEN, frontend build/lint/format/translations and applicable Rust checks; one implementer retry for the combined gate.
- [ ] Push reviewed concrete source and run native Windows packaging; inspect installed payload and CPU enumeration.
- [ ] Generate installer checksum, source/build/resource provenance and explicit unsigned status.
- [ ] Run independent security, reliability, operations, observability, accessibility and UI verification; write scoped documentation.
- [ ] Required post-green technical review of all relevant final source/tests/docs and evidence.
- [ ] Commit source, preserve auditable baseline, publish a clearly labeled preview with exact downloadable artifact and source.
- [ ] Deliver short install/setup/recovery instructions and honest validation report.
- [ ] Jason/Angie perform native interactive Windows acceptance and review branding; record pending until actually observed.

Test author, implementer and post-green reviewer receive fresh contexts. Tests precede implementation. Disjoint prerequisite toolchain work may overlap with tests. Documentation writes follow the relevant implementation. Reviews are batched within capacity and all selected results are awaited. The orchestrator writes only this plan and helper-managed progress, while handling read-only verification and Git/delivery operations.

## Reviewers selected

- Architecture: required pre-plan consultation and closing technical review. Cache isolation, update locks and native DLL staging are explicit obligations.
- Security: always; installer/update trust, cloud defaults, data separation and public artifact hygiene.
- Documentation: always; README/build/installation, rights, unsigned status and truthful checks.
- Reliability and observability: long-running recording/model jobs and background errors; assess changed integration paths and inherited recovery limits.
- Operations: native build, packaging, runtime loading, install/update/uninstall and provenance.
- Accessibility: UI branding/theme changes; keyboard, labels and contrast.
- UI verification: user-visible changes, using existing Playwright setup if reachable; report blocked capability honestly.
- Performance: no engine or hot-path redesign planned; select if actual diff introduces hot-path/scale changes. Device performance remains human acceptance.
- Migration safety: no schema/data migration planned; isolation review covers no-import/no-shared-cache behavior; select if schema/migrations enter the diff.
- Plugin validation: not applicable; this is an app fork, not a plugin package.

## Out of scope and not yet specified

No speech-engine rewrite, subscription service, account backend, store/winget submission, Windows signing purchase, automatic updater infrastructure or broad dependency upgrade. No promise of all-platform parity. Angie's hardware, policies, preferred model/hotkey/microphone, target apps, latency tolerance and appearance acceptance remain unknown. Optional cloud providers remain inherited, disabled and unverified.

## Verification evidence and open items

- Spec: author changed only `docs/robey-voice-windows-spec.md`; final hash independently verified. Architecture returned ready with no blocking Spec correction.
- Source baseline: independent clone at v0.10.1; no app changes before test-author gate. Fork main's two extra upstream commits were inspected but excluded from pinned preview.
- Architecture reviewer disclosed incidental inline-test matches from an early production-file search; excluded from its analysis. Independent test author will receive a fresh context without these results. No strict enforced test-read isolation is claimed.
- Windows artifact, signing, first-run, live dictation, offline behavior and side-by-side installation remain unverified at plan initialization.
- Required runtime/VAD/model/dependency rights and provenance must be recorded for actual shipped bytes; application MIT does not imply all dependencies/models are MIT.
- Task-local bootstrap installed official Bun 1.4.5 under ignored `.robey-local/` and preserved frozen dependency locks. Baseline frontend build, lint, translation/catalog/language checks, three existing frontend unit suites and baseline-file Prettier passed. Existing build has a >500 kB chunk warning. Mac Rust formatting is unavailable because rustfmt is absent; native Windows CI must supply it. Existing Playwright smoke tests reached the server but Chromium was absent; task-local browser provisioning is underway.
- Existing UI tests contain only HTML/server smoke checks, not a Tauri mock fixture. Independent tests will distinguish distributable configuration assertions from actual backend enforcement and native behavior; no mocked passing result will substitute for those gates.
- Root independently ran `node --test tests/robey-voice-config.test.mjs`: exit 1, five assertion failures (identity/version/updater artifacts/feed/sign command) and one passing full-MIT assertion. Root independently ran the task-local browser test: exit 1, one assertion failure (observed title `handy`, expected Robey Voice). These are semantic RED, not launcher errors. Baseline browser smoke tests passed 2/2 after task-local browser provisioning.
- Pre-freeze test review removed an invented declarative-window requirement: the Spec permits either declarative or programmatic window creation. This correction removed a constraint beyond the Spec; no assertion was relaxed to fit an implementation. Final tests were formatted, rerun, and hashed before implementation.
- Frozen files: `tests/robey-voice-config.test.mjs` SHA256 `aee2062cf31608b7409bfda3dd763d5add50921b02417c9d9785b72a3740b19a`; `tests/robey-voice.spec.ts` SHA256 `4230b760b213173e2674ad8154b635fdc2e7a6d67d25e9aa378e533231cfeb17`; coverage map SHA256 `6aceffab4bca05771d4c9c9581fd3503ac8ad065883b1ecdfa95988f02212c16`. Existing tests remain unchanged. Native policy/data isolation remain explicit source/native review obligations.

## Lessons and interruptions

The successful Mac installation does not validate Windows. Handy's upstream updater and signing defaults must be removed, and its inherited HF cache behavior requires active isolation beyond renaming the app. Progress/worker evidence will be appended here as gates complete; interrupted or blocked checks remain explicit.
