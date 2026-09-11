import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Globe, Inbox, LayoutDashboard, Loader2, LogOut, Menu, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
});

const nav = [
  { to: "/leads", label: "Leads Management", icon: Inbox, exact: true },
  { to: "/admin", label: "Admin Overview", icon: LayoutDashboard, exact: true },
  { to: "/", label: "Storefront (User View)", icon: Globe, exact: true },
] as const;

function AdminLayout() {
  const { loading, session, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/admin/login", replace: true });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    navigate({ to: "/admin/login", replace: true });
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-5">
        <div className="max-w-md border border-border bg-background p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto size-8 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold">Access Denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account ({session.user.email}) is not authorised to view administrative enquiry records.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={handleSignOut} variant="destructive">
              Sign out &amp; Switch Account
            </Button>
            <Button onClick={() => navigate({ to: "/" })} variant="outline">
              Return to Storefront
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const Sidebar = (
    <nav className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-5">
        <p className="font-display text-base font-semibold uppercase tracking-[0.18em]">
          SSG Granites
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">Administration</p>
      </div>
      <ul className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-border p-3">
        <p className="truncate px-3 pb-2 text-xs text-muted-foreground">{session.user.email}</p>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-background lg:block">
        {Sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-background shadow-xl">{Sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <span className="font-display text-sm font-semibold uppercase tracking-[0.18em]">
            SSG Admin
          </span>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
