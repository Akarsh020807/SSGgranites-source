import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Archive,
  ArrowLeft,
  ArrowUpDown,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Filter,
  Gem,
  Inbox,
  Layers,
  LayoutList,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Ship,
  Sparkles,
  StickyNote,
  Table as TableIcon,
  Tag,
  Trash2,
  TrendingUp,
  User,
  X,
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
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  New: {
    label: "New",
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
  },
  Contacted: {
    label: "Contacted",
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
  },
  "Follow Up": {
    label: "Follow Up",
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    border: "border-purple-500/30",
    dot: "bg-purple-500",
  },
  Qualified: {
    label: "Qualified",
    bg: "bg-cyan-500/10",
    text: "text-cyan-600",
    border: "border-cyan-500/30",
    dot: "bg-cyan-500",
  },
  Converted: {
    label: "Converted",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  Closed: {
    label: "Closed",
    bg: "bg-stone-500/10",
    text: "text-stone-500",
    border: "border-stone-500/30",
    dot: "bg-stone-400",
  },
  Spam: {
    label: "Spam",
    bg: "bg-red-500/10",
    text: "text-red-600",
    border: "border-red-500/30",
    dot: "bg-red-500",
  },
};

const DEFAULT_STATUS_CONFIG = STATUS_CONFIG["New"]!;

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? DEFAULT_STATUS_CONFIG;
}

const GRANITE_VARIETIES = [
  "All Varieties",
  "Black Galaxy",
  "Steel Grey",
  "Absolute Black",
  "Tan Brown",
  "Black Pearl",
];

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
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

interface ParsedLeadSpecs {
  requirement?: string | undefined;
  granite?: string | undefined;
  volume?: string | undefined;
  specifications?: string | undefined;
  hasStructuredSpecs: boolean;
}

function parseLeadDetails(rawMessage: string): ParsedLeadSpecs {
  const lines = (rawMessage || "").split("\n");
  let requirement: string | undefined;
  let granite: string | undefined;
  let volume: string | undefined;
  let parsingSpecs = false;
  const specLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("Requirement:")) {
      requirement = trimmed.replace("Requirement:", "").trim();
    } else if (trimmed.startsWith("Granite:")) {
      granite = trimmed.replace("Granite:", "").trim();
    } else if (trimmed.startsWith("Estimated Volume:")) {
      volume = trimmed.replace("Estimated Volume:", "").trim();
    } else if (trimmed.startsWith("Client Specifications:")) {
      parsingSpecs = true;
    } else if (parsingSpecs) {
      specLines.push(line);
    }
  }

  const specifications = specLines.join("\n").trim();
  const hasStructuredSpecs = Boolean(requirement || granite || volume);

  return {
    requirement,
    granite,
    volume,
    specifications: specifications || (!hasStructuredSpecs ? rawMessage : undefined),
    hasStructuredSpecs,
  };
}

function getBuyerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length || !parts[0]) return "SSG";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase() || "SSG";
}

function getLeadRefCode(id: string): string {
  return `#SSG-${id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase()}`;
}

