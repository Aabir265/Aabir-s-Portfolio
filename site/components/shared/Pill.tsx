import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "default" | "outline";
};

export function Pill({ children, variant = "default" }: Props) {
  return (
    <span
      className="mono"
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-mono-label)",
        letterSpacing: "0.06em",
        backgroundColor:
          variant === "outline" ? "transparent" : "var(--color-surface-soft)",
        border:
          variant === "outline"
            ? "1px solid var(--color-hairline)"
            : "1px solid transparent",
        color: "var(--color-ink-soft)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
