import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Globe,
  Inbox,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/hooks/useAdminSession";
import type { Lead, LeadStatus } from "@/types/lead";

export const Route = createFileRoute("/leads")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Enquiry Leads & Orders — SSG Granites" },
      {
        name: "description",
        content: "Track, manage and contact buyer enquiries for SSG Granites.",
      },
    ],
  }),
  component: LeadsPage,
});

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  New: {
    label: "New",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/30",
  },
  Contacted: {
    label: "Contacted",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30",
  },
  "Follow Up": {
    label: "Follow Up",
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/30",
  },
  Qualified: {
    label: "Qualified",
    bg: "bg-cyan-500/10",
    text: "text-cyan-500",
    border: "border-cyan-500/30",
  },
  Converted: {
    label: "Converted",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/30",
  },
  Closed: {
    label: "Closed",
    bg: "bg-stone-500/10",
    text: "text-stone-400",
    border: "border-stone-500/30",
  },
  Spam: {
    label: "Spam",
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/30",
  },
};

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function LeadsPage() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Unauthenticated Staff Sign-In form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Fetch leads whenever verified admin status is active
  useEffect(() => {
    if (isAdmin) {
      fetchLeads();
    }
  }, [isAdmin]);

  async function fetchLeads(showToast = false) {
    try {
      if (showToast) setRefreshing(true);
      else setLoadingLeads(true);

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setLeads((data as Lead[]) || []);
      if (showToast) {
        toast.success(`Refreshed: ${data?.length || 0} enquiries loaded`);
      }
    } catch (err: any) {
      console.error("Error fetching leads:", err);
      toast.error("Failed to load leads: " + (err.message || "Permission issue"));
    } finally {
      setLoadingLeads(false);
      setRefreshing(false);
    }
  }

  async function handleStatusChange(leadId: string, nextStatus: LeadStatus) {
    try {
      setUpdatingId(leadId);
      const { error } = await supabase
        .from("leads")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? { ...l, status: nextStatus, updated_at: new Date().toISOString() }
            : l,
        ),
      );
      toast.success(`Status updated to "${nextStatus}"`);
    } catch (err: any) {
      console.error("Status update error:", err);
      toast.error("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(leadId: string, name: string) {
    if (!confirm(`Are you sure you want to archive the enquiry from ${name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("leads")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;

      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      toast.success(`Enquiry from ${name} archived`);
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error("Failed to delete enquiry: " + err.message);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  }

  async function handleInlineLogin(e: FormEvent) {
    e.preventDefault();
    if (loginBusy) return;
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Please enter your admin email and password.");
      return;
    }

    setLoginBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error || !data.user) {
        setLoginError("Incorrect email or password.");
        return;
      }

      const isAdm = await checkIsAdmin(data.user.id);
      if (!isAdm) {
        setLoginError(
          "Authentication succeeded, but this account is not registered as an administrator. Enquiry data is restricted.",
        );
        return;
      }

      toast.success("Welcome back, Administrator");
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError("Connection error. Please try again.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/" });
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" || lead.status.toLowerCase() === statusFilter.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.subject && lead.subject.toLowerCase().includes(q)) ||
        lead.message.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "New").length;
    const contacted = leads.filter((l) => l.status === "Contacted" || l.status === "Follow Up")
      .length;
    const converted = leads.filter((l) => l.status === "Converted").length;
    return { total, newCount, contacted, converted };
  }, [leads]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
        {/* Loading State during initial session resolution */}
        {authLoading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-24 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="font-display text-lg">Verifying Access Privileges...</p>
            <p className="text-xs text-muted-foreground">Checking authentication status</p>
          </div>
        ) : !user ? (
          /* State 1: Unauthenticated Visitor -> Dedicated Staff Sign-In Card */
          <div className="mx-auto my-12 max-w-md border border-border bg-card p-8 shadow-sm sm:p-10">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center bg-primary/10 text-primary">
                <Lock className="size-5" />
              </span>
              <div>
                <p className="font-display text-base font-semibold uppercase tracking-[0.18em]">
                  Staff Portal
                </p>
                <p className="text-xs text-muted-foreground">SSG Granites Administration</p>
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight">Admin Sign In</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Customer enquiry records are confidential. Please sign in with authorised staff credentials to view leads.
            </p>

            <form onSubmit={handleInlineLogin} className="mt-6 space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Staff Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@ssggranites.com"
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2.5 pr-10 text-sm text-foreground focus:border-primary focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginBusy}
                className="w-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-brown disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loginBusy && <Loader2 className="size-4 animate-spin" />}
                {loginBusy ? "Signing in…" : "Sign In & Access Leads"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft className="size-3.5" />
                Back to Website
              </Link>
              <Link to="/admin/login" className="hover:text-primary transition-colors">
                Dedicated Portal &rarr;
              </Link>
            </div>
          </div>
        ) : !isAdmin ? (
          /* State 2: Signed in but NOT an Admin -> Access Denied Card */
          <div className="mx-auto my-16 max-w-md border border-destructive/30 bg-background p-8 text-center sm:p-10 shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="size-7" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-foreground">Administrator Access Required</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You are signed in as <span className="font-semibold text-foreground">{user.email}</span>. This account does not have permission to view enquiry records.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full bg-destructive px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-destructive-foreground transition-colors hover:bg-destructive/90 cursor-pointer"
              >
                Sign Out &amp; Switch Account
              </button>

              <Link
                to="/"
                className="w-full border border-border bg-secondary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary hover:text-primary text-center"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        ) : (
          /* State 3: Verified Admin View -> Full Leads CRM Dashboard */
          <>
            {/* Admin Header Context Banner */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-primary/20 bg-primary/5 px-4 py-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold uppercase tracking-wider text-primary">Admin Session</span>
                <span className="text-muted-foreground">• Confidential pipeline for {user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Globe className="size-3.5" />
                  <span>View Storefront (User View)</span>
                </Link>
                <span className="text-border">|</span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1 text-destructive hover:underline cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Top Breadcrumb & Actions Bar */}
            <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="eyebrow">Quarry-to-Market Management</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wider text-primary">
                    Live Supabase
                  </span>
                </div>
                <h1 className="mt-2 text-3xl sm:text-4xl">Client Enquiries &amp; Leads</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review customer requirements, manage enquiry pipeline, and contact prospective buyers
                  directly.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  hash="contact"
                  className="inline-flex items-center gap-2 border border-border bg-secondary px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Send className="size-3.5" />
                  Test New Enquiry
                </Link>

                <button
                  onClick={() => fetchLeads(true)}
                  disabled={refreshing || loadingLeads}
                  className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-brown disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
              <div className="border border-border bg-secondary/40 p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Total Received
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-foreground">
                  {stats.total}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">All time submissions</p>
              </div>

              <div className="border border-amber-500/20 bg-amber-500/5 p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
                  New Enquiries
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-amber-600 dark:text-amber-400">
                  {stats.newCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Requires initial contact</p>
              </div>

              <div className="border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                  In Discussion
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-blue-600 dark:text-blue-400">
                  {stats.contacted}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Contacted / Follow-up</p>
              </div>

              <div className="border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                  Converted
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {stats.converted}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Confirmed orders</p>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="mt-8 flex flex-col gap-4 border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search buyer name, email, phone, granite type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-border bg-background py-2 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status:
                </span>
                {[
                  "all",
                  "New",
                  "Contacted",
                  "Follow Up",
                  "Qualified",
                  "Converted",
                  "Closed",
                  "Spam",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground font-medium"
                        : "border border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s === "all" ? "All" : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads List */}
            <div className="mt-6 space-y-4">
              {loadingLeads ? (
                <div className="flex min-h-[250px] items-center justify-center border border-border py-16">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="border border-border bg-card py-16 text-center">
                  <Inbox className="mx-auto size-10 text-muted-foreground/50" />
                  <h3 className="mt-3 text-lg font-medium">No enquiries match your filter</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try clearing your search keyword or switching status filters.
                  </p>
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const statusConf = STATUS_CONFIG[lead.status] || STATUS_CONFIG["New"];
                  const whatsAppPhone = cleanPhoneForWhatsApp(lead.phone);
                  const isUpdating = updatingId === lead.id;

                  const whatsappMessage = encodeURIComponent(
                    `Hello ${lead.name}, this is SSG Granites regarding your enquiry on our website about ${lead.subject || "Granite blocks & slabs"}. How may we assist you further with specifications, block selection and pricing?`,
                  );
                  const emailSubject = encodeURIComponent(
                    `SSG Granites — Quotation & Info regarding ${lead.subject || "Your Enquiry"}`,
                  );
                  const emailBody = encodeURIComponent(
                    `Dear ${lead.name},\n\nThank you for reaching out to SSG Granites.\n\nRegarding your requirement:\n"${lead.message}"\n\nWe would be pleased to share technical specifications, finish options (Polished, Flamed, Leather, Lapato) and FOB/CIF export pricing.\n\nBest regards,\nSSG Granites Sales Desk\nChimakurthy, AP, India`,
                  );

                  return (
                    <article
                      key={lead.id}
                      className="border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        {/* Left: Contact Info & Message */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wider ${statusConf.bg} ${statusConf.text} border ${statusConf.border}`}
                            >
                              {statusConf.label}
                            </span>

                            {lead.priority && lead.priority !== "Normal" && (
                              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-amber-600">
                                {lead.priority} Priority
                              </span>
                            )}

                            <span className="text-xs text-muted-foreground">
                              Received {formatTimeAgo(lead.created_at)}
                            </span>
                          </div>

                          <h3 className="mt-2 text-xl font-semibold text-foreground">
                            {lead.name}
                          </h3>

                          {lead.subject && (
                            <p className="mt-0.5 text-xs font-medium text-primary">
                              Requirement: {lead.subject}
                            </p>
                          )}

                          {/* Contact Badges */}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(lead.phone, "Phone number")}
                              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-secondary/80 px-2.5 py-1 text-foreground transition-colors hover:border-primary hover:text-primary"
                              title="Click to copy phone"
                            >
                              <Phone className="size-3 text-primary" />
                              <span>{lead.phone}</span>
                              <Copy className="size-2.5 opacity-50" />
                            </button>

                            <button
                              type="button"
                              onClick={() => copyToClipboard(lead.email, "Email address")}
                              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-secondary/80 px-2.5 py-1 text-foreground transition-colors hover:border-primary hover:text-primary"
                              title="Click to copy email"
                            >
                              <Mail className="size-3 text-primary" />
                              <span>{lead.email}</span>
                              <Copy className="size-2.5 opacity-50" />
                            </button>

                            <span className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground px-1 py-1">
                              <Calendar className="size-3" />
                              {new Date(lead.created_at).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>

                          {/* Message Body */}
                          <div className="mt-4 rounded-sm border border-border/80 bg-background/80 p-4">
                            <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">
                              Customer Requirements
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                              {lead.message}
                            </p>
                          </div>
                        </div>

                        {/* Right: Actions & Pipeline Status Selector */}
                        <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end lg:justify-between">
                          {/* Pipeline Status Dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">
                              Update Status:
                            </span>
                            <select
                              value={lead.status}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value as LeadStatus)
                              }
                              className="border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Follow Up">Follow Up</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Converted">Converted</option>
                              <option value="Closed">Closed</option>
                              <option value="Spam">Spam</option>
                            </select>
                          </div>

                          {/* WhatsApp Direct Action */}
                          <a
                            href={`https://wa.me/${whatsAppPhone}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                          >
                            <MessageSquare className="size-3.5" />
                            WhatsApp Lead
                            <ExternalLink className="size-3 opacity-70" />
                          </a>

                          {/* Call Button */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-brown shadow-sm"
                          >
                            <Phone className="size-3.5" />
                            Call Direct
                          </a>

                          {/* Email Button */}
                          <a
                            href={`mailto:${lead.email}?subject=${emailSubject}&body=${emailBody}`}
                            className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                          >
                            <Mail className="size-3.5" />
                            Send Email
                          </a>

                          {/* Archive/Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(lead.id, lead.name)}
                            title="Archive this enquiry"
                            aria-label="Archive enquiry"
                            className="inline-flex items-center justify-center rounded-sm border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
