import { APPLICATION_STATUS } from "@/entities/application";

export interface StatusConfig {
  label: string;
  styles: string;
  description: string;
}

export const STATUS_CONFIG: Record<APPLICATION_STATUS, StatusConfig> = {
  [APPLICATION_STATUS.SAVED]: {
    label: "Saved",
    styles: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    description: "Application saved for later",
  },
  [APPLICATION_STATUS.APPLIED]: {
    label: "Applied",
    styles: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    description: "Application submitted",
  },
  [APPLICATION_STATUS.SCREENING]: {
    label: "Screening",
    styles:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    description: "Application under review",
  },
  [APPLICATION_STATUS.INTERVIEW]: {
    label: "Interview",
    styles:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    description: "Interview scheduled or in progress",
  },
  [APPLICATION_STATUS.OFFER]: {
    label: "Offer",
    styles:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    description: "Job offer received",
  },
  [APPLICATION_STATUS.ACCEPTED]: {
    label: "Accepted",
    styles: "bg-green-600 text-white dark:bg-green-600 dark:text-white",
    description: "Offer accepted",
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: "Rejected",
    styles: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    description: "Application rejected",
  },
};
