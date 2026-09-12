import { Link, useNavigate } from "@tanstack/react-router";
import {
  Calculator,
  ChevronDown,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const linkBase =
  "text-sm font-medium tracking-wide text-foreground transition-colors hover:text-primary";

export function Header() {
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/" });
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="group flex items-center gap-4">
            <div className="flex items-center justify-center rounded-lg bg-secondary p-2 ring-1 ring-border/60 shadow-sm">
              <img
                src="/favicon.png"
                alt="SSG Granites logo"
                className="h-14 w-auto rounded-sm object-contain"
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

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-9 md:flex">
            <Link to="/" className={linkBase} activeProps={{ className: "text-primary font-semibold" }}>
              Home
            </Link>
            <Link
              to="/products"
              className={linkBase}
              activeProps={{ className: "text-primary font-semibold" }}
            >
              Products
            </Link>

            {/* Leads CRM link is STRICTLY shown to verified Admins */}
            {isAdmin && (
              <Link
                to="/leads"
                className={linkBase}
                activeProps={{ className: "text-primary font-semibold" }}
              >
                <span className="flex items-center gap-1.5 font-medium text-primary">
                  Leads
                  <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" />
                </span>
              </Link>
            )}

            <Link
              to="/contact"
              className={linkBase}
              activeProps={{ className: "text-primary font-semibold" }}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Admin elevated session indicator */}
            {!loading && isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition-all hover:bg-primary/20 hover:border-primary/50 cursor-pointer"
                  >
                    <span className="size-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
                    <span>Admin</span>
                    <ChevronDown className="size-3.5 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border-border p-1.5 shadow-xl">
                  <div className="px-3 py-2 border-b border-border/70 mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Admin Authenticated
                    </p>
                    <p className="text-xs font-medium text-foreground truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/leads"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground cursor-pointer rounded-sm hover:bg-muted"
                    >
                      <Inbox className="size-4 text-primary" />
                      <span>Leads Management</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground cursor-pointer rounded-sm hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4 text-primary" />
                      <span>Admin Workspace</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-destructive cursor-pointer rounded-sm hover:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="size-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Regular Authenticated User (Customer) */}
            {!loading && user && !isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted cursor-pointer"
                  >
                    <UserIcon className="size-3.5 text-primary" />
                    <span className="max-w-[130px] truncate">
                      {user.user_metadata?.["full_name"] || user.email}
                    </span>
                    <ChevronDown className="size-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 bg-background border-border p-1.5 shadow-xl">
                  <div className="px-3 py-2 border-b border-border/70 mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Customer Account
                    </p>
                    <p className="text-xs font-medium text-foreground truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/quote"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground cursor-pointer rounded-sm hover:bg-muted"
                    >
                      <Calculator className="size-3.5 text-primary" />
                      <span>Request Granite Quote</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-destructive cursor-pointer rounded-sm hover:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Guest / Visitor: Sign In button */}
            {!loading && !user && (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <UserIcon className="size-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <Link
              to="/quote"
              className="flex items-center gap-2 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-all hover:bg-brown shadow-sm"
            >
              <Calculator className="size-4" />
              Get a Quote
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="text-foreground md:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
              <Link to="/" className="py-3 text-sm" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="py-3 text-sm" onClick={() => setOpen(false)}>
                Products
              </Link>

              {/* Leads CRM strictly in mobile menu only for verified Admins */}
              {isAdmin && (
                <Link
                  to="/leads"
                  className="flex items-center justify-between py-3 text-sm font-medium text-primary"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    Leads Management
                  </span>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-primary">
                    Admin
                  </span>
                </Link>
              )}

              <Link
                to="/contact"
                className="py-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                Contact Us
              </Link>

              {/* Mobile Auth actions */}
              {!loading && !user && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-2 border border-border bg-secondary py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <UserIcon className="size-3.5" />
                  <span>Customer Sign In / Register</span>
                </button>
              )}

              {user && (
                <div className="mt-2 border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground px-1 truncate">
                    Logged in as{" "}
                    <span className="font-medium text-foreground">
                      {user.user_metadata?.["full_name"] || user.email}
                    </span>
                    {isAdmin && (
                      <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold uppercase text-primary">
                        Admin
                      </span>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleSignOut();
                    }}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    Sign Out
                  </button>
                </div>
              )}

              <Link
                to="/quote"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 bg-primary px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground shadow-sm"
              >
                <Calculator className="size-4" />
                Get a Quote
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Customer / Admin Auth Dialog */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
