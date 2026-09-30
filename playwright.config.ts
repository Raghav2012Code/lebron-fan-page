import { defineConfig } from "@playwright/test";

/**
 * The no-JS e2e gate — the behavioral sibling of the design guards.
 *
 * `tests/design-guards.test.ts` pins the root layout's no-JS style block as
 * source text, and the render suite puts sections in jsdom. Neither could see
 * the defects in issue #33: a `<noscript>` block is raw text to jsdom (there
 * is no scripting-disabled mode), and six overlapping stage panels are a
 * layout fact no source-string assertion can express. Only a real browser with
 * `javaScriptEnabled: false` can observe them, which is what this suite is.
 *
 * The server: a production build served on port 3100. The guarantee under
 * test is "server HTML + CSS with scripting off", so dev-mode tooling only
 * adds noise, and 3100 keeps the suite's server from colliding with a `next
 * dev` on 3000. `npm run build` is quality gate 4 and runs immediately before
 * this one, so the web server only starts the app; running `test:e2e` without
 * a build fails loudly at `next start` rather than silently testing a stale
 * or absent artifact.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    viewport: { width: 1280, height: 812 },
  },
  webServer: {
    command: "npm run start -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: "chromium" }],
});
