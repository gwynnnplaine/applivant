import z from "zod";
import { APPLICATION_STATUS } from "./application-status";
import { JOB_TYPE } from "./job-type";

export const JobApplicationSchema = z.object({
    id: z.uuid(),
    company: z.string().min(2).max(100),
    jobTitle: z.string().min(2).max(100),
    status: z.enum(APPLICATION_STATUS),
    jobType: z.enum(JOB_TYPE).optional(),
    salary: z.string().max(50).optional(),
    location: z.string().max(100).optional(),
    jobUrl: z.url().optional(),
    notes: z.string().max(5000).optional(),
    dateAdded: z.date(),
    dateModified: z.date(),
})

export type JobApplication = z.infer<typeof JobApplicationSchema>

export type JobApplicationInput = Omit<JobApplication, "id" | "dateAdded" | "dateModified">;