"use client";

import dynamic from "next/dynamic";

const FunGame = dynamic(() => import("@/components/fun/FunGame"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[100svh] w-full place-items-center">
      <div className="border border-rule bg-raised px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-muted">
        Loading village…
      </div>
    </div>
  ),
});

export default function FunGameClient() {
  return <FunGame />;
}
