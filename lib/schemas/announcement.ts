import { z } from "zod";

export const announcementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be under 150 characters")
    .transform((v) => v.trim()),
  body: z
    .string()
    .min(10, "Body must be at least 10 characters")
    .max(5000, "Body must be under 5000 characters")
    .transform((v) => v.trim()),
  published: z.boolean().default(false),
  pinned: z.boolean().default(false),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
