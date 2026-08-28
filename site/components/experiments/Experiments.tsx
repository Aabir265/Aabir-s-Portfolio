import { site } from "@/lib/site";
import { Section } from "@/components/shared/Section";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Pill } from "@/components/shared/Pill";
import { RevealOnView } from "@/components/motion/RevealOnView";

export function Experiments() {
  const { experiments } = site;

  return (
    <Section
      id="experiments"
      eyebrow="Experiments &amp; Learning"
      title={
        <>
          Side quests between the main work. The competitive programming,
          learning, and shipping record in one place.
        </>
      }
    >
      <div className="space-y-12">
        {/* Block 1: learning (pills) */}
        <RevealOnView>
          <MonoLabel variant="muted" className="block mb-3">
            Currently learning
          </MonoLabel>
          <div className="flex flex-wrap gap-2">
            {experiments.currentlyLearning.map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>
        </RevealOnView>

        {/* Block 2: competitive programming */}
        <RevealOnView delay={0.08}>
          <div
            style={{
              paddingTop: "1.25rem",
              paddingBottom: "1.25rem",
              borderTop: "1px solid var(--color-hairline-soft)",
              borderBottom: "1px solid var(--color-hairline-soft)",
            }}
          >
            <MonoLabel variant="muted" className="block mb-2">
              Competitive programming
            </MonoLabel>
            <div
              className="font-display mb-1"
              style={{
                fontSize: "1.25rem",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "var(--color-ink)",
              }}
            >
              {experiments.competitiveProgramming.platform}
            </div>
            <div
              className="text-ink-soft"
              style={{ fontSize: "0.9375rem", lineHeight: 1.55, maxWidth: "50ch" }}
            >
              {experiments.competitiveProgramming.note}
            </div>
          </div>
        </RevealOnView>

        {/* Block 3: recent activity */}
        <RevealOnView delay={0.16}>
          <MonoLabel variant="muted" className="block mb-4">
            Recent activity
          </MonoLabel>
          <ol className="space-y-2">
            {experiments.recentActivity.map((item, i) => (
              <li
                key={i}
                className="grid grid-cols-[5rem_1fr] items-baseline gap-4 py-1.5"
              >
                <MonoLabel variant="faint">{item.date}</MonoLabel>
                <span
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--color-ink-soft)",
                  }}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ol>
        </RevealOnView>
      </div>
    </Section>
  );
}
