import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Ruler, Ship } from "lucide-react";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { products } from "@/lib/products";
import heroSlabs from "@/assets/hero-slabs.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Our Products — Black Galaxy, Steel Grey & Black Pearl Granite" },
      {
        name: "description",
        content:
          "Premium Black Galaxy granite plus Steel Grey and Black Pearl, processed in-house from rough block to polished slab. Finishes, applications and bulk export enquiries.",
      },
      { property: "og:title", content: "Our Products — SSG Granites" },
      {
        property: "og:description",
        content:
          "Black Galaxy, Steel Grey and Black Pearl granite slabs — polished, honed, leather and flamed finishes, direct from our own mine.",
      },
    ],
  }),
  component: Products,
});

function Tags({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i} className="border border-border bg-secondary px-3 py-1.5 text-xs">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function Products() {
  const [flagship, ...rest] = products;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden">
          <img
            src={heroSlabs}
            alt="Polished granite slabs"
            width={1920}
            height={1080}
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-ink/75" />
          <div className="mx-auto max-w-7xl px-5 py-28 lg:px-8 lg:py-36">
            <p className="eyebrow">Our Range</p>
            <h1 className="mt-4 font-display text-5xl text-background sm:text-6xl">Our Products</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/70">
              Premium Black Galaxy granite and complementary varieties, processed in-house from
              block to polished slab.
            </p>
          </div>
        </section>

        {/* Flagship */}
        <section id={flagship!.slug} className="scroll-mt-24 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <Reveal>
                <img
                  src={flagship!.image}
                  alt={flagship!.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-[28rem] w-full object-cover"
                />
              </Reveal>
              <Reveal delay={100}>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  {flagship!.tagline}
                </span>
                <h2 className="mt-3 text-4xl sm:text-5xl">{flagship!.name}</h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {flagship!.description}
                </p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <Tags label="Available Finishes" items={flagship!.finishes} />
                  <Tags label="Typical Applications" items={flagship!.applications} />
                </div>
                <Link
                  to="/"
                  hash="contact"
                  className="mt-9 inline-block bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-brown"
                >
                  Enquire Now
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Companion varieties */}
        <section className="bg-secondary py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">Companion Varieties</p>
              <h2 className="mt-4 text-4xl sm:text-5xl">Steel Grey &amp; Black Pearl</h2>
              <p className="mt-4 text-base text-muted-foreground">
                Stones from the same broader granite family, processed on the same lines and held to
                the same selection standard.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-8 lg:grid-cols-2">
              {rest.map((p, i) => (
                <Reveal key={p.slug} delay={i * 110}>
                  <article
                    id={p.slug}
                    className="flex h-full scroll-mt-24 flex-col border border-border bg-background"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="h-72 w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-8">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                        {p.tagline}
                      </span>
                      <h3 className="mt-3 text-3xl">{p.name}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                      <div className="mt-7 grid gap-6 sm:grid-cols-2">
                        <Tags label="Finishes" items={p.finishes} />
                        <Tags label="Applications" items={p.applications} />
                      </div>
                      <Link
                        to="/"
                        hash="contact"
                        className="mt-8 inline-block self-start border border-primary px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        Enquire Now
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Custom / bulk note */}
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <Reveal>
            <div className="grid gap-10 border-l-2 border-brown bg-secondary p-10 sm:grid-cols-3 lg:p-14">
              {[
                {
                  icon: Ruler,
                  title: "Custom Sizing",
                  text: "Cut-to-size slabs and tiles to your project drawings.",
                },
                {
                  icon: Package,
                  title: "Slab & Tile Formats",
                  text: "Gangsaw slabs, cutter slabs and standard tile sizes.",
                },
                {
                  icon: Ship,
                  title: "Bulk & Export Orders",
                  text: "Container loads with export packing and documentation.",
                },
              ].map((n) => (
                <div key={n.title}>
                  <n.icon className="size-6 text-primary" strokeWidth={1.4} />
                  <h3 className="mt-4 text-xl">{n.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{n.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
