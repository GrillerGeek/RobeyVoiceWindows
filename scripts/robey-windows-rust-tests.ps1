# Cargo places lib-test executables outside the application's staged runtime
# directory. Co-locate the existing native DLLs before running unchanged tests.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$PSNativeCommandUseErrorActionPreference = $false
$project = Split-Path $PSScriptRoot -Parent
$evidence = Join-Path $project 'robey-evidence'
New-Item -ItemType Directory -Force $evidence | Out-Null
$facts = @{ status = 'pending'; testExecutables = @(); stagedDlls = @() }
$oldPath = $env:PATH
try {
    $artifacts = [System.Collections.Generic.List[string]]::new()
    $testArguments = @('test', '--locked', '--manifest-path', 'src-tauri/Cargo.toml', '--target', 'x86_64-pc-windows-msvc', '--lib')
    & cargo @testArguments --no-run --message-format=json | ForEach-Object {
        $message = $_ | ConvertFrom-Json
        if ($message.reason -eq 'compiler-message' -and $message.message.rendered) {
            Write-Host $message.message.rendered
        }
        if ($message.reason -eq 'compiler-artifact' -and $message.profile.test -and $message.executable) {
            $artifacts.Add([string]$message.executable)
        }
    }
    $facts.compileExitCode = $LASTEXITCODE
    if ($LASTEXITCODE -ne 0) { throw "Rust lib-test compilation failed with exit code $LASTEXITCODE" }
    $executables = @($artifacts | Sort-Object -Unique)
    if (-not $executables.Count) { throw 'Cargo reported no executable lib-test artifacts' }

    $targetRoot = (Resolve-Path -LiteralPath (Join-Path $project 'src-tauri/target/x86_64-pc-windows-msvc/debug')).Path
    $targetPrefix = $targetRoot.TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
    $staging = (Resolve-Path -LiteralPath (Join-Path $project 'src-tauri/transcribe-libs')).Path
    $dlls = @(Get-ChildItem -LiteralPath $staging -File -Filter '*.dll' | Sort-Object Name)
    foreach ($pattern in @('*transcribe*.dll', '*ggml-cpu*.dll', '*ggml-vulkan*.dll', 'msvcp140.dll', 'vcruntime140.dll', 'vcomp140.dll')) {
        if (-not ($dlls | Where-Object { $_.Name -like $pattern })) { throw "Existing runtime staging is incomplete for lib tests: $pattern" }
    }
    $facts.stagedDirectory = $staging
    $facts.stagedDlls = @($dlls | ForEach-Object {
        @{ name = $_.Name; bytes = $_.Length; sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant() }
    })
    foreach ($executable in $executables) {
        $resolved = (Resolve-Path -LiteralPath $executable).Path
        if (-not $resolved.StartsWith($targetPrefix, [StringComparison]::OrdinalIgnoreCase) -or [IO.Path]::GetExtension($resolved) -ine '.exe') {
            throw 'Cargo test executable is outside the expected project-owned Windows debug target'
        }
        $testFile = Get-Item -LiteralPath $resolved
        if ($testFile.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Cargo test executable must not be a reparse point' }
        $destination = Split-Path $resolved -Parent
        Write-Host "Staging $($dlls.Count) existing runtime DLLs beside Cargo lib-test executable: $resolved"
        foreach ($dll in $dlls) {
            $copy = Join-Path $destination $dll.Name
            Copy-Item -LiteralPath $dll.FullName -Destination $copy -Force
            if ((Get-FileHash -LiteralPath $copy).Hash -ne (Get-FileHash -LiteralPath $dll.FullName).Hash) { throw "Lib-test runtime copy differs from staging: $($dll.Name)" }
        }
        $facts.testExecutables += @{ path = $resolved; sha256 = (Get-FileHash -LiteralPath $resolved).Hash.ToLowerInvariant(); runtimeDllsCoLocated = $dlls.Count }
    }
    # Scoped to this test invocation. The installer audit independently strips
    # build paths and verifies its own co-located runtime payload hashes.
    $env:PATH = "$staging;$oldPath"
    & cargo @testArguments
    $facts.testExitCode = $LASTEXITCODE
    if ($LASTEXITCODE -ne 0) { throw "Rust lib tests failed with exit code $LASTEXITCODE" }
    $facts.status = 'passed'
} catch {
    $facts.status = 'failed'
    $facts.reason = $_.Exception.Message
    throw
} finally {
    $env:PATH = $oldPath
    $facts | ConvertTo-Json -Depth 7 | Set-Content (Join-Path $evidence 'rust-test-runtime.json')
}
