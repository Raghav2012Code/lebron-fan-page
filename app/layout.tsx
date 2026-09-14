import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import "./globals.css";

/**
 * One display family taken to two width extremes, so `wdth` is loaded as an
 * extra variable axis alongside weight. Newsreader carries the reading copy
 * and brings its optical-size axis with it.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
