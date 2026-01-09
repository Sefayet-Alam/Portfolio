"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Give a 6-bullet summary of Sefayet",
  "What are his strongest skills?",
  "Show top achievements",
  "Best MERN project for recruiters?",
  "Expected salary (BDT)?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I’m Sef-AI-yet. Ask recruiter questions about Sefayet (skills, projects, achievements, experience, salary).",
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-chat", onOpen as any);
    return () => window.removeEventListener("open-chat", onOpen as any);
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content) return;

    setBusy(true);
    setInput("");

    const next = [...messages, { role: "user", content }] as Msg[];
    setMessages(next);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      const data = await res.json();
      if (!data?.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: `Error: ${data?.error || "Request failed"}` },
        ]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Error: ${e?.message || "Failed"}` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] md:bottom-5 md:right-5">
      {/* Bubble */}
      {!open && (
        <button
          type="button"
          aria-label="Open AI chat"
          onClick={() => setOpen(true)}
          className="group inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white/70 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:bg-zinc-900"
        >
          <MessageCircle className="h-6 w-6 text-zinc-800 dark:text-zinc-100" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="w-[calc(100vw-24px)] max-w-[380px] overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-2xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Sef-AI-yet
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                Recruiter assistant • fast answers
              </p>
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white/60 text-zinc-700 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="max-h-[55vh] space-y-3 overflow-auto px-4 py-3"
          >
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs text-zinc-700 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  {s}
                </button>
              ))}
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={[
                  "max-w-[92%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "mr-auto bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50",
                ].join(" ")}
              >
                {m.content}
              </div>
            ))}

            {busy && (
              <div className="mr-auto w-fit rounded-2xl bg-zinc-100 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                Typing…
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!busy && input.trim()) send(input);
            }}
            className="flex items-center gap-2 border-t border-zinc-200 px-3 py-3 dark:border-zinc-800"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, projects, salary…"
              className="h-10 flex-1 rounded-xl border border-zinc-200 bg-white/70 px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-700"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/70 text-zinc-900 transition hover:bg-white disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
