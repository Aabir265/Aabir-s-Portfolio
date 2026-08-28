import { site } from "@/lib/site";
import { Section } from "@/components/shared/Section";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { RevealOnView } from "@/components/motion/RevealOnView";
import { LossCurve } from "./LossCurve";

export function Skills() {
  const { skills } = site;

  return (
    <Section
      id="skills"
      eyebrow="Skills &amp; Tools"
      title={
        <>
          A working toolkit for ML, research, and the
          {" "}<em className="display-italic">web</em> around them.
        </>
      }
    >
      <RevealOnView>
        <div
          className="mb-12 pb-10"
          style={{ borderBottom: "1px solid var(--color-hairline-soft)" }}
        >
          <LossCurve />
          <div
            className="mt-3 mono text-right"
            style={{
              fontSize: "var(--text-mono-label)",
              color: "var(--color-ink-faint)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            fig. skills — a loss landscape, sketch
          </div>
        </div>
      </RevealOnView>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
        {skills.map((group, gi) => (
          <RevealOnView key={group.group} delay={gi * 0.06}>
            <div>
              <h3
                className="font-display mb-6"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                }}
              >
                {group.group}
              </h3>
              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-baseline gap-4"
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.875rem",
                        color: "var(--color-ink)",
                        minWidth: "11rem",
                      }}
                    >
                      {item.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-ink-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnView>
        ))}
      </div>
    </Section>
  );
}
