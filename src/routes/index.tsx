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
import { useEffect, useState, type FormEvent } from "react";
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
import heroGallery from "@/assets/hero-gallery.jpg";
import heroShowroom1 from "@/assets/hero-showroom-1.jpg";
import heroShowroom2 from "@/assets/hero-showroom-2.jpg";
import quarry from "@/assets/quarry.jpg";
import cutting from "@/assets/cutting.jpg";
import polishing from "@/assets/polishing.jpg";
import exportYard from "@/assets/export.jpg";
import quality from "@/assets/quality.jpg";
import blackGalaxy from "@/assets/black-galaxy.jpg";
import founderPortrait from "@/assets/founder-buchepalli.jpg";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { product?: string | undefined } => ({
    product: typeof search["product"] === "string" ? (search["product"] as string) : undefined,
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
  { icon: Gem, title: "Wide Granite Varieties", text: "Black Galaxy and a full Indian collection" },
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
  image: founderPortrait,
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
    <section className="relative overflow-hidden bg-[#FAF8F5] text-foreground pt-14 pb-8 sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-12 border-y border-[#EAE3D7]">
      {/* Warm luxury architectural ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_15%,rgba(197,168,128,0.18),transparent)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] bg-[radial-gradient(#1A1A1A_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Editorial Eyebrow & Title */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-primary font-semibold">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary" />
              <span>Leadership &amp; Heritage</span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground">
              The Vision Behind <span className="font-semibold text-primary">SSG Granites</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Spearheading integrated captive mining, advanced processing, and direct global exports from the heart of Chimakurthy’s Black Galaxy granite belt.
            </p>
          </Reveal>
        </div>

        {/* Master Showcase Card (compacted by ~2-3 cm) */}
        <div className="mx-auto mt-10 max-w-5xl">
          <Reveal delay={100}>
            <div className="relative overflow-hidden rounded-3xl border border-[#DECDB3]/80 bg-gradient-to-b from-white via-[#FCFBF9] to-[#FAF8F5] p-6 sm:p-8 lg:p-10 shadow-[0_20px_70px_-15px_rgba(28,25,23,0.08)] ring-1 ring-[#D6C4A5]/25">
              {/* Top dual-tone gold accent ribbon */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

              <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-center">
                {/* Left Column: Modern Executive Portrait in Luxury Gallery Frame */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-full max-w-[270px]">
                    {/* Double-beveled gallery frame */}
                    <div className="relative overflow-hidden rounded-2xl border border-[#D8C9AE] bg-gradient-to-b from-[#F7F4EC] to-[#EFE7D8] p-2 shadow-xl group">
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-white shadow-inner">
                        <img
                          src={founder.image}
                          alt={`${founder.name} — ${founder.role}`}
                          loading="lazy"
                          width={786}
                          height={1024}
                          className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Discreet floating gold provenance tag */}
                        <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#1C1917]/90 px-2.5 py-0.5 text-[9.5px] font-semibold tracking-widest text-[#E6CA92] uppercase shadow-md backdrop-blur-sm border border-[#E6CA92]/30">
                          <Gem className="size-2.5 text-primary" />
                          <span>Chimakurthy AP</span>
                        </div>
                      </div>

                      {/* Engraved Executive Nameplate */}
                      <div className="mt-2 p-3 rounded-xl bg-white/90 border border-[#E8DFC9] text-center shadow-sm">
                        <p className="font-serif text-base sm:text-lg font-bold tracking-wide text-foreground leading-snug">
                          {founder.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                          {founder.role}
                        </p>
                        <div className="my-1.5 mx-auto h-px w-12 bg-primary/30" />
                        <p className="text-[0.68rem] font-medium text-muted-foreground uppercase tracking-widest">
                          Captive Mine Concessionaire
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Statement, Executive Charter, and Stylish Signature */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    <BadgeCheck className="size-3.5 text-primary" />
                    <span>Executive Directorate</span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-bold tracking-tight text-foreground leading-[1.18]">
                    Direct Quarry Stewardship, Global Sawn Caliber.
                  </h3>

                  <div className="my-4 h-px w-full bg-gradient-to-r from-primary/40 via-[#EAE3D7] to-transparent" />

                  {/* Executive Charter / Quote Box */}
                  <div className="relative rounded-2xl border-l-4 border-primary border border-[#EAE3D7] bg-[#FAF8F5] p-4 sm:p-5 shadow-sm">
                    <div className="flex gap-3 sm:gap-3.5 items-start">
                      <Quote className="size-5 shrink-0 text-primary mt-0.5 opacity-80" />
                      <blockquote className="font-sans text-xs sm:text-sm leading-relaxed text-stone-800 font-normal tracking-wide">
                        &ldquo;True mastery of natural stone begins at the quarry face. By stewarding our captive Black Galaxy reserves in Chimakurthy, we eliminate middlemen and ensure that every single slab leaving our yard maintains uncompromising gold-fleck brilliance, density, and dimensional accuracy for prestigious architectural projects worldwide.&rdquo;
                      </blockquote>
                    </div>
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


const heroSlides = [
  {
    src: heroSlabs,
    alt: "Polished Black Galaxy granite slabs in the SSG Granites warehouse",
  },
  {
    src: heroGallery,
    alt: "Premium natural granite and marble vertical slab selection at SSG Granites facility",
  },
  {
    src: heroShowroom1,
    alt: "Architectural luxury natural stone gallery display",
  },
  {
    src: heroShowroom2,
    alt: "Grand luxury marble and granite exhibition showroom",
  },
];

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000); // 3 seconds delay

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
      {/* Background Slideshow (4s span) */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 -z-10 transition-opacity duration-1000 ease-in-out ${
            activeSlide === index ? "opacity-100 scale-105" : "opacity-0 scale-100"
          } transform transition-transform duration-[7000ms]`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            width={1920}
            height={1080}
            className="size-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-ink/70" />

      {/* Slide indicator dots */}
      <div className="absolute bottom-8 right-8 z-20 hidden sm:flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              activeSlide === i ? "w-8 bg-primary" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
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
    <section className="bg-secondary pt-12 pb-24 sm:pt-14 sm:pb-28 lg:pt-16 lg:pb-32">
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

