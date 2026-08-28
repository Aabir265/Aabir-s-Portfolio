"use client";

import dynamic from "next/dynamic";
import { Section } from "@/components/shared/Section";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Hairline } from "@/components/shared/Hairline";
import { Pill } from "@/components/shared/Pill";
import { site } from "@/lib/site";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { useState } from "react";

const ManifoldScene = dynamic(
  () => import("@/components/3d/ManifoldScene").then((m) => m.ManifoldScene),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

export function Research() {
  const { research } = site;

  return (
    <Section
      id="research"
      eyebrow="Research"
      title={
        <>
          Papers I have presented, in the order <em className="display-italic">they shipped</em>.
        </>
      }
      variant="dark"
    >
      <RevealOnView>
        <div
          className="relative w-full mb-16"
          style={{ aspectRatio: "16 / 9" }}
          aria-label="3D probability manifold visualizing research concepts"
          role="img"
        >
          <div className="absolute inset-0">
            <ManifoldScene />
          </div>
          <div
            className="absolute bottom-2 left-0 right-0 text-center mono"
            style={{
              fontSize: "var(--text-mono-label)",
              color: "var(--color-on-dark-faint)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            fig. 02 - a loss surface, with research points
          </div>
        </div>
      </RevealOnView>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {research.map((paper, i) => (
          <RevealOnView key={paper.id} delay={i * 0.08} y={24}>
            <PaperPlate paper={paper} />
          </RevealOnView>
        ))}
      </div>
    </Section>
  );
}

type Paper = (typeof site.research)[number];

function PaperPlate({ paper }: { paper: Paper }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCite = () => {
    const bibtex = `@misc{sharma${paper.date.slice(0, 4)}${paper.id},
  title = {${paper.title}},
  author = {Sharma, Aabir},
  year = {${paper.date.slice(0, 4)}},
  note = {${paper.venue}, ${paper.host}, ${paper.dateLabel}}
}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(bibtex).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "6px",
        background: hovered
          ? "linear-gradient(135deg, rgba(124,108,255,0.08) 0%, rgba(17,18,31,1) 100%)"
          : "var(--color-deep-3)",
        borderRadius: "calc(var(--radius-lg) + 4px)",
        transition: "background 0.4s ease",
        boxShadow: hovered
          ? "0 0 0 1px rgba(124,108,255,0.25), 0 8px 32px rgba(124,108,255,0.12), 0 2px 8px rgba(0,0,0,0.4)"
          : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div
        className="relative transition-all duration-300"
        style={{
          padding: "1.75rem",
          background: hovered
            ? "linear-gradient(135deg, var(--color-deep-2) 0%, var(--color-deep-3) 100%)"
            : "var(--color-deep-2)",
          borderRadius: "var(--radius-lg)",
          border: `1px solid ${hovered ? "rgba(124,108,255,0.25)" : "var(--color-deep-hairline)"}`,
          transition: "border-color 0.3s ease, background 0.3s ease",
        }}
      >
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <MonoLabel variant="dark-soft">
            {paper.number} · {paper.dateLabel}
          </MonoLabel>
          {paper.funding && (
            <Pill variant="outline">{paper.funding}</Pill>
          )}
        </div>

        <h3
          className="font-display mb-4 link-underline"
          style={{
            fontSize: "1.25rem",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "var(--color-on-deep)",
            cursor: "default",
          }}
        >
          {paper.title}
        </h3>

        <div
          className="mb-4"
          style={{
            fontSize: "0.875rem",
            color: "var(--color-on-deep-soft)",
            lineHeight: 1.5,
          }}
        >
          <div>{paper.venue}</div>
          <div className="mono mt-1" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
            {paper.host}
          </div>
        </div>

        <p
          className="transition-all duration-300"
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.55,
            color: "var(--color-on-deep)",
            opacity: hovered ? 1 : 0.82,
            marginBottom: "1.5rem",
          }}
        >
          {paper.takeaway}
        </p>

        <div className="flex items-center gap-6">
          <button
            onClick={handleCite}
            className="mono"
            aria-label="Copy citation to clipboard"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: hovered ? "var(--color-accent-muted)" : "var(--color-on-deep-soft)",
              padding: "6px 12px",
              border: "1px solid rgba(124,108,255,0.2)",
              borderRadius: "var(--radius-pill)",
              background: hovered ? "rgba(124,108,255,0.06)" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? "Copied" : "Cite"}
          </button>
          <time
            dateTime={paper.date}
            className="mono"
            style={{
              fontSize: "0.6875rem",
              color: "var(--color-on-deep-faint)",
              letterSpacing: "0.08em",
            }}
          >
            presented {paper.dateLabel}
          </time>
        </div>
      </div>
    </article>
  );
}
