import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Anchor,
  BadgeCheck,
  Gem,
  Globe2,
  Layers,
  Mail,
  MapPin,
  Mountain,
  Phone,
  Scissors,
  Ship,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { products } from "@/lib/products";
import heroSlabs from "@/assets/hero-slabs.jpg";
import quarry from "@/assets/quarry.jpg";
import cutting from "@/assets/cutting.jpg";
import polishing from "@/assets/polishing.jpg";
import exportYard from "@/assets/export.jpg";
import blackGalaxy from "@/assets/black-galaxy.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SSG Granites — Black Galaxy Granite from Our Own Mine" },
      {
        name: "description",
        content:
          "SSG Granites mines, processes and exports premium Black Galaxy, Steel Grey and Black Pearl granite slabs — an integrated quarry-to-market operation.",
      },
      { property: "og:title", content: "SSG Granites — Black Galaxy Granite from Our Own Mine" },
      {
        property: "og:description",
        content:
          "Integrated granite mining, cutting, polishing and export. Premium Black Galaxy slabs direct from source.",
      },
    ],
  }),
  component: Home,
});

const stats = [
  { icon: Mountain, title: "Captive Mining Operations", text: "Rough blocks from our own quarry" },
  { icon: Gem, title: "3 Premium Varieties", text: "Black Galaxy, Steel Grey, Black Pearl" },
  { icon: Globe2, title: "Domestic & Export Reach", text: "Supplying India and overseas markets" },
  { icon: Layers, title: "Quarry-to-Market Model", text: "One chain, block to polished slab" },
];

const steps = [
  { icon: Mountain, title: "Mining & Block Sourcing", text: "Rough blocks extracted at our own mine." },
  { icon: Scissors, title: "Cutting & Processing", text: "Blocks sized and sawn into slabs in-house." },
  { icon: Sparkles, title: "Polishing & Finishing", text: "Polished, honed, leathered or flamed." },
  { icon: BadgeCheck, title: "Quality Selection", text: "Slabs graded for colour and consistency." },
  { icon: Ship, title: "Distribution & Export", text: "Packed and shipped domestic or overseas." },
];

const gallery = [
  { src: quarry, alt: "Open-pit black granite quarry", w: 1280, h: 960 },
  { src: cutting, alt: "Granite block being cut into slabs", w: 1024, h: 768 },
  { src: polishing, alt: "Polishing a dark granite slab", w: 1024, h: 768 },
  { src: exportYard, alt: "Granite blocks loaded for export", w: 1024, h: 768 },
  { src: blackGalaxy, alt: "Black Galaxy granite close-up", w: 1024, h: 768 },
  { src: heroSlabs, alt: "Finished polished granite slabs", w: 1920, h: 1080 },
];

const trust = [
  { icon: Mountain, title: "Own Mining, Consistent Supply", text: "No middlemen between quarry face and your order." },
  { icon: BadgeCheck, title: "Strict Quality Selection", text: "Every slab graded before it leaves the yard." },
  { icon: Anchor, title: "Export-Ready Processing", text: "Container-grade packing and documentation." },
  { icon: Tag, title: "Direct-from-Source Pricing", text: "Owning the mine keeps our numbers competitive." },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Process />
        <Range />
        <Gallery />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
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

function About() {
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

function Process() {
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

function Range() {
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
                src={flagship!.image}
                alt={flagship!.name}
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
              <h3 className="mt-3 text-3xl">{flagship!.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{flagship!.short}</p>
              <Link
                to="/products"
                hash={flagship!.slug}
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

function Gallery() {
  return (
    <section className="bg-secondary py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Facility & Finished Slabs</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Inside the operation</h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal key={g.alt} delay={(i % 3) * 90}>
              <div className="overflow-hidden">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  width={g.w}
                  height={g.h}
                  className="h-64 w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">Why Choose Us</p>
        <h2 className="mt-4 text-4xl sm:text-5xl">Built on control, not on resale</h2>
      </Reveal>
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map((t, i) => (
          <Reveal key={t.title} delay={i * 80}>
            <div className="border-t-2 border-primary pt-6">
              <t.icon className="size-6 text-primary" strokeWidth={1.4} />
              <h3 className="mt-4 text-xl leading-snug">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  }

  const field =
    "w-full border border-background/20 bg-transparent px-4 py-3 text-sm text-background placeholder:text-background/40 focus:border-primary focus:outline-none";

  return (
    <section id="contact" className="scroll-mt-20 bg-ink py-24 text-background lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Contact Us</p>
          <h2 className="mt-4 text-4xl text-background sm:text-5xl">
            Tell us what you need — slab, container or project volume
          </h2>
          <p className="mt-4 text-base text-background/60">
            Domestic enquiries and export or bulk orders are equally welcome. Share your sizes,
            finishes and quantities and our team will revert with pricing and availability.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <form onSubmit={onSubmit} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <input required name="name" placeholder="Name" className={field} />
                <input required name="phone" placeholder="Phone Number" className={field} />
              </div>
              <input
                required
                type="email"
                name="email"
                placeholder="Email Address"
                className={field}
              />
              <textarea
                required
                name="message"
                rows={5}
                placeholder="Comments / Message"
                className={field}
              />
              <button
                type="submit"
                className="justify-self-start bg-primary px-9 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-brown"
              >
                Send Enquiry
              </button>
              {sent && (
                <p className="text-sm text-primary">
                  Thank you — your enquiry has been received. Our team will get back to you shortly.
                </p>
              )}
            </form>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6 border-l-2 border-primary pl-8">
              <div className="flex items-start gap-4">
                <Phone className="mt-1 size-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-background/40">Phone</p>
                  <a href="tel:+919000000000" className="text-base hover:text-primary">
                    +91 90000 00000
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1 size-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-background/40">Email</p>
                  <a href="mailto:sales@ssggranites.com" className="text-base hover:text-primary">
                    sales@ssggranites.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 size-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-background/40">Address</p>
                  <p className="text-base leading-relaxed text-background/80">
                    Processing Unit &amp; Quarry Office,
                    <br />
                    Chimakurthy, Prakasam District,
                    <br />
                    Andhra Pradesh, India
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 border border-background/15 p-6">
                <Truck className="size-6 text-primary" />
                <p className="text-sm text-background/60">
                  Factory and quarry visits welcome by appointment.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
