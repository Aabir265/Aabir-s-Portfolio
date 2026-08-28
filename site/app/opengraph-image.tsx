import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Aabir Sharma - AI/ML Engineer in Progress";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f7f6f3",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 14,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#787774",
            display: "flex",
            gap: 16,
          }}
        >
          <span>Aabir Sharma</span>
          <span style={{ color: "#a8a6a0" }}>·</span>
          <span>TIET</span>
          <span style={{ color: "#a8a6a0" }}>·</span>
          <span>2026</span>
        </div>

        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 88,
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#0f0f0e",
            maxWidth: 980,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>I build AI systems</span>
          <span>
            and study <span style={{ fontStyle: "italic" }}>what they learn</span>.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontFamily: "system-ui",
              fontSize: 22,
              color: "#2a2926",
              maxWidth: 600,
              lineHeight: 1.4,
            }}
          >
            Computer engineering undergraduate. Machine learning, generative
            models, and the math underneath them.
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 13,
              color: "#787774",
              letterSpacing: "0.05em",
            }}
          >
            aabirsharma.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
