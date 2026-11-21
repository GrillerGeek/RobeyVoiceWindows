$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
New-Item -ItemType Directory -Force robey-evidence | Out-Null
$packages = @(Get-ChildItem 'src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis' -Filter '*.exe')
if ($packages.Count -ne 1) { throw 'Expected exactly one release NSIS installer' }
$package = $packages[0]
if ((Get-AuthenticodeSignature $package.FullName).Status -ne 'NotSigned') {
    throw 'This preview must be unsigned; unexpected installer signature state'
}
$staged = @(Get-ChildItem src-tauri/transcribe-libs -Filter '*.dll')
foreach ($pattern in @('*transcribe*.dll', '*ggml-cpu*.dll', '*ggml-vulkan*.dll', 'msvcp140.dll', 'vcruntime140.dll', 'vcomp140.dll')) {
    if (-not ($staged | Where-Object { $_.Name -like $pattern })) { throw "Required staged runtime missing: $pattern" }
}

$work = Join-Path $env:RUNNER_TEMP ("Robey package audit " + [guid]::NewGuid().ToString('N'))
$install = Join-Path $work 'Robey Voice install'
New-Item -ItemType Directory -Path $install -Force | Out-Null
$oldPath = $env:PATH
$oldAppData = $env:APPDATA
$oldLocalAppData = $env:LOCALAPPDATA
try {
    # The inherited portable installer performs a temporary, normal-user install.
    # It creates no installed-app registry entries or shortcuts and never launches
    # an interactive recording session. Windows protections remain in force.
    # NSIS /D consumes the remaining command line, including spaces, and must
    # remain the last argument without surrounding quotes.
    $process = Start-Process -FilePath $package.FullName -ArgumentList @('/S', '/PORTABLE', "/D=$install") -Wait -PassThru
    if ($process.ExitCode -ne 0) { throw "Portable NSIS install exited $($process.ExitCode)" }
    $binary = Join-Path $install 'robey-voice.exe'
    if (-not (Test-Path $binary -PathType Leaf)) { throw 'Installer omitted root robey-voice.exe' }
    if (Get-ChildItem $install -File -Recurse -Filter 'handy.exe') { throw 'Installer contains upstream handy.exe process identity' }
    if (-not (Test-Path (Join-Path $install 'portable'))) { throw 'Temporary portable marker is absent' }
    if ((Get-AuthenticodeSignature $binary).Status -ne 'NotSigned') { throw 'Unexpected application signing state' }
    $metadata = (Get-Item $binary).VersionInfo
    if ($metadata.ProductName -ne 'Robey Voice' -or $metadata.ProductVersion -notlike '0.1.0*') {
        throw "Incorrect executable product identity: $($metadata.ProductName) $($metadata.ProductVersion)"
    }
    foreach ($dll in $staged) {
        $installed = Join-Path $install $dll.Name
        if (-not (Test-Path $installed -PathType Leaf)) { throw "Runtime is not co-located with robey-voice.exe: $($dll.Name)" }
        if ((Get-FileHash $installed).Hash -ne (Get-FileHash $dll.FullName).Hash) { throw "Packaged runtime differs from staging: $($dll.Name)" }
    }
    $vad = Join-Path $install 'resources/models/silero-vad-v6.2-F32.gguf'
    if ((Get-FileHash $vad).Hash.ToLowerInvariant() -ne '0d871a800c420fdd5d1b17a3aea4296d1c39608f0ff4a9295eb76457eb1c88e6') { throw 'Packaged VAD hash mismatch' }
    foreach ($name in @('HANDY-MIT.txt', 'THIRD-PARTY-NOTICES.txt', 'RUST-DEPENDENCIES.html', 'FRONTEND-DEPENDENCIES.txt', 'NATIVE-DEPENDENCIES.txt', 'GPL-3.0-only.txt', 'SILERO-LICENSE.txt', 'SILERO-NOTICE.txt', 'NOTO-OFL.txt', 'MICROSOFT-VS2022-TERMS.txt', 'MICROSOFT-VS2022-REDISTRIBUTION.txt')) {
        if (-not (Test-Path (Join-Path $install "resources/licenses/$name") -PathType Leaf)) { throw "Package omitted notice: $name" }
    }
    if (-not (Get-ChildItem (Join-Path $install 'resources') -Recurse -Filter 'robey-voice.svg')) { throw 'Package omitted the GPL icon source' }

    # Inventory the payload before smoke-run-created portable profile files exist.
    $inventory = @(Get-ChildItem $install -File -Recurse | Sort-Object FullName | ForEach-Object {
        @{ path = [IO.Path]::GetRelativePath($install, $_.FullName).Replace('\', '/'); bytes = $_.Length; sha256 = (Get-FileHash $_.FullName).Hash.ToLowerInvariant() }
    })
    $inventory | ConvertTo-Json -Depth 5 | Set-Content robey-evidence/installed-file-inventory.json

    # Strip build/SDK paths so staging directories cannot satisfy missing imports.
    $env:PATH = "$install;$env:SystemRoot\System32;$env:SystemRoot"
    $env:APPDATA = Join-Path $work 'synthetic-roaming'
    $env:LOCALAPPDATA = Join-Path $work 'synthetic-local'
    New-Item -ItemType Directory -Force $env:APPDATA, $env:LOCALAPPDATA | Out-Null
    $stdout = Join-Path (Get-Location) 'robey-evidence/list-devices.stdout.txt'
    $stderr = Join-Path (Get-Location) 'robey-evidence/list-devices.stderr.txt'
    $process = Start-Process -FilePath $binary -ArgumentList '--list-devices' -WorkingDirectory $install -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
    if (-not $process.WaitForExit(120000)) {
        $process.Kill($true)
        throw 'Packaged device enumeration timed out after 120 seconds'
    }
    $process.WaitForExit()
    $deviceOutput = Get-Content $stdout -Raw
    $deviceOutput | Write-Host
    if ($process.ExitCode -ne 0) { throw "Packaged --list-devices exited $($process.ExitCode); see bounded device logs" }
    if ($deviceOutput -notmatch 'kind=cpu') { throw 'Packaged backend did not enumerate a CPU device' }
    $hasVulkanDevice = $deviceOutput -match 'kind=vulkan'
    $cpuMatch = [regex]::Match($deviceOutput, 'index=(\d+) kind=cpu')
    if (-not $cpuMatch.Success) { throw 'CPU enumeration did not include a usable registry index' }
    & "$PSScriptRoot/robey-windows-file-probe.ps1" -Install $install -CpuIndex ([int]$cpuMatch.Groups[1].Value) -Evidence (Join-Path (Get-Location) 'robey-evidence')
    $fileProbe = Get-Content robey-evidence/file-transcription-probe.json -Raw | ConvertFrom-Json
    @{
        audited = $true
        installer = $package.Name
        installerSha256 = (Get-FileHash $package.FullName).Hash.ToLowerInvariant()
        installerSigned = $false
        productName = $metadata.ProductName
        productVersion = $metadata.ProductVersion
        packagedExecutable = [IO.Path]::GetFileName($binary)
        packagedProcessName = [IO.Path]::GetFileNameWithoutExtension($binary)
        upstreamHandyExecutablePresent = $false
        executableMetadata = @{ originalFilename = $metadata.OriginalFilename; internalName = $metadata.InternalName }
        installationPathContainsSpaces = $install.Contains(' ')
        webView2Bootstrap = 'Bootstrapper path quoting is source-audited; a successful install does not establish bootstrapper execution when WebView2 is already present.'
        cpuEnumerated = $true
        vulkanDeviceEnumerated = $hasVulkanDevice
        gpuNote = if ($hasVulkanDevice) { 'Vulkan device enumerated; GPU dictation unverified' } else { 'No usable Vulkan device enumerated on this runner; CPU available' }
        scope = 'Actual NSIS temporary portable install, payload hash audit, packaged device enumeration only. Microphone, shortcut, paste, transcription quality, offline dictation, side-by-side installation and Angie acceptance remain unverified.'
        fileTranscription = $fileProbe.status
        fileTranscriptionEvidence = 'file-transcription-probe.json; optional synthetic CPU CLI probe; never microphone/shortcut/paste acceptance'
    } | ConvertTo-Json -Depth 4 | Set-Content robey-evidence/package-audit.json
} finally {
    $env:PATH = $oldPath
    $env:APPDATA = $oldAppData
    $env:LOCALAPPDATA = $oldLocalAppData
    # The only removed directory is this invocation's freshly created temp tree.
    if (Test-Path $work) { Remove-Item $work -Recurse -Force }
}
