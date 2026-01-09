import { ReactNode } from "react";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-14">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight md:text-xl">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
