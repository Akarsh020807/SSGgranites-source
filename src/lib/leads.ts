import type { Database } from "@/integrations/supabase/types";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Follow Up",
  "Qualified",
  "Converted",
  "Closed",
  "Spam",
] as const;

export const LEAD_PRIORITIES = ["Low", "Normal", "High", "Urgent"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];

export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

export const statusStyles: Record<string, string> = {
  New: "bg-primary/15 text-primary border-primary/30",
  Contacted: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  "Follow Up": "bg-amber-500/10 text-amber-600 border-amber-500/30",
  Qualified: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  Converted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Closed: "bg-muted text-muted-foreground border-border",
  Spam: "bg-destructive/10 text-destructive border-destructive/30",
};

export const priorityStyles: Record<string, string> = {
  Low: "bg-muted text-muted-foreground border-border",
  Normal: "bg-slate-500/10 text-slate-600 border-slate-500/30",
  High: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  Urgent: "bg-destructive/10 text-destructive border-destructive/30",
};

/** Keeps a leading + and digits only, so tel:/wa.me links stay valid. */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `${plus ? "+" : ""}${digits}` : "";
}

export function whatsappHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
