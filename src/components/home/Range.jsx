import { Link } from "@tanstack/react-router";

import { Reveal } from "@/components/layout/Reveal";
import { products } from "@/data/products";

export function Range() {
  const [flagship, ...rest] = products;

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">Our Granite Range</p>
        <h2 className="mt-4 text-4xl sm:text-5xl">Three stones, one dark-granite family</h2>
      </Reveal>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <article className="group h-full border border-border bg-background">
            <div className="overflow-hidden">
              <img
                src={flagship.image}
                alt={flagship.name}
                loading="lazy"
                width={1024}
                height={768}
                className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-[26rem]"
              />
            </div>
            <div className="p-8">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Flagship Product
              </span>
              <h3 className="mt-3 text-3xl">{flagship.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{flagship.short}</p>
              <Link
                to="/products"
                hash={flagship.slug}
                className="mt-6 inline-block border-b border-primary pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary"
              >
                View Details
              </Link>
            </div>
          </article>
        </Reveal>

        <div className="grid gap-8">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <article className="group flex h-full flex-col border border-border bg-secondary sm:flex-row">
                <div className="overflow-hidden sm:w-2/5">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-full"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-7">
                  <h3 className="text-2xl">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.short}</p>
                  <Link
                    to="/products"
                    hash={p.slug}
                    className="mt-5 inline-block self-start border-b border-primary pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary"
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
  );
}
