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

test("theme toggle switches between light and dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(html).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(html).not.toHaveClass(/dark/);
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
