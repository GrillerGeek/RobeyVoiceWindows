import { expect, test, type Locator, type Page } from "@playwright/test";
import { installSyntheticWindows } from "./robey-ui-fixture";

// Independent E1/E7 keyboard contract: synthetic IPC, never native shortcut,
// microphone, screen-reader, cancel/reset or Windows acceptance evidence.
const MAX_TABS = 60;

async function tabTo(page: Page, control: Locator) {
  // Deliberately do not use click(), focus(), locator.press(), or injected
  // focus. The control must be reachable through the real document Tab order.
  for (let attempt = 0; attempt < MAX_TABS; attempt++) {
    await page.keyboard.press("Tab");
    if (
      (await control.count()) === 1 &&
      (await control.evaluate(
        (element) => element === element.ownerDocument.activeElement,
      ))
    ) {
      await expect(control).toHaveAccessibleName(/\S/);
      return;
    }
  }
  await expect(
    control,
    `A named control must receive focus within ${MAX_TABS} actual Tab presses`,
  ).toBeFocused({ timeout: 1000 });
}

function sectionControl(page: Page, name: string) {
  // Permit semantic navigation links, tabs or buttons; the contract promises
  // accessible names and keyboard behavior rather than a particular element.
  return page
    .getByRole("button", { name, exact: true })
    .or(page.getByRole("link", { name, exact: true }))
    .or(page.getByRole("tab", { name, exact: true }))
    .first();
}

type SyntheticState = {
  calls: { command: string; args: Record<string, unknown> }[];
  unexpected: string[];
};

const syntheticState = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __robeyUI: SyntheticState }).__robeyUI,
  );

test.describe("E1/E7 keyboard entry with synthetic Windows IPC", () => {
  test.beforeEach(async ({ page }) => {
    await installSyntheticWindows(page, { returning: true });
    await page.goto("/");
    await expect(page.getByText("Ctrl + Space", { exact: true })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    expect(
      (await syntheticState(page)).unexpected,
      "unmodeled IPC must remain explicit",
    ).toEqual([]);
  });

  for (const activation of ["Enter", "Space"] as const) {
    test(`Sidebar uses Tab and ${activation} to open About and History without a mouse`, async ({
      page,
    }) => {
      await tabTo(page, sectionControl(page, "About"));
      await page.keyboard.press(activation);
      await expect(
        page.getByText("Robey Voice v0.1.0", { exact: true }).first(),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: "Handy source and MIT license",
          exact: true,
        }),
      ).toBeVisible();

      await tabTo(page, sectionControl(page, "History"));
      await page.keyboard.press(activation);
      await expect(
        page.getByRole("heading", { name: "History", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", {
          name: "Open Recordings Folder",
          exact: true,
        }),
      ).toBeVisible();
    });

    test(`Shortcut capture uses Tab and ${activation}, shows feedback and saves a keyboard binding`, async ({
      page,
    }) => {
      const capture = page
        .getByRole("button")
        .filter({ hasText: "Ctrl + Space" });
      await tabTo(page, capture);
      await page.keyboard.press(activation);
      await expect(
        page.getByText("Press keys...", { exact: true }),
      ).toBeVisible();
      await expect
        .poll(
          async () =>
            (await syntheticState(page)).calls.filter(
              ({ command }) => command === "suspend_all_bindings",
            ).length,
        )
        .toBe(1);

      await page.keyboard.press("Control+j");
      await expect(page.getByText("Ctrl + J", { exact: true })).toBeVisible();
      await expect(
        page.getByText("Press keys...", { exact: true }),
      ).toHaveCount(0);
      await expect
        .poll(
          async () =>
            (await syntheticState(page)).calls.filter(
              ({ command }) => command === "resume_all_bindings",
            ).length,
        )
        .toBe(1);

      await page.reload();
      await expect(page.getByText("Ctrl + J", { exact: true })).toBeVisible();
    });
  }
});
