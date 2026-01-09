import Link from "next/link";
import { FunGame } from "@/components/fun/FunGame";

export default function FunPage() {
  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-white">
      {/* Sticky Back Home (no header) */}
      <div className="pointer-events-none absolute left-4 top-4 z-50">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur hover:bg-white"
        >
          ← Back Home
        </Link>
      </div>

      {/* Instruction bar */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2">
        <div className="rounded-full border border-zinc-300 bg-white/85 px-4 py-2 text-xs text-zinc-800 shadow-sm backdrop-blur">
          Explore neighborhoods • Move: WASD/Arrow • Interact: E (near knights/kids)
        </div>
      </div>

      <FunGame />
    </main>
  );
}
