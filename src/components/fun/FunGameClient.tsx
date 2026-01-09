"use client";

import dynamic from "next/dynamic";

const FunGame = dynamic(() => import("@/components/fun/FunGame"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[100svh] w-full place-items-center">
      <div className="rounded-2xl border border-zinc-200 bg-white/70 px-5 py-3 text-sm text-zinc-700 shadow-sm backdrop-blur">
        Loading village…
      </div>
    </div>
  ),
});

export default function FunGameClient() {
  return <FunGame />;
}
