"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { site } from "@/lib/site";
import { MonoLabel } from "@/components/shared/MonoLabel";

const HeroScene = dynamic(
  () => import("@/components/3d/HeroScene").then((m) => m.HeroScene),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

export function Hero() {
  const reduce = useReducedMotion();
  const { hero, owner } = site;

  return (
    <section
      className="hero-stage relative min-h-[100dvh] flex items-center"
      style={{
        paddingTop: "8rem",
        paddingBottom: "4rem",
        backgroundColor: "var(--color-ivory-top)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "var(--grad-deep-violet)",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="section-fade-bottom"
        style={{ zIndex: 2 }}
      />
      <div className="container-wide w-full relative" style={{ zIndex: 3 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <MonoLabel variant="muted">
                {hero.eyebrow}
              </MonoLabel>
            </motion.div>

            <h1
              className="font-display"
              style={{
                fontSize: "var(--text-hero)",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                fontWeight: 400,
                marginBottom: "1.5rem",
                color: "var(--color-ink)",
              }}
            >
              <HeadlineLine text={hero.headline[0]} delay={0.25} />
              <br />
              <HeadlineLine
                text={hero.headline[1]}
                delay={0.55}
                italicPart={hero.emphasis}
              />
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.55,
                maxWidth: "32ch",
                marginBottom: "2.5rem",
                color: "var(--color-ink-soft)",
              }}
            >
              {hero.sub}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="flex flex-wrap items-center gap-6"
            >
              <DirectionalButton href={hero.cta.href}>
                {hero.cta.label}
                <span
                  aria-hidden="true"
                  className="ml-1.5 flex items-center"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3V13M8 13L4 9M8 13L12 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </DirectionalButton>
              <a
                href={`mailto:${owner.email}`}
                className="link-underline mono text-sm"
                style={{
                  letterSpacing: "0.05em",
                  color: "var(--color-ink-muted)",
                }}
              >
                {owner.email}
              </a>
            </motion.div>
          </div>

          {/* Right: 3D neural fragment */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
            aria-hidden="true"
          >
            <div
              className="relative w-full"
              style={{
                aspectRatio: "4 / 3",
                maxHeight: "60dvh",
              }}
            >
              <div className="absolute inset-0">
                <HeroScene />
              </div>
              <div
                className="absolute -bottom-2 left-0 right-0 text-center mono"
                style={{
                  fontSize: "var(--text-mono-label)",
                  color: "var(--color-ink-muted)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                fig. 01 - a learning system
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeadlineLine({
  text,
  delay,
  italicPart,
}: {
  text: string;
  delay: number;
  italicPart?: string;
}) {
  const reduce = useReducedMotion();
  if (!italicPart) {
    return (
      <span style={{ display: "inline-block", overflow: "hidden" }}>
        <motion.span
          style={{ display: "inline-block" }}
          initial={reduce ? false : { y: "110%" }}
          animate={reduce ? undefined : { y: "0%" }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.span>
      </span>
    );
  }
  const idx = text.indexOf(italicPart);
  if (idx < 0) {
    return (
      <span style={{ display: "inline-block", overflow: "hidden" }}>
        <motion.span
          style={{ display: "inline-block" }}
          initial={reduce ? false : { y: "110%" }}
          animate={reduce ? undefined : { y: "0%" }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.span>
      </span>
    );
  }
  const before = text.slice(0, idx);
  const italic = text.slice(idx, idx + italicPart.length);
  const after = text.slice(idx + italicPart.length);
  return (
    <span style={{ display: "inline-block" }}>
      <RevealChunk text={before} delay={delay} />
      <RevealChunk text={italic} delay={delay + 0.15} italic />
      <RevealChunk text={after} delay={delay + 0.3} />
    </span>
  );
}

function RevealChunk({
  text,
  delay,
  italic,
}: {
  text: string;
  delay: number;
  italic?: boolean;
}) {
  const reduce = useReducedMotion();
  if (!text) return null;
  return (
    <span style={{ display: "inline-block", overflow: "hidden" }}>
      <motion.span
        style={{
          display: "inline-block",
          fontStyle: italic ? "italic" : "normal",
        }}
        initial={reduce ? false : { y: "110%" }}
        animate={reduce ? undefined : { y: "0%" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function DirectionalButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setOffset({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseMove={handleMouseMove}
      className="group relative inline-flex items-center px-5 py-3 rounded-md overflow-hidden"
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        fontSize: "0.9375rem",
        color: "var(--color-deep)",
        backgroundColor: "var(--color-on-deep)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.08), 0 1px 0 rgba(255,255,255,0.12) inset",
        transformOrigin: `${offset.x}% ${offset.y}%`,
        transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(0.97)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(0.97)";
      }}
    >
      {children}
    </a>
  );
}
