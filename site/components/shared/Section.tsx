import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  children: ReactNode;
  variant?: "default" | "dark";
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  children,
  variant = "default",
  className = "",
}: Props) {
  const isDark = variant === "dark";
  return (
    <section
      id={id}
      className={`relative ${className} ${isDark ? "section-dark" : ""}`}
      style={{
        backgroundColor: isDark ? "var(--color-deep)" : "transparent",
        color: isDark ? "var(--color-on-deep)" : "var(--color-ink)",
      }}
    >
      {isDark && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "var(--grad-deep-violet)",
              zIndex: 0,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, var(--grad-deep-top-accent), transparent 30%, transparent 70%, var(--grad-deep-bottom-accent))",
              zIndex: 0,
            }}
          />
          <div
            aria-hidden="true"
            className="section-fade-top"
            style={{ zIndex: 2 }}
          />
          <div
            aria-hidden="true"
            className="section-fade-bottom"
            style={{ zIndex: 2 }}
          />
        </>
      )}
      <div
        className="container-wide relative"
        style={{
          paddingBlock: "var(--spacing-section)",
          zIndex: 1,
        }}
      >
        {(eyebrow || title) && (
          <header className="mb-10 md:mb-12">
            {eyebrow && (
              <div
                className="eyebrow mb-4"
                style={{
                  color: isDark
                    ? "var(--color-on-dark-soft)"
                    : "var(--color-ink-muted)",
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <h2
                style={{
                  fontSize: "var(--text-h1)",
                  maxWidth: "20ch",
                  color: isDark ? "var(--color-on-dark)" : "var(--color-ink)",
                }}
              >
                {title}
              </h2>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
