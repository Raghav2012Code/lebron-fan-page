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
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
