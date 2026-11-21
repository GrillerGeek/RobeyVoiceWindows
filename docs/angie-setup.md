# Angie's Robey Voice setup

Robey Voice 0.1.0 is a local dictation preview for **Windows 11 x64 on an Intel or AMD PC**. It needs no account, subscription, API key, or paid service for local dictation. Your actual PC, microphone, preferred shortcut and apps have not yet been tested. A dedicated GPU is not required by the intended CPU option; speed and recognition quality remain unverified.

## Before Installing

**Download link: PENDING — Jason has not supplied a built installer.**  
**Installer filename and SHA256: PENDING — do not install an unverified substitute.**

The preview will be an unsigned NSIS `.exe`. It has no verified Windows publisher signature. First model download and setup of a missing Microsoft WebView2 runtime need internet access. Once the model and runtime are installed, local dictation is intended to work offline; the native offline check is still pending.

When Jason supplies the file and its matching checksum, open PowerShell and check the downloaded file, replacing the example filename with the exact name supplied:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath "$HOME\Downloads\EXACT-INSTALLER-FILENAME.exe"
```

Compare the entire hash with Jason's supplied SHA256. If it differs, stop and report it. A matching checksum checks that you received the specified file; it does not provide a publisher signature.

Run the checked installer and follow normal Windows prompts. If Windows or your organization's policy blocks the unsigned app or WebView2 setup, **stop and send Jason the exact message**. Do not disable protections or work around device policy. Keep any report free of personal documents, audio and transcripts.

## First Setup

1. Launch **Robey Voice** from the Start menu. First run should open setup without recording or enabling startup.
2. Allow microphone access through normal Windows permissions. If necessary, check **Settings → Privacy & security → Microphone** and the desktop-app access setting. If a setting is managed or unavailable, stop and report it. Select your microphone in Robey Voice settings if the system default is wrong.
3. Choose a local model in the model chooser. Review its name, download size and progress; wait for completion and select it. Use a CPU-capable option. An interrupted download needs a retry, not a cloud account.
4. Start with **Ctrl+Space**. Hold it while speaking and release to finish, or tap to start and tap again to finish. You can select hold-only or toggle-only behavior and rebind it in settings. If another app uses the shortcut, choose a free one.
5. Leave optional cloud post-processing off. English recognition and interface are the initial defaults; translation, automatic submission and startup are off.

## Try a Sentence

1. Open ordinary **Notepad**, without running it as administrator, and click in a new empty document.
2. Use the shortcut and say a synthetic sentence such as “The blue cup is beside the window.” Finish recording and wait for processing to return to idle.
3. Check whether text appeared and whether the History entry contains the result. Repeat with a few harmless test sentences before using your normal apps.
4. If the text did not appear, open **History**, choose **Copy**, return to an allowed text field, and paste normally. Some restricted or elevated apps reject automatic input, and the app may not reliably detect every failed insertion. Do not run it elevated to get around this.
5. If recording fails, check microphone permission/device selection. If the model is unavailable, return to model setup. Report a stuck recording or repeated failure to Jason rather than reinstalling repeatedly.

These are setup instructions, not a record that the test has passed. Tell Jason your Windows version/architecture, chosen model, microphone, shortcut, target app and whether the result and wait time were comfortable. Appearance, quality, timing and usability acceptance remain yours to decide after using it.

## Local History and Privacy

Core recognition processes audio locally; optional cloud post-processing is off. Explicit model/runtime downloads and links use the internet. Native offline/network verification is still pending.

History can retain transcripts **and local recordings**. The inherited default history limit is five entries, with recording retention following that limit. Review the history/recording settings and use History's deletion controls to remove entries you do not want to keep. Model settings provide model deletion controls.

Robey Voice uses its own app-data directory, expected at `%APPDATA%\com.jasonrobey.robeyvoice.windows`, for settings, history, recordings, models, WebView and its private Hugging Face model cache. Use **Open App Data Folder** in the app to locate the actual folder. There is no automatic import or cache sharing with Handy. The portable option instead keeps its data in `Data` beside its own executable.

## Updates, Removal and Handy

Updates are **manual**. The app's update link opens this fork's releases page; it does not install updates. Use only the Robey Voice file and checksum supplied for that version, verify them again, quit Robey Voice from its tray, and run the replacement installer. Manual upgrade and data-retention behavior still need native testing; keep a copy of any local data you choose to retain before updating.

For a normal installation, uninstall **Robey Voice** through Windows Settings → Apps → Installed apps. The inherited uninstaller offers a data-deletion checkbox: leave it unchecked to retain local data, or select it to request removal of Robey Voice's own roaming/local data folders. This can remove settings, transcripts, recordings, models and cache. Native uninstall verification is pending. Portable mode has no normal uninstall entry: quit it and deliberately remove only its separate folder when you also intend to delete its `Data`.

If Handy is already installed, keep Robey Voice in a separate folder. Shared shortcuts may conflict, and side-by-side launch/uninstall behavior is still unverified. The internal executable filename `handy.exe` is inherited; use the **Robey Voice** shortcut and installation location to identify this app. Do not migrate Handy's data or delete Handy folders.

Robey Voice is based on Handy by CJ Pais and contributors. Handy's MIT license remains intact; Jason's original icon artwork/source is GPL-3.0-only. Dependencies, runtimes and models have their own terms; see the [README notices](../README.md#attribution-and-licenses).
