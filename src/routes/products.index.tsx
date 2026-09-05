import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Ruler, Ship } from "lucide-react";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { collection, flagship } from "@/lib/products";
import heroSlabs from "@/assets/hero-slabs.jpg";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Granite Collection — Black Galaxy, Steel Grey, Absolute Black & More" },
      {
        name: "description",
        content:
          "Browse the full SSG Granites collection: Black Galaxy from our own mine plus Steel Grey, Black Pearl, Absolute Black, Tan Brown, River White and more Indian granite varieties.",
      },
      { property: "og:title", content: "Granite Collection — SSG Granites" },
      {
        property: "og:description",
        content:
          "Thirteen Indian granite varieties in slab and cut-to-size format, processed in-house from block to polished slab.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
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
              Premium Black Galaxy granite from our own captive mine, alongside a full collection of
              Indian granite varieties — processed in-house from block to polished slab.
            </p>
          </div>
        </section>

        {/* Flagship */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <article className="grid items-stretch gap-0 border border-border bg-secondary lg:grid-cols-2">
                <img
                  src={flagship.image}
                  alt={flagship.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-72 w-full object-cover lg:h-full"
                />
                <div className="flex flex-col justify-center p-9 lg:p-14">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                    Flagship — from our own captive mine
                  </span>
                  <h2 className="mt-3 text-4xl sm:text-5xl">{flagship.name}</h2>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    {flagship.short} Quarried at our own mine and processed end to end in our
                    facility, which lets us hold colour and fleck consistency across large orders.
                  </p>
                  <Link
                    to="/products/$slug"
                    params={{ slug: flagship.slug }}
                    className="mt-8 inline-block self-start bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-brown"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Collection grid */}
        <section className="bg-secondary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">The Collection</p>
              <h2 className="mt-4 text-4xl sm:text-5xl">Indian Granite Colours</h2>
              <p className="mt-4 text-base text-muted-foreground">
                Every variety is supplied in slab and cut-to-size format. Finish availability
                depends on the block and buyer specification — each page lists standard finishes
                separately from those available on request.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {collection.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 90}>
                  <article className="flex h-full flex-col border border-border bg-background">
                    <div className="overflow-hidden">
                      <img
                        src={p.image}
                        alt={`${p.name} granite slab`}
                        loading="lazy"
                        width={1024}
                        height={768}
                        className="h-56 w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="text-2xl">{p.name}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.short}
                      </p>
                      <Link
                        to="/products/$slug"
                        params={{ slug: p.slug }}
                        className="mt-6 inline-block self-start border border-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        View Details
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
