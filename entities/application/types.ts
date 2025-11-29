import { z } from "zod";

export const APPLICATION_STATUS = {
  SAVED: "Saved",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
} as const;

export type APPLICATION_STATUS =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export const JOB_TYPE = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
} as const;

export type JOB_TYPE = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];

export const JobApplicationSchema = z.object({
  id: z.uuid({ message: "Invalid application ID" }),
  company: z
    .string({ error: "Company name is required" })
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  jobTitle: z
    .string({ error: "Job title is required" })
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters"),
  status: z.enum(APPLICATION_STATUS),
  jobType: z.enum(JOB_TYPE),
  salary: z.string().optional(),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  jobUrl: z.url("Please enter a valid URL").optional().or(z.literal("")),
  notes: z
    .string()
    .max(5000, "Notes must be less than 5000 characters")
    .optional(),
  dateAdded: z.date({ error: "Date added is required" }),
  dateModified: z.date({ error: "Date modified is required" }),
});

export type JobApplication = z.infer<typeof JobApplicationSchema>;

export const JobApplicationInputSchema = JobApplicationSchema.omit({
  id: true,
  dateAdded: true,
  dateModified: true,
});

export type JobApplicationInput = z.infer<typeof JobApplicationInputSchema>;
