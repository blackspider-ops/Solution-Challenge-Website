import { z } from "zod";

export const certificateSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be under 100 characters")
    .transform((v) => v.trim()),
  htmlContent: z
    .string()
    .min(50, "HTML content must be at least 50 characters")
    .transform((v) => v.trim()),
});

export type CertificateInput = z.infer<typeof certificateSchema>;

export const sendCertificateSchema = z.object({
  certificateId: z.string().min(1, "Certificate is required"),
  audience: z.enum(["all", "registered", "checked_in", "volunteers", "admins", "team", "individual"]),
  teamId: z.string().optional(),
  userIds: z.array(z.string()).optional(),
});

export type SendCertificateInput = z.infer<typeof sendCertificateSchema>;
