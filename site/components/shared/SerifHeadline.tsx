import type { ReactNode } from "react";

type Props = {
  as?: "h1" | "h2" | "h3";
  size?: "hero" | "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function SerifHeadline({
  as: Tag = "h1",
  size = "h1",
  children,
  className = "",
  style,
}: Props) {
  const sizeMap = {
    hero: "var(--text-hero)",
    h1: "var(--text-h1)",
    h2: "var(--text-h2)",
    h3: "var(--text-h3)",
  };
  return (
    <Tag
      className={className}
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 400,
        fontSize: sizeMap[size],
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
