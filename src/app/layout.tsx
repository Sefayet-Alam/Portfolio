import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import { SpatialField } from "@/components/layout/SpatialField";
import { CursorFx } from "@/components/ui/CursorFx";
import { ChatWidgetGate } from "@/components/ui/ChatWidgetGate";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollRefresher } from "@/components/motion/ScrollRefresher";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sefayet Alam — AI/ML Engineer & NLP Researcher",
  description:
    "AI/ML engineer and NLP researcher building grounded agentic systems, full-stack products, and research-backed software.",
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
          <SpatialField />

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
