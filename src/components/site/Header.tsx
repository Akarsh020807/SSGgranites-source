import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

import logoAsset from "@/assets/logo.jpeg.asset.json";

const linkBase =
  "text-sm font-medium tracking-wide text-foreground transition-colors hover:text-primary";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-4">
          <div className="flex items-center justify-center rounded-lg bg-secondary p-2 ring-1 ring-border/60 shadow-sm">
            <img
              src={logoAsset.url}
              alt="SSG Granites logo"
              className="h-16 w-auto rounded-sm"
            />
          </div>
          <span className="flex flex-col leading-none">
            <span className="font-display text-3xl tracking-[0.16em] text-foreground">
              SSG GRANITES
            </span>
            <span className="mt-1.5 text-[0.7rem] uppercase tracking-[0.28em] text-primary">
              Mine · Process · Export
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          <Link to="/" className={linkBase} activeProps={{ className: "text-primary" }}>
            Home
          </Link>
          <Link to="/products" className={linkBase} activeProps={{ className: "text-primary" }}>
            Products
          </Link>
          <Link to="/" hash="contact" className={linkBase}>
            Contact Us
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="tel:+919000000000"
            className="flex items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-brown"
          >
            <Phone className="size-4" />
            Get a Quote
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-foreground md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            <Link to="/" className="py-3 text-sm" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="py-3 text-sm" onClick={() => setOpen(false)}>
              Products
            </Link>
            <Link to="/" hash="contact" className="py-3 text-sm" onClick={() => setOpen(false)}>
              Contact Us
            </Link>
            <a
              href="tel:+919000000000"
              className="mt-2 bg-primary px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Get a Quote
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
