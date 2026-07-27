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
        "Hi — I'm Sef-AI-yet. Ask recruiter questions about Sefayet (skills, projects, achievements, experience, salary).",
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-chat", onOpen as EventListener);
    return () =>
      window.removeEventListener("open-chat", onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
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
          {
            role: "assistant",
            content: `Error: ${data?.error || "Request failed"}`,
          },
        ]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed";
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Error: ${message}` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {/* Bubble */}
      {!open && (
        <button
          type="button"
          aria-label="Open AI chat"
          onClick={() => setOpen(true)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-accent text-accent-ink shadow-[0_18px_45px_var(--accent-soft)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_24px_55px_var(--accent-soft)]"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="w-[calc(100vw-40px)] max-w-[390px] overflow-hidden rounded-[22px] border border-rule bg-raised shadow-[var(--shadow-lift)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rule px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-medium uppercase tracking-[0.14em] text-ink">
                Sef-AI-yet
              </p>
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Recruiter assistant
              </p>
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rule bg-surface text-ink transition-[transform,color,background-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-soft hover:text-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="max-h-[55vh] space-y-3 overflow-auto px-4 py-4"
          >
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-lg border border-rule bg-surface/60 px-3 py-1.5 text-left font-mono text-[10px] text-muted transition-[transform,color,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-rule-strong hover:bg-accent-soft hover:text-ink"
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
                    ? "ml-auto bg-accent text-accent-ink"
                    : "mr-auto border border-rule bg-surface/55 text-ink",
                ].join(" ")}
              >
                {m.content}
              </div>
            ))}

            {busy && (
              <div className="mr-auto w-fit rounded-xl border border-rule bg-surface/55 px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted">
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
            className="flex items-center gap-2 border-t border-rule px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, projects, salary…"
              className="h-11 flex-1 rounded-xl border border-rule bg-surface px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-accent"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-rule bg-accent text-accent-ink transition-[transform,opacity] duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
