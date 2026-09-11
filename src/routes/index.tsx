import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Anchor,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Gem,
  Globe2,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Mountain,
  Phone,
  Quote,
  Scissors,
  Send,
  Ship,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { useAuth } from "@/context/AuthContext";
import { collection, flagship, products } from "@/lib/products";
import { countryCodes } from "@/lib/country-codes";
import { site } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import heroSlabs from "@/assets/hero-slabs.jpg";
import quarry from "@/assets/quarry.jpg";
import cutting from "@/assets/cutting.jpg";
import polishing from "@/assets/polishing.jpg";
import exportYard from "@/assets/export.jpg";
import quality from "@/assets/quality.jpg";
import blackGalaxy from "@/assets/black-galaxy.jpg";
import leader1 from "@/assets/leader-1.jpg";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    product: typeof search.product === "string" ? search.product : undefined,
  }),
  head: () => ({
    meta: [
      { title: "SSG Granites — Black Galaxy Granite from Our Own Mine" },
      {
        name: "description",
        content:
          "SSG Granites mines, processes and exports premium Black Galaxy granite plus a full collection of Indian granite varieties — an integrated quarry-to-market operation.",
      },
      { property: "og:title", content: "SSG Granites — Black Galaxy Granite from Our Own Mine" },
      {
        property: "og:description",
        content:
          "Integrated granite mining, cutting, polishing and export. Premium Black Galaxy slabs direct from source.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const stats = [
  { icon: Mountain, title: "Captive Mining Operations", text: "Rough blocks from our own quarry" },
  { icon: Gem, title: "13 Granite Varieties", text: "Black Galaxy plus a full Indian collection" },
  { icon: Globe2, title: "Domestic & Export Reach", text: "Supplying India and overseas markets" },
  { icon: Layers, title: "Quarry-to-Market Model", text: "One chain, block to polished slab" },
];

const steps = [
  {
    icon: Mountain,
    title: "Mining & Block Sourcing",
    text: "Rough blocks extracted at our own mine.",
    image: quarry,
  },
  {
    icon: Scissors,
    title: "Cutting & Processing",
    text: "Blocks sized and sawn into slabs in-house.",
    image: cutting,
  },
  {
    icon: Sparkles,
    title: "Polishing & Finishing",
    text: "Polished, honed, leathered or flamed.",
    image: polishing,
  },
  {
    icon: BadgeCheck,
    title: "Quality Selection",
    text: "Slabs graded for colour and consistency.",
    image: quality,
  },
  {
    icon: Ship,
    title: "Loading & Export",
    text: "Packed and shipped domestic or overseas.",
    image: exportYard,
  },
];

const founder = {
  name: "Buchepalli Rilasa Reddy",
  role: "Owner & Managing Director",
  company: "SSG Granites",
  image: leader1,
  quote:
    "Steering SSG Granites from the quarry face to international markets with an unwavering focus on raw block consistency, state-of-the-art Italian polishing, and factory-direct export value.",
};

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
        <Leadership />
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

function Leadership() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/80 via-background to-secondary/50 py-24 lg:py-32 border-y border-border">
      {/* Subtle stone quarry radial background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(169,145,113,0.14),transparent)]" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow flex items-center justify-center gap-2">
              <Sparkles className="size-3.5 text-primary" />
              Executive Ownership &amp; Vision
              <Sparkles className="size-3.5 text-primary" />
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
              The Driving Force Behind SSG Granites
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Leading captive quarry extraction, world-standard precision processing, and direct international
              export partnerships.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          <Reveal delay={100}>
            <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-background/95 backdrop-blur-sm shadow-2xl transition-all duration-300 hover:border-primary/60 hover:shadow-primary/10">
              {/* Luxury architectural gold accent top bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:gap-12 lg:items-center">
                {/* Left Column: Portrait & Verified Badges */}
                <div className="flex flex-col items-center text-center lg:col-span-5">
                  <div className="relative">
                    {/* Outer glowing aura */}
                    <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-primary/40 via-transparent to-primary/60 blur-sm opacity-70" />

                    <div className="relative size-56 sm:size-64 overflow-hidden rounded-2xl border-2 border-primary/50 shadow-2xl bg-ink/10">
                      <img
                        src={founder.image}
                        alt={`${founder.name} — ${founder.role} at ${founder.company}`}
                        loading="lazy"
                        width={768}
                        height={768}
                        className="size-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      {/* Subtle dark vignette at base of image */}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent" />
                    </div>

                    {/* Verified Seal Floating Pill */}
                    <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-ink px-3.5 py-1 text-[0.7rem] font-semibold text-primary shadow-lg backdrop-blur-md">
                        <BadgeCheck className="size-3.5 text-primary" />
                        <span>Verified Quarry Promoter</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Location & Reach */}
                  <div className="mt-8 flex flex-col items-center gap-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <MapPin className="size-3.5 text-primary" />
                      Captive Quarry • Chimakurthy, Andhra Pradesh
                    </span>
                    <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground/80">
                      Export Operations Worldwide
                    </span>
                  </div>
                </div>

                {/* Right Column: Name, Single Title, Vision Quote, and Strategic Pillars */}
                <div className="flex flex-col text-left lg:col-span-7">
                  {/* Single Clean Title Pill */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary shadow-sm">
                      <Gem className="size-3.5" />
                      {founder.role}
                    </span>
                    <span className="rounded-full border border-border bg-secondary/80 px-3 py-1 text-xs font-medium text-foreground/80">
                      {founder.company}
                    </span>
                  </div>

                  {/* Powerful, Solid Executive Name */}
                  <h3 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-foreground leading-none">
                    {founder.name}
                  </h3>

                  {/* Architectural Accent Bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-0.5 w-16 bg-primary" />
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <div className="h-0.5 w-8 bg-primary/40" />
                  </div>

                  {/* Executive Vision Statement */}
                  <div className="relative mt-6 rounded-xl border border-border/80 bg-secondary/40 p-5 sm:p-6">
                    <Quote className="absolute top-3 right-4 size-8 text-primary/20" />
                    <p className="relative z-10 text-sm sm:text-base italic text-foreground/85 leading-relaxed font-serif">
                      &ldquo;{founder.quote}&rdquo;
                    </p>
                  </div>

                  {/* 3 Core Leadership Pillars */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border bg-background p-3.5 shadow-sm transition-all hover:border-primary/40">
                      <Mountain className="size-4 text-primary" />
                      <p className="mt-2 text-xs font-semibold text-foreground">Direct Mining</p>
                      <p className="mt-0.5 text-[0.72rem] text-muted-foreground leading-snug">
                        Raw Galaxy blocks sourced from captive quarry pits.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-3.5 shadow-sm transition-all hover:border-primary/40">
                      <Sparkles className="size-4 text-primary" />
                      <p className="mt-2 text-xs font-semibold text-foreground">Italian Precision</p>
                      <p className="mt-0.5 text-[0.72rem] text-muted-foreground leading-snug">
                        Mirror-grade finishing with automated multi-head polishers.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-3.5 shadow-sm transition-all hover:border-primary/40">
                      <Globe2 className="size-4 text-primary" />
                      <p className="mt-2 text-xs font-semibold text-foreground">Global Delivery</p>
                      <p className="mt-0.5 text-[0.72rem] text-muted-foreground leading-snug">
                        Container-ready seaport logistics for overseas ports.
                      </p>
                    </div>
                  </div>

                  {/* Executive CTAs */}
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      to="/quote"
                      className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:bg-brown shadow-md"
                    >
                      <span>Connect with Executive Office</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <span>Direct Enquiry</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
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
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-brown shadow-md"
            >
              Explore Our Granite
            </Link>
            <Link
              to="/quote"
              className="inline-flex items-center gap-3 border border-background/40 bg-background/10 backdrop-blur-sm px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-background hover:text-foreground"
            >
              Get a Quote (RFQ)
            </Link>
          </div>
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
              <div className="group flex h-full flex-col border border-border bg-background transition-colors hover:border-primary">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-36 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between">
                    <step.icon className="size-6 text-primary" strokeWidth={1.4} />
                    <span className="font-display text-3xl text-border transition-colors group-hover:text-primary">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg leading-snug">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Range() {
  const preview = collection.slice(0, 4);
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">Our Granite Range</p>
        <h2 className="mt-4 text-4xl sm:text-5xl">
          {products.length} granite varieties, one integrated supply chain
        </h2>
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
                to="/products/$slug"
                params={{ slug: flagship.slug }}
                className="mt-6 inline-block border-b border-primary pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary"
              >
                View Details
              </Link>
            </div>
          </article>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {preview.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <Link
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="group flex h-full flex-col border border-border bg-secondary"
              >
                <div className="overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.short}</p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    View Details
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal>
        <Link
          to="/products"
          className="mt-12 inline-block bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-brown"
        >
          View All Products
        </Link>
      </Reveal>
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
  const { product } = Route.useSearch();
  const { isAdmin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{
    name: string;
    variety: string;
    email: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stoneVariety, setStoneVariety] = useState(product || "Black Galaxy");
  const [requirementType, setRequirementType] = useState("Gang-saw Slabs (20mm / 30mm)");
  const [quantity, setQuantity] = useState("1 Container (~4,500 sq.ft)");
  const [message, setMessage] = useState(
    product ? `Requesting quotation, slab photos and container availability for ${product}.` : ""
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      const fullPhone = `${countryCode} ${phone.trim()}`;
      const subject = `[${stoneVariety}] ${requirementType}`;
      const detailedMessage = `Requirement: ${requirementType}\nGranite: ${stoneVariety}\nEstimated Volume: ${quantity}\n\nClient Specifications:\n${message.trim()}`;

      const { error: insertError } = await supabase.from("leads").insert({
        name: name.trim(),
        email: email.trim(),
        phone: fullPhone,
        subject,
        message: detailedMessage,
        source: "Website",
        status: "New",
        priority: "Normal",
      });

      if (insertError) {
        throw insertError;
      }

      setSubmittedLead({
        name: name.trim(),
        variety: stoneVariety,
        email: email.trim(),
      });
      toast.success("Enquiry submitted successfully! Stored in Supabase.");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err?.message || "Failed to submit enquiry. Please check your details and try again.");
      toast.error("Submission error: " + (err?.message || "Failed to save enquiry"));
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setSubmittedLead(null);
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
  }

  const field =
    "w-full border border-background/20 bg-background/5 px-4 py-3 text-sm text-background placeholder:text-background/40 focus:border-primary focus:outline-none transition-colors";

  return (
    <section id="contact" className="scroll-mt-20 bg-ink py-24 text-background lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Direct Quarry & Trade Enquiry</p>
          <h2 className="mt-4 text-4xl text-background sm:text-5xl">
            Tell us what you need — slab, container or project volume
          </h2>
          <p className="mt-4 text-base text-background/60">
            Domestic enquiries and export or bulk orders are equally welcome. Share your sizes,
            finishes and quantities and our sales desk will revert with pricing and availability.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            {submittedLead ? (
              /* Success State with Link to Leads Tab */
              <div className="border border-primary/40 bg-background/5 p-8 sm:p-10 text-background">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <CheckCircle2 className="size-7" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-background">
                  Enquiry Successfully Recorded!
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-background/70">
                  Thank you, <strong className="text-primary">{submittedLead.name}</strong>. Your requirement
                  for <strong className="text-primary">{submittedLead.variety}</strong> has been received. Our export sales desk will review your specifications and reach out via WhatsApp / phone shortly.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-background/15 pt-6">
                  {isAdmin ? (
                    <Link
                      to="/leads"
                      className="inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-brown"
                    >
                      View in Leads CRM (Admin)
                      <ArrowRight className="size-3.5" />
                    </Link>
                  ) : (
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-brown"
                    >
                      Explore Granite Slabs
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={resetForm}
                    className="border border-background/20 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-background/80 transition-colors hover:bg-background/10 hover:text-background cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              /* Enquiry Form */
              <form onSubmit={onSubmit} className="grid gap-5">
                {error && (
                  <div className="border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
                    {error}
                  </div>
                )}

                {/* Name & Phone */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-background/70">
                      Full Name *
                    </label>
                    <input
                      required
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Robert Smith / Sharma Trading"
                      className={field}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-background/70">
                      Phone / WhatsApp *
                    </label>
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
                      <select
                        name="countryCode"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        aria-label="Country code"
                        className="border border-background/20 bg-ink px-2 py-3 text-sm text-background focus:border-primary focus:outline-none"
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code + c.label} value={c.code} className="bg-ink">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        required
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className={field}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-background/70">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. procurement@company.com"
                    className={field}
                  />
                </div>

                {/* Granite Variety & Requirement Type */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-background/70">
                      Granite Variety *
                    </label>
                    <select
                      value={stoneVariety}
                      onChange={(e) => setStoneVariety(e.target.value)}
                      className="w-full border border-background/20 bg-ink px-4 py-3 text-sm text-background focus:border-primary focus:outline-none"
                    >
                      <option value="Black Galaxy (Captive Mine)">Black Galaxy (Own Mine - Flagship)</option>
                      <option value="Steel Grey">Steel Grey</option>
                      <option value="Black Pearl">Black Pearl</option>
                      <option value="Tan Brown">Tan Brown</option>
                      <option value="Absolute Black">Absolute Black</option>
                      <option value="Viscont White">Viscont White</option>
                      <option value="Colonial White">Colonial White</option>
                      <option value="Other / Mixed Consignment">Other / Multi-variety Order</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-background/70">
                      Order / Processing Type
                    </label>
                    <select
                      value={requirementType}
                      onChange={(e) => setRequirementType(e.target.value)}
                      className="w-full border border-background/20 bg-ink px-4 py-3 text-sm text-background focus:border-primary focus:outline-none"
                    >
                      <option value="Gang-saw Slabs (20mm / 30mm)">Gang-saw Polished Slabs (20mm/30mm)</option>
                      <option value="Cutter Slabs">Cutter Slabs</option>
                      <option value="Export Container Order (FOB/CIF)">Export Container Order (FOB/CIF)</option>
                      <option value="Cut-to-Size / Commercial Project">Cut-to-Size / Commercial Project</option>
                      <option value="Rough Blocks">Rough Blocks Direct from Mine</option>
                      <option value="General Technical & Pricing Query">General Enquiry & Price List</option>
                    </select>
                  </div>
                </div>

                {/* Estimated Quantity */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-background/70">
                    Estimated Quantity / Volume
                  </label>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 1 Container (~4,500 sq.ft) or 500 sq.ft or 2 Rough Blocks"
                    className={field}
                  />
                </div>

                {/* Message / Specifications */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-background/70">
                    Project Specifications / Comments *
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details such as finishes (Polished, Honed, Leathered, Flamed), destination port, slab sizes, or specific delivery timelines..."
                    className={field}
                  />
                </div>

                {/* Submit CTA */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2.5 bg-primary px-9 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-brown disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Saving to Supabase...
                      </>
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        Send Enquiry Now
                      </>
                    )}
                  </button>

                  <span className="text-xs text-background/50">
                    Direct entry to our CRM and quarry export team.
                  </span>
                </div>
              </form>
            )}
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6 border-l-2 border-primary pl-8">
              <div className="flex items-start gap-4">
                <Phone className="mt-1 size-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-background/40">Phone</p>
                  <a
                    href={site.phoneHref}
                    className="text-base text-background/80 hover:text-primary transition-colors"
                  >
                    {site.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1 size-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-background/40">Email</p>
                  <a href={site.emailHref} className="text-base hover:text-primary transition-colors">
                    {site.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 size-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-background/40">Address</p>
                  <a
                    href={site.mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="group block text-base leading-relaxed text-background/80 hover:text-primary transition-colors cursor-pointer"
                    title="Open in Google Maps"
                  >
                    {site.addressLines.map((line) => (
                      <span key={line} className="block group-hover:underline">
                        {line}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary mt-1">
                      <span>View in Google Maps</span>
                      <span>↗</span>
                    </span>
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 border border-background/15 p-6">
                <Truck className="size-6 text-primary" />
                <p className="text-sm text-background/60">
                  Factory and quarry visits welcome by appointment.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link
                  to="/quote"
                  className="flex items-center justify-between border border-primary/40 bg-primary/10 p-4 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors"
                >
                  <span>Interactive Quote &amp; Container Estimator</span>
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-between border border-background/20 bg-background/5 p-4 text-xs font-semibold uppercase tracking-wider text-background/80 hover:bg-background/10 hover:text-background transition-colors"
                >
                  <span>Quarry Visit &amp; Travel Guide</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

