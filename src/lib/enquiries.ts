import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { normalizePhone } from "@/lib/leads";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number")
    .max(40)
    .refine((v) => v.replace(/\D/g, "").length >= 6, "Please enter a valid phone number"),
  message: z.string().trim().min(5, "Please tell us what you need").max(4000),
  service: z.string().trim().max(160).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryResult = { ok: true } | { ok: false; message: string };

export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const data = parsed.data;
  const { error } = await supabase.from("leads").insert({
    name: data.name,
    email: data.email,
    phone: normalizePhone(data.phone),
    message: data.message,
    service: data.service?.trim() ? data.service.trim() : null,
    source: "Website",
    status: "New",
    priority: "Normal",
  });

  if (error) {
    console.error("Enquiry insert failed", error);
    return {
      ok: false,
      message: "We couldn't send your enquiry just now. Please try again or email us directly.",
    };
  }

  return { ok: true };
}
