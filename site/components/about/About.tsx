import { site } from "@/lib/site";
import { Section } from "@/components/shared/Section";
import { Pill } from "@/components/shared/Pill";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Hairline } from "@/components/shared/Hairline";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { AboutScene } from "./AboutScene";

function getOrdinalSuffix(n: number): string {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function About() {
  const { about, owner } = site;

  return (
    <Section
      id="about"
      eyebrow="About"
      variant="dark"
      className="relative"
    >
      {/* Full-screen 3D background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <AboutScene className="w-full h-full" />
      </div>

      {/* Subtle dark overlay for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(10,10,20,0.6) 0%, rgba(10,10,20,0.4) 50%, rgba(10,10,20,0.7) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Text content - positioned over the 3D scene */}
      <div
        className="relative"
        style={{ zIndex: 2, minHeight: "100vh" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* --- Text column: headline + paragraphs + facts + focus + currently --- */}
          <div className="lg:col-span-7 max-w-[64ch]">
            <RevealOnView>
              <h2
                className="display-italic"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h1)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  fontWeight: 400,
                  color: "var(--color-on-deep)",
                  marginBottom: "2.5rem",
                }}
              >
                I build AI systems
                <br />
                and study
                <br />
                what they learn.
              </h2>
            </RevealOnView>

            <RevealOnView delay={0.05}>
              <div className="space-y-6 mb-14">
                {about.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: "1.125rem",
                      lineHeight: 1.65,
                      color: "var(--color-on-deep-soft)",
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </RevealOnView>

            <div
              className="mb-10"
              style={{
                height: "1px",
                background: "var(--color-deep-hairline)",
                width: "100%",
              }}
            />

            <RevealOnView delay={0.1}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8 mb-14">
                <FactRow label="Education" value={owner.education} />
                <FactRow
                  label="Year"
                  value={`${owner.currentYear}${getOrdinalSuffix(owner.currentYear)} Year`}
                  sub={`B.Tech ${owner.graduationYear}`}
                />
                <FactRow label="Location" value={owner.location} />
                <FactRow label="Email" value={owner.email} mono />
              </div>
            </RevealOnView>

            <div
              className="mb-10"
              style={{
                height: "1px",
                background: "var(--color-deep-hairline)",
                width: "100%",
              }}
            />

            <RevealOnView delay={0.2}>
              <MonoLabel
                style={{
                  color: "var(--color-on-deep-faint)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-mono-label)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "1rem",
                }}
              >
                Current Focus
              </MonoLabel>
              <div className="flex flex-wrap gap-2">
                {about.focus.map((f) => (
                  <Pill key={f}>{f}</Pill>
                ))}
              </div>
            </RevealOnView>

            <div
              className="mb-10 mt-12"
              style={{
                height: "1px",
                background: "var(--color-deep-hairline)",
                width: "100%",
              }}
            />

            <RevealOnView delay={0.3}>
              <div
                role="note"
                aria-label="Currently"
                className="flex flex-wrap items-center gap-x-3 gap-y-2"
              >
                <span
                  className="relative flex items-center justify-center"
                  style={{ width: "10px", height: "10px" }}
                  aria-hidden="true"
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-accent-violet)",
                      boxShadow: "0 0 12px rgba(124,108,255,0.6)",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      backgroundColor: "var(--color-accent-violet)",
                      opacity: 0.4,
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  />
                </span>
                <MonoLabel
                  style={{
                    color: "var(--color-on-deep-faint)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono-label)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Currently
                </MonoLabel>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-on-deep-soft)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Reading ML papers, building LLMs, shipping this site
                </span>
              </div>
            </RevealOnView>
          </div>

          {/* --- Caption for the 3D scene --- */}
          <div className="lg:col-span-5">
            <RevealOnView delay={0.1} y={24}>
              <div
                className="lg:sticky lg:top-24"
                style={{ minHeight: "360px" }}
              >
                <div
                  className="mt-3"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-mono-label)",
                    color: "var(--color-on-deep-faint)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  fig. — AI artifact
                </div>
              </div>
            </RevealOnView>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FactRow({
  label,
  value,
  sub,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <MonoLabel
        style={{
          color: "var(--color-on-deep-faint)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-mono-label)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "0.375rem",
        }}
      >
        {label}
      </MonoLabel>
      <div
        className={mono ? "mono" : ""}
        style={{
          fontFamily: mono ? "var(--font-mono)" : "var(--font-display)",
          fontSize: "1rem",
          color: "var(--color-on-deep)",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          className="mono"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--color-on-deep-faint)",
            marginTop: "0.25rem",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
