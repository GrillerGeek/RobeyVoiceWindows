import type { Page } from "@playwright/test";
import { catalog } from "@handy-computer/models";
import type { AppSettings, ModelInfo } from "../src/bindings";

/** Synthetic IPC only. This does not exercise Windows, Rust, audio or disk. */
export async function installSyntheticWindows(
  page: Page,
  options: { returning?: boolean; persistedUpdaterOptIn?: boolean } = {},
) {
  // Spec defaults supplied as INPUT, never used as evidence of Rust defaults.
  const defaults: AppSettings = {
    app_language: "en",
    selected_language: "en",
    spoken_languages: ["en"],
    selected_microphone: "Default",
    selected_output_device: "Default",
    always_on_microphone: false,
    vad_enabled: true,
    translate_to_english: false,
    post_process_enabled: false,
    auto_submit: false,
    autostart_enabled: false,
    start_hidden: false,
    show_tray_icon: true,
    history_limit: 5,
    recording_retention_period: "preserve_limit",
    shortcut_activation: "hold_or_toggle",
    keyboard_implementation: "tauri",
    theme: "system",
    custom_words: [],
    post_process_providers: [],
    post_process_prompts: [],
    model_unload_timeout: "never",
    overlay_style: "minimal",
    paste_method: "ctrl_v",
    clipboard_handling: "dont_modify",
    audio_feedback: false,
    update_checks_enabled: false,
    onboarding_completed: false,
    bindings: {
      transcribe: {
        id: "transcribe",
        name: "Transcribe",
        description: "Synthetic dictation shortcut",
        default_binding: "ctrl+space",
        current_binding: "ctrl+space",
      },
      cancel: {
        id: "cancel",
        name: "Cancel",
        description: "Synthetic cancellation shortcut",
        default_binding: "escape",
        current_binding: "escape",
      },
    },
  };
  // Real public catalog metadata; every model remains NOT downloaded.
  const models: ModelInfo[] = catalog.curatedModels
    .filter((model) => model.role === "asr")
    .map((model) => {
      const file = model.files[model.quant];
      return {
        id: model.id,
        name: model.name,
        description: model.description,
        filename: file.filename,
        source: {
          HuggingFace: { repo_id: model.repository, revision: model.revision },
        },
        size_mb: file.size / (1024 * 1024),
        is_downloaded: false,
        is_downloading: false,
        partial_size: 0,
        accuracy_score: 0,
        speed_score: 0,
        supports_translation: model.capabilities.translate,
        is_recommended: false,
        supported_languages: [...model.languages],
        supports_language_selection: true,
        is_custom: false,
        supports_streaming: model.capabilities.streaming,
        supports_language_detection: model.capabilities.languageDetection,
      };
    });
  await page.route("http://localhost:1420/", async (route) => {
    const response = await route.fetch();
    const bootstrap = `
      import { mockIPC, mockWindows, mockConvertFileSrc } from '/node_modules/@tauri-apps/api/mocks.js';
      const defaults = ${JSON.stringify(defaults)};
      const options = ${JSON.stringify(options)};
      const models = ${JSON.stringify(models)};
      window.__TAURI_OS_PLUGIN_INTERNALS__ = {
        platform: 'windows', os_type: 'windows', family: 'windows',
        arch: 'x86_64', version: 'synthetic', eol: '\\r\\n', exe_extension: 'exe'
      };
      mockWindows('main');
      mockConvertFileSrc('windows');
      const saved = JSON.parse(sessionStorage.getItem('robey-ui-settings') || 'null');
      const settings = saved || {...defaults,
        onboarding_completed: !!options.returning,
        update_checks_enabled: !!options.persistedUpdaterOptIn
      };
      sessionStorage.setItem('robey-ui-settings', JSON.stringify(settings));
      const calls = [];
      const unexpected = [];
      window.__robeyUI = {calls, unexpected, settings};
      mockIPC(async (command, args = {}) => {
        calls.push({command, args});
        switch (command) {
          case 'get_app_settings': return structuredClone(settings);
          case 'get_default_settings': return structuredClone(defaults);
          case 'get_available_models': return models;
          case 'get_current_model': return '';
          case 'get_retired_models': case 'get_active_notices':
          case 'get_available_microphones': case 'get_available_output_devices': return [];
          case 'get_available_accelerators': return {transcribe: ['cpu'], gpu_devices: []};
          case 'check_custom_sounds': return {start: false, stop: false};
          case 'is_update_checks_locked': return true;
          case 'get_windows_microphone_permission_status': return {
            supported: true, overall_access: 'allowed', device_access: 'allowed',
            app_access: 'allowed', desktop_app_access: 'allowed'
          };
          case 'get_microphone_channels': return 1;
          case 'get_secure_input_status': return {enabled: false, sustained: false, recorder_blocked: false, degraded_bindings: [], uncovered_bindings: [], culprit_name: null, culprit_pid: null};
          case 'get_history_entries': return {entries: [], has_more: false};
          case 'plugin:app|version': return '0.1.0';
          case 'plugin:os|locale': return 'en-US';
          case 'get_app_dir_path': return 'C:\\\\SyntheticTestProfile\\\\com.jasonrobey.robeyvoice.windows';
          case 'get_log_dir_path': return 'C:\\\\SyntheticTestProfile\\\\com.jasonrobey.robeyvoice.windows\\\\logs';
          case 'is_portable': case 'is_recording': return false;
          case 'initialize_enigo': case 'initialize_shortcuts':
          case 'suspend_all_bindings': case 'resume_all_bindings':
          case 'plugin:opener|open_url': return null;
          case 'change_binding': {
            if (args.binding === 'ctrl+k') return {success: false, binding: null, error: 'Synthetic shortcut conflict: choose another shortcut'};
            const binding = settings.bindings[args.id];
            binding.current_binding = args.binding;
            sessionStorage.setItem('robey-ui-settings', JSON.stringify(settings));
            return {success: true, binding, error: null};
          }
          case 'change_spoken_languages_setting': settings.spoken_languages = args.languages; return null;
          case 'change_shortcut_activation_setting': settings.shortcut_activation = args.activation; return null;
          case 'download_model': throw 'Synthetic offline model download; reconnect and retry';
          default:
            unexpected.push(command);
            throw 'Unsupported synthetic IPC: ' + command;
        }
      }, {shouldMockEvents: true});
      await import('/src/main.tsx');
    `;
    await route.fulfill({
      response,
      body: (await response.text()).replace(
        '<script type="module" src="/src/main.tsx"></script>',
        `<script type="module">${bootstrap}</script>`,
      ),
    });
  });
}
