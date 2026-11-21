$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$audit = Get-Content robey-evidence/package-audit.json -Raw | ConvertFrom-Json
if (-not $audit.audited -or -not $audit.cpuEnumerated) { throw 'Successful native package audit required before artifact assembly' }
$source = (& git rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0 -or $source -ne $env:GITHUB_SHA) { throw 'Checked-out source does not match workflow source commit' }
$package = Join-Path 'src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis' $audit.installer
if ((Get-FileHash $package).Hash.ToLowerInvariant() -ne $audit.installerSha256) { throw 'Installer changed after package audit' }
if (Test-Path robey-artifact) { throw 'Artifact directory must not pre-exist' }
New-Item -ItemType Directory robey-artifact | Out-Null
Copy-Item $package robey-artifact
Copy-Item robey-evidence robey-artifact/evidence -Recurse
Copy-Item src-tauri/resources/licenses robey-artifact/licenses -Recurse

$facts = @{
    product = 'Robey Voice'
    version = '0.1.0'
    previewPlatform = 'Windows 11 x64; native MSVC build on Windows Server 2022 hosted runner'
    sourceRepository = 'https://github.com/GrillerGeek/RobeyVoiceWindows'
    sourceCommit = $source
    handyBaseline = 'aca8985190c3ad7f361d8a80cb30f179513ed690 (Handy v0.10.1)'
    workflowRun = "https://github.com/$env:GITHUB_REPOSITORY/actions/runs/$env:GITHUB_RUN_ID"
    workflowAttempt = $env:GITHUB_RUN_ATTEMPT
    builtAtUtc = [DateTime]::UtcNow.ToString('o')
    runner = @{ os = $env:RUNNER_OS; architecture = $env:RUNNER_ARCH; image = $env:ImageOS; imageVersion = $env:ImageVersion; windows = [Environment]::OSVersion.VersionString }
    tools = @{ bun = (& bun --version | Out-String).Trim(); rustc = (& rustc -vV | Out-String).Trim(); cargo = (& cargo --version | Out-String).Trim(); rustfmt = (& cargo fmt --version | Out-String).Trim(); clippy = (& cargo clippy --version | Out-String).Trim(); cargoAbout = (& cargo about --version | Out-String).Trim(); vcpkg = (& vcpkg version | Out-String).Trim() }
    nativePrerequisites = Get-Content robey-evidence/native-prerequisites.json -Raw | ConvertFrom-Json
    integrity = @('bun.lock', 'src-tauri/Cargo.lock', 'src-tauri/tauri.conf.json', 'src-tauri/tauri.windows.conf.json', 'src-tauri/resources/models/silero-vad-v6.2-F32.gguf', '.github/workflows/robey-windows.yml') | ForEach-Object {
        @{ path = $_; sha256 = (Get-FileHash $_ -Algorithm SHA256).Hash.ToLowerInvariant() }
    }
    packageAudit = $audit
    unsigned = $true
    automaticReleasePublishing = $false
    configuration = 'Normal tauri.conf.json merged with tauri.windows.conf.json; NSIS-only CLI target, no additional config override'
    licenseInventory = 'See licenses; Rust selected Windows dependency graph includes build dependencies, frontend production graph is conservative, native vendored texts are included separately. Generated from locked installed source, not an attestation.'
    requiredDownloads = 'User-selected transcription model; WebView2 runtime when absent. No transcription weights are included. Silero VAD is included and verified.'
    acceptance = 'Native interactive Windows 11 dictation, offline flow, recovery/side-by-side tests, performance, and Angie review remain pending.'
}
$facts | ConvertTo-Json -Depth 12 | Set-Content robey-artifact/BUILD-FACTS.json
Copy-Item LICENSE robey-artifact/LICENSE.txt
$hashes = Get-ChildItem robey-artifact -File -Recurse | Sort-Object FullName | ForEach-Object {
    $relative = [IO.Path]::GetRelativePath((Join-Path (Get-Location) 'robey-artifact'), $_.FullName).Replace('\', '/')
    "$((Get-FileHash $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant())  $relative"
}
$hashes | Set-Content robey-artifact/SHA256SUMS.txt
