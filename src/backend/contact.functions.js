import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(5).max(40),
  email: z.string().email().max(160),
  message: z.string().min(1).max(4000),
});

/** Backend handler for the website enquiry form. */
export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    console.log("New enquiry received", { name: data.name, email: data.email });
    return { ok: true };
  });
