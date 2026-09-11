import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Lock, Mail, MapPin, Phone } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export function Footer() {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-ink text-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="inline-flex items-center justify-center rounded-lg bg-background/10 p-3 ring-1 ring-primary/30">
            <img
              src="/favicon.png"
              alt="SSG Granites logo"
              className="h-16 w-auto rounded-sm object-contain"
            />
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

            {/* If Admin is logged in, show the Leads link */}
            {isAdmin && (
              <li>
                <Link
                  to="/leads"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  <span>Leads Management</span>
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                    Admin
                  </span>
                </Link>
              </li>
            )}

            <li>
              <Link to="/quote" className="transition-colors hover:text-primary font-medium text-primary/90">
                Request a Quote (RFQ)
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-primary">
                Contact &amp; Plant Visit
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
              <a href="tel:+917799999555" className="hover:text-primary transition-colors font-medium">
                +91 77999 99555
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-primary" />
              <a href="mailto:srisuryagranites5@gmail.com" className="hover:text-primary transition-colors">
                srisuryagranites5@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-primary" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Processing+Unit+%26+Quarry+Office,+Chimakurthy,+Andhra+Pradesh,+India"
                target="_blank"
                rel="noreferrer"
                className="group hover:text-primary transition-colors leading-relaxed"
                title="Open in Google Maps"
              >
                <span>
                  Processing Unit &amp; Quarry Office,
                  <br />
                  Chimakurthy, Andhra Pradesh, India
                </span>
                <span className="block text-[0.7rem] text-primary mt-1 font-semibold group-hover:underline">
                  Open in Google Maps ↗
                </span>
              </a>
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-background/40 sm:flex-row lg:px-8">
          <p>© 2026 SSG Granites. All rights reserved.</p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1 text-background/30 transition-colors hover:text-background/70"
            title="Authorized Staff Portal"
          >
            <Lock className="size-3" />
            <span>Staff Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