function exportLeadsCSV(leadsToExport: Lead[]) {
  if (!leadsToExport.length) {
    toast.error("No leads available to export.");
    return;
  }
  const headers = ["Reference", "Name", "Email", "Phone", "Status", "Priority", "Subject", "Requirement", "Created At"];
  const rows = leadsToExport.map((l) => [
    getLeadRefCode(l.id),
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.email.replace(/"/g, '""')}"`,
    `"${l.phone.replace(/"/g, '""')}"`,
    l.status,
    l.priority || "Normal",
    `"${(l.subject || "").replace(/"/g, '""')}"`,
    `"${(l.message || "").replace(/"/g, '""')}"`,
    l.created_at,
  ]);
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `SSG_Granites_Leads_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`Exported ${leadsToExport.length} enquiries to CSV`);
}

function LeadsPage() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());

  // Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [varietyFilter, setVarietyFilter] = useState<string>("All Varieties");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "priority">("newest");
  const [viewMode, setViewMode] = useState<"dossier" | "table">("dossier");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // CRM Internal Notes state (stored per lead id in localStorage)
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  // Delete & Archive modal controls
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [viewArchived, setViewArchived] = useState(false);

  // Load saved notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ssg_lead_crm_notes");
      if (saved) {
        setLeadNotes(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  function handleSaveNote(leadId: string, noteText: string) {
    const updated = { ...leadNotes, [leadId]: noteText };
    setLeadNotes(updated);
    try {
      localStorage.setItem("ssg_lead_crm_notes", JSON.stringify(updated));
      toast.success("Sales memo saved");
    } catch {
      // ignore
    }
  }

  // Unauthenticated Staff Sign-In form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Fetch leads whenever verified admin status is active or viewArchived changes
  useEffect(() => {
    if (isAdmin) {
      fetchLeads(false, viewArchived);
    }
  }, [isAdmin, viewArchived]);

  async function fetchLeads(showToast = false, archived = viewArchived) {
    try {
      if (showToast) setRefreshing(true);
      else setLoadingLeads(true);

      let query = supabase.from("leads").select("*");
      if (archived) {
        query = query.not("deleted_at", "is", null);
      } else {
        query = query.is("deleted_at", null);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setLeads((data as Lead[]) || []);
      setLastSynced(new Date());
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

  async function handleArchive(leadId: string, name: string) {
    try {
      setDeleteBusy(true);
      const { error } = await supabase
        .from("leads")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;

      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setLeadToDelete(null);
      toast.success(`Enquiry from ${name} moved to archive`);
    } catch (err: any) {
      console.error("Archive error:", err);
      toast.error("Failed to archive: " + err.message);
    } finally {
      setDeleteBusy(false);
    }
  }

  async function handleRestore(leadId: string, name: string) {
    try {
      setUpdatingId(leadId);
      const { error } = await supabase
        .from("leads")
        .update({ deleted_at: null })
        .eq("id", leadId);

      if (error) throw error;

      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      toast.success(`Enquiry from ${name} restored to active pipeline`);
    } catch (err: any) {
      console.error("Restore error:", err);
      toast.error("Failed to restore: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteLead(leadId: string, name: string) {
    try {
      setDeleteBusy(true);
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId);

      if (error) throw error;

      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setLeadToDelete(null);
      toast.success(`Enquiry from ${name} deleted successfully`);
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error("Failed to delete enquiry: " + err.message);
    } finally {
      setDeleteBusy(false);
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

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    const list = leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" || lead.status.toLowerCase() === statusFilter.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.subject && lead.subject.toLowerCase().includes(q)) ||
        lead.message.toLowerCase().includes(q) ||
        getLeadRefCode(lead.id).toLowerCase().includes(q);

      const matchesVariety =
        varietyFilter === "All Varieties" ||
        lead.message.toLowerCase().includes(varietyFilter.toLowerCase()) ||
        (lead.subject && lead.subject.toLowerCase().includes(varietyFilter.toLowerCase()));

      return matchesStatus && matchesSearch && matchesVariety;
    });

    return list.sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortOrder === "priority") {
        const priorityRank: Record<string, number> = { Urgent: 3, High: 2, Normal: 1 };
        const rankA = priorityRank[a.priority || "Normal"] || 1;
        const rankB = priorityRank[b.priority || "Normal"] || 1;
        if (rankA !== rankB) return rankB - rankA;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [leads, statusFilter, searchQuery, varietyFilter, sortOrder]);

  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "New").length;
    const contacted = leads.filter((l) => l.status === "Contacted" || l.status === "Follow Up").length;
    const converted = leads.filter((l) => l.status === "Converted").length;
    const qualified = leads.filter((l) => l.status === "Qualified").length;
    const closed = leads.filter((l) => l.status === "Closed").length;
    const spam = leads.filter((l) => l.status === "Spam").length;

    // Percentages for pipeline distribution bar
    const pct = (cnt: number) => (total > 0 ? (cnt / total) * 100 : 0);

    return {
      total,
      newCount,
      contacted,
      converted,
      qualified,
      closed,
      spam,
      pNew: pct(newCount),
      pContacted: pct(contacted),
      pQualified: pct(qualified),
      pConverted: pct(converted),
      pOther: pct(closed + spam),
    };
  }, [leads]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-foreground flex flex-col font-sans">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State during initial session resolution */}
        {authLoading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-24 text-center">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="font-display text-lg">Verifying Commercial Privileges...</p>
            <p className="text-xs text-muted-foreground">Synchronizing credentials with SSG portal</p>
          </div>
        ) : !user ? (
          /* State 1: Unauthenticated Visitor -> Dedicated Staff Sign-In Card */
          <div className="mx-auto my-12 max-w-md border border-[#DECDB3]/60 bg-white p-8 shadow-sm sm:p-10 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lock className="size-5" />
              </span>
              <div>
                <p className="font-display text-base font-semibold uppercase tracking-[0.18em]">
                  Staff Portal
                </p>
                <p className="text-xs text-muted-foreground">SSG Granites Commercial Intelligence</p>
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight">Executive Sign In</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Direct procurement records are confidential. Please authenticate with authorized credentials to view active enquiries.
            </p>

            <form onSubmit={handleInlineLogin} className="mt-6 space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Admin Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@ssggranites.com"
                  className="w-full rounded-xl border border-border bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition-colors"
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
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-[#FAF8F5] px-3.5 py-2.5 pr-10 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginBusy}
                className="w-full rounded-xl bg-primary py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-brown transition-all shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {loginBusy ? "Authenticating..." : "Sign In to Commercial Desk"}
              </button>
            </form>
          </div>
        ) : !isAdmin ? (
          /* State 2: Authenticated but not an Admin */
          <div className="mx-auto my-16 max-w-lg rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
              <ShieldAlert className="size-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-foreground">Access Restricted</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You are signed in as <span className="font-semibold text-foreground">{user.email}</span>, but this account is not registered with Commercial Pipeline privileges.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/"
                search={{ product: undefined }}
                className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary"
              >
                Return to Storefront
              </Link>
            </div>
          </div>
        ) : (
          /* State 3: Verified Admin View -> Full Leads CRM Dashboard */
          <>
            {/* Top Commercial Header & Actions Bar */}
            <div className="flex flex-col gap-5 border-b border-border/70 pb-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-primary font-bold">
                  <Gem className="size-3.5 text-primary" />
                  <span>SSG Granites Commercial Intelligence</span>
                </div>
                <h1 className="mt-1.5 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Enquiry Pipeline &amp; Buyer Management
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Direct commercial oversight for quarry-face orders, gang-saw slab specifications, and export consignment contracts.
                </p>
              </div>

              {/* Utility Actions Cluster: Export, View Switcher & Sync */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">

                {/* View Switcher: Dossier Cards vs Data Table */}
                <div className="inline-flex rounded-xl border border-[#D6C4A5]/70 bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("dossier")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${viewMode === "dossier"
                        ? "bg-primary text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                    title="Dossier Cards View"
                  >
                    <LayoutList className="size-3.5" />
                    <span>Dossier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${viewMode === "table"
                        ? "bg-primary text-white shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                    title="Data Table View"
                  >
                    <TableIcon className="size-3.5" />
                    <span>Table</span>
                  </button>
                </div>

                {/* Export CSV Button */}
                <button
                  type="button"
                  onClick={() => exportLeadsCSV(filteredLeads)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D6C4A5] bg-white hover:bg-[#FAF8F5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <Download className="size-3.5 text-primary" />
                  <span>Export CSV</span>
                </button>

                {/* Sync Pipeline Button */}
                <button
                  type="button"
                  onClick={() => fetchLeads(true)}
                  disabled={refreshing || loadingLeads}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-brown px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-all shadow-sm hover:shadow-md disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
                  <span>{refreshing ? "Syncing..." : "Sync Pipeline"}</span>
                </button>
              </div>
            </div>

            {/* Executive KPI Metric Cards */}
            <div className="mt-7 grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:gap-5">
              {/* Card 1: Total Received */}
              <div className="relative overflow-hidden rounded-2xl border border-[#DECDB3]/70 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Total Inquiries
                  </span>
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Layers className="size-4" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-foreground">
                  {stats.total}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2">
                  <span>All pipeline records</span>
                  <span className="font-semibold text-primary">100% Direct</span>
                </div>
              </div>

              {/* Card 2: New Inquiries */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-50/70 via-white to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-800">
                    Action Required
                  </span>
                  <div className="rounded-xl bg-amber-500/15 p-2.5 text-amber-600">
                    <Clock className="size-4" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-amber-600">
                  {stats.newCount}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-xs text-amber-800/80 border-t border-amber-500/20 pt-2">
                  <span>Pending response</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Target &lt; 2h
                  </span>
                </div>
              </div>

              {/* Card 3: In Discussion */}
              <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-50/70 via-white to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-800">
                    In Discussion
                  </span>
                  <div className="rounded-xl bg-blue-500/15 p-2.5 text-blue-600">
                    <MessageSquare className="size-4" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-blue-600">
                  {stats.contacted}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-xs text-blue-800/80 border-t border-blue-500/20 pt-2">
                  <span>Quotes &amp; negotiation</span>
                  <span className="font-semibold text-blue-600">High Intent</span>
                </div>
              </div>

              {/* Card 4: Converted */}
              <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50/70 via-white to-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">
                    Confirmed Orders
                  </span>
                  <div className="rounded-xl bg-emerald-500/15 p-2.5 text-emerald-600">
                    <CheckCircle2 className="size-4" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl sm:text-4xl font-bold text-emerald-600">
                  {stats.converted}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-800/80 border-t border-emerald-500/20 pt-2">
                  <span>Converted consignments</span>
                  <span className="font-semibold text-emerald-600">Won Deals</span>
                </div>
              </div>
            </div>


            {/* Filter, Search & Granite Variety Toolbar */}
            <div className="mt-6 rounded-2xl border border-[#DECDB3]/70 bg-white p-4 shadow-sm space-y-3.5">
              {/* Row 1: Search Bar & Sort Order */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search buyer name, ref #, phone, email, granite variety..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border bg-[#FAF8F5] py-2.5 pl-10 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort Order Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-medium shrink-0">Sort:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="rounded-xl border border-border bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest Inquiries</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">High Priority First</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/40">
                {[
                  { id: "all", label: "All Records", count: stats.total },
                  { id: "New", label: "New", count: stats.newCount },
                  { id: "Contacted", label: "Contacted", count: leads.filter((l) => l.status === "Contacted").length },
                  { id: "Follow Up", label: "Follow Up", count: leads.filter((l) => l.status === "Follow Up").length },
                  { id: "Qualified", label: "Qualified", count: stats.qualified },
                  { id: "Converted", label: "Converted", count: stats.converted },
                  { id: "Closed", label: "Closed", count: stats.closed },
                  { id: "Spam", label: "Spam", count: stats.spam },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer ${statusFilter === s.id
                        ? "bg-primary text-white font-semibold shadow-xs"
                        : "border border-border/70 bg-[#FAF8F5] text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                  >
                    <span>{s.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${statusFilter === s.id ? "bg-white/25 text-white" : "bg-white border border-border text-muted-foreground"
                        }`}
                    >
                      {s.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Row 3: Granite Variety Quick Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40 text-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                  Stone Variety:
                </span>
                {GRANITE_VARIETIES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVarietyFilter(v)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${varietyFilter === v
                        ? "bg-brown text-white shadow-2xs font-semibold"
                        : "border border-border/60 bg-white text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count Summary */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground px-1">
              <div>
                {viewArchived ? (
                  <span className="font-semibold text-amber-900">
                    Showing <strong className="text-foreground">{filteredLeads.length}</strong> archived records
                  </span>
                ) : (
                  <span>
                    Showing <strong className="text-foreground">{filteredLeads.length}</strong> of {leads.length} total enquiries
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {(searchQuery || statusFilter !== "all" || varietyFilter !== "All Varieties") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setVarietyFilter("All Varieties");
                    }}
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    Reset all filters
                  </button>
                )}

                {/* Small subtle option to toggle view archived without affecting existing UI */}
                <button
                  type="button"
                  onClick={() => setViewArchived(!viewArchived)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title={viewArchived ? "Switch back to active enquiries" : "View archived records"}
                >
                  <Archive className="size-3.5" />
                  <span>{viewArchived ? "Back to Active Enquiries" : "View Archived"}</span>
                </button>
              </div>
            </div>

            {/* Leads View Container: Dossier View vs Data Table View */}
            <div className="mt-3">
              {viewArchived && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-300/80 bg-amber-50/80 px-4 py-2.5 text-xs text-amber-900 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Archive className="size-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>Archived Pipeline Mode</strong> — Showing previously archived enquiries.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewArchived(false)}
                    className="font-semibold text-primary hover:underline cursor-pointer shrink-0"
                  >
                    ← Back to Active Enquiries
                  </button>
                </div>
              )}
              {loadingLeads ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-border bg-white py-16 gap-3 shadow-sm">
                  <Loader2 className="size-8 animate-spin text-primary" />
                  <p className="text-sm font-medium text-foreground">Synchronizing client pipeline...</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="rounded-2xl border border-border bg-white py-20 text-center shadow-sm">
                  <Inbox className="mx-auto size-12 text-muted-foreground/40" />
                  <h3 className="mt-4 text-lg font-bold text-foreground">No enquiries match your filter criteria</h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                    Try adjusting your search terms, status filters, or granite variety filters to view customer enquiries.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setVarietyFilter("All Varieties");
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : viewMode === "table" ? (
                /* ======================== DATA TABLE VIEW ======================== */
                <div className="overflow-x-auto rounded-2xl border border-[#DECDB3]/70 bg-white shadow-sm">
                  <table className="w-full text-left text-xs text-foreground">
                    <thead className="bg-[#FAF8F5] border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3.5">Ref ID</th>
                        <th className="px-4 py-3.5">Buyer</th>
                        <th className="px-4 py-3.5">Granite &amp; Cut</th>
                        <th className="px-4 py-3.5">Volume</th>
                        <th className="px-4 py-3.5">Contact</th>
                        <th className="px-4 py-3.5">Date</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredLeads.map((lead) => {
                        const parsed = parseLeadDetails(lead.message);
                        const statusConf = getStatusConfig(lead.status);
                        const whatsAppPhone = cleanPhoneForWhatsApp(lead.phone);
                        const refCode = getLeadRefCode(lead.id);

                        const whatsappMessage = encodeURIComponent(
                          `Hello ${lead.name}, this is SSG Granites regarding your enquiry on our website about ${lead.subject || "Granite blocks & slabs"}. How may we assist you further with specifications, block selection and export pricing?`,
                        );
                        const emailSubject = encodeURIComponent(
                          `SSG Granites — Quotation & Info regarding ${lead.subject || "Your Granite Enquiry"}`,
                        );
                        const emailBody = encodeURIComponent(
                          `Dear ${lead.name},\n\nThank you for reaching out to SSG Granites.\n\nRegarding your requirement:\n"${lead.message}"\n\nWe would be pleased to share technical specifications, finish options (Polished, Flamed, Leather, Lapato) and direct quarry FOB/CIF export pricing.\n\nBest regards,\nSSG Granites Sales Desk\nChimakurthy, AP, India`,
                        );

                        return (
                          <tr key={lead.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                            <td className="px-4 py-3 font-mono font-semibold text-primary">
                              {refCode}
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              <div>{lead.name}</div>
                              {lead.priority && lead.priority !== "Normal" && (
                                <span className="text-[10px] font-bold text-amber-600">
                                  {lead.priority} Priority
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-foreground">
                                {parsed.granite || "General Enquiry"}
                              </span>
                              {parsed.requirement && (
                                <div className="text-[11px] text-muted-foreground">
                                  {parsed.requirement}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {parsed.volume || "—"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium">{lead.phone}</div>
                              <div className="text-[11px] text-muted-foreground">{lead.email}</div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {formatTimeAgo(lead.created_at)}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={lead.status}
                                disabled={updatingId === lead.id}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                                className={`rounded-lg px-2 py-1 text-[11px] font-semibold border ${statusConf.border} ${statusConf.bg} ${statusConf.text} cursor-pointer focus:outline-none`}
                              >
                                <option value="New">🟡 New</option>
                                <option value="Contacted">🔵 Contacted</option>
                                <option value="Follow Up">🟣 Follow Up</option>
                                <option value="Qualified">🔷 Qualified</option>
                                <option value="Converted">🟢 Converted</option>
                                <option value="Closed">⚪ Closed</option>
                                <option value="Spam">🔴 Spam</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1">
                                <a
                                  href={`https://wa.me/${whatsAppPhone}?text=${whatsappMessage}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="WhatsApp Buyer"
                                >
                                  <MessageSquare className="size-4" />
                                </a>
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="rounded-lg p-1.5 text-primary hover:bg-primary/10 transition-colors"
                                  title="Direct Phone Call"
                                >
                                  <PhoneCall className="size-4" />
                                </a>
                                <a
                                  href={`mailto:${lead.email}?subject=${emailSubject}&body=${emailBody}`}
                                  className="rounded-lg p-1.5 text-foreground hover:bg-secondary transition-colors"
                                  title="Send Email Quotation"
                                >
                                  <Mail className="size-4" />
                                </a>
                                {viewArchived ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleRestore(lead.id, lead.name)}
                                      className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                      title="Restore to Active Pipeline"
                                    >
                                      <RotateCcw className="size-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setLeadToDelete(lead)}
                                      className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                      title="Permanently Delete Record"
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setLeadToDelete(lead)}
                                    className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                                    title="Delete Enquiry"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* ======================== DOSSIER CARDS VIEW ======================== */
                <div className="space-y-5">
                  {filteredLeads.map((lead) => {
                    const statusConf = getStatusConfig(lead.status);
                    const whatsAppPhone = cleanPhoneForWhatsApp(lead.phone);
                    const isUpdating = updatingId === lead.id;
                    const buyerInitials = getBuyerInitials(lead.name);
                    const parsed = parseLeadDetails(lead.message);
                    const refCode = getLeadRefCode(lead.id);
                    const currentNote = leadNotes[lead.id] || "";
                    const isNoteOpen = expandedNoteId === lead.id;

                    const whatsappMessage = encodeURIComponent(
                      `Hello ${lead.name}, this is SSG Granites regarding your enquiry on our website about ${lead.subject || "Granite blocks & slabs"}. How may we assist you further with specifications, block selection and export pricing?`,
                    );
                    const emailSubject = encodeURIComponent(
                      `SSG Granites — Quotation & Info regarding ${lead.subject || "Your Granite Enquiry"}`,
                    );
                    const emailBody = encodeURIComponent(
                      `Dear ${lead.name},\n\nThank you for reaching out to SSG Granites.\n\nRegarding your requirement:\n"${lead.message}"\n\nWe would be pleased to share technical specifications, finish options (Polished, Flamed, Leather, Lapato) and direct quarry FOB/CIF export pricing.\n\nBest regards,\nSSG Granites Sales Desk\nChimakurthy, AP, India`,
                    );

                    return (
                      <article
                        key={lead.id}
                        className="rounded-2xl border border-[#DECDB3]/70 bg-white p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.07)] hover:border-primary/50 transition-all duration-300"
                      >
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                          {/* Left: Buyer Dossier Header & Specification Matrix */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              {/* Buyer Initials Avatar Badge */}
                              <div className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#EFEAE1] border border-primary/25 text-primary font-serif font-bold text-lg shadow-2xs">
                                {buyerInitials}
                              </div>

                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Lead Reference Code */}
                                  <span className="font-mono text-[11px] font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                                    {refCode}
                                  </span>

                                  {/* Pipeline Status Tag */}
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${statusConf.bg} ${statusConf.text} border ${statusConf.border}`}
                                  >
                                    <span className={`size-1.5 rounded-full ${statusConf.dot}`} />
                                    {statusConf.label}
                                  </span>

                                  {/* Priority Tag */}
                                  {lead.priority && lead.priority !== "Normal" && (
                                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 border border-amber-500/20">
                                      {lead.priority} Priority
                                    </span>
                                  )}

                                  {/* Time Received */}
                                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground ml-auto sm:ml-0">
                                    <Clock className="size-3" />
                                    Received {formatTimeAgo(lead.created_at)}
                                  </span>
                                </div>

                                <h3 className="mt-2 font-display text-2xl font-bold text-foreground">
                                  {lead.name}
                                </h3>

                                {lead.subject && (
                                  <p className="mt-0.5 text-xs font-semibold text-primary tracking-wide">
                                    Requirement: {lead.subject}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Contact Badges Strip */}
                            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
                              {/* Phone Copy Chip */}
                              <button
                                type="button"
                                onClick={() => copyToClipboard(lead.phone, "Phone number")}
                                className="group inline-flex items-center gap-1.5 rounded-xl border border-border bg-[#FAF8F5] hover:bg-white hover:border-primary px-3 py-1.5 text-foreground transition-all shadow-2xs cursor-pointer"
                                title="Click to copy phone"
                              >
                                <Phone className="size-3.5 text-primary" />
                                <span className="font-medium">{lead.phone}</span>
                                <Copy className="size-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                              </button>

                              {/* Email Copy Chip */}
                              <button
                                type="button"
                                onClick={() => copyToClipboard(lead.email, "Email address")}
                                className="group inline-flex items-center gap-1.5 rounded-xl border border-border bg-[#FAF8F5] hover:bg-white hover:border-primary px-3 py-1.5 text-foreground transition-all shadow-2xs cursor-pointer"
                                title="Click to copy email"
                              >
                                <Mail className="size-3.5 text-primary" />
                                <span className="font-medium">{lead.email}</span>
                                <Copy className="size-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                              </button>

                              {/* Exact Timestamp */}
                              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground px-2 py-1">
                                <Calendar className="size-3 text-muted-foreground" />
                                {new Date(lead.created_at).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </span>
                            </div>

                            {/* Structured 3-Pillar Granite Architecture Matrix */}
                            {parsed.hasStructuredSpecs ? (
                              <div className="mt-5 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                  {parsed.granite && (
                                    <div className="rounded-xl border border-primary/25 bg-[#FAF8F5] p-3.5 shadow-2xs">
                                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                        <Gem className="size-3.5 text-primary" />
                                        <span>Granite Variety</span>
                                      </div>
                                      <p className="mt-1 text-sm font-bold text-foreground">
                                        {parsed.granite}
                                      </p>
                                    </div>
                                  )}

                                  {parsed.requirement && (
                                    <div className="rounded-xl border border-primary/25 bg-[#FAF8F5] p-3.5 shadow-2xs">
                                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                        <Layers className="size-3.5 text-primary" />
                                        <span>Processing / Cut</span>
                                      </div>
                                      <p className="mt-1 text-sm font-bold text-foreground">
                                        {parsed.requirement}
                                      </p>
                                    </div>
                                  )}

                                  {parsed.volume && (
                                    <div className="rounded-xl border border-primary/25 bg-[#FAF8F5] p-3.5 shadow-2xs">
                                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                        <Ship className="size-3.5 text-primary" />
                                        <span>Estimated Volume</span>
                                      </div>
                                      <p className="mt-1 text-sm font-bold text-foreground">
                                        {parsed.volume}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {parsed.specifications && (
                                  <div className="rounded-xl border border-border/80 bg-[#FAF8F5]/80 p-3.5 shadow-2xs">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                      Client Notes &amp; Specifications
                                    </p>
                                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-wrap italic">
                                      &ldquo;{parsed.specifications}&rdquo;
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="mt-4 rounded-xl border border-border/80 bg-[#FAF8F5] p-4 shadow-2xs">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  Customer Enquiry Message
                                </p>
                                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                  {lead.message}
                                </p>
                              </div>
                            )}

                            {/* Interactive Sales Memo / CRM Activity Notes */}
                            <div className="mt-4 pt-3 border-t border-border/50">
                              <div className="flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => setExpandedNoteId(isNoteOpen ? null : lead.id)}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  <StickyNote className="size-3.5 text-primary" />
                                  <span>Internal Sales Memo</span>
                                  {currentNote && (
                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                  )}
                                </button>
                                {currentNote && !isNoteOpen && (
                                  <span className="text-[11px] text-muted-foreground truncate max-w-xs">
                                    {currentNote}
                                  </span>
                                )}
                              </div>

                              {isNoteOpen && (
                                <div className="mt-2.5 flex gap-2">
                                  <input
                                    type="text"
                                    defaultValue={currentNote}
                                    placeholder="Add commercial follow-up note (e.g. Quoted $42/sqm FOB Chennai)..."
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleSaveNote(lead.id, (e.target as HTMLInputElement).value);
                                      }
                                    }}
                                    id={`note-input-${lead.id}`}
                                    className="flex-1 rounded-xl border border-border bg-[#FAF8F5] px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const input = document.getElementById(
                                        `note-input-${lead.id}`,
                                      ) as HTMLInputElement;
                                      if (input) handleSaveNote(lead.id, input.value);
                                    }}
                                    className="rounded-xl bg-primary hover:bg-brown px-3 py-1.5 text-xs font-semibold text-white transition-all cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Actions Cluster & Pipeline Status Selector */}
                          <div className="flex flex-col gap-4 lg:w-60 lg:shrink-0 lg:border-l lg:border-border/70 lg:pl-6">
                            {/* Pipeline Status Selector */}
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                <span>Pipeline Status</span>
                                {isUpdating && <Loader2 className="size-3 animate-spin text-primary" />}
                              </label>
                              <select
                                value={lead.status}
                                disabled={isUpdating}
                                onChange={(e) =>
                                  handleStatusChange(lead.id, e.target.value as LeadStatus)
                                }
                                className="w-full rounded-xl border border-border bg-[#FAF8F5] hover:bg-white px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none transition-colors cursor-pointer shadow-2xs"
                              >
                                <option value="New">🟡 New</option>
                                <option value="Contacted">🔵 Contacted</option>
                                <option value="Follow Up">🟣 Follow Up</option>
                                <option value="Qualified">🔷 Qualified</option>
                                <option value="Converted">🟢 Converted</option>
                                <option value="Closed">⚪ Closed</option>
                                <option value="Spam">🔴 Spam</option>
                              </select>
                            </div>

                            {/* Quick Communication Actions */}
                            <div className="flex flex-col gap-2 pt-1">
                              {/* WhatsApp Direct Action */}
                              <a
                                href={`https://wa.me/${whatsAppPhone}?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition-all shadow-sm hover:shadow-md cursor-pointer"
                              >
                                <MessageSquare className="size-3.5" />
                                <span>WhatsApp Buyer</span>
                                <ExternalLink className="size-3 opacity-75" />
                              </a>

                              {/* Direct Call Button */}
                              <a
                                href={`tel:${lead.phone}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-brown px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all shadow-sm hover:shadow-md cursor-pointer"
                              >
                                <PhoneCall className="size-3.5" />
                                <span>Direct Phone Call</span>
                              </a>

                              {/* Send Quotation Email */}
                              <a
                                href={`mailto:${lead.email}?subject=${emailSubject}&body=${emailBody}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white hover:bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
                              >
                                <Mail className="size-3.5 text-primary" />
                                <span>Send Quotation</span>
                              </a>
                            </div>

                            {/* Delete / Restore Action */}
                            <div className="pt-2 border-t border-border/60 flex items-center justify-end text-xs">
                              {viewArchived ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleRestore(lead.id, lead.name)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                                  >
                                    <RotateCcw className="size-3" />
                                    <span>Restore to Active</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setLeadToDelete(lead)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="size-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setLeadToDelete(lead)}
                                  title="Delete enquiry"
                                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                                >
                                  <Trash2 className="size-3.5" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ======================== CONFIRM DELETE / ARCHIVE MODAL ======================== */}
        {leadToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
            <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <Trash2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      Delete or Archive Enquiry?
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {getLeadRefCode(leadToDelete.id)} • {leadToDelete.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={() => setLeadToDelete(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="rounded-xl border border-border/70 bg-[#FAF8F5] p-3 text-xs space-y-1">
                <p className="font-semibold text-foreground">{leadToDelete.name}</p>
                <p className="text-muted-foreground">{leadToDelete.email} • {leadToDelete.phone}</p>
                {leadToDelete.subject && (
                  <p className="text-primary font-medium truncate">Requirement: {leadToDelete.subject}</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose to move this enquiry to archive to preserve the record, or delete it permanently from the database.
              </p>

              <div className="pt-3 border-t border-border/80 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={() => setLeadToDelete(null)}
                  className="rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                {!viewArchived && (
                  <button
                    type="button"
                    disabled={deleteBusy}
                    onClick={() => handleArchive(leadToDelete.id, leadToDelete.name)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <Archive className="size-3.5 text-muted-foreground" />
                    <span>Archive Enquiry</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={deleteBusy}
                  onClick={() => handleDeleteLead(leadToDelete.id, leadToDelete.name)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-white hover:bg-destructive/90 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {deleteBusy ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  <span>Permanently Delete</span>
                </button>
              </div>

              {/* Small subtle option to see archived without affecting existing UI */}
              <div className="pt-2 border-t border-dashed border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Looking for past archived records?</span>
                <button
                  type="button"
                  onClick={() => {
                    setLeadToDelete(null);
                    setViewArchived(true);
                  }}
                  className="font-medium text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Archived</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
