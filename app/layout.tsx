import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Cinzel, Fredoka, Outfit } from "next/font/google";
import "./globals.css";

const display = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const ui = Outfit({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const spell = Cinzel({
  subsets: ["latin"],
  variable: "--font-spell",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Prompt Wizard Battles",
    template: "%s · Prompt Wizard Battles",
  },
  description:
    "Duel with prompts. Laugh at the verdict. You are Nova Shipwright; Synergy is a pretend rival. One spell, 90s clock, half-deterministic score.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable} ${spell.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link href="/" className="logo">
            Prompt <span>Wizard</span> Battles
          </Link>
          <Link href="/duel" className="nav-cta">
            Enter the Arena
          </Link>
        </header>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
