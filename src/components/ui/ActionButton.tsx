import type { ReactNode } from "react";

export type ActionVariant = "primary" | "secondary" | "quiet";

export function actionClassName(
  variant: ActionVariant = "secondary",
  className = "",
) {
  return `action-control action-${variant} ${className}`.trim();
}

export function ActionLink({
  href,
  children,
  variant = "secondary",
  className = "",
  external = false,
  label,
}: {
  href: string;
  children: ReactNode;
  variant?: ActionVariant;
  className?: string;
  external?: boolean;
  label?: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={actionClassName(variant, className)}
      {...(external
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
    >
      {children}
    </a>
  );
}
