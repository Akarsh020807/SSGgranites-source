import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const linkBase =
  "text-sm font-medium tracking-wide text-foreground transition-colors hover:text-primary";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="group flex flex-col leading-none">
          <span className="font-display text-2xl tracking-[0.18em] text-foreground">
            SSG GRANITES
          </span>
          <span className="mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-primary">
            Mine · Process · Export
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
