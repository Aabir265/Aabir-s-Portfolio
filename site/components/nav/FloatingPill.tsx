"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MagneticLink } from "./MagneticLink";

export function FloatingPill() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["work", "research", "experiments", "about", "writing", "contact", "skills", "achievements"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the section closest to the top of the viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const navItems = [
    { label: "Work", href: "#work" },
    { label: "Research", href: "#research" },
    { label: "Experiments", href: "#experiments" },
    { label: "About", href: "#about" },
    { label: "Writing", href: "#writing" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed top-5 left-1/2 z-50 -translate-x-1/2"
        style={{
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          className="flex items-center gap-1 rounded-full backdrop-blur-sm"
          style={{
            backgroundColor: scrolled
              ? "rgba(247,246,243,0.95)"
              : "rgba(247,246,243,0.7)",
            border: "1px solid var(--color-hairline)",
            padding: scrolled ? "6px 8px" : "10px 14px",
            boxShadow: "none",
          }}
        >
          <Link
            href="#"
            className="font-display text-xl font-normal text-ink leading-none mx-1"
            style={{ letterSpacing: "-0.02em" }}
          >
            AS
          </Link>
          <div
            style={{ width: "1px", height: "14px", background: "var(--color-hairline)" }}
          />
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <div
                  key={item.href}
                  className="relative group"
                >
                  <MagneticLink
                    href={item.href}
                    className={`mono px-2.5 py-1 text-xs tracking-[0.08em] uppercase transition-colors duration-200 ${
                      isActive ? "text-ink font-medium" : "text-ink-muted hover:text-ink"
                    }`}
                    isActive={isActive}
                    aria-current={isActive ? "location" : undefined}
                  >
                    {item.label}
                  </MagneticLink>
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-px bg-ink origin-left transition-transform duration-300 pointer-events-none ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            className="md:hidden p-1.5 text-ink hover:text-ink-soft transition-colors"
          >
            <span
              className="block w-4 h-px bg-current mb-0.5"
              style={{
                transform: menuOpen ? "rotate(45deg) translateY(2.5px)" : "none",
                transition: "transform 0.3s ease",
              }}
            />
            <span
              className="block w-4 h-px bg-current"
              style={{
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
            <span
              className="block w-4 h-px bg-current mt-0.5"
              style={{
                transform: menuOpen ? "rotate(-45deg) translateY(-2.5px)" : "none",
                transition: "transform 0.3s ease",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen sheet */}
      <div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      >
        <div
          className="absolute inset-0 bg-ink/10 backdrop-blur-md"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className="absolute top-24 left-0 right-0 bg-canvas/95 backdrop-blur-xl"
          style={{
            padding: "3rem 1.5rem",
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
            transform: menuOpen ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          <div className="flex flex-col gap-2 max-w-xs mx-auto">
            {navItems.map((item, i) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`mono text-sm tracking-[0.12em] uppercase py-3 border-b border-hairline transition-colors ${
                    isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                  style={{
                    animationDelay: `${i * 60}ms`,
                    animation: menuOpen ? "fadeSlideIn 0.3s ease forwards" : "none",
                    opacity: 0,
                  }}
                  aria-current={isActive ? "location" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
