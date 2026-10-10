import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const ROUTES = ["/", "/work", "/blog"];
const SCHEMES = ["light", "dark"] as const;
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(AXE_TAGS)
    .analyze();
  expect(
    violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`,
    ),
  ).toEqual([]);
}

/** Press the command-menu shortcut once the page has hydrated (the menu trigger flags it). */
async function openWithShortcut(page: Page, key = "Control+KeyK") {
  await page
    .locator('button[aria-keyshortcuts][data-ready="true"]')
    .waitFor({ state: "attached" });
  await page.keyboard.press(key);
}

/** First post link on /blog, so tests don't depend on a specific slug. */
async function firstPostPath(page: Page): Promise<string> {
  await page.goto("/blog");
  const href = await page
    .locator('main a[href^="/blog/"]')
    .first()
    .getAttribute("href");
  expect(href, "expected at least one published post").toBeTruthy();
  return href as string;
}

for (const scheme of SCHEMES) {
  test.describe(`accessibility (${scheme})`, () => {
    test.use({ colorScheme: scheme });

    for (const route of ROUTES) {
      test(`${route} has one h1 and no axe violations`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator("h1")).toHaveCount(1);
        await expectNoAxeViolations(page);
      });
    }

    test("a blog post has one h1 and no axe violations", async ({ page }) => {
      await page.goto(await firstPostPath(page));
      await expect(page.locator("h1")).toHaveCount(1);
      await expectNoAxeViolations(page);
    });

    test("the command menu has no axe violations when open", async ({
      page,
    }) => {
      await page.goto("/");
      await openWithShortcut(page);
      await expect(
        page.getByRole("dialog", { name: "Command menu" }),
      ).toBeVisible();
      await expectNoAxeViolations(page);
    });

    test("the 404 page has no axe violations", async ({ page }) => {
      const response = await page.goto("/does-not-exist");
      expect(response?.status()).toBe(404);
      await expect(
        page.getByRole("heading", { name: "Page not found" }),
      ).toBeVisible();
      await expectNoAxeViolations(page);
    });
  });
}

test("skip link is the first tab stop and moves focus to main content", async ({
  page,
}) => {
  await page.goto("/work");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("theme toggle switches theme, icon and accessible name", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  const toggle = page.getByRole("button", {
    name: /switch to (dark|light) theme/i,
  });
  const moon = toggle.locator("svg").nth(0);
  const sun = toggle.locator("svg").nth(1);

  // Light: the button offers dark, and the moon is the visible icon.
  await expect(html).not.toHaveClass(/dark/);
  await expect(toggle).toHaveAccessibleName("Switch to dark theme");
  await expect(moon).toHaveCSS("opacity", "1");
  await expect(sun).toHaveCSS("opacity", "0");

  await toggle.click();

  // Dark: the sun shows, and the button now offers light.
  await expect(html).toHaveClass(/dark/);
  await expect(toggle).toHaveAccessibleName("Switch to light theme");
  await expect(sun).toHaveCSS("opacity", "1");
  await expect(moon).toHaveCSS("opacity", "0");

  await toggle.click();
  await expect(html).not.toHaveClass(/dark/);
  await expect(moon).toHaveCSS("opacity", "1");
});

test("the theme icon transition is disabled for reduced motion", async ({
  page,
}) => {
  const icon = () =>
    page
      .getByRole("button", { name: /switch to (dark|light) theme/i })
      .locator("svg")
      .first();
  const seconds = () =>
    icon().evaluate((el) =>
      Number.parseFloat(getComputedStyle(el).transitionDuration),
    );

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  expect(await seconds()).toBeGreaterThanOrEqual(0.3);

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await seconds()).toBeLessThan(0.001);
});

test("roles at the same company are grouped under one company heading", async ({
  page,
}) => {
  await page.goto("/work");
  // Each company name appears once as a heading, even with several roles there.
  const companies = await page
    .locator("main > section > ul > li > p.font-semibold")
    .allTextContents();
  expect(new Set(companies).size).toBe(companies.length);
  expect(companies).toContain("Maxxton");
  // The home hero line is derived from the newest role.
  await page.goto("/");
  await expect(page.locator("h1 + p")).toContainText(" at ");
});

test("the home page lists the newest posts and links to all posts", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("section", {
    has: page.getByRole("heading", { name: "Posts", level: 2 }),
  });
  await expect(
    section.getByRole("link", { name: "See all posts" }),
  ).toHaveAttribute("href", "/blog");
  const postLinks = section.locator('a[href^="/blog/"]');
  expect(await postLinks.count()).toBeGreaterThan(0);
  expect(await postLinks.count()).toBeLessThanOrEqual(2);
  // Same format as /blog: title, date and description.
  await expect(section.locator("time").first()).toBeVisible();
});

test.describe("command menu", () => {
  const dialog = (page: Page) =>
    page.getByRole("dialog", { name: "Command menu" });
  const search = (page: Page) => page.getByRole("combobox");

  test("opens with Ctrl+K, filters, and navigates with Enter", async ({
    page,
  }) => {
    await page.goto("/");
    await openWithShortcut(page);
    await expect(dialog(page)).toBeVisible();
    await expect(search(page)).toBeFocused();

    await search(page).fill("work");
    await expect(page.getByRole("option", { name: /^Work/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work$/);
    await expect(dialog(page)).toBeHidden();
  });

  test("the trigger opens it and Esc returns focus to the trigger", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /open command menu/i });
    await trigger.click();
    await expect(dialog(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("/ opens it when not typing in a field", async ({ page }) => {
    await page.goto("/work");
    await openWithShortcut(page, "/");
    await expect(dialog(page)).toBeVisible();
    // Typing a slash into the open menu must not be swallowed.
    await search(page).pressSequentially("a/b");
    await expect(search(page)).toHaveValue("a/b");
  });

  test("arrow keys move the highlighted option", async ({ page }) => {
    await page.goto("/");
    await openWithShortcut(page);
    const first = await search(page).getAttribute("aria-activedescendant");
    await page.keyboard.press("ArrowDown");
    const second = await search(page).getAttribute("aria-activedescendant");
    expect(second).not.toBe(first);
    await page.keyboard.press("ArrowUp");
    expect(await search(page).getAttribute("aria-activedescendant")).toBe(
      first,
    );
  });

  test("finds blog posts from the static index", async ({ page }) => {
    await page.goto("/");
    await openWithShortcut(page);
    const { posts } = await (
      await page.request.get("/search-index.json")
    ).json();
    const [post] = posts;
    await search(page).fill(post.title);
    await expect(
      page.getByRole("option", { name: new RegExp(post.title) }),
    ).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/blog/${post.slug}$`));
  });

  test("the theme action toggles the theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await openWithShortcut(page);
    await search(page).fill("theme");
    await page.keyboard.press("Enter");
    await expect(dialog(page)).toBeHidden();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("the copy email action copies the address", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await openWithShortcut(page);
    await search(page).fill("copy email");
    await page.keyboard.press("Enter");
    await expect(dialog(page).getByRole("status")).toContainText(/copied/i);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
      "@",
    );
  });

  test("caps how many posts are listed and says how many are hidden", async ({
    page,
  }) => {
    const posts = Array.from({ length: 12 }, (_, i) => ({
      slug: `post-${i}`,
      title: `Test post ${i}`,
      date: "2026-01-01",
      description: "Stubbed",
      tags: [],
    }));
    await page.route("**/search-index.json", (route) =>
      route.fulfill({ json: { posts } }),
    );
    await page.goto("/");
    await openWithShortcut(page);
    const postOptions = page.getByRole("option", { name: /^Test post/ });

    // No query: a short overview of 5.
    await expect(postOptions).toHaveCount(5);
    await expect(page.getByText("+7 more posts")).toBeVisible();

    // Searching: top 8 of the 12 matches.
    await search(page).fill("test post");
    await expect(postOptions).toHaveCount(8);
    await expect(page.getByText("+4 more posts")).toBeVisible();
    await expect(dialog(page).getByRole("status")).toContainText(
      "4 more posts not shown",
    );
  });

  test("the search field shows focus with a background shade, not a ring", async ({
    page,
  }) => {
    await page.goto("/");
    await openWithShortcut(page);
    await expect(search(page)).toBeFocused();
    // No outline (Tailwind keeps one for forced-colors mode only) and a tinted background.
    await expect(search(page)).toHaveCSS("outline-style", "none");
    const bg = await search(page).evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    expect(bg).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("shows an empty state when nothing matches", async ({ page }) => {
    await page.goto("/");
    await openWithShortcut(page);
    await search(page).fill("zzzzqq");
    await expect(page.getByText(/no results for/i)).toBeVisible();
    await expect(dialog(page).getByRole("status")).toHaveText("No results");
  });
});

