import { site } from "@/lib/site";
import { Section } from "@/components/shared/Section";
import { Pill } from "@/components/shared/Pill";
import { RevealOnView } from "@/components/motion/RevealOnView";

export function Writing() {
  const { writing } = site;

  return (
    <Section
      id="writing"
      eyebrow="Writing"
      title={
        <>
          Working notes from research and projects. Updated when there is something to share.
        </>
      }
    >
      <div className="space-y-6">
          {writing.map((piece, i) => (
            <RevealOnView key={piece.title} delay={i * 0.08}>
              <article
                className="group p-6 lg:p-8 transition-colors"
                style={{
                  border: "1px solid var(--color-hairline)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-canvas)",
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4
                    className="font-display"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      color: "var(--color-ink)",
                      lineHeight: 1.2,
                    }}
                  >
                    {piece.title}
                  </h4>
                  <Pill>{piece.status}</Pill>
                </div>
                <p
                  className="text-ink-muted"
                  style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}
                >
                  {piece.note}
                </p>
              </article>
            </RevealOnView>
          ))}
        </div>
    </Section>
  );
}
