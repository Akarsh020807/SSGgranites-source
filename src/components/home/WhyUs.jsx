import { Anchor, BadgeCheck, Mountain, Tag } from "lucide-react";

import { Reveal } from "@/components/layout/Reveal";

const trust = [
  { icon: Mountain, title: "Own Mining, Consistent Supply", text: "No middlemen between quarry face and your order." },
  { icon: BadgeCheck, title: "Strict Quality Selection", text: "Every slab graded before it leaves the yard." },
  { icon: Anchor, title: "Export-Ready Processing", text: "Container-grade packing and documentation." },
  { icon: Tag, title: "Direct-from-Source Pricing", text: "Owning the mine keeps our numbers competitive." },
];

export function WhyUs() {
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
