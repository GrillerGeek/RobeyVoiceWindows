# Build prerequisites only; the inherited build.rs remains the runtime stager.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
New-Item -ItemType Directory -Force robey-evidence | Out-Null

$vad = 'src-tauri/resources/models/silero-vad-v6.2-F32.gguf'
$expected = '0d871a800c420fdd5d1b17a3aea4296d1c39608f0ff4a9295eb76457eb1c88e6'
git ls-files --error-unmatch -- $vad | Out-Null
if ($LASTEXITCODE -ne 0 -or (Get-FileHash $vad -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected) {
    throw 'Tracked VAD is missing or changed. No automatic download/replacement is permitted.'
}
if ($env:TAURI_CONFIG) { throw 'TAURI_CONFIG override is forbidden for this preview build' }

$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
$vsRoot = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
if (-not $vsRoot) { throw 'Visual Studio x64 MSVC tools are required' }
$redistVersion = (Get-Content (Join-Path $vsRoot 'VC\Auxiliary\Build\Microsoft.VCRedistVersion.default.txt')).Trim()
$toolsetVersion = (Get-Content (Join-Path $vsRoot 'VC\Auxiliary\Build\Microsoft.VCToolsVersion.default.txt')).Trim()
$compiler = Get-Item (Join-Path $vsRoot "VC\Tools\MSVC\$toolsetVersion\bin\Hostx64\x64\cl.exe")
$archDir = Join-Path $vsRoot "VC\Redist\MSVC\$redistVersion\x64"
$crt = Get-ChildItem $archDir -Directory -Filter 'Microsoft.VC*.CRT' | Sort-Object Name | Select-Object -Last 1
$omp = Get-ChildItem $archDir -Directory -Filter 'Microsoft.VC*.OpenMP' | Sort-Object Name | Select-Object -Last 1
if (-not $crt -or -not $omp) { throw 'Required x64 CRT/OpenMP redistribution directories were not found' }
foreach ($item in @((Join-Path $crt.FullName 'msvcp140.dll'), (Join-Path $crt.FullName 'vcruntime140.dll'), (Join-Path $omp.FullName 'vcomp140.dll'))) {
    if (-not (Test-Path $item -PathType Leaf)) { throw "Missing app-local runtime prerequisite: $item" }
}
$dirs = "$($crt.FullName);$($omp.FullName)"
Add-Content $env:GITHUB_ENV "HANDY_VC_REDIST_DIRS=$dirs"

cmake --version | Set-Content robey-evidence/cmake-version.txt
if ($LASTEXITCODE -ne 0) { throw 'CMake is unavailable' }
if (-not (Test-Path "$env:VULKAN_SDK/Bin/glslc.exe")) { throw 'Vulkan SDK glslc is unavailable' }
& "$env:VULKAN_SDK/Bin/glslc.exe" --version | Set-Content robey-evidence/glslc-version.txt
if ($LASTEXITCODE -ne 0) { throw 'glslc failed' }
vcpkg install spirv-headers:x64-windows
if ($LASTEXITCODE -ne 0) { throw 'SPIRV-Headers installation failed' }
vcpkg list | Set-Content robey-evidence/vcpkg-installed.txt
if ($LASTEXITCODE -ne 0) { throw 'vcpkg inventory failed' }
$prefix = "$env:VCPKG_INSTALLATION_ROOT/installed/x64-windows" -replace '\\', '/'
if (-not (Get-ChildItem "$prefix/share" -Filter '*spirv*config.cmake' -Recurse)) { throw 'SPIRV-Headers CMake config is unavailable' }
$combined = if ($env:CMAKE_PREFIX_PATH) { "$prefix;$env:CMAKE_PREFIX_PATH" } else { $prefix }
Add-Content $env:GITHUB_ENV "CMAKE_PREFIX_PATH=$combined"
@{
    visualStudio = $vsRoot
    msvcToolsetVersion = $toolsetVersion
    compilerFileVersion = $compiler.VersionInfo.FileVersion
    vcRedistVersion = $redistVersion
    vcRedistDirectories = $dirs
    vulkanSdk = $env:VULKAN_SDK
    spirvHeadersPrefix = $prefix
    vcpkgCommit = (& git -C $env:VCPKG_INSTALLATION_ROOT rev-parse HEAD)
} | ConvertTo-Json | Set-Content robey-evidence/native-prerequisites.json
