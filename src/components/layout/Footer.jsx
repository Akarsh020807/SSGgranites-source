import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import logoAsset from "@/assets/logo.jpeg.asset.json";
import { navLinks, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-ink text-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="inline-flex items-center justify-center rounded-lg bg-background/10 p-3 ring-1 ring-primary/30">
            <img src={logoAsset.url} alt="SSG Granites logo" className="h-24 w-auto rounded-sm" />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-background/60">
            Integrated granite mining, processing &amp; export — Black Galaxy, Steel Grey and Black
            Pearl, straight from our own quarry.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Quick Links
          </p>
          <ul className="mt-5 space-y-3 text-sm text-background/70">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Get in Touch
          </p>
          <ul className="mt-5 space-y-3 text-sm text-background/70">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 text-primary" />
              <a href={site.phoneHref} className="hover:text-primary">
                {site.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-primary" />
              <a href={site.emailHref} className="hover:text-primary">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-primary" />
              <span>
                Processing Unit &amp; Quarry Office,
                <br />
                Chimakurthy, Andhra Pradesh, India
              </span>
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            {[Linkedin, Instagram, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex size-9 items-center justify-center border border-background/20 transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-background/40 lg:px-8">
          © 2026 SSG Granites. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
