import { site } from "@/lib/site";
import { Section } from "@/components/shared/Section";
import { MonoLabel } from "@/components/shared/MonoLabel";
import { ExternalLink } from "@/components/shared/ExternalLink";
import { RevealOnView } from "@/components/motion/RevealOnView";

export function Contact() {
  const { contact, owner } = site;

  return (
    <Section
      id="contact"
      variant="default"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <MonoLabel variant="muted">
            Contact
          </MonoLabel>
        </div>

        <div className="lg:col-span-8">
          <RevealOnView>
            <h2
              className="font-display mb-8"
              style={{
                fontSize: "clamp(2rem, 4vw + 1rem, 3.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--color-ink)",
                maxWidth: "20ch",
              }}
            >
              Get in <em className="display-italic">touch</em>.
            </h2>
          </RevealOnView>

          <RevealOnView delay={0.1}>
            <p
              className="mb-12"
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.6,
                color: "var(--color-ink-soft)",
                maxWidth: "48ch",
              }}
            >
              {contact.invitation}
            </p>
          </RevealOnView>

          <RevealOnView delay={0.2}>
            <div className="space-y-4">
              <ContactRow
                label="Email"
                value={contact.email}
                href={`mailto:${contact.email}`}
              />
              <ContactRow
                label="GitHub"
                value="github.com/Aabir265"
                href={contact.github}
              />
              <ContactRow
                label="LinkedIn"
                value="linkedin.com/in/aabir-sharma-2296b3375"
                href={contact.linkedin}
              />
            </div>
          </RevealOnView>

          <RevealOnView delay={0.3}>
            <div
              className="mt-16 pt-8 flex flex-wrap items-center justify-between gap-4"
              style={{ borderTop: "1px solid var(--color-hairline)" }}
            >
              <MonoLabel variant="muted">
                © 2026 {owner.name} · Built in Patiala
              </MonoLabel>
              <MonoLabel variant="muted">
                Last updated Aug 2026
              </MonoLabel>
            </div>
          </RevealOnView>
        </div>
      </div>
    </Section>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-baseline gap-6 py-3 transition-colors"
      style={{
        borderBottom: "1px solid var(--color-hairline)",
      }}
    >
      <MonoLabel
        variant="muted"
        className="shrink-0 w-24"
      >
        {label}
      </MonoLabel>
      <span
        className="font-mono"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "1rem",
          color: "var(--color-ink)",
        }}
      >
        {value}
      </span>
      <span
        aria-hidden="true"
        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)" }}
      >
        ↗
      </span>
    </a>
  );
}
