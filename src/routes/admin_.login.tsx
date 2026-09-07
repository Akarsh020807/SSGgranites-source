import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/hooks/useAdminSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login — SSG Granites" },
      { name: "description", content: "Secure sign-in for the SSG Granites enquiry dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — SSG Granites" },
      { property: "og:description", content: "Secure sign-in for the SSG Granites dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (!user || !active) return;
      if (await checkIsAdmin(user.id)) navigate({ to: "/admin", replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setBusy(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !data.user) {
        setError("Incorrect email or password.");
        return;
      }

      const isAdmin = await checkIsAdmin(data.user.id);
      if (!isAdmin) {
        await supabase.auth.signOut();
        setError("This account is not authorised to access the dashboard.");
        return;
      }

      navigate({ to: "/admin", replace: true });
    } catch (err) {
      console.error(err);
      setError("We couldn't sign you in. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-5 py-16">
      <div className="w-full max-w-md border border-border bg-background p-8 shadow-sm sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-[0.18em]">
              SSG Granites
            </p>
            <p className="text-xs text-muted-foreground">Enquiry management</p>
          </div>
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Authorised staff only. Enquiry data is confidential.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
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
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
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

          <Button type="submit" disabled={busy} className="w-full">
            {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">
          ← Back to website
        </Link>
      </div>
    </main>
  );
}
