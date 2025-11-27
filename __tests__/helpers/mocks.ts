import {
  JobApplicationInputSchema,
  JobApplicationSchema,
  type JobApplication,
  type JobApplicationInput,
} from "@/entities/application";
import { zocker } from "zocker";

export const applicationZocker = zocker(JobApplicationSchema);
export const applicationInputZocker = zocker(JobApplicationInputSchema);

export const generateMockApplication = (
  overrides?: Partial<JobApplication>,
): JobApplication => ({
  ...applicationZocker.generate(),
  ...overrides,
});

export const generateMockApplications = (
  count: number,
  overrides?: Partial<JobApplication>,
): JobApplication[] =>
  applicationZocker.generateMany(count).map((app) => ({
    ...app,
    ...overrides,
  }));

export const generateMockApplicationInput = (
  overrides?: Partial<JobApplicationInput>,
): JobApplicationInput => ({
  ...applicationInputZocker.generate(),
  ...overrides,
});

export const readBlobAsText = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
};

export const suppressConsoleError = async <T>(
  fn: () => Promise<T>,
): Promise<T> => {
  const originalError = console.error;
  console.error = () => {};
  try {
    return await fn();
  } finally {
    console.error = originalError;
  }
};
