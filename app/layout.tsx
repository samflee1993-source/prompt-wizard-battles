import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Cinzel, Libre_Baskerville, Outfit } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prompt Wizard Battles",
    template: "%s · Prompt Wizard Battles",
  },
  description:
    "Two wizards. One before-image. One riddle. Parallel spells, scored half by match and half by a snarky judge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${outfit.variable} ${serif.variable}`}
    >
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="app-frame">
          <nav className="top-nav">
            <Link href="/" className="brand">
              Prompt Wizard Battles
            </Link>
            <span className="poc-chip">POC</span>
          </nav>
          <main id="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
