import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/hooks/useAdminSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff Login — SSG Granites" },
      { name: "description", content: "Authorised portal login for SSG Granites staff." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { isAdmin, user, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated as admin, route directly to leads
  useEffect(() => {
    if (isAdmin) {
      navigate({ to: "/leads", replace: true });
    }
  }, [isAdmin, navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your staff email and password.");
      return;
    }

    setBusy(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !data.user) {
        setError("Invalid email or password.");
        return;
      }

      const isAdm = await checkIsAdmin(data.user.id);
      if (!isAdm) {
        setError(
          "Signed in successfully, but your account is not registered as an administrator. Enquiry data is restricted.",
        );
        return;
      }

      toast.success("Welcome, Administrator");
      navigate({ to: "/leads", replace: true });
    } catch (err: any) {
      console.error(err);
      setError("Connection error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-5 py-16">
      <div className="w-full max-w-md border border-border bg-background p-8 shadow-sm sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center bg-primary/10 text-primary">
            <Lock className="size-5" />
          </span>
          <div>
            <p className="font-display text-base font-semibold uppercase tracking-[0.18em]">
              SSG Granites
            </p>
            <p className="text-xs text-muted-foreground">Staff Administration Portal</p>
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Staff Sign In</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Authorised personnel only. Customer enquiries and buyer contacts are confidential.
        </p>

        {user && !isAdmin && (
          <div className="mt-4 border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
            Currently signed in as <strong>{user.email}</strong> (Non-admin). Please sign in with an admin account below.
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ssggranites.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="w-full cursor-pointer">
            {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
            {busy ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 border-t border-border pt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Return to Storefront (User View)
          </Link>
        </div>
      </div>
    </main>
  );
}
