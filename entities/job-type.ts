export const JOB_TYPE = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
} as const;

export type JOB_TYPE = typeof JOB_TYPE[keyof typeof JOB_TYPE];