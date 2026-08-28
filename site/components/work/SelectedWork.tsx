import { site } from "@/lib/site";
import { Section } from "@/components/shared/Section";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { Pill } from "@/components/shared/Pill";
import { ExternalLink } from "@/components/shared/ExternalLink";
import { ProjectVisual } from "./ProjectVisual";
import { TiltVisual } from "./TiltVisual";
import { RevealOnView } from "@/components/motion/RevealOnView";

export function SelectedWork() {
  const { projects } = site;

  return (
    <Section
      id="work"
      eyebrow="Selected Work"
      title={
        <>
          Things I have built, in the order <em className="display-italic">they mattered</em>.
        </>
      }
    >
      <div>
        {projects.map((project, i) => {
          // First Source link, if any, becomes the primary click target
          const sourceLink = project.links.find((l) => l.label === "Source");
          const primaryHref = sourceLink?.href ?? project.links[0]?.href;
          return (
            <RevealOnView key={project.id} delay={i * 0.05} y={32}>
              <article
                className="group relative"
                role="article"
                aria-label={project.title}
                style={{
                  borderTop: i === 0 ? "1px solid var(--color-hairline)" : "none",
                  borderBottom: "1px solid var(--color-hairline)",
                }}
              >
                {/* hairline thickening on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 right-0 -bottom-px h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ backgroundColor: "var(--color-ink)" }}
                />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 lg:py-14">
                  {/* Left: number, year, category */}
                  <div className="lg:col-span-2 flex lg:flex-col gap-4 lg:gap-2">
                    <MonoLabel variant="muted">{project.number}</MonoLabel>
                    <MonoLabel variant="faint">{project.year}</MonoLabel>
                    <MonoLabel variant="faint">{project.category}</MonoLabel>
                  </div>

                  {/* Center: title, description, stack, links */}
                  <div className="lg:col-span-6">
                    <h3
                      className="font-display text-ink"
                      style={{
                        fontSize: "clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)",
                        fontWeight: 400,
                        letterSpacing: "-0.025em",
                        lineHeight: 1.1,
                        marginBottom: "0.75rem",
                      }}
                    >
                      {primaryHref ? (
                        <a
                          href={primaryHref}
                          target={primaryHref.startsWith("http") ? "_blank" : undefined}
                          rel={primaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="link-underline"
                        >
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>
                    <p
                      className="text-ink-soft mb-6"
                      style={{
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        maxWidth: "50ch",
                      }}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.stack.map((s) => (
                        <Pill key={s}>{s}</Pill>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-6">
                      {project.links.map((link) => (
                        <ExternalLink
                          key={link.href}
                          href={link.href}
                          showArrow={link.label === "Source"}
                        >
                          {link.label}
                        </ExternalLink>
                      ))}
                    </div>
                  </div>

                  {/* Right: visual with fig. caption */}
                  <div className="lg:col-span-4">
                    <TiltVisual
                      maxTilt={5}
                      className="transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_4px_24px_rgba(15,15,14,0.06),0_1px_0_rgba(124,108,255,0.04)]"
                    >
                      <ProjectVisual type={project.visual} />
                    </TiltVisual>
                    <div
                      className="mt-3 mono"
                      style={{
                        fontSize: "var(--text-mono-label)",
                        color: "var(--color-ink-faint)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      fig. {String(i + 1).padStart(2, "0")} - {project.category.toLowerCase()}
                    </div>
                  </div>
                </div>
              </article>
            </RevealOnView>
          );
        })}
      </div>
    </Section>
  );
}
