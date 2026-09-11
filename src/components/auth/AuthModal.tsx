import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, Lock, Sparkles, User, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/hooks/useAdminSession";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
}

export function AuthModal({ open, onOpenChange, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setEmail("");
    setPassword("");
    setFullName("");
    setShowPassword(false);
    setError(null);
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setBusy(true);
    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInErr || !data.user) {
        setError(signInErr?.message || "Invalid email or password.");
        return;
      }

      const isAdmin = await checkIsAdmin(data.user.id);
      if (isAdmin) {
        toast.success("Welcome back, Administrator");
      } else {
        toast.success(`Welcome back, ${data.user.user_metadata?.full_name || data.user.email}`);
      }

      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      setError("Failed to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setBusy(true);
    try {
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (signUpErr) {
        setError(signUpErr.message);
        return;
      }

      if (data.session) {
        toast.success("Account created successfully!");
        resetForm();
        onOpenChange(false);
      } else {
        toast.success("Account created! Please check your email to confirm your account.");
        resetForm();
        onOpenChange(false);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to create account. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[420px] bg-background border border-border p-6 shadow-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </span>
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              SSG Granites
            </span>
          </div>
          <DialogTitle className="text-xl font-semibold mt-2">
            {tab === "signin" ? "Sign In to Your Account" : "Create Customer Account"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {tab === "signin"
              ? "Access your saved granite enquiries, pricing quotes, and order requests."
              : "Register to track granite enquiries and request custom block inspections."}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="mt-4 flex rounded-md bg-secondary p-1">
          <button
            type="button"
            onClick={() => {
              setTab("signin");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold transition-all rounded ${
              tab === "signin"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold transition-all rounded ${
              tab === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        {tab === "signin" ? (
          <form onSubmit={handleSignIn} className="mt-4 space-y-4" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="modal-email"
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </label>
              <input
                id="modal-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="modal-password"
                  className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="modal-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground focus:border-primary focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-brown disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="size-3.5 animate-spin" />}
              {busy ? "Signing in…" : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="mt-4 space-y-3.5" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="modal-fullname"
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Full Name / Company
              </label>
              <input
                id="modal-fullname"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe / Apex Builders"
                className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="modal-signup-email"
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Work Email
              </label>
              <input
                id="modal-signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@granite-import.com"
                className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="modal-signup-password"
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Create Password (min. 6 characters)
              </label>
              <div className="relative">
                <input
                  id="modal-signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground focus:border-primary focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-brown disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="size-3.5 animate-spin" />}
              {busy ? "Creating Account…" : "Create Account"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
