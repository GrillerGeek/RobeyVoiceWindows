# Robey Voice Windows execution plan

Started: 2026-11-21. Mode: bounded feature implementation, based on Handy v0.10.1.
Status: application source checks green; native packaging and UI/documentation verification in progress.

## Context and authority

Jason requested: “Let's do it. Let's go ahead and create a version based on handy for Angie.” Earlier instructions authorize autonomous implementation, branding choices, sub-agents, committing and delivery. This work has its own fork, https://github.com/GrillerGeek/RobeyVoiceWindows, and does not modify the working Mac application.

The source baseline is `aca8985190c3ad7f361d8a80cb30f179513ed690` (Handy v0.10.1). The working branch began as `robey/windows-preview` and is now `main` for native build/delivery. Initial checkout was clean and detached at that release; the only initial authored file is the specification. The fork's untouched upstream branch has two later upstream commits; they are preserved separately, not silently included in the preview baseline.

The authoritative plain specification is [robey-voice-windows-spec.md](../../robey-voice-windows-spec.md), current SHA256 `c432fffe941085bf58a7938c0140996b5e08d1ba0c160c562d7498c74d274f00` after the reviewed process-isolation amendment. The initial frozen-test authority was SHA256 `3594471308ced7b1ee39695923065b659b9e623104e32799dc5e88be5f27a47f`. This is a new non-IDD project: no IDD Product or lifecycle statuses are invented. A separate specification author produced it from the owner's authorized outcome and explicitly labeled engineering assumptions. The independent architecture consultation reviewed it and returned ready for independent tests and bounded implementation. Human acceptance remains pending.

## Assumptions and decisions

- First target: Windows 11 x64, Intel/AMD, English UI and dictation. Angie's machine and applications have not been inspected.
- Product Robey Voice, version 0.1.0, identifier `com.jasonrobey.robeyvoice.windows`. Reuse our owned waveform/microphone brand with a teal accent; final appearance is for owner review.
- Preserve Handy's Tauri/Rust/React recording, local transcription, shortcuts, paste and history. Keep internal Cargo/library names, but package a distinct `robey-voice.exe` via Tauri `mainBinaryName` so installer process checks cannot target Handy's process.
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
- [x] Implement minimal identity, branding, local defaults, cache isolation and update enforcement; preserve frozen tests.
- [x] Add a native Windows x64 build/audit workflow without inherited signing/publication dependencies.
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

## Bounded accessibility correction contract

Independent accessibility review found one high focus issue on the newly added license button, two contrast failures in changed palette consumers, and two high inherited keyboard-entry gaps. Resolve these within the current UI recovery/identity scope rather than shipping known inaccessible entry points. This adds no new product workflow or OS access and does not supply human acceptance.

- The new About upstream-license button must show a visible keyboard focus indicator.
- Small primary-button text must meet 4.5:1 in resting and hover states; selected sidebar labels must meet 4.5:1 in both themes.
- Sidebar section controls must be reachable with Tab, expose an accessible name and support keyboard activation to navigate to the named section without an initial mouse click.
- The shortcut capture control must be reachable with Tab, expose an accessible name and support keyboard activation without an initial mouse click, preserving the existing capture/cancel/reset behavior.
- New independent keyboard regressions must fail on the existing click-only entry points before the implementer changes their semantics. Existing frozen assertions remain unchanged; synthetic browser evidence still cannot prove native shortcut capture or Windows screen-reader behavior.

