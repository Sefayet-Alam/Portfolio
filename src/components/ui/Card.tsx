import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      {children}
    </div>
  );
}
