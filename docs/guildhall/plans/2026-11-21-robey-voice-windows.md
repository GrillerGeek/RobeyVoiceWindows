# Robey Voice Windows execution plan

Started: 2026-11-21. Mode: bounded feature implementation, based on Handy v0.10.1.
Status: bounded Windows preview implementation and release delivery complete; native interactive Windows and Angie acceptance remain pending.

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
- [x] Verify GREEN, frontend build/lint/format/translations and applicable Rust checks; actual CI environment corrections recorded below.
- [x] Push reviewed concrete source and run native Windows packaging; inspect installed payload and CPU enumeration.
- [x] Generate installer checksum, source/build/resource provenance and explicit unsigned status.
- [x] Run independent security, reliability, operations, observability, accessibility and UI verification; write scoped documentation (final package facts pending).
- [x] Required post-green technical review of all relevant final source/tests/docs and evidence.
- [x] Commit source, preserve auditable baseline, publish a clearly labeled preview with exact downloadable artifact and source.
- [x] Deliver short install/setup/recovery instructions and honest validation report.
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
- Source candidate `f2eaf50c98eb86402ba65fa532b35665ba39a941` was pushed to the new `main`, which is now the repository default. The automatic [source quality run](https://github.com/GrillerGeek/RobeyVoiceWindows/actions/runs/44924199496) passed on that exact source. Initial native dispatch returned workflow-not-found while GitHub had registered only the push-triggered workflow; the native workflow file is independently verified present on main. A follow-up main push records this evidence and allows default-branch manual-workflow registration. No native execution is claimed from the dispatch attempt.
- Manual-workflow registration required changing the workflow files after main became default; a plain plan-only push still returned 404. The meaningful SHA-based `run-name` metadata update `322c8b5` preserved triggers/permissions/jobs and registered both manual workflows. Its [source-quality run](https://github.com/GrillerGeek/RobeyVoiceWindows/actions/runs/44924529565) passed.
- First [native Windows run](https://github.com/GrillerGeek/RobeyVoiceWindows/actions/runs/44924529206), source `322c8b517a533684e1824ab34a31de01f0dfdde4`, passed tool setup, Vulkan/SPIRV/VC-runtime prerequisites, frozen dependency install, frontend checks and all seven config assertions. It failed only Rust formatting before tests/clippy/installer. Exact formatter output required indentation alignment on seven method-chain/comment lines in `managers/model.rs`; `ea0156e` applies only whitespace, independently checked with an empty whitespace-insensitive diff and unchanged inline tests.
- Second native run `44924813744` at `ea0156e373cf0d653e405637473fdc42108faa9d` was explicitly cancelled as superseded during Rust checks, not marked passed or misclassified as a product failure. Operations review found one remaining installer label still promising automatic updates. The single-literal correction `ba8beef29b46ebaf6519b238f9b16d118c388d9b` now accurately promises manual updates, with no logic change.
- Current [native candidate run](https://github.com/GrillerGeek/RobeyVoiceWindows/actions/runs/44925334812) is pinned to `ba8beef29b46ebaf6519b238f9b16d118c388d9b`; started 2026-11-21 16:34:42 UTC, Rust checks started 16:36:29 UTC. Setup and frontend/config steps passed; no installer, checksum, successful native tests, CPU result or optional transcription result is claimed until the run actually supplies them. An independent artifact auditor monitors only this exact run/ref and will verify downloaded bytes against all manifests before release.
- All selected source reviewers returned: security 0 high/0 medium/1 information item after correction; accessibility resolved 3 high/2 medium with 1 information item remaining; reliability 0 high/0 medium/3 low CI-only timeout follow-ups; observability 0 high/0 medium/1 low manual-link rejection-feedback follow-up; operations supplied deploy/watch/rollback/on-call/open-question sections and its installer wording correction is committed. Closing technical review remains gated on native package evidence and final documentation.
- Follow-up owners: Windows build maintainer (Jason/Codex) owns bounded installer/SAPI/cargo-inventory subprocess deadlines in the next CI maintenance pass; the job already has a 150-minute global deadline. Windows UI maintainer owns explicit manual-release-link failure feedback and untranslated English passages before broader locale claims. Windows distribution maintainer preserves/rechecks the two upstream MIT metadata-only notice gaps; no missing copyright owner is invented and no exhaustive legal certification is claimed. These findings do not establish a core dictation failure.

## Lessons and interruptions

The successful Mac installation does not validate Windows. Handy's upstream updater and signing defaults must be removed, and its inherited HF cache behavior requires active isolation beyond renaming the app. Progress/worker evidence will be appended here as gates complete; interrupted or blocked checks remain explicit.

- Native run `44925334812` failed after successful Rust compilation when the lib-test executable exited `0xc0000135` (missing DLL) before any test cases ran. No installer was produced. The staged runtime existed elsewhere; correction `e0c4233952f98d754db7207052e25948186bee4d` adds a CI helper that locates actual Cargo lib-test artifacts, co-locates the existing staged DLLs with hash checks, runs the unchanged tests, and records compile/test results. It does not skip tests or weaken the separate installer audit with its stripped build-tool PATH. Replacement [native run](https://github.com/GrillerGeek/RobeyVoiceWindows/actions/runs/44927384462) has passed frontend/config prerequisites and is compiling Rust; no result is presumed. Failure evidence is retained independently under task-local delivery records.

- Replacement native run `44927384462` passed Rust formatting, unchanged library tests through the staging helper, and clippy at 17:14:57 UTC. Complete dependency notice generation also passed; unsigned NSIS assembly started 17:19:45 UTC and remains running at the 17:24:59 UTC checkpoint. Root rechecked all four key frozen test hashes unchanged and confirmed all eight normative boundaries are present verbatim in both validation and execution-report drafts. No installer outcome is inferred from these intermediate gates.

- Exact-candidate [source-quality run 44927384933](https://github.com/GrillerGeek/RobeyVoiceWindows/actions/runs/44927384933) succeeded at `e0c4233952f98d754db7207052e25948186bee4d`. The independent artifact auditor verified that result separately; installer assembly remains pending.

- Native run `44927384462` completed SUCCESS at 2026-11-21 17:41:23 UTC for exact source `e0c4233952f98d754db7207052e25948186bee4d`. Root independently verified all required steps: Rust checks, notice inventories, unsigned NSIS assembly, actual temporary installed-payload/CPU audit, provenance/checksums and artifact upload. The independent auditor is checking downloaded bytes. Interactive Windows and Angie acceptance remain pending; package success is not microphone/paste/offline evidence.

## Operations runbook, reviewer stdout at native-build milestone

The following reviewer output is preserved verbatim for the closing review and PR-draft handoff. Its pending artifact/release questions are checkpoint facts; subsequent plan entries reconcile them with actual audit and publication evidence.

### Deploy plan

- **Native packaging milestone passed:** run `44927384462` completed successfully at `2026-11-21T17:41:23Z`, building exact source `e0c4233952f98d754db7207052e25948186bee4d`. The workflow completed NSIS temporary portable installation, payload/CPU audit, provenance generation and artifact upload.
- **Hold distribution:** independent verification of downloaded artifact bytes, installer hash and probe facts is in progress. Closing review and release-fact reconciliation remain required. No GitHub prerelease or durable download is established yet.
- After independent audit and closing review, create the planned durable GitHub prerelease `v0.1.0-preview.1` at the exact built source. Attach the verified installer, `BUILD-FACTS.json`, `SHA256SUMS.txt`, evidence and notices. Publish the installer’s actual SHA256 and successful run URL in the handoff.
- Refresh README, BUILD, validation and Angie setup with actual source/run/artifact facts. Preserve separate native interactive and human acceptance gates.
- The build uses MSVC x64/Windows SDK, app-local CRT/OpenMP redistributables, Rust components, Bun 1.4.5, CMake, Vulkan SDK 1.4.309.0, SPIRV-Headers and tracked hash-verified Silero VAD. No signing credentials or core-service credentials are required.
- The Rust-test helper stages hash-checked existing runtime DLLs beside library-test executables. The installer audit independently strips build paths; test-host DLL staging is not installer completeness evidence.
- Pilot manually on a deliberately configured Windows 11 x64 Intel/AMD test machine. Complete all eight edge cases, native dictation/offline checks and accessibility checks before recording those gates as passed. CI package loading/device enumeration cannot establish microphone, shortcut, paste or Angie acceptance.
- Distribution is manual; there is no rollout flag. The updater is structurally disabled, and installer text now states manual updates. End users explicitly download a local model and, when absent, WebView2. Optional cloud post-processing stays off.

### What to watch (first hour)

- **Installer integrity and policy:** exact delivered SHA256, expected unsigned state, distinct Robey Voice installation/registration and normal Windows prompts. Record policy/runtime blocks and stop without bypasses.
- **Isolation:** packaged process is `robey-voice.exe`; Handy stays running and usable through normal install, upgrade and removal. Compare only deliberately created synthetic markers in each app’s separate stores.
- **First run:** onboarding opens without recording/startup; local defaults persist after restart; private data, WebView and Hugging Face cache resolve beneath Robey Voice’s own root.
- **Core flow:** five synthetic ordinary-editor dictations produce nonempty recoverable history and return to idle. Record hardware, microphone, model/revision, CPU/GPU selection and observed timing.
- **Recovery:** microphone denial/disconnect, model interruption, shortcut contention, cancellation and restricted-target insertion leave actionable states and recoverable text. Distinguish attempted paste from observed insertion.
- **Offline/manual updates:** three network-blocked dictations, history copy and relaunch succeed after setup; persisted updater opt-in cannot enable requests or installation. Explicit downloads/clicked links are separate traffic.

### Rollback plan

1. Stop distribution and mark the affected source/run/installer hash withdrawn. Quit **Robey Voice** through its tray.
2. For a normal installation, uninstall **Robey Voice** through Windows Settings. Leave its data-deletion checkbox unchecked when retaining settings/history/recordings/models/cache. For portable mode, retain its separate folder and `Data` while diagnosing.
3. No previous known-good Robey Voice installer is established. Do not substitute Handy, assume downgrade compatibility or copy Robey Voice data into Handy.
4. Correct/revert the offending source change, then rebuild and repeat the native package gate before supplying a replacement.
5. Only delete Robey Voice data when the user explicitly chooses removal. Normal uninstall’s checkbox targets its identifier-derived roaming/local folders; portable deletion removes that installation’s `Data`. Native normal-uninstall deletion/isolation behavior remains unverified. Do not touch Handy folders or unrelated stores.

### On-call notes

- Entry points: `docs/angie-setup.md`, `BUILD.md`, `docs/robey-voice-windows-validation.md`, [successful native run](https://github.com/GrillerGeek/RobeyVoiceWindows/actions/runs/44927384462) and its artifact evidence.
- This is a family desktop preview, with no monitored backend, telemetry, alert service or stated SLO. Support begins with Jason and bounded, synthetic reproduction.
- Expected installed data root is `%APPDATA%\com.jasonrobey.robeyvoice.windows`; confirm using **Open App Data Folder**. Portable data lives beside its executable under `Data`. Do not collect personal recordings, transcripts, settings credentials or another app’s real data.
- Missing GPU enumeration does not imply CPU failure. CPU enumeration does not prove model loading or dictation performance. Inspect the optional synthetic file probe separately; its facts remain pending independent audit.
- Recover failed insertion through History → Copy into an allowed normal-user target. Never elevate the app to overcome input restrictions.
- CI artifacts expire after 30 days; failure diagnostics expire after seven. The workflow uploads artifacts but creates no GitHub release. The planned prerelease must supply durable distribution.
- No automatic update recovery exists. Replacement installation and data retention require explicit native verification.

### Open ops questions

- Does independent artifact verification confirm the exact installer SHA256, built source, complete payload/provenance/notices and optional probe result? Align release facts only after that audit.
- Has closing review cleared creation of `v0.1.0-preview.1`, and does its tag resolve to exact built source `e0c4233952f98d754db7207052e25948186bee4d`?
- Who will execute and record the Windows 11 interactive, normal side-by-side installation/upgrade/uninstall, missing-WebView2, policy, deletion and screen-reader checks? These remain pending.
- Does Angie’s actual hardware and device policy permit this unsigned preview, and which microphone, model, shortcut and target apps meet her needs? Angie acceptance remains pending.
- Which validated build will become the retained rollback candidate after the first successful pilot? Until one exists, rollback is removal with deliberate data retention.

## Exact package audit and closing evidence

Independent audit `.robey-local/delivery/native-44927384462/artifact-audit-report.md` passed 116 factual checks with no blocking packaging finding. Root independently recomputed all 28 artifact checksums. Installer `Robey Voice_0.1.0_x64-setup.exe`: 16,415,893 bytes; SHA256 `21a50c13f4f625459e02f64cb6699eb22635b8880f0dcb27ba0b772fcd5203f5`. Official 29-file CI ZIP: 16,525,597 bytes; SHA256 `003e1862560e9121de82c5af985d75e029c960a0eac5dc902d22fcfeb233690e`, matching hosted digest and extracted files. The CI inventory has 56 files, 22 DLLs and 13 notices; unique robey-voice.exe, no handy.exe. Rust library tests: 342 passed, 0 failed, 20 ignored; clippy passed with warnings (no warning-free claim). CPU enumeration succeeded with SDK/build paths stripped. Optional CPU CLI transcription matched the exact synthetic SAPI phrase; no model/WAV is distributed and no usable Vulkan GPU enumerated. These do not establish microphone, shortcuts, paste, offline flow, side-by-side installation, performance or Angie acceptance.

The exact source archive `RobeyVoice-0.1.0-source-e0c4233.tar.gz` has SHA256 `58e258016ad44d521b0bc207c757a79a7f9e45352106fa755c299328b1a37674`. Planned prerelease tag points to exact built commit `e0c4233952f98d754db7207052e25948186bee4d`; documentation-only main will advance separately. All notice inventories physically present; the two disclosed MIT metadata-only source-text gaps remain distributor follow-ups, not legal certification. The native package gate is complete; closing review and publication remain.

## Closing technical review

Fresh independent reviewer `windows_closing_review` returned **PASS for source/configuration and native packaging closure, permitting the labeled built-preview publication**. It reviewed all 137 changed tracked paths, current untracked reports, full current Spec, every Expectation/edge/Boundary/Deliverable and actual native/source evidence. It independently reran 7/7 configuration assertions, verified frozen hashes and empty inherited-test diff, RED/GREEN logs, 28 artifact checksums/29 files, six source integrity hashes, source/CI ZIP digests and 13 notice hashes. No new blocker/high/medium findings or missing mandatory source/native automation. Native interactive Windows/Angie gates remain pending. The final execution-report closing entries, this plan/progress, PR draft and observed release publication are permitted pending orchestration outputs, not missing implementation.

Residuals retain owners: low CI subprocess deadlines at audit.ps1:27/file-probe.ps1:28/license-inventory.mjs:147 (Windows build maintainer next maintenance; global deadline exists); low manual-link error feedback at UpdateChecker.tsx:18 (UI maintainer); information-level broader-locale prose and the two upstream MIT source-text gaps (UI/distribution maintainers). No unrelated source/test/substantive documentation changes are authorized after this verdict without re-review. The closing-report recorder will save the actual verdict; root verifies its saved content before publication.

## Published delivery and final reconciliation

Published [v0.1.0-preview.1](https://github.com/GrillerGeek/RobeyVoiceWindows/releases/tag/v0.1.0-preview.1) at 2026-11-21 18:06:42 UTC as a non-draft prerelease. The tag is verified to resolve to exact built source `e0c4233952f98d754db7207052e25948186bee4d`. Documentation-only main is intentionally ahead. All seven release asset sizes/API SHA256 digests match the prepared copies; the exact source archive, unchanged official evidence ZIP, installer, build facts, original CI checksum manifest, release checksum manifest and independent audit report are durably published.

GitHub normalized spaces in the original uploaded asset name. The first public-link check caught that naming difference; root renamed the public download to [`RobeyVoice-0.1.0-windows-x64-setup.exe`](https://github.com/GrillerGeek/RobeyVoiceWindows/releases/download/v0.1.0-preview.1/RobeyVoice-0.1.0-windows-x64-setup.exe), preserving every installer byte and its SHA256 `21a50c13f4f625459e02f64cb6699eb22635b8880f0dcb27ba0b772fcd5203f5`. The source CI filename inside the unchanged evidence ZIP remains `Robey Voice_0.1.0_x64-setup.exe`. Public release checksums use the public filename. Root downloaded the corrected public asset and recomputed its full hash/16,415,893-byte size, and an unauthenticated direct-link HEAD returned HTTP 200 with that size.

Only README, Angie setup and release notes needed the delivery-name correction. Independent focused re-review returned PASS, confirmed all seven asset digests, release checksum filenames, downloaded bytes, exact source tag and unchanged core source/config/tests/workflow/lockfiles. No blockers; prior full closing PASS remains applicable. Root synchronized the actual GitHub release body with the reviewed corrected notes and fetched/asserted exact text equality. No other substantive implementation/test/documentation changes followed.

Rook produced the required stdout-only integration PR draft, title `feat: deliver an audited Robey Voice Windows preview`, including the operations runbook verbatim and accurately pending native/human gates. No upstream PR or outreach was created; this owned fork already contains the work on main. Final execution-report closing verdict was saved and verified. Documentation commit `b78144ef656cd7a999ba884f0efcd5d7ddbd13d5` also passed source-quality run `44933590063`; final delivery-doc formatting passed after the filename correction.

Remaining human waypoint is deliberately upcoming, not completed: Windows 11 x64 Intel/AMD desktop/policy, microphone, shortcuts, paste/history, offline/recovery, concurrent Handy install/upgrade/removal/data retention, missing WebView2, accessibility, hardware suitability and Angie/Jason visual/usability acceptance. The source/native-package quest is complete; none of these human checks is inferred. Follow-up technical owners remain as recorded above.
