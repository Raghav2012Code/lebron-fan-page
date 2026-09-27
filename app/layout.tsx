import type { Metadata, Viewport } from "next";
import { Oswald, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The King — an unofficial LeBron James tribute",
  description:
    "An unofficial fan tribute to LeBron James: twenty-three seasons, four titles, four MVPs, and the first forty thousand points anyone has scored.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#e9d6b0",
  colorScheme: "light",
};

/**
 * The page without JavaScript.
 *
 * Framer serialises each element's `initial` variant state into the server HTML
 * as an inline `style`. With JS on, hydration animates it away. With JS off,
 * nothing ever does — so the hidden state is simply the resting state, and the
 * measured result was that the hero was 0% visible and the document held 27,827
 * characters of which essentially none were painted. That is the opposite of
 * what `AGENTS.md` §6 promises, so the promise is kept here rather than argued
 * about.
 *
 * Why a `<noscript>` block and not more `data-reveal` attributes: the existing
 * `[data-reveal]` override lives inside `@media (prefers-reduced-motion: reduce)`,
 * and a visitor with JS blocked is not necessarily in that media query — so the
 * documented remedy structurally cannot reach the failure it was written for.
 * This block can, because a browser with scripting disabled renders its contents
 * and the `<style>` applies to the whole document.
 *
 * Why not simply `[style*="opacity:0"]`: that substring is present in all four
 * of the page's real design opacities (`0.72`, `0.45`, `0.3`, `0.14`), so it
 * would flatten them. The four selectors below anchor on a declaration boundary
 * instead — the value is exactly `opacity:0`, ends with it, is followed by a
 * semicolon, or is surrounded by them. All four positions actually occur in the
 * built HTML; the trailing-semicolon-less one is the room panels'
 * `color:#231508;opacity:0`, which is what the first attempt missed.
 *
 * Why not simply `[style*="transform:"] { transform: none }`: two elements carry
 * `translateX(-50%) translateY(-50%)` to centre themselves in an absolutely
 * positioned box, and `none` throws them to the container's top-left corner. They
 * are re-asserted after the general rule, which is why order matters below.
 *
 * The last rule is a different mechanism again. The court's six `<path>` elements
 * are drawn by animating `pathLength`, whose SSR'd initial state Framer expresses
 * as `stroke-dasharray="0 1"` — a zero-length dash, so an invisible stroke, and
 * the whole half-court disappears with JS off. `stroke-dasharray` is a
 * presentation ATTRIBUTE there, not an inline style, but any CSS rule outranks a
 * presentation attribute, so this still works. The value is matched exactly
 * because the page also draws genuinely dashed lines at `2 3` and `4 4`, and
 * those are geometry, not animation.
 *
 * The trade-off, stated plainly: the general transform rule will also flatten any
 * inline transform added in future for a reason other than animation. No such
 * transform exists today — the built HTML was enumerated exhaustively, and every
 * value is either a Framer entrance, `none`, or one of the two centring pairs.
 * `tests/design-guards.test.ts` G9 keeps this block honest against the source.
 */
const NO_SCRIPT_CSS = `
[style="opacity:0"],
[style$="opacity:0"],
[style*="opacity:0;"],
[style*=";opacity:0;"] {
  opacity: 1 !important;
}
[style*="transform:"] {
  transform: none !important;
}
[style*="translateX(-50%) translateY(-50%)"] {
  transform: translateX(-50%) translateY(-50%) !important;
}
[style*="translateX(-50%)"] {
  transform: translateX(-50%) !important;
}
[stroke-dasharray="0 1"] {
  stroke-dasharray: none !important;
}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${oswald.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <noscript
          dangerouslySetInnerHTML={{ __html: `<style>${NO_SCRIPT_CSS}</style>` }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
