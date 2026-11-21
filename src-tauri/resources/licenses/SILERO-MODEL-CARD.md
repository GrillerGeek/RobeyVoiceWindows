---
license: mit
library_name: transcribe.cpp
pipeline_tag: audio-classification
tags:
  - gguf
  - transcribe.cpp
  - voice-activity-detection
  - silero-vad
transcribe_cpp:
  schema_version: 2
  rtf_m4:
    cpu: 1630.87
  streaming: true
  translate: false
  lang_detect: false
  timestamps: none
---

# silero-vad: transcribe.cpp GGUF

GGUF conversions of [snakers4/silero-vad](https://github.com/snakers4/silero-vad) for use
with [transcribe.cpp](https://github.com/handy-computer/transcribe.cpp).

Ported from upstream commit
[5cd7945](https://github.com/snakers4/silero-vad/commit/5cd7945),
pinned 2026-10-09.
Validated against the silero-vad 6.2.3 (TorchScript, CPU, F32) reference at transcribe.cpp commit
[2674b95d](https://github.com/handy-computer/transcribe.cpp/tree/2674b95d)
on 2026-10-10.

Voice activity detection by the Silero Team. Not a transcription model:
the VAD role produces per-frame speech probabilities (offline or
streaming) and offline speech segments. CPU is the default backend for
reference fidelity. transcribe.cpp also loads whisper.cpp's
`ggml-silero-v5.1.2.bin` / `v6.2.0.bin`.


## Downloads

| Quantization | Download | Size |
| --- | --- | ---: |
| F32 | [silero-vad-v6.2-F32.gguf](https://huggingface.co/handy-computer/silero-vad-v6.2-gguf/resolve/main/silero-vad-v6.2-F32.gguf) | 1 MB |

## Usage

Build transcribe.cpp and run on a mono WAV at the model's sample rate:

```bash
cmake -B build && cmake --build build --target transcribe-cli
build/bin/transcribe-cli -m silero-vad-v6.2-F32.gguf input.wav
```

From the C API, use the VAD role (`include/transcribe/vad.h`): offline
segments with `transcribe_vad_run`, live per-frame probabilities with
`transcribe_vad_stream_feed`.

See [the model page](https://github.com/handy-computer/transcribe.cpp/blob/main/docs/models/silero-vad-v6.2.md)
and [VAD usage](https://github.com/handy-computer/transcribe.cpp/blob/main/docs/vad.md).

## License

Inherited from the base model: **MIT**. See the
[upstream model card](https://github.com/snakers4/silero-vad) for full terms.
This repository includes the license text
([`LICENSE`](https://huggingface.co/handy-computer/silero-vad-v6.2-gguf/blob/main/LICENSE)) and a
[`NOTICE`](https://huggingface.co/handy-computer/silero-vad-v6.2-gguf/blob/main/NOTICE) recording
how these files were derived from the original.
