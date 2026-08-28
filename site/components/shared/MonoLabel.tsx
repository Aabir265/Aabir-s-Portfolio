import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "span" | "div" | "time";
  dateTime?: string;
  variant?: "default" | "muted" | "faint" | "dark-soft" | "dark-faint";
};

export function MonoLabel({
  children,
  className = "",
  as: Tag = "span",
  dateTime,
  variant = "default",
}: Props) {
  const colors = {
    default: "var(--color-ink-soft)",
    muted: "var(--color-ink-muted)",
    faint: "var(--color-ink-faint)",
    "dark-soft": "var(--color-on-dark-soft)",
    "dark-faint": "var(--color-on-dark-faint)",
  };
  return (
    <Tag
      {...(dateTime ? { dateTime } : {})}
      className={`mono ${className}`}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-mono-meta)",
        letterSpacing: "0.04em",
        color: colors[variant],
        textTransform: "uppercase",
      }}
    >
      {children}
    </Tag>
  );
}
