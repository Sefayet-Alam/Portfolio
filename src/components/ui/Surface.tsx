import type { ReactNode } from "react";

export function Surface({
  children,
  as: Tag = "div",
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  as?: "div" | "article" | "section";
  className?: string;
  interactive?: boolean;
}) {
  return (
    <Tag
      className={[
        "surface-shell",
        interactive ? "surface-interactive" : "",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
