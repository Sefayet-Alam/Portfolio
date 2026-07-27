import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import { Stage } from "@/components/layout/Stage";
import { CursorFx } from "@/components/ui/CursorFx";
import { ChatWidgetGate } from "@/components/ui/ChatWidgetGate";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollRefresher } from "@/components/motion/ScrollRefresher";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sefayet-Alam",
  description: "Full-Stack Developer (MERN) • Flutter • Competitive Programmer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${mono.variable} ${sans.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-surface font-sans text-ink"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll />
          <ScrollRefresher />

          {/* z-0 — decorative 3D only */}
          <Stage />

          {/* z-10 — page content, never inside a perspective context */}
          <div className="layer-content">{children}</div>

          {/* z-50 — fixed/sticky UI, siblings of the stage */}
          <div className="layer-chrome">
            <CursorFx />
            <ChatWidgetGate />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
