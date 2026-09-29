import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * The render suite. The data and design suites are untouched and still run on
 * `node:test` via `npm test`.
 *
 * Two runners, deliberately, and the split is by what each is good at:
 *
 *  - `node:test` (`npm test`) — the data module, the tiers, and the design
 *    guards that read source text. It needs no transform, so it stayed
 *    dependency-free for the whole history of this project.
 *  - `vitest` (`npm run test:render`) — the only way to put a component in a
 *    DOM. It brings a JSX transform and a DOM, which `node:test` cannot do
 *    without two dependencies that would have been paid for by every suite
 *    whether or not it rendered anything.
 *
 * So the cost is scoped: the render layer is opt-in, and a data or guard
 * regression is still caught by the zero-dependency gate in well under a
 * second.
 *
 * `globals: false` and explicit imports everywhere. The existing suites use
 * `node:test`'s injected `test`/`assert`; sharing the word `test` across two
 * runners in one repo is a reliable source of confusion.
 *
 * `alias` is required because components import through the `@/` prefix, which
 * is a `tsconfig.json` path mapping that Vite does not read.
 *
 * No `@vitejs/plugin-react`. Its only jobs are Fast Refresh, which is a dev
 * server concern, and JSX, which esbuild already does from `tsconfig.json`'s
 * `"jsx": "react-jsx"`. Installing it would add a dependency whose newest
 * release wants a Vite major this Vitest does not ship, purely to configure
 * something that already works.
 */
export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    include: ["tests/render/**/*.test.tsx"],
    // Framer animates on mount. Assertions that care about the settled state
    // wait for it explicitly; this only keeps unhandled act() noise down.
    globals: false,
    setupFiles: ["./tests/render/setup.ts"],
  },
});
