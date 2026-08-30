import heroSlabs from "@/assets/hero-slabs.jpg";

export function ProductsHero() {
  return (
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
          Premium Black Galaxy granite and complementary varieties, processed in-house from block to
          polished slab.
        </p>
      </div>
    </section>
  );
}
