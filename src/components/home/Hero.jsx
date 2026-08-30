import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/layout/Reveal";
import heroSlabs from "@/assets/hero-slabs.jpg";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
      <img
        src={heroSlabs}
        alt="Polished Black Galaxy granite slabs in the SSG Granites warehouse"
        width={1920}
        height={1080}
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-ink/70" />
      <div className="mx-auto w-full max-w-7xl px-5 py-28 lg:px-8">
        <Reveal>
          <p className="eyebrow text-primary">Quarry Owners · Processors · Exporters</p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-background sm:text-6xl lg:text-7xl">
            SSG GRANITES
          </h1>
          <p className="mt-5 max-w-2xl font-display text-2xl text-primary sm:text-3xl">
            From Our Mine to Your Market — Premium Black Galaxy Granite
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-background/70">
            An integrated mining-to-export operation: we extract our own rough blocks, cut, polish
            and grade them in-house, and ship finished slabs to buyers across India and overseas.
          </p>
          <Link
            to="/products"
            className="mt-10 inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-brown"
          >
            Explore Our Granite
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