Scope: `Sidebar.tsx`, `ShortcutInput.tsx`, theme tokens, the new license button's local focus classes, and narrow version-prefix lint placement in Footer/About. Preserve other workflows, settings, backend, assets, dependencies and normal permissions. The independent UI fixture may be corrected for Vite's legitimate cache-busting main-entry query without relaxing product assertions.

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
- Application source commit `8ee2c10` contains exactly the implementer's 84 declared paths. Root independently re-ran configuration checks (6/6), frontend TypeScript/Vite build (pass), and branded title plus existing browser smoke checks (3/3). Frozen hashes match and the baseline-to-current existing test diff is empty. The implementer additionally reported lint, 26-locale completeness, catalog, keyboard/clipboard/portable-installer unit checks, targeted source formatting and frozen/offline dependency install passed; native Rust and runtime evidence remain pending.
- Application changes structurally remove the updater plugin and capability grants, replace update UI with a manual link, and force the existing effective-lock function off regardless of stored opt-in or environment. A private explicit HF Cache covers discovery/deletion/download; initialization precedes headless and GUI model managers. These are reviewed source observations, not native Windows acceptance.
- Scope extension explicitly authorized: remove updater permissions in `src-tauri/capabilities/{default,desktop}.json`; preserve all other grants. Root pre-package review also found absent publisher metadata could inherit Cargo author `cjpais`; the packaging writer is narrowly authorized to set only `bundle.publisher` to `Jason Robey`, with original authorship and unsigned status retained.
- Original artwork is declared GPL-3.0-only and is preserved separately from Handy's MIT code. The exact original SVG is available both in frontend assets and shipped `resources/brand/robey-voice.svg`; package notices must include its full license and attribution. No relicensing is assumed.
- The untouched fork main was preserved as `upstream-main` at `939c9573a346859016de1f9d87369a9765af1671`. Our pinned release-based implementation can become a new main without overwriting or force-pushing that history.
- UI verification and four scoped documentation surfaces are delegated after application GREEN. Browser fixtures, if used, remain synthetic and cannot establish microphone, shortcut, native paste or Angie acceptance. Task-local review server is reachable at localhost:1420.
- Packaging commit `b3b27c3` contains exactly 35 declared pipeline/notice/publisher paths. Worker checked pinned actionlint 1.7.7 (three workflows), PowerShell 7.4.6 parsing (four scripts), exact cargo-about 0.8.2 generation against the locked Windows graph, native/frontend inventories, frozen config tests and targeted formatting. Native execution is still pending. Two npm packages publish MIT declarations without full copyright/license files at their exact revisions; supplemental notices explicitly preserve that gap rather than inventing ownership.
- Independent UI commit `5a26243` adds exactly two files; root reran its six Chromium checks successfully. Fixture SHA256 `7ac3812147dbad5a565caa04970d54360cd0ce42cf7808add470555026a18422`; UI spec SHA256 `f1bc69443754fc3c0dbb42f5bf7bf350c5aaadd04a5ecea72dfb80a7f7d50412`. Evidence covers synthetic first-use/download retry/default presentation/manual updates/attribution/shortcut conflict and rebinding, not native behavior. Existing sidebar and shortcut entry points are inherited click-only controls; keyboard entry remains a disclosed baseline gap.
- Documentation commit `6eadee3` adds the four named owner/handoff/build/validation surfaces with all native artifact fields explicitly pending. Root ran targeted Prettier on all four: pass. Markdown hard-break double spaces trigger `git diff --check` warnings but are intentional and Prettier-approved; code whitespace checks pass.
- Optional Mac rustfmt provisioning could not load its matching compiler driver and made no Rust changes; the Windows job installs a matched stable toolchain. The small `.gitattributes` addition pins text LF while preserving binary auto-detection and the exact catalog exception, preventing Windows checkout line endings from invalidating formatting checks.
- An unexpected root `StartupProfileData-NonInteractive` stopped handoff briefly. The responsible worker identified its creation by task-local PowerShell from timestamps, embedded filename/profiling symbols and assembly labels, and relocated the task-owned file unchanged under ignored `.robey-local/tooling-output/`. SHA256 `02a642e5d3dda6d02760cfea2cb566c8e51be7bec823cf76172a432852489eb8`; no user files removed and no unknown output published.
- Accessibility review initially found one new high focus issue, two contrast issues in touched palette consumers, and two inherited high keyboard-entry gaps. Root measured the actual color pairs. Independent new keyboard tests established 4/4 semantic RED before native-button changes; frozen keyboard SHA256 `ccec4400e19270c9554abcd53e033dddf743e20675e87469e537b4a6ac43fad7`. Correction commit `e8b4f3c` changes only five production UI files. Root reran all 13 browser checks: pass. Lior re-reviewed and resolved 3 high and 2 medium findings; one information-level untranslated-English follow-up remains outside the English preview claim.
- Final measured pairs: primary white text 7.514:1 resting and 4.745:1 at 80% hover over light; selected sidebar dark-ink text 4.787:1 light and 8.953:1 dark. New license/sidebar/shortcut buttons have visible focus rings and named native-button semantics; native Windows screen-reader/capture acceptance remains pending.
- Source changes exposed a fixture-only Vite HMR issue: the entry script gained a query string, preventing the exact-match synthetic bootstrap. Vera corrected only query-aware fixture matching, made missing/duplicate entry failure explicit, preserved all six original assertions, and reran two successful six-test passes. Current fixture SHA256 `d932691f36bfc3d0a2d4f225a8197327161a4815f855b3b30a7d8cb2b0b4f282`. No application or server workaround was used.
- Security review verified exact locked HF cache/token construction, updater lock and identifier-based single-instance behavior. It found a medium E2 issue: the retained packaged basename made NSIS find/kill Handy by name during install/uninstall. A dedicated author corrected the Spec at `34a59dd`; independent isolation test SHA256 `c6e6f746d5fff12d42101711e9426290b919c484ac2acc1096e18e73e2096ddc` established one semantic RED before implementation. Root froze it at `65e4746`; correction `0475b44` adds unique packaged naming, payload rejection of `handy.exe`, spaced-path audit and one quoted WebView bootstrapper command. Root re-ran config suites: 7/7 passed. Security re-review resolved the medium process issue and the quoting information item, with no new findings; one information-level upstream license-text gap remains disclosed.
- Documentation is aligned with the process amendment and actual 13-test frontend evidence at `d43ebe9`; all four targeted Prettier checks and verbatim-boundary comparisons pass. New isolation test was then still marked pending in that conservative snapshot; root has since verified it passed. All native installer/run/hash/human fields remain pending until actual Windows evidence arrives.
- GitHub account authorization was checked without displaying credentials; existing repo/workflow scopes support the authorized push and native build. Source candidate is ready for its first native Windows run, with no force-push, signing secret or security bypass.

## Lessons and interruptions

The successful Mac installation does not validate Windows. Handy's upstream updater and signing defaults must be removed, and its inherited HF cache behavior requires active isolation beyond renaming the app. Progress/worker evidence will be appended here as gates complete; interrupted or blocked checks remain explicit.
