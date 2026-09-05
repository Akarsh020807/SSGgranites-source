import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { getProduct } from "@/lib/products";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product not found — SSG Granites" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} Granite — Finishes, Applications & Enquiry | SSG Granites`;
    const description = `${product.short} ${product.recommendedFinish}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductDetail,
});

function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-5 py-32 lg:px-8">
        <h1 className="text-4xl">Stone not found</h1>
        <p className="mt-4 text-muted-foreground">
          We couldn&apos;t find that granite variety. Browse the full collection instead.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-block bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground"
        >
          All Products
        </Link>
      </main>
      <Footer />
    </div>
  );
}

function FinishList({ label, items, muted }: { label: string; items: string[]; muted?: boolean }) {
  return (
    <div className={`border p-7 ${muted ? "border-border bg-secondary" : "border-primary/40 bg-background"}`}>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">{label}</p>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-2 size-1.5 shrink-0 bg-primary" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <ChevronRight className="size-3" />
            <li>
              <Link to="/products" className="hover:text-primary">
                Products
              </Link>
            </li>
            <ChevronRight className="size-3" />
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="mx-auto mt-8 max-w-7xl px-5 lg:px-8">
          <img
            src={product.image}
            alt={`${product.name} granite slab`}
            width={1024}
            height={768}
            className="h-[22rem] w-full object-cover lg:h-[30rem]"
          />
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <Reveal className="max-w-3xl">
            {product.flagship && (
              <p className="eyebrow">Flagship — sourced from our own captive mine</p>
            )}
            <h1 className="mt-3 font-display text-5xl sm:text-6xl">{product.name}</h1>
            <p className="mt-4 text-lg text-primary">{product.tagline}</p>
          </Reveal>

          <div className="mt-14 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-14">
              <Reveal>
                <h2 className="text-3xl">Colour &amp; Character</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                {product.note && (
                  <p className="mt-5 border-l-2 border-brown bg-secondary p-5 text-sm leading-relaxed text-muted-foreground">
                    {product.note}
                  </p>
                )}
              </Reveal>

              <Reveal>
                <h2 className="text-3xl">Available Finishes</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Finish availability depends on the block, factory processing and buyer
                  specification.
                </p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <FinishList label="Standard Finishes" items={product.standardFinishes} />
                  <FinishList label="Available on Request" items={product.requestFinishes} muted />
                </div>
              </Reveal>

              <Reveal>
                <h2 className="text-3xl">Best Applications</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {product.applications.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 bg-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <aside className="space-y-8 border border-border bg-secondary p-8">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                    Recommended Finish
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {product.recommendedFinish}
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                    Design Positioning
                  </p>
                  <p className="mt-3 font-display text-lg tracking-wide text-foreground">
                    {product.positioning.join(" • ")}
                  </p>
                </div>
                <Link
                  to="/"
                  search={{ product: product.name }}
                  hash="contact"
                  className="block bg-primary px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-brown"
                >
                  Enquire Now
                </Link>
              </aside>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
