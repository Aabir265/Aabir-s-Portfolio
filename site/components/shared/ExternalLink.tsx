import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  showArrow?: boolean;
};

export function ExternalLink({
  href,
  children,
  className = "",
  showArrow = true,
}: Props) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`link-underline ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4em",
        color: "var(--color-ink)",
        fontWeight: 500,
      }}
    >
      <span>{children}</span>
      {showArrow && (
        <span aria-hidden="true" style={{ fontSize: "0.9em" }}>
          ↗
        </span>
      )}
    </a>
  );
}