test.describe("email address", () => {
  const EMAIL = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i;

  test("is not in the HTML or any script until revealed", async ({ page }) => {
    const scripts: string[] = [];
    page.on("response", async (response) => {
      if (response.url().endsWith(".js")) scripts.push(await response.text());
    });
    await page.goto("/");
    // Load the lazy command menu chunk too.
    await openWithShortcut(page);
    await expect(
      page.getByRole("dialog", { name: "Command menu" }),
    ).toBeVisible();

    expect(await page.content()).not.toMatch(EMAIL);
    expect(scripts.length).toBeGreaterThan(0);
    for (const script of scripts) expect(script).not.toMatch(EMAIL);
  });

  const envelope = (page: Page) =>
    page.locator('button[aria-label="Copy email address"][data-ready="true"]');

  test("the envelope copies the address and confirms with a popup that fades away", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const popup = page.getByText("Email copied", { exact: true });
    await expect(popup).toHaveCSS("opacity", "0");

    await envelope(page).click();
    await expect(popup).toHaveCSS("opacity", "1");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(
      EMAIL,
    );
    // The address is copied, never put on the page.
    expect(await page.content()).not.toMatch(EMAIL);

    // It dismisses itself.
    await expect(popup).toHaveCSS("opacity", "0", { timeout: 5000 });
  });

  test("shows the address instead when copying is blocked", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: () => Promise.reject(new Error("blocked")) },
      });
    });
    await page.goto("/");
    await envelope(page).click();
    const link = page.getByRole("link", { name: EMAIL });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      /^mailto:[^@\s]+@[^@\s]+\.[a-z]+$/i,
    );
  });

  test("the contact icons press in while the mouse is down", async ({
    page,
  }) => {
    await page.goto("/");
    const github = page.getByRole("link", { name: /on github/i });
    await github.hover();
    expect(await github.evaluate((el) => getComputedStyle(el).scale)).toBe(
      "none",
    );
    await page.mouse.down();
    await expect
      .poll(() => github.evaluate((el) => getComputedStyle(el).scale))
      .not.toBe("none");
    // Release away from the link so it does not open a new tab.
    await page.mouse.move(0, 0);
    await page.mouse.up();
  });
});

