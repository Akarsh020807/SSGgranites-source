import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import logoAsset from "@/assets/logo.jpeg.asset.json";

export function Footer() {
  return (
    <footer className="bg-ink text-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-3 lg:px-8">
        <div>
          <img
            src={logoAsset.url}
            alt="SSG Granites logo"
            className="h-16 w-auto rounded-sm"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/60">
            Integrated granite mining, processing &amp; export — Black Galaxy, Steel Grey and Black
            Pearl, straight from our own quarry.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Quick Links
          </p>
          <ul className="mt-5 space-y-3 text-sm text-background/70">
            <li>
              <Link to="/" className="transition-colors hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition-colors hover:text-primary">
                Products
              </Link>
            </li>
            <li>
              <Link to="/" hash="contact" className="transition-colors hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Get in Touch
          </p>
          <ul className="mt-5 space-y-3 text-sm text-background/70">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 text-primary" />
              <a href="tel:+919000000000" className="hover:text-primary">
                +91 90000 00000
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-primary" />
              <a href="mailto:sales@ssggranites.com" className="hover:text-primary">
                sales@ssggranites.com
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
