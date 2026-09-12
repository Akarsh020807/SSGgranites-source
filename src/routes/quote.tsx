import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Download,
  FileCheck2,
  FileText,
  Filter,
  Gem,
  Globe2,
  HelpCircle,
  Info,
  Layers,
  Loader2,
  MapPin,
  MessageSquare,
  Mountain,
  Package,
  Phone,
  Printer,
  RefreshCw,
  Scale,
  Send,
  ShieldCheck,
  Ship,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { countryCodes } from "@/lib/country-codes";
import { products, type Product } from "@/lib/products";
import { createLead } from "@/services/leadService";

export const Route = createFileRoute("/quote")({
  validateSearch: (search: Record<string, unknown>): { product?: string | undefined } => ({
    product: typeof search["product"] === "string" ? (search["product"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Granite RFQ & Container Estimator | SSG Granites" },
      {
        name: "description",
        content:
          "Configure direct quarry pricing for Black Galaxy, Steel Grey, Black Pearl. Calculate 20ft container payloads, finishes, thicknesses, and FOB/CIF shipping.",
      },
      { property: "og:title", content: "Granite RFQ & Container Estimator | SSG Granites" },
      {
        property: "og:description",
        content:
          "Direct quarry-to-market pricing. Instant B2B quotation configurator for global stone importers, architects, and builders.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: QuotePage,
});

type CategoryFilter = "all" | "flagship" | "dark" | "light" | "exotic";

const thicknesses = [
  {
    id: "20mm-gangsaw",
    label: "20 mm Gang-saw Slabs",
    badge: "Export Standard",
    sub: "Most in-demand international specification. ~4,500 sq.ft (418 m²) per 20ft container load.",
    weightFactor: 56, // kg/m2 approx
    sqftPerContainer: 4500,
  },
  {
    id: "30mm-gangsaw",
    label: "30 mm Gang-saw Slabs",
    badge: "Heavy-Duty Commercial",
    sub: "Ideal for monolithic countertops, vanity tops, and exterior architectural cladding. ~2,900 sq.ft per container.",
    weightFactor: 84,
    sqftPerContainer: 2900,
  },
  {
    id: "18mm-cutter",
    label: "18 mm Cutter Slabs",
    badge: "Cost-Optimized",
    sub: "Optimized for large-scale flooring, steps, risers, and residential development corridors.",
    weightFactor: 50,
    sqftPerContainer: 5000,
  },
  {
    id: "cut-to-size",
    label: "Cut-to-Size Project Tiles",
    badge: "Pre-Engineered",
    sub: "Precision factory-sawn to your project schedule (60x60, 60x30, 80x80 cm or custom dimensions).",
    weightFactor: 56,
    sqftPerContainer: 4200,
  },
  {
    id: "rough-blocks",
    label: "Rough Blocks Direct from Mine",
    badge: "Quarry Direct",
    sub: "Dressed gang-saw and cutter blocks for overseas stone processing and slicing plants.",
    weightFactor: 2900, // per m3
    sqftPerContainer: 0,
  },
];

const finishes = [
  {
    id: "Polished",
    label: "High-Gloss Mirror Polish",
    desc: "Reflective optical polish (>90 Gloss Units) accentuating natural bronze/golden mineral crystals.",
    icon: Sparkles,
  },
  {
    id: "Honed",
    label: "Honed / Satin Matte",
    desc: "Smooth micro-abrasive finish with uniform non-reflective matte patina for contemporary luxury floors.",
    icon: Layers,
  },
  {
    id: "Leathered",
    label: "Leathered / Antique Touch",
    desc: "Brushed relief finish following natural stone fissures with a soft, tactile leather feel.",
    icon: Gem,
  },
  {
    id: "Flamed",
    label: "Thermal Flamed",
    desc: "High-temperature flame textured surface with exceptional anti-slip properties for exteriors.",
    icon: Zap,
  },
  {
    id: "Bush Hammered",
    label: "Bush Hammered / Textured",
    desc: "Uniform coarse masonry crater finish ideal for civic plazas, monuments, and landscaping.",
    icon: Mountain,
  },
];

function generateRfqId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SSG-RFQ-${code}`;
}

function QuotePage() {
  const searchParams = Route.useSearch();

  // Initial stone selection
  const initialProductSlug = useMemo(() => {
    if (!searchParams.product) return "black-galaxy";
    const found = products.find(
      (p) =>
        p.slug.toLowerCase() === searchParams.product?.toLowerCase() ||
        p.name.toLowerCase() === searchParams.product?.toLowerCase(),
    );
    return found ? found.slug : "black-galaxy";
  }, [searchParams.product]);

  // Stepper state (1 to 3)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Filter for Step 1
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  // Selection states
  const [selectedProductSlug, setSelectedProductSlug] = useState(initialProductSlug);
  const [selectedThicknessId, setSelectedThicknessId] = useState("20mm-gangsaw");
  const [selectedFinish, setSelectedFinish] = useState("Polished");

  // Buyer Info
  const [buyerName, setBuyerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submittedRfq, setSubmittedRfq] = useState<{
    id: string;
    product: Product;
    thickness: (typeof thicknesses)[0];
    finish: string;
    buyerName: string;
    companyName: string;
    email: string;
    phone: string;
    notes: string;
    date: string;
  } | null>(null);

  // Derived objects
  const selectedProduct: Product = useMemo(
    () => products.find((p) => p.slug === selectedProductSlug) || products[0]!,
    [selectedProductSlug],
  );

  const selectedThickness = useMemo(
    () => thicknesses.find((t) => t.id === selectedThicknessId) || thicknesses[0]!,
    [selectedThicknessId],
  );

  // Filtered products
  const filteredProducts = useMemo(() => {
    switch (categoryFilter) {
      case "flagship":
        return products.filter((p) => p.flagship);
      case "dark":
        return products.filter(
          (p) =>
            p.slug.includes("black") ||
            p.slug.includes("grey") ||
            p.slug.includes("g20") ||
            p.slug.includes("tan"),
        );
      case "light":
        return products.filter((p) => p.slug.includes("white"));
      case "exotic":
        return products.filter((p) => p.slug.includes("blue"));
      default:
        return products;
    }
  }, [categoryFilter]);

  // Form submission
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (honeypot) {
      // Honeypot trapped
      setSubmittedRfq({
        id: generateRfqId(),
        product: selectedProduct,
        thickness: selectedThickness,
        finish: selectedFinish,
        buyerName,
        companyName,
        email,
        phone: `${countryCode} ${phone}`,
        notes,
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });
      return;
    }

    if (!buyerName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please enter your name, email, and phone/WhatsApp number.");
      return;
    }

    setSubmitting(true);
    const rfqId = generateRfqId();
    const formattedPhone = `${countryCode} ${phone.trim()}`;

    const specSummary = [
      `=== OFFICIAL GRANITE RFQ: ${rfqId} ===`,
      `Stone: ${selectedProduct.name} ${selectedProduct.flagship ? "[Captive Quarry Mine]" : ""}`,
      `Cut / Thickness: ${selectedThickness.label} (${selectedThickness.badge})`,
      `Surface Finish: ${selectedFinish}`,
      `Buyer: ${buyerName.trim()} | Company: ${companyName.trim() || "Not specified"}`,
      notes.trim() ? `Custom Requirements:\n${notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await createLead({
        name: buyerName.trim(),
        email: email.trim(),
        phone: formattedPhone,
        subject: `[${rfqId}] RFQ for ${selectedProduct.name} (${selectedThickness.label})`,
        message: specSummary,
        source: "Enterprise RFQ Portal",
        priority: "High",
      });

      setSubmittedRfq({
        id: rfqId,
        product: selectedProduct,
        thickness: selectedThickness,
        finish: selectedFinish,
        buyerName: buyerName.trim(),
        companyName: companyName.trim() || "Private Procurement",
        email: email.trim(),
        phone: formattedPhone,
        notes: notes.trim(),
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });

      toast.success(`Quotation ${rfqId} registered! Our export desk is reviewing.`);
    } catch (err: any) {
      console.error("RFQ creation error:", err);
      toast.error(err?.message || "Failed to generate quotation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSubmittedRfq(null);
    setCurrentStep(1);
  }

  const inputClass =
    "w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Top Architectural Header */}
        <section className="border-b border-border bg-gradient-to-b from-secondary/80 via-secondary/40 to-background py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Calculator className="size-3.5" />
                  <span>Official Enterprise RFQ Estimator</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Direct Mine Quota Active</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
                    Configure Granite Slabs &amp; <br className="hidden sm:inline" />
                    <span className="font-semibold text-primary">Instant Container Pricing</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Direct quarry-to-market pricing for architects, stone importers, and contractors.
                    Select your stone variety, gang-saw thickness, finish, and destination port for an
                    immediate factory proforma quotation.
                  </p>
                </div>

                {/* Key operational metrics */}
                <div className="grid grid-cols-3 gap-3 border-l-2 border-primary/40 pl-6 text-xs">
                  <div>
                    <span className="block font-display text-2xl font-bold text-foreground">13+</span>
                    <span className="text-muted-foreground">Stone Colours</span>
                  </div>
                  <div>
                    <span className="block font-display text-2xl font-bold text-primary">Zero</span>
                    <span className="text-muted-foreground">Middleman Cost</span>
                  </div>
                  <div>
                    <span className="block font-display text-2xl font-bold text-foreground">24h</span>
                    <span className="text-muted-foreground">Port Dispatch</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* STEPPER PROGRESS BAR (Hidden when submitted) */}
        {!submittedRfq && (
          <div className="sticky top-24 z-40 border-b border-border bg-background/95 backdrop-blur shadow-sm">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="grid grid-cols-3 py-3 text-center sm:text-left">
                {[
                  { step: 1, label: "Stone Variety", icon: Mountain },
                  { step: 2, label: "Sizing & Finish", icon: Layers },
                  { step: 3, label: "Review & Proforma", icon: FileCheck2 },
                ].map((s) => {
                  const isActive = currentStep === s.step;
                  const isDone = currentStep > s.step;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setCurrentStep(s.step as 1 | 2 | 3)}
                      className={`group flex items-center justify-center sm:justify-start gap-2.5 py-1.5 px-2 transition-all cursor-pointer ${
                        isActive
                          ? "text-primary font-bold border-b-2 border-primary"
                          : isDone
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground font-bold shadow-sm"
                            : isDone
                            ? "bg-primary/20 text-primary font-bold"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {isDone ? <Check className="size-3.5" /> : s.step}
                      </span>
                      <span className="hidden sm:inline text-xs uppercase tracking-wider truncate">
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONFIGURATOR & FLOATING ESTIMATOR PANEL */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            {submittedRfq ? (
              /* ================= THE LUXURY CONFIRMATION TICKET ================= */
              <div className="mx-auto max-w-4xl">
                <Reveal>
                  <div className="border border-border bg-background p-8 sm:p-14 shadow-2xl print:border-none print:shadow-none">
                    {/* Top Branding Banner */}
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
                      <div>
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-6" />
                          <span className="text-xs font-bold uppercase tracking-[0.2em]">
                            Official Quotation Registered
                          </span>
                        </div>
                        <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground">
                          {submittedRfq.id}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Issued on {submittedRfq.date} by SSG Granites Export Logistics Desk
                        </p>
                      </div>

                      <div className="flex items-center gap-3 print:hidden">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="inline-flex items-center gap-2 border border-border bg-secondary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-secondary/80 transition-colors shadow-sm"
                        >
                          <Printer className="size-4" />
                          <span>Print / Save PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Proforma Specification Table */}
                    <div className="mt-8 space-y-8">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                          Configured Stone Specification
                        </span>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-secondary/30 p-6 border border-border/80 text-sm">
                          <div>
                            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                              Selected Stone
                            </p>
                            <p className="mt-1 font-semibold text-foreground text-base">
                              {submittedRfq.product.name}
                            </p>
                            {submittedRfq.product.flagship && (
                              <span className="inline-block mt-1 text-[0.65rem] font-bold text-primary uppercase">
                                Captive Quarry Extraction
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                              Slab Thickness &amp; Format
                            </p>
                            <p className="mt-1 font-semibold text-foreground">
                              {submittedRfq.thickness.label}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {submittedRfq.thickness.badge}
                            </span>
                          </div>

                          <div>
                            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                              Surface Finish
                            </p>
                            <p className="mt-1 font-semibold text-foreground">
                              {submittedRfq.finish}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Buyer Details Bar */}
                      <div className="grid gap-4 sm:grid-cols-2 border border-border p-6 bg-background">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Authorized Buyer
                          </p>
                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {submittedRfq.buyerName}
                          </p>
                          <p className="text-xs text-muted-foreground">{submittedRfq.companyName}</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Contact Coordinates
                          </p>
                          <p className="mt-1 text-sm font-medium text-foreground">
                            {submittedRfq.phone}
                          </p>
                          <p className="text-xs text-muted-foreground">{submittedRfq.email}</p>
                        </div>

                        {submittedRfq.notes && (
                          <div className="sm:col-span-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
                            <strong className="text-foreground">Project Notes:</strong>{" "}
                            {submittedRfq.notes}
                          </div>
                        )}
                      </div>

                      {/* Next Steps & Instant WhatsApp Follow-up */}
                      <div className="rounded border border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 print:hidden">
                        <div className="flex items-start gap-4">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <MessageSquare className="size-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground">
                              Fast-Track Proforma Invoice via WhatsApp
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              Our export logistics director is available on WhatsApp right now. We have
                              pre-loaded your RFQ details so you can receive FOB Chennai or CIF ocean freight
                              pricing without delay.
                            </p>

                            <div className="mt-5 flex flex-wrap gap-4">
                              <a
                                href={`https://wa.me/917799999555?text=Hello%20SSG%20Granites%2C%20I%20have%20submitted%20Quotation%20%23${submittedRfq.id}%20for%20${encodeURIComponent(
                                  submittedRfq.product.name,
                                )}%20(${encodeURIComponent(
                                  submittedRfq.thickness.label,
                                )}).%20Please%20provide%20the%20proforma%20rates.`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-emerald-600 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors shadow-md"
                              >
                                <MessageSquare className="size-4" />
                                <span>Fast-Track on WhatsApp</span>
                              </a>

                              <button
                                type="button"
                                onClick={handleReset}
                                className="border border-border bg-background px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors"
                              >
                                Configure Another Stone
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            ) : (
              /* ================= 4-STEP WIZARD + REAL-TIME SIDEBAR ================= */
              <form onSubmit={handleSubmit}>
                {/* Honeypot field */}
                <input
                  type="text"
                  name="rfq_bypass"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid gap-12 lg:grid-cols-12">
                  {/* LEFT: STEP CONTENT (7 COLS) */}
                  <div className="lg:col-span-8">
                    {/* STEP 1: VARIETY */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                              Step 1 of 4
                            </span>
                            <h2 className="mt-1 text-2xl sm:text-3xl font-light text-foreground">
                              Select Your Granite Variety
                            </h2>
                          </div>

                          {/* Filter Tabs */}
                          <div className="flex flex-wrap gap-1.5 border border-border p-1 bg-secondary/50 rounded-none text-xs">
                            {[
                              { id: "all", label: "All (13)" },
                              { id: "flagship", label: "Own Mine" },
                              { id: "dark", label: "Black & Dark" },
                              { id: "light", label: "White / Light" },
                              { id: "exotic", label: "Blue / Exotic" },
                            ].map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => setCategoryFilter(f.id as CategoryFilter)}
                                className={`px-2.5 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
                                  categoryFilter === f.id
                                    ? "bg-primary text-primary-foreground font-bold"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {f.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Stones Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                          {filteredProducts.map((p) => {
                            const isSelected = selectedProductSlug === p.slug;
                            return (
                              <button
                                key={p.slug}
                                type="button"
                                onClick={() => setSelectedProductSlug(p.slug)}
                                className={`group relative flex flex-col text-left border p-3 transition-all cursor-pointer ${
                                  isSelected
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/50 shadow-md"
                                    : "border-border bg-secondary/20 hover:border-foreground/30 hover:bg-secondary/40"
                                }`}
                              >
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink/30">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  {p.flagship && (
                                    <span className="absolute top-2 left-2 rounded bg-primary px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                                      Captive Mine
                                    </span>
                                  )}
                                </div>

                                <div className="mt-3 flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <h3 className="font-display text-sm font-semibold text-foreground">
                                        {p.name}
                                      </h3>
                                      {isSelected && (
                                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                          <Check className="size-2.5" />
                                        </span>
                                      )}
                                    </div>
                                    <p className="mt-0.5 text-[0.7rem] text-muted-foreground line-clamp-1">
                                      {p.tagline}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex justify-end pt-6 border-t border-border">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 transition-all shadow-md cursor-pointer"
                          >
                            <span>Continue to Specs &amp; Finish</span>
                            <ArrowRight className="size-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: SIZING & FINISH */}
                    {currentStep === 2 && (
                      <div className="space-y-10">
                        <div className="border-b border-border pb-5">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Step 2 of 4
                          </span>
                          <h2 className="mt-1 text-2xl sm:text-3xl font-light text-foreground">
                            Thickness &amp; Surface Treatment
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Configuring for:{" "}
                            <strong className="text-primary">{selectedProduct.name}</strong>
                          </p>
                        </div>

                        {/* Thickness cards */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                            Select Slab Thickness / Format *
                          </label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {thicknesses.map((th) => {
                              const isSelected = selectedThicknessId === th.id;
                              return (
                                <button
                                  key={th.id}
                                  type="button"
                                  onClick={() => setSelectedThicknessId(th.id)}
                                  className={`text-left border p-4 transition-all cursor-pointer ${
                                    isSelected
                                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                                      : "border-border bg-background hover:bg-secondary/30"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-foreground">
                                      {th.label}
                                    </span>
                                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-primary border border-primary/30 px-1.5 py-0.5">
                                      {th.badge}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                                    {th.sub}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Finish options */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                            Select Surface Finish *
                          </label>
                          <div className="space-y-3">
                            {finishes.map((f) => {
                              const isSelected = selectedFinish === f.id;
                              const Icon = f.icon;
                              return (
                                <button
                                  key={f.id}
                                  type="button"
                                  onClick={() => setSelectedFinish(f.id)}
                                  className={`w-full flex items-start gap-3.5 text-left border p-4 transition-all cursor-pointer ${
                                    isSelected
                                      ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                                      : "border-border bg-background hover:bg-secondary/30"
                                  }`}
                                >
                                  <div
                                    className={`flex size-8 shrink-0 items-center justify-center rounded ${
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-muted-foreground"
                                    }`}
                                  >
                                    <Icon className="size-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-foreground">{f.label}</p>
                                      {isSelected && <Check className="size-4 text-primary" />}
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                                      {f.desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Step Navigation */}
                        <div className="flex items-center justify-between pt-6 border-t border-border">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors"
                          >
                            <ArrowLeft className="size-4" />
                            <span>Back to Stone Selection</span>
                          </button>                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 transition-all shadow-md cursor-pointer"
                          >
                            <span>Next: Review &amp; Proforma</span>
                            <ArrowRight className="size-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: BUYER DETAILS & FINAL SUBMIT */}
                    {currentStep === 3 && (
                      <div className="space-y-8">
                        <div className="border-b border-border pb-5">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Step 3 of 3
                          </span>
                          <h2 className="mt-1 text-2xl sm:text-3xl font-light text-foreground">
                            Buyer Information &amp; Submit
                          </h2>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Please provide your corporate contact details to issue your formal RFQ
                            ticket.
                          </p>
                        </div>

                        <div className="space-y-5">
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                                Contact / Procurement Name *
                              </label>
                              <input
                                required
                                type="text"
                                value={buyerName}
                                onChange={(e) => setBuyerName(e.target.value)}
                                placeholder="e.g. Ramesh Reddy / John Doe"
                                className={inputClass}
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                                Company / Firm Name
                              </label>
                              <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="e.g. Miller Stone Importers Inc"
                                className={inputClass}
                              />
                            </div>
                          </div>

                          <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                                Corporate Email *
                              </label>
                              <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. procurement@stonedealer.com"
                                className={inputClass}
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                                Phone / WhatsApp *
                              </label>
                              <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
                                <select
                                  value={countryCode}
                                  onChange={(e) => setCountryCode(e.target.value)}
                                  aria-label="Country Code"
                                  className="border border-border bg-background px-2 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                                >
                                  {countryCodes.map((c) => (
                                    <option key={c.code + c.label} value={c.code}>
                                      {c.flag} {c.code}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  required
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="WhatsApp number"
                                  className={inputClass}
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                              Specific Sizing / Notes / Requirements
                            </label>
                            <textarea
                              rows={3}
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="e.g. Minimum gangsaw slab height 160cm x length 280cm. Dry-lay inspection photos required prior to stuffing..."
                              className={inputClass}
                            />
                          </div>

                          {/* Final Submit Bar */}
                          <div className="rounded border border-border bg-secondary/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold text-foreground">
                                Direct Quarry Proforma Assurance
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Your RFQ is received directly by SSG Granites export sales directors.
                              </p>
                            </div>

                            <button
                              type="submit"
                              disabled={submitting}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary px-9 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="size-4 animate-spin" />
                                  <span>Generating RFQ...</span>
                                </>
                              ) : (
                                <>
                                  <FileCheck2 className="size-4" />
                                  <span>Issue Official Quotation</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setCurrentStep(2)}
                              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <ArrowLeft className="size-3.5" />
                              <span>Back to Sizing &amp; Finish</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: FLOATING LIVE ESTIMATOR SIDEBAR (4 COLS) */}
                  <div className="lg:col-span-4">
                    <div className="sticky top-40 space-y-6">
                      <div className="border border-border bg-secondary/30 p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-border/80 pb-4">
                          <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary">
                            Live RFQ Summary
                          </span>
                          <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase">
                            Step {currentStep} of 3
                          </span>
                        </div>

                        {/* Selected Stone Preview */}
                        <div className="mt-4 flex gap-3.5 items-center">
                          <div className="size-16 shrink-0 overflow-hidden border border-border bg-ink">
                            <img
                              src={selectedProduct.image}
                              alt={selectedProduct.name}
                              className="size-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-display text-base font-bold text-foreground">
                              {selectedProduct.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">{selectedProduct.tagline}</p>
                            {selectedProduct.flagship && (
                              <span className="inline-block mt-1 text-[0.65rem] font-bold text-primary uppercase tracking-wider">
                                Captive Mine
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Live Specs Checklist */}
                        <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Thickness:</span>
                            <span className="font-semibold text-foreground truncate max-w-[170px]">
                              {selectedThickness.label}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Finish:</span>
                            <span className="font-semibold text-foreground">{selectedFinish}</span>
                          </div>
                        </div>

                        {/* Live Container Metric Box */}
                        <div className="mt-6 border border-primary/30 bg-primary/5 p-4 text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-primary text-[0.7rem]">
                            <Scale className="size-3.5" />
                            <span>Payload Calculation</span>
                          </div>
                          <p className="text-muted-foreground">
                            Payload Weight:{" "}
                            <strong className="text-foreground">~27.5 Metric Tons</strong>
                          </p>
                          <p className="text-muted-foreground">
                            Container Packing:{" "}
                            <strong className="text-foreground">7 Fumigated A-Frames</strong>
                          </p>
                          <p className="text-muted-foreground">
                            Port Dispatch:{" "}
                            <strong className="text-foreground">Chennai / Krishnapatnam</strong>
                          </p>
                        </div>

                        {/* Direct Fast-Track Callout */}
                        <div className="mt-6 border-t border-border/70 pt-4">
                          <a
                            href="https://wa.me/917799999555?text=Hello%20SSG%20Granites%2C%20I%20am%20configuring%20an%20RFQ%20for%20Black%20Galaxy%20granite."
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 bg-emerald-600/10 border border-emerald-600/30 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 transition-colors"
                          >
                            <MessageSquare className="size-3.5" />
                            <span>Live WhatsApp Desk</span>
                          </a>
                        </div>
                      </div>

                      {/* Plant Guarantee Card */}
                      <div className="border border-border bg-background p-6 text-xs space-y-3">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider">
                          <ShieldCheck className="size-4" />
                          <span>SSG Export Guarantee</span>
                        </div>
                        <ul className="space-y-2 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">✓</span>
                            <span>Direct captive mine block supply</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">✓</span>
                            <span>Full thickness calibration (± 1mm)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">✓</span>
                            <span>High-gloss optical polish (&gt;90 GU)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">✓</span>
                            <span>Fumigated seaworthy A-frame crating</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
