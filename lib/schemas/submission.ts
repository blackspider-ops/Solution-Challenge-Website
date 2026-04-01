import { z } from "zod";

const urlOrEmpty = z
  .string()
  .refine(
    (v) => v === "" || (v.startsWith("https://") && z.string().url().safeParse(v).success),
    "Must be a valid HTTPS URL (starting with https://)"
  )
  .optional()
  .transform((v) => (!v || v === "" ? undefined : v));

export const submissionSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be under 120 characters")
    .transform((v) => v.trim()),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be under 2000 characters")
    .transform((v) => v.trim()),
  repoUrl:   urlOrEmpty,
  demoUrl:   urlOrEmpty,
  videoUrl:  urlOrEmpty,
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

// Minimum fields required to move from draft → submitted
export const submitReadySchema = submissionSchema.refine(
  (d) => d.title.length >= 3 && d.description.length >= 20,
  { message: "Fill in title and description before submitting" }
);
