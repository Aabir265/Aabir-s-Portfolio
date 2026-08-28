"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  text: string;
  italicWord?: string;
  delay?: number;
  className?: string;
};

export function WordReveal({
  text,
  italicWord,
  delay = 0,
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => {
        const isItalic = italicWord && word.includes(italicWord);
        return (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden" }}
          >
            <motion.span
              style={{
                display: "inline-block",
                paddingRight: "0.28em",
                fontStyle: isItalic ? "italic" : "normal",
              }}
              initial={reduce ? false : { y: "110%", opacity: 0 }}
              animate={reduce ? undefined : { y: "0%", opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: delay + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
              {isItalic ? "" : ""}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
