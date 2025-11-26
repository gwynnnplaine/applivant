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
  id: z.uuid(),
  company: z.string().min(2).max(100),
  jobTitle: z.string().min(2).max(100),
  status: z.enum(APPLICATION_STATUS),
  jobType: z.enum(JOB_TYPE),
  salary: z.string().max(50).optional(),
  location: z.string().max(100).optional(),
  jobUrl: z.url().optional(),
  notes: z.string().max(5000).optional(),
  dateAdded: z.date(),
  dateModified: z.date(),
});

export type JobApplication = z.infer<typeof JobApplicationSchema>;

export const JobApplicationInputSchema = JobApplicationSchema.omit({
  id: true,
  dateAdded: true,
  dateModified: true,
});

export type JobApplicationInput = z.infer<typeof JobApplicationInputSchema>;
