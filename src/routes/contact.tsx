import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  Eye,
  FileCheck,
  HelpCircle,
  Layers,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Mountain,
  Navigation,
  Phone,
  Plane,
  Radio,
  Send,
  ShieldCheck,
  Ship,
  Sparkles,
  Train,
  Truck,
  Users,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { countryCodes } from "@/lib/country-codes";
import { createLead } from "@/services/leadService";

// Real plant photos
import quarryImg from "@/assets/quarry.jpg";
import polishingImg from "@/assets/polishing.jpg";
import exportImg from "@/assets/export.jpg";
import qualityImg from "@/assets/quality.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Headquarters & Quarry Inspection Desk | SSG Granites" },
      {
        name: "description",
        content:
          "Connect directly with SSG Granites captive quarry and processing plant in Chimakurthy, Andhra Pradesh. Schedule block inspection visits and coordinate international container export dispatch.",
      },
      { property: "og:title", content: "Contact Headquarters & Quarry Inspection Desk | SSG Granites" },
      {
        property: "og:description",
        content:
          "Direct plant access, quarry inspection bookings, and global container export dispatch via Chennai & Krishnapatnam ports.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

const faqs = [
  {
    q: "Can international buyers inspect raw granite blocks directly at the quarry?",
    a: "Yes. We regularly host stone procurement delegations from China, Europe, the USA, and the Middle East for live block selection at our Chimakurthy captive mine and dressing yards prior to gang-saw slicing. Prior appointment is recommended so our quarry directors can prepare transport and block records.",
  },
  {
    q: "What is your standard procedure for container export documentation?",
    a: "We manage the entire export chain: factory slab processing, ISPM-15 fumigated wooden A-frame packaging, customs documentation, container stuffing, and transport to Chennai or Krishnapatnam port under FOB or CIF Incoterms with Phytosanitary and Certificate of Origin.",
  },
  {
    q: "Do you supply physical stone sample kits for architects and builders?",
    a: "Yes. We courier 10x10 cm and 15x15 cm polished/honed granite specimens worldwide via DHL/FedEx for material sign-off and laboratory ASTM/EN testing.",
  },
  {
    q: "What is the recommended travel route to visit the Chimakurthy plant?",
    a: "Fly into Vijayawada International Airport (VGA, 155 km / 3 hrs drive) or Chennai International Airport (MAA, 290 km / 5 hrs drive). Ongole Railway Station (OGL, 22 km) has direct superfast express trains from Chennai, Hyderabad, and Bangalore. Our reception desk provides local driver transfers.",
  },
];

const facilities = [
  {
    title: "Captive Quarry Pit",
    location: "Chimakurthy Mining Cluster",
    desc: "Direct block extraction from our licensed mine. Deep-quarried rough blocks with tight fleck and colour consistency.",
    image: quarryImg,
    badge: "Mine Site",
  },
  {
    title: "Processing & Polishing Unit",
    location: "R.L. Puram Industrial Corridor",
    desc: "Multi-blade gang-saw machines and 16-head automated Italian polishing lines ensuring optical gloss >90 GU.",
    image: polishingImg,
    badge: "Plant Floor",
  },
  {
    title: "Export Yard & Stuffing Bays",
    location: "National Highway 16 Corridor",
    desc: "Heavy-duty gantry cranes and certified fumigated A-frame packaging for fast 24-hr transit to Chennai and Krishnapatnam ports.",
    image: exportImg,
    badge: "Port Logistics",
  },
];

const inputClass =
  "w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

function ContactPage() {
  const [formType, setFormType] = useState<"general" | "visit">("visit");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Quarry & Plant Inspection Visit");
  const [visitDate, setVisitDate] = useState("");
  const [delegateCount, setDelegateCount] = useState("1-2 Persons");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    if (honeypot) {
      // Bot trapped
      setSubmitted(true);
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill in all required contact details.");
      return;
    }

    setSubmitting(true);
    try {
      const formattedPhone = `${countryCode} ${phone.trim()}`;
      const compiledSubject = `[${department}] Inquiry from ${fullName.trim()} (${companyName.trim() || "Private"})`;
      
      const detailsList = [
        `Category: ${department}`,
        `Company / Firm: ${companyName.trim() || "Not specified"}`,
        formType === "visit" && visitDate ? `Requested Visit Date: ${visitDate}` : null,
        formType === "visit" ? `Visiting Delegation Size: ${delegateCount}` : null,
        `\nMessage / Specific Requirements:\n${message.trim()}`,
      ]
        .filter(Boolean)
        .join("\n");

      await createLead({
        name: fullName.trim(),
        email: email.trim(),
        phone: formattedPhone,
        subject: compiledSubject,
        message: detailsList,
        source: formType === "visit" ? "Plant Visit Booking" : "Direct Contact Desk",
        priority: department.includes("Visit") ? "Urgent" : "Normal",
      });

      setSubmitted(true);
      toast.success("Thank you! Your communication has been dispatched to our operations team.");
    } catch (err: any) {
      console.error("Contact submission error:", err);
      toast.error(err?.message || "Failed to deliver message. Please try again or reach out on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setFullName("");
    setCompanyName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setVisitDate("");
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Top Operational Header */}
        <section className="relative border-b border-border bg-gradient-to-b from-secondary/80 via-secondary/40 to-background py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Mountain className="size-3.5" />
                  <span>Mine &amp; Plant Operations Headquarters</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-full border border-border bg-background px-3.5 py-1 text-xs text-muted-foreground shadow-sm">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-foreground">Operational Now</span>
                  <span className="opacity-40">•</span>
                  <span>08:00 – 18:30 IST</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
                    Connect Directly with <br className="hidden sm:inline" />
                    <span className="font-semibold text-primary">SSG Granites Plant Floor</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Direct communication with our Chimakurthy quarry management, block dressing yards,
                    and ocean container export dispatch desk. We welcome international inspection
                    delegations and commercial partnerships.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono border-l-2 border-primary/40 pl-6 text-muted-foreground">
                  <div>
                    <span className="block font-sans text-xs uppercase tracking-wider text-primary font-bold">
                      GPS Coordinates
                    </span>
                    <span className="text-foreground">15.5843° N, 79.8711° E</span>
                  </div>
                  <div className="border-l border-border pl-4">
                    <span className="block font-sans text-xs uppercase tracking-wider text-primary font-bold">
                      District
                    </span>
                    <span className="text-foreground">Prakasam, AP, India</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3 OPERATIONAL HUBS MATRIX */}
        <section className="py-12 border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Hub 1 */}
              <div className="flex flex-col justify-between border border-border bg-background p-8 shadow-sm transition-all hover:border-primary/50">
                <div>
                  <div className="flex size-12 items-center justify-center rounded bg-primary/10 text-primary">
                    <Mountain className="size-6" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">Captive Mine &amp; Factory</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Chimakurthy Processing Hub
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    R.L. Puram Road, Chimakurthy,
                    <br />
                    Prakasam District, Andhra Pradesh 523226, India.
                  </p>

                  <div className="mt-6 space-y-2 text-xs text-muted-foreground border-t border-border/80 pt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-primary" />
                      <span>Mon – Sat: 8:00 AM – 6:30 PM IST</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-primary" />
                      <a href="tel:+919000000000" className="hover:text-primary transition-colors font-medium">
                        +91 90000 00000
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between">
                  <a
                    href="https://maps.google.com/?q=Chimakurthy+Andhra+Pradesh"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
                  >
                    <span>Google Maps Pin</span>
                    <ExternalLink className="size-3" />
                  </a>
                  <span className="text-[0.65rem] uppercase font-bold text-muted-foreground">
                    Plant Reception
                  </span>
                </div>
              </div>

              {/* Hub 2 */}
              <div className="flex flex-col justify-between border border-border bg-background p-8 shadow-sm transition-all hover:border-primary/50">
                <div>
                  <div className="flex size-12 items-center justify-center rounded bg-primary/10 text-primary">
                    <Ship className="size-6" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">Global Export Shipping</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Container &amp; Port Logistics
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Full 20ft container handling, seaworthy ISPM-15 fumigated A-frame packing, ocean bill of
                    lading &amp; Phytosanitary clearance.
                  </p>

                  <div className="mt-6 space-y-2 text-xs text-muted-foreground border-t border-border/80 pt-4">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 text-primary" />
                      <a href="mailto:srisuryagranites5@gmail.com" className="hover:text-primary transition-colors font-medium">
                        srisuryagranites5@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck className="size-3.5 text-primary" />
                      <span>FOB Chennai / Krishnapatnam, CIF Worldwide</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between">
                  <Link
                    to="/quote"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
                  >
                    <span>Configure Container RFQ</span>
                    <ArrowRight className="size-3" />
                  </Link>
                  <span className="text-[0.65rem] uppercase font-bold text-muted-foreground">
                    Export Desk
                  </span>
                </div>
              </div>

              {/* Hub 3 */}
              <div className="flex flex-col justify-between border border-border bg-background p-8 shadow-sm transition-all hover:border-primary/50">
                <div>
                  <div className="flex size-12 items-center justify-center rounded bg-primary/10 text-primary">
                    <Building2 className="size-6" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">Architects &amp; Wholesale</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Commercial Project Supply
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    Supplying cut-to-size cladding, vanity slabs, tiles, and monument stock for
                    hospitality, commercial towers, and national distributors.
                  </p>

                  <div className="mt-6 space-y-2 text-xs text-muted-foreground border-t border-border/80 pt-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="size-3.5 text-primary" />
                      <span>Instant WhatsApp Operational Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="size-3.5 text-primary" />
                      <span>Dedicated All-India Fleet Dispatch</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between">
                  <a
                    href="https://wa.me/919000000000?text=Hello%20SSG%20Granites%2C%20I%20am%20interested%20in%20commercial%20granite%20supply"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="size-3" />
                  </a>
                  <span className="text-[0.65rem] uppercase font-bold text-muted-foreground">
                    Wholesale
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PHOTO SHOWCASE: REAL QUARRY & FACTORY FLOORS */}
        <section className="py-16 border-b border-border">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    Integrated Operations
                  </p>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-light text-foreground">
                    Our Mine, Factory &amp; Export Infrastructure
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground max-w-md">
                  We invite clients to witness every stage: rough block quarrying, diamond gang-saw
                  slicing, multi-head polishing, and seaworthy container loading.
                </p>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {facilities.map((fac) => (
                  <div key={fac.title} className="group overflow-hidden border border-border bg-secondary/20">
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                      <img
                        src={fac.image}
                        alt={fac.title}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute bottom-3 left-3 rounded bg-ink/80 backdrop-blur-sm px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-background">
                        {fac.badge}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-base font-bold text-foreground">{fac.title}</h3>
                      <p className="text-[0.7rem] uppercase tracking-wider text-primary mt-0.5">
                        {fac.location}
                      </p>
                      <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                        {fac.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* MAIN SECTION: VISIT APPOINTMENT & INQUIRY FORM */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-12">
              {/* Left Column: Form (7 COLS) */}
              <div className="lg:col-span-7">
                <Reveal>
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        Direct Factory Access
                      </p>
                      <h2 className="mt-1 text-3xl sm:text-4xl font-light text-foreground">
                        Schedule an Inspection or Submit an Inquiry
                      </h2>
                    </div>

                    {/* Form type toggle */}
                    <div className="flex border border-border p-0.5 bg-secondary text-xs">
                      <button
                        type="button"
                        onClick={() => setFormType("visit")}
                        className={`px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                          formType === "visit"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Book Visit
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormType("general")}
                        className={`px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                          formType === "general"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        General Inquiry
                      </button>
                    </div>
                  </div>

                  {submitted ? (
                    <div className="mt-8 border border-primary/40 bg-primary/5 p-8 text-center sm:p-12">
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="size-8" />
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-foreground">
                        {formType === "visit"
                          ? "Plant Visit Request Logged!"
                          : "Communication Dispatched"}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                        Thank you for contacting SSG Granites. A member of our operations and sales
                        directorate will contact you within 12 hours via phone or email to organize your
                        itinerary.
                      </p>

                      <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="bg-secondary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-secondary/80 transition-colors"
                        >
                          Submit Another Request
                        </button>
                        <a
                          href="https://wa.me/919000000000?text=Hello%20SSG%20Granites%2C%20I%20have%20submitted%20a%20factory%20visit%20request%20on%20your%20portal."
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors"
                        >
                          <MessageSquare className="size-4" />
                          <span>Instant WhatsApp Coordination</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      {/* Honeypot field */}
                      <input
                        type="text"
                        name="contact_bypass"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                      />

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                            Full Name *
                          </label>
                          <input
                            required
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. David Miller / Rajesh Varma"
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
                              placeholder="Phone / WhatsApp"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Visit specific inputs */}
                      {formType === "visit" ? (
                        <div className="grid gap-6 sm:grid-cols-2 bg-secondary/30 p-5 border border-border">
                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                              Anticipated Visit Date *
                            </label>
                            <input
                              required
                              type="date"
                              value={visitDate}
                              onChange={(e) => setVisitDate(e.target.value)}
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                              Visiting Delegation Size
                            </label>
                            <select
                              value={delegateCount}
                              onChange={(e) => setDelegateCount(e.target.value)}
                              className={inputClass}
                            >
                              <option value="1-2 Persons">1 to 2 Persons</option>
                              <option value="3-5 Persons (Delegation)">3 to 5 Persons (Delegation)</option>
                              <option value="6+ Persons (Commercial Team)">
                                6+ Persons (Commercial Team)
                              </option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                            Inquiry Department *
                          </label>
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className={inputClass}
                          >
                            <option value="Quarry & Plant Inspection Visit">
                              Quarry &amp; Factory Inspection Visit (Chimakurthy)
                            </option>
                            <option value="Dealership & Wholesale">
                              Dealership &amp; Domestic Wholesale Distribution
                            </option>
                            <option value="Export Logistics & Ocean Freight">
                              Export Documentation &amp; Port Freight Inquiries
                            </option>
                            <option value="Architectural Custom Cuts">
                              Commercial Project Supply (Custom Cut-to-size)
                            </option>
                            <option value="Sample Box Courier">
                              Physical Granite Sample Box Courier
                            </option>
                            <option value="General Information">General Business Inquiry</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/80">
                          {formType === "visit"
                            ? "Specific Blocks / Stones you wish to inspect *"
                            : "Message / Specific Requirements *"}
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={
                            formType === "visit"
                              ? "Mention if you are interested in rough block inspection, dry-lay gang-saw slab approval, thickness calibration, or container dispatch..."
                              : "Provide details regarding your project scope, intended timeline, or technical requirements..."
                          }
                          className={inputClass}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center gap-3 bg-primary px-9 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 transition-all shadow-md cursor-pointer disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              <span>Dispatching...</span>
                            </>
                          ) : (
                            <>
                              <Send className="size-4" />
                              <span>
                                {formType === "visit"
                                  ? "Confirm Inspection Booking"
                                  : "Submit Inquiry"}
                              </span>
                            </>
                          )}
                        </button>

                        <p className="text-xs text-muted-foreground">
                          Direct Entry to Chimakurthy Plant Desk.
                        </p>
                      </div>
                    </form>
                  )}
                </Reveal>
              </div>

              {/* Right Column: Travel Logistics & Airport Transfers (5 COLS) */}
              <div className="lg:col-span-5 space-y-8">
                <Reveal delay={100}>
                  <div className="border border-border bg-secondary/40 p-8 shadow-sm">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <Navigation className="size-4" />
                      <span>Visiting Delegations Guide</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold">How to Reach Chimakurthy</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      Chimakurthy is globally recognized as the exclusive geological belt for authentic
                      Black Galaxy granite. We provide local reception and chauffeur transport for
                      approved international stone buyers.
                    </p>

                    <div className="mt-6 space-y-4">
                      {/* Flights */}
                      <div className="flex items-start gap-3 border-t border-border/70 pt-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded bg-background text-primary">
                          <Plane className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Gateway Airports
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            <strong className="text-foreground">Vijayawada (VGA)</strong> — 155 km
                            (~3 hrs via NH-16)
                            <br />
                            <strong className="text-foreground">Chennai (MAA)</strong> — 290 km (~5
                            hrs via NH-16)
                          </p>
                        </div>
                      </div>

                      {/* Rail */}
                      <div className="flex items-start gap-3 border-t border-border/70 pt-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded bg-background text-primary">
                          <Train className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Nearest Railway Hub
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            <strong className="text-foreground">Ongole (OGL)</strong> — 22 km. Main
                            express trunk line with direct high-speed trains from Chennai, Hyderabad, and
                            Bangalore.
                          </p>
                        </div>
                      </div>

                      {/* Ocean Port */}
                      <div className="flex items-start gap-3 border-t border-border/70 pt-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded bg-background text-primary">
                          <Ship className="size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Ocean Container Ports
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Chennai Port (280 km) &amp; Krishnapatnam Port (170 km). Daily 24-hr dedicated
                            trailer transit.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Estimator Callout */}
                  <div className="border border-primary/40 bg-primary/5 p-8 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Looking for Container Rates?
                    </p>
                    <h4 className="mt-2 text-xl font-semibold">Granite Quotation Estimator</h4>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Need immediate FOB/CIF container pricing or cut-to-size square footage
                      calculations? Use our 4-step RFQ configurator.
                    </p>
                    <Link
                      to="/quote"
                      className="mt-5 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <span>Open Quote Estimator</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="border-t border-border bg-secondary/20 py-20">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <HelpCircle className="size-4" />
                <span>Trade Protocols</span>
              </div>
              <h2 className="mt-3 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Trade &amp; Visit Questions
              </h2>
            </div>

            <div className="mt-12 space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border bg-background p-6 sm:p-7 shadow-sm">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {faq.q}
                  </h3>
                  <p className="mt-3 pl-9 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
