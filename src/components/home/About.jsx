import { Gem, Globe2, Layers, Mountain } from "lucide-react";

import { Reveal } from "@/components/layout/Reveal";
import quarry from "@/assets/quarry.jpg";

const stats = [
  { icon: Mountain, title: "Captive Mining Operations", text: "Rough blocks from our own quarry" },
  { icon: Gem, title: "3 Premium Varieties", text: "Black Galaxy, Steel Grey, Black Pearl" },
  { icon: Globe2, title: "Domestic & Export Reach", text: "Supplying India and overseas markets" },
  { icon: Layers, title: "Quarry-to-Market Model", text: "One chain, block to polished slab" },
];

export function About() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Who We Are</p>
          <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
            A granite business that begins at the rock face
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              SSG Granites is a granite processing and trading enterprise backed by its own mining
              operations. We draw Black Galaxy rough blocks from our captive mine and convert them
              into cut and polished slabs for buyers in domestic and international markets.
            </p>
            <p>
              Alongside Black Galaxy, we supply Steel Grey and Black Pearl — stones from the same
              broader granite family that naturally complement our primary offering.
            </p>
            <p>
              Our work spans raw-block sourcing, processing, cutting, polishing, finishing, quality
              selection, domestic distribution and exports. Running that full chain ourselves gives
              us real control over raw-material supply, processing quality and product consistency.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative">
            <img
              src={quarry}
              alt="SSG Granites captive black granite quarry"
              loading="lazy"
              width={1280}
              height={960}
              className="w-full object-cover"
            />
            <div className="absolute -bottom-6 -left-6 hidden border-l-2 border-primary bg-background p-6 shadow-sm lg:block">
              <p className="font-display text-3xl text-foreground">Captive</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Mine ownership
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-20 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.title} delay={i * 80}>
            <div className="h-full bg-background p-8">
              <s.icon className="size-7 text-primary" strokeWidth={1.4} />
              <h3 className="mt-5 text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
