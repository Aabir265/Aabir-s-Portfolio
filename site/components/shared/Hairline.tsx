type Props = {
  className?: string;
  variant?: "default" | "soft" | "dark";
};

export function Hairline({ className = "", variant = "default" }: Props) {
  const color =
    variant === "soft"
      ? "var(--color-hairline-soft)"
      : variant === "dark"
        ? "var(--color-hairline-dark)"
        : "var(--color-hairline)";
  return (
    <div
      className={`hairline ${className}`}
      style={{ backgroundColor: color }}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}
