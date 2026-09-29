const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

/**
 * Phones swap the desktop headline (h1) for a separate intro block, so the
 * "is the hero visible" checks target whichever one the viewport actually shows.
 */
function heroIntro(page) {
  return test.info().project.name === "mobile"
    ? page.locator(".hero-v12-mobile-intro")
    : page.locator("h1");
}

/** Reveal every scroll-animated block so axe measures final colours, not mid-fade ones. */
async function settle(page) {
  await page.evaluate(() =>
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("show")),
  );
  await page.waitForTimeout(900);
}

test.describe("smoke", () => {
  test("title leads with QA and the page has exactly one h1", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/QA Engineer/);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("no console errors or uncaught exceptions on load", async ({ page }) => {
    const problems = [];
    page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
    page.on("console", (msg) => {
      if (msg.type() === "error") problems.push(`console: ${msg.text()}`);
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(problems).toEqual([]);
  });

  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("hero headline is fully visible shortly after load (not gated on JS)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(heroIntro(page)).toHaveCSS("opacity", "1", { timeout: 2000 });
    await expect(heroIntro(page)).toBeVisible();
  });

  test("hero states a concrete claim on every viewport", async ({ page }) => {
    await page.goto("/");
    await expect(heroIntro(page)).toContainText(
      /test software for a living.*same discipline/s,
    );
  });

  test("nav and footer anchors point at real sections", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.$$eval(
      ".nav-links a[href^='#'], .footer-nav a[href^='#']",
      (as) => as.map((a) => a.getAttribute("href")),
    );
    expect(hrefs.length).toBeGreaterThan(5);
    for (const href of hrefs) {
      await expect(page.locator(href), `${href} should exist`).toHaveCount(1);
    }
  });

  test("every local link, image, script and document resolves", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const urls = await page.evaluate(() => {
      const out = new Set();
      const add = (v) => {
        if (!v || /^(https?:|mailto:|tel:|#|data:)/.test(v)) return;
        out.add(v.split("#")[0].split("?")[0]);
      };
      document
        .querySelectorAll("a[href]")
        .forEach((el) => add(el.getAttribute("href")));
      document
        .querySelectorAll("img[src]")
        .forEach((el) => add(el.getAttribute("src")));
      document
        .querySelectorAll("source[srcset]")
        .forEach((el) => add(el.getAttribute("srcset")));
      document
        .querySelectorAll("script[src]")
        .forEach((el) => add(el.getAttribute("src")));
      document
        .querySelectorAll("link[href]")
        .forEach((el) => add(el.getAttribute("href")));
      return [...out].filter(Boolean);
    });
    expect(urls.length).toBeGreaterThan(10);
    for (const url of urls) {
      const res = await request.get(
        new URL(url, "http://127.0.0.1:4173/").href,
      );
      expect(res.status(), `${url} should return 200`).toBe(200);
    }
  });

  test("both résumé downloads are real PDFs", async ({ request }) => {
    for (const file of [
      "paul-dedumo-qa-resume.pdf",
      "paul-dedumo-sales-research-resume.pdf",
    ]) {
      const res = await request.get(`/assets/documents/${file}`);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("pdf");
      expect((await res.body()).subarray(0, 4).toString()).toBe("%PDF");
    }
  });
});

test.describe("regressions guarded", () => {
  test("experience timeline is newest-first and covers 2016 onward", async ({
    page,
  }) => {
    await page.goto("/");
    const years = await page.$$eval(".timeline-year", (els) =>
      els.map((e) => e.textContent.trim()),
    );
    expect(years.length).toBeGreaterThanOrEqual(4);
    expect(years[0]).toMatch(/2024/);
    expect(years[years.length - 1]).toMatch(/2016/);
  });

  test("script font is self-hosted and actually loads (no generic cursive fallback)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const state = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts]
        .filter((f) => f.family.replace(/"/g, "") === "Cormorant Garamond")
        .map((f) => f.status);
    });
    expect(state).toContain("loaded");
  });

  test("hero portrait is served as WebP under 150 KB", async ({ page }) => {
    const sizes = [];
    page.on("response", async (res) => {
      if (/hero-portrait\.(webp|png)$/.test(res.url())) {
        sizes.push({ url: res.url(), bytes: (await res.body()).length });
      }
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(sizes).toHaveLength(1);
    expect(sizes[0].url).toMatch(/\.webp$/);
    expect(sizes[0].bytes).toBeLessThan(150 * 1024);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("hero and below-the-fold content stay visible", async ({ page }) => {
    await page.goto("/");
    await expect(heroIntro(page)).toBeVisible();
    await expect(page.locator("#about h2")).toHaveCSS("opacity", "1");
  });
});

test.describe("QA case study dialog", () => {
  test("opens from the carousel and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const opener = page
      .locator('[data-qa-case-detail="qaCaseDetail01"]')
      .first();
    await opener.scrollIntoViewIfNeeded();
    await opener.click();
    const dialog = page.locator("#qaCaseModal");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("moves focus in, keeps Tab inside, and restores focus on close", async ({
    page,
  }) => {
    await page.goto("/");
    const opener = page
      .locator('[data-qa-case-detail="qaCaseDetail01"]')
      .first();
    await opener.scrollIntoViewIfNeeded();
    await opener.click();
    const dialog = page.locator("#qaCaseModal");
    await expect(dialog.locator(":focus")).toHaveCount(1);
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      await expect(dialog.locator(":focus")).toHaveCount(1);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });
});

test.describe("accessibility (axe, WCAG 2.1 A/AA)", () => {
  const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

  test("home page has no violations", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await settle(page);
    // The carousel's adjacent "peek" slides are 40%-opacity, blurred previews that
    // qa-carousel.js marks aria-hidden: decorative, so WCAG 1.4.3 does not apply to
    // them and axe would otherwise measure the faded blend.
    const results = await new AxeBuilder({ page })
      .withTags(tags)
      .exclude('.qa-case-slide[aria-hidden="true"]')
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
      ),
    ).toEqual([]);
  });

  test("QA case study dialog has no violations when open", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const opener = page
      .locator('[data-qa-case-detail="qaCaseDetail01"]')
      .first();
    await opener.scrollIntoViewIfNeeded();
    await opener.click();
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page })
      .include("#qaCaseModal")
      .withTags(tags)
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
      ),
    ).toEqual([]);
  });
});
