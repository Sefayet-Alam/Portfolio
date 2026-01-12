import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import { BackgroundFx } from "@/components/ui/BackgroundFx";
import { CursorFx } from "@/components/ui/CursorFx";
import { ChatWidgetGate } from "@/components/ui/ChatWidgetGate";

export const metadata: Metadata = {
  title: "Sefayet-Alam",
  description: "Full-Stack Developer (MERN) • Flutter • Competitive Programmer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundFx />
          <CursorFx />
          <ChatWidgetGate />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
