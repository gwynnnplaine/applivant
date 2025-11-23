import { JobApplicationSchema } from "@/entities/job-application";
import z from "zod";

export const JobApplicationInputSchema = JobApplicationSchema.omit({
  id: true,
  dateAdded: true,
  dateModified: true,
});

export type JobApplicationInput = z.infer<typeof JobApplicationInputSchema>;
