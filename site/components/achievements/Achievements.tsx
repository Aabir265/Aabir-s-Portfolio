import { site } from "@/lib/site";
import { Section } from "@/components/shared/Section";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Hairline } from "@/components/shared/Hairline";
import { RevealOnView } from "@/components/motion/RevealOnView";

export function Achievements() {
  const { achievements } = site;

  return (
    <Section id="achievements">
      <div className="max-w-[48rem]">
        <h3
          style={{
            fontSize: "var(--text-h2)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "var(--color-ink)",
            lineHeight: 1.15,
            marginBottom: "3rem",
            fontFamily: "var(--font-display)",
          }}
        >
          Achievements
        </h3>
      </div>

      <div className="space-y-1">
        {achievements.map((item, i) => (
          <RevealOnView key={item.date} delay={i * 0.06}>
            <article className="py-6 lg:py-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
                <div className="md:col-span-3">
                  <MonoLabel variant="faint">{item.dateLabel}</MonoLabel>
                </div>
                <div className="md:col-span-9">
                  <h4
                    className="font-display"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      color: "var(--color-ink)",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-ink-soft"
                    style={{ fontSize: "0.9375rem", lineHeight: 1.5, marginTop: "0.25rem" }}
                  >
                    {item.detail}
                  </p>
                </div>
              </div>
              {i < achievements.length - 1 && <Hairline className="mt-6 lg:mt-8" />}
            </article>
          </RevealOnView>
        ))}
      </div>
    </Section>
  );
}
