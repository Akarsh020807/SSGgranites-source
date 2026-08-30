import { Mail, MapPin, Phone, Truck } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/layout/Reveal";
import { submitEnquiry } from "@/backend/contact.functions";
import { site } from "@/data/site";

const field =
  "w-full border border-background/20 bg-transparent px-4 py-3 text-sm text-background placeholder:text-background/40 focus:border-primary focus:outline-none";

export function ContactSection() {
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    form.reset();
    setSent(true);
    try {
      await submitEnquiry({ data });
    } catch (error) {
      console.error(error);
    }
  }

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
                  <a href={site.phoneHref} className="text-base hover:text-primary">
                    {site.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1 size-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-background/40">Email</p>
                  <a href={site.emailHref} className="text-base hover:text-primary">
                    {site.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 size-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-background/40">Address</p>
                  <p className="text-base leading-relaxed text-background/80">
                    {site.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
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
