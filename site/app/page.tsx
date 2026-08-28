import { FloatingPill } from "@/components/nav/FloatingPill";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { SelectedWork } from "@/components/work/SelectedWork";
import { Research } from "@/components/research/Research";
import { Experiments } from "@/components/experiments/Experiments";
import { Skills } from "@/components/skills/Skills";
import { Achievements } from "@/components/achievements/Achievements";
import { Writing } from "@/components/writing/Writing";
import { Contact } from "@/components/contact/Contact";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { AuroraVeil } from "@/components/atmosphere/AuroraVeil";

export default function Page() {
  return (
    <SmoothScroll>
      <FloatingPill />
      <AuroraVeil />
      <main id="main">
        <Hero />
        <About />
        <SelectedWork />
        <Research />
        <Experiments />
        <Skills />
        <Achievements />
        <Writing />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
