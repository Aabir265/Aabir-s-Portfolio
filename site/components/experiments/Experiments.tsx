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

        {/* Block 2: competitive programming profiles */}
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
            <div className="flex flex-wrap gap-2">
              {experiments.competitiveProgramming.profiles.map((profile) => (
                <a
                  key={profile.name}
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border transition-all duration-200 hover:bg-opacity-5 hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
                  style={{
                    padding: "8px 14px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--color-ink)",
                    borderColor: "var(--color-hairline)",
                    backgroundColor: "var(--color-surface-soft)",
                  }}
                >
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mono"
                  >
                    {profile.brand === "codechef"
                      ? `
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 12 12 12 2 7.477 2 12s4.477 10 10 10zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                    `
                      : `
                    <path d="M17.65 13.1l1.66-1.66a2.93 2.93 0 0 1-1.07 2.17l-2.31 2.05-2.22-2.22a2.93 2.93 0 0 1 0-4.22l1.19-1.19a2.93 2.93 0 0 1 2.18-.98l1.75 1.75a2.93 2.93 0 0 1 2.93 0l1.76-1.76a2.93 2.93 0 0 1-.99 2.16zM7.39 19.56a2.93 2.93 0 0 1 0-4.22l1.19-1.19a2.93 2.93 0 0 1 2.18-.98l1.76 1.76a2.93 2.93 0 0 1-.98 2.17l-1.52 1.4l.91 2.07a2.93 2.93 0 0 1-2.81.88l-2.24-1.25a2.93 2.93 0 0 1-2.36-2.16l-1.26 2.22a2.93 2.93 0 0 1 .67 3.05l.86.64a2.93 2.93 0 0 1 1.35.31l.85-.63a2.93 2.93 0 0 1 2.19-.97l1.66 1.66zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                    `
                  }
                </svg>
                  <span className="mono">{profile.name}</span>
                  <span className="mono ml-1">{profile.handle}</span>
                </a>
              ))}
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