test("posts show an estimated reading time in the list and on the post", async ({
  page,
}) => {
  await page.goto("/blog");
  await expect(page.getByText(/\d+ min read/).first()).toBeVisible();
  await page.goto(await firstPostPath(page));
  await expect(page.locator("header").getByText(/\d+ min read/)).toBeVisible();
});

test("each post has its own share image, referenced in the page metadata", async ({
  page,
  request,
}) => {
  const path = await firstPostPath(page);
  await page.goto(path);
  const og = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(og).toContain(`${path}/opengraph-image`);
  expect(
    await page.locator('meta[name="twitter:image"]').getAttribute("content"),
  ).toBe(og);

  const image = await request.get(`${path}/opengraph-image`);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
});

test("the active nav link is marked with aria-current", async ({ page }) => {
  await page.goto("/work");
  await expect(
    page.getByRole("navigation", { name: "Main" }).getByRole("link", {
      name: "work",
    }),
  ).toHaveAttribute("aria-current", "page");
});

test("responses carry the security headers", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toBeTruthy();
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("feeds, sitemap and robots are served", async ({ request }) => {
  const rss = await request.get("/feed.xml");
  expect(rss.headers()["content-type"]).toContain("application/rss+xml");
  expect(await rss.text()).toContain("<rss");

  const atom = await request.get("/atom.xml");
  expect(atom.headers()["content-type"]).toContain("application/atom+xml");

  const json = await request.get("/feed.json");
  expect(json.headers()["content-type"]).toContain("application/feed+json");
  expect((await json.json()).version).toContain("jsonfeed.org");

  const searchIndex = await request.get("/search-index.json");
  expect(searchIndex.headers()["content-type"]).toContain("application/json");
  const { posts } = await searchIndex.json();
  expect(Array.isArray(posts)).toBe(true);

  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/blog");

  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Sitemap:");
});

test("the home page exposes valid JSON-LD", async ({ page }) => {
  await page.goto("/");
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  const data = JSON.parse(raw ?? "");
  expect(data["@context"]).toBe("https://schema.org");
  const types = data["@graph"].map(
    (node: { "@type": string }) => node["@type"],
  );
  expect(types).toEqual(expect.arrayContaining(["WebSite", "Person"]));
});
