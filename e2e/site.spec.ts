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
