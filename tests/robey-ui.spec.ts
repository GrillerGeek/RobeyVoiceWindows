import { expect, test, type Page } from "@playwright/test";
import { installSyntheticWindows } from "./robey-ui-fixture";

type SyntheticState = {
  calls: { command: string; args: Record<string, unknown> }[];
  unexpected: string[];
};
const state = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __robeyUI: SyntheticState }).__robeyUI,
  );

test.describe("Robey Voice UI with synthetic Windows IPC (not native acceptance)", () => {
  test.afterEach(async ({ page }) => {
    expect(
      (await state(page)).unexpected,
      "unmodeled IPC must be explicit",
    ).toEqual([]);
  });

  test("E1/E3: first use explains local setup, history and microphone/shortcut choices", async ({
    page,
  }) => {
    await installSyntheticWindows(page);
    await page.goto("/");
    await expect(page).toHaveTitle("Robey Voice");
    await expect(page.getByText("Robey Voice", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Speak instead of typing, in any app",
    );
    await expect(
      page.getByText(/Local dictation with no account or subscription/),
    ).toBeVisible();
    await expect(
      page.getByText(
        /Download a speech model first; initial setup needs internet/,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        /Choose your microphone in Settings and use or rebind Ctrl\+Space/,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        /History and recordings stay in this app’s local data directory/,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(/last five entries and their recordings are retained/),
    ).toBeVisible();
    await expect(
      page.getByText(/Review or delete them in History/),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Remove English" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "App language" })).toHaveText(
      "Menus in English",
    );
    expect(
      (await state(page)).calls.filter(({ command }) =>
        /record|download_model|complete_onboarding|autostart/.test(command),
      ),
    ).toEqual([]);
  });

  test("E3/E7: model download requires a click and an offline failure offers retry", async ({
    page,
  }) => {
    await installSyntheticWindows(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Choose a speech model" }),
    ).toBeVisible();
    const recommended = page.getByRole("radio", { name: /^Recommended/ });
    await expect(recommended).toContainText("Parakeet Unified English 0.6B");
    await expect(recommended).toContainText("697 MB");
    expect(
      (await state(page)).calls.filter(
        ({ command }) => command === "download_model",
      ),
    ).toHaveLength(0);
    await page
      .getByRole("button", { name: "Download 697 MB", exact: true })
      .click();
    await expect(
      page.getByRole("status").filter({ hasText: "stopped downloading" }),
    ).toBeVisible();
    await expect(
      page.getByText("Retry picks up where it stopped"),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Retry download", exact: true })
      .click();
    await expect
      .poll(
        async () =>
          (await state(page)).calls.filter(
            ({ command }) => command === "download_model",
          ).length,
      )
      .toBe(2);
    await expect(
      page.getByRole("button", { name: "Retry download", exact: true }),
    ).toBeVisible();
    expect(
      (await state(page)).calls.some(({ command }) =>
        /post_process|cloud|complete_onboarding/.test(command),
      ),
    ).toBe(false);
  });

  test("E1/E3: settings render supplied local defaults and preserve history access", async ({
    page,
  }) => {
    await installSyntheticWindows(page, { returning: true });
    await page.goto("/");
    await expect(page.getByText("Ctrl + Space", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Auto", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Default", exact: true }).first(),
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "No Model - Download Required" }),
    ).toBeVisible();
    await expect(
      page.getByText("Post Processing", { exact: true }),
    ).toHaveCount(0);
    await page.getByText("Advanced", { exact: true }).click();
    await expect(
      page.getByRole("checkbox", { name: "Launch on Startup" }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("checkbox", { name: "Voice Activity Detection" }),
    ).toBeChecked();
    await expect(
      page.getByRole("button", { name: "Off", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("spinbutton")).toHaveValue("5");
    await expect(
      page.getByRole("button", { name: "Keep latest 5", exact: true }),
    ).toBeVisible();
    await page.getByText("History", { exact: true }).first().click();
    await expect(
      page.getByRole("heading", { name: "History", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Open Recordings Folder", exact: true }),
    ).toBeVisible();
  });

  test("E6: persisted update opt-in cannot invoke a frontend updater across reload/events", async ({
    page,
  }) => {
    const outbound: string[] = [];
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.hostname !== "localhost") {
        outbound.push(url.href);
        await route.abort();
      } else await route.fallback();
    });
    await installSyntheticWindows(page, {
      returning: true,
      persistedUpdaterOptIn: true,
    });
    for (let launch = 0; launch < 2; launch++) {
      if (launch === 0) await page.goto("/");
      else await page.reload();
      const manual = page.getByRole("button", {
        name: "Manual updates only — preview",
        exact: true,
      });
      await expect(manual).toBeVisible();
      await page.evaluate(async () => {
        const bridge = (
          window as unknown as {
            __TAURI_INTERNALS__: {
              invoke: (command: string, args: unknown) => Promise<unknown>;
            };
          }
        ).__TAURI_INTERNALS__;
        await bridge.invoke("plugin:event|emit", {
          event: "check-for-updates",
          payload: null,
        });
      });
      await page.waitForLoadState("networkidle");
      expect(
        (await state(page)).calls.filter(({ command }) =>
          /updater|update.*install|check_for_updates/.test(command),
        ),
      ).toEqual([]);
      expect(
        (await state(page)).calls.filter(
          ({ command }) => command === "plugin:opener|open_url",
        ),
      ).toEqual([]);
      await manual.focus();
      await expect(manual).toBeFocused();
      await page.keyboard.press("Enter");
      await expect
        .poll(async () =>
          (await state(page)).calls
            .filter(({ command }) => command === "plugin:opener|open_url")
            .map(({ args }) => args.url),
        )
        .toEqual(["https://github.com/GrillerGeek/RobeyVoiceWindows/releases"]);
    }
    expect(outbound).toEqual([]);
  });

  test("E1/E9: About exposes version, separate data path and upstream attribution", async ({
    page,
  }) => {
    await installSyntheticWindows(page, { returning: true });
    await page.goto("/");
    await page.getByText("About", { exact: true }).click();
    await expect(
      page.getByText("Robey Voice v0.1.0", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "System", exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByText(
          /SyntheticTestProfile.*com\.jasonrobey\.robeyvoice\.windows/,
          { exact: false },
        )
        .first(),
    ).toBeVisible();
    const attribution = page.getByRole("heading", {
      name: "Handy source and MIT license",
      exact: true,
    });
    await attribution
      .locator("..")
      .getByRole("button", { name: "More information", exact: true })
      .click();
    await expect(page.getByRole("tooltip")).toContainText(
      "Based on Handy by CJ Pais and contributors (MIT)",
    );
    await expect(page.getByRole("tooltip")).toContainText(
      "Dependencies and models have their own licenses",
    );
    await page
      .getByRole("button", {
        name: "Handy source and MIT license",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "View on GitHub", exact: true })
      .click();
    expect(
      (await state(page)).calls
        .filter(({ command }) => command === "plugin:opener|open_url")
        .map(({ args }) => args.url),
    ).toEqual([
      "https://github.com/cjpais/Handy/blob/v0.10.1/LICENSE",
      "https://github.com/GrillerGeek/RobeyVoiceWindows",
    ]);
  });

  test("E7: a synthetic shortcut conflict is visible and a new keyboard binding recovers", async ({
    page,
  }) => {
    await installSyntheticWindows(page, { returning: true });
    await page.goto("/");
    await page.getByText("Ctrl + Space", { exact: true }).click();
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("status")).toContainText(
      "Synthetic shortcut conflict: choose another shortcut",
    );
    await expect(page.getByText("Ctrl + Space", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await page.getByText("Ctrl + Space", { exact: true }).click();
    await page.keyboard.press("Control+j");
    await expect(page.getByText("Ctrl + J", { exact: true })).toBeVisible();
    await expect
      .poll(
        async () =>
          (await state(page)).calls.filter(
            ({ command }) => command === "resume_all_bindings",
          ).length,
      )
      .toBe(2);
    await page.reload();
    await expect(page.getByText("Ctrl + J", { exact: true })).toBeVisible();
  });
});
