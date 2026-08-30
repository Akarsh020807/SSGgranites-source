import { BadgeCheck, Mountain, Scissors, Ship, Sparkles } from "lucide-react";

import { Reveal } from "@/components/layout/Reveal";

const steps = [
  { icon: Mountain, title: "Mining & Block Sourcing", text: "Rough blocks extracted at our own mine." },
  { icon: Scissors, title: "Cutting & Processing", text: "Blocks sized and sawn into slabs in-house." },
  { icon: Sparkles, title: "Polishing & Finishing", text: "Polished, honed, leathered or flamed." },
  { icon: BadgeCheck, title: "Quality Selection", text: "Slabs graded for colour and consistency." },
  { icon: Ship, title: "Distribution & Export", text: "Packed and shipped domestic or overseas." },
];

export function Process() {
  return (
    <section className="bg-secondary py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">From Mine to Market</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Our Integrated Process</h2>
          <p className="mt-4 text-base text-muted-foreground">
            Five stages, one company. Nothing leaves our hands between the quarry bench and the
            container.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 90}>
              <div className="group h-full border border-border bg-background p-7 transition-colors hover:border-primary">
                <div className="flex items-center justify-between">
                  <step.icon className="size-6 text-primary" strokeWidth={1.4} />
                  <span className="font-display text-3xl text-border transition-colors group-hover:text-primary">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg leading-snug">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
