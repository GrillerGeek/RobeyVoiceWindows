param([Parameter(Mandatory)][string]$Install, [Parameter(Mandatory)][int]$CpuIndex, [Parameter(Mandatory)][string]$Evidence)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
# Optional, bounded CPU engine probe. All inputs are synthetic or pinned public
# model weights, created after installer assembly and removed with the temp tree.
$revision = '5359861c739e955e79d9a303bcbc70fb988958b1'
$expected = '921e4cf8686fdd993dcd081a5da5b6c365bfde1162e72b08d75ac75289920b1f'
$modelUrl = "https://huggingface.co/ggerganov/whisper.cpp/resolve/$revision/ggml-tiny.en.bin"
$phrase = 'The purple robot places seven paper flowers beside the window.'
$facts = @{
    status = 'pending'
    scope = 'Synthetic SAPI WAV -> packaged CPU file-transcription CLI only. No microphone capture, global shortcut, clipboard, paste, offline-network, accuracy or human acceptance claim.'
    syntheticPhrase = $phrase
    fixtureGenerator = 'Windows System.Speech.Synthesis.SpeechSynthesizer, 16000 Hz signed 16-bit mono WAV'
    model = @{ repository = 'ggerganov/whisper.cpp'; revision = $revision; file = 'ggml-tiny.en.bin'; url = $modelUrl; sha256 = $expected; bytes = 77704715; license = 'MIT (Whisper model weights, OpenAI; GGML conversion in whisper.cpp)'; licenseSource = 'https://github.com/openai/whisper/blob/v20240930/LICENSE'; metadataSource = "https://huggingface.co/api/models/ggerganov/whisper.cpp/revision/$revision" }
    cpuIndex = $CpuIndex
    distributedWeights = $false
    distributedAudio = $false
}
try {
    Add-Type -AssemblyName System.Speech
    $synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
    try {
        $wav = Join-Path $Install 'robey-ci-synthetic.wav'
        $format = [System.Speech.AudioFormat.SpeechAudioFormatInfo]::new(16000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
        $synth.SetOutputToWaveFile($wav, $format)
        $facts.voice = $synth.Voice.Name
        $synth.Speak($phrase)
    } finally { $synth.Dispose() }
    $facts.fixtureSha256 = (Get-FileHash $wav).Hash.ToLowerInvariant()
    $modelDir = Join-Path $Install 'Data/models'
    New-Item -ItemType Directory -Force $modelDir | Out-Null
    $model = Join-Path $modelDir 'robey-ci-whisper-tiny-en.bin'
    Invoke-WebRequest -Uri $modelUrl -OutFile $model -TimeoutSec 120
    if ((Get-Item $model).Length -ne 77704715 -or (Get-FileHash $model).Hash.ToLowerInvariant() -ne $expected) { throw 'Pinned synthetic-probe model size/hash mismatch' }
    $stdout = Join-Path $Evidence 'file-transcription.stdout.json'
    $stderr = Join-Path $Evidence 'file-transcription.stderr.txt'
    $binary = Join-Path $Install 'robey-voice.exe'
    # Quote the generated WAV path for native Windows argv parsing.
    $arguments = "--transcribe-file `"$wav`" --model robey-ci-whisper-tiny-en --device-index $CpuIndex --json"
    $process = Start-Process -FilePath $binary -ArgumentList $arguments -WorkingDirectory $Install -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
    if (-not $process.WaitForExit(180000)) {
        $process.Kill($true)
        throw 'Synthetic CPU file-transcription exceeded 180 seconds'
    }
    $process.WaitForExit()
    if ($process.ExitCode -ne 0) { throw "Synthetic CPU CLI exited $($process.ExitCode)" }
    $result = Get-Content $stdout -Raw | ConvertFrom-Json
    if ([string]::IsNullOrWhiteSpace($result.text)) { throw 'Synthetic file-transcription returned empty text' }
    $facts.status = 'passed'
    $facts.result = $result
} catch {
    # minimal: optional probe is nonblocking; making it a release gate requires
    # a separately reviewed fixture/model expectation and native baseline.
    $facts.status = 'failed-optional'
    $facts.reason = $_.Exception.Message
    Write-Warning "Optional synthetic file-transcription probe: $($_.Exception.Message)"
} finally {
    $facts | ConvertTo-Json -Depth 8 | Set-Content (Join-Path $Evidence 'file-transcription-probe.json')
}
