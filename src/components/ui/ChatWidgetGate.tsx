// src/components/ui/ChatWidgetGate.tsx
"use client";

import { usePathname } from "next/navigation";
import { ChatWidget } from "@/components/ui/ChatWidget";

export function ChatWidgetGate() {
  const pathname = usePathname();

  // Hide on fun site routes (and any nested fun routes)
  if (pathname?.startsWith("/fun")) return null;

  return <ChatWidget />;
}
