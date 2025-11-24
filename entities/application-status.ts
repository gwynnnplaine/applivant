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

export interface StatusMetadata {
  label: APPLICATION_STATUS;
  styles: string;
  icon?: string;
  description?: string;
}

export const STATUS_METADATA: Record<APPLICATION_STATUS, StatusMetadata> = {
  [APPLICATION_STATUS.SAVED]: {
    label: APPLICATION_STATUS.SAVED,
    styles: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    description: "Application saved for later",
  },
  [APPLICATION_STATUS.APPLIED]: {
    label: APPLICATION_STATUS.APPLIED,
    styles: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    description: "Application submitted",
  },
  [APPLICATION_STATUS.SCREENING]: {
    label: APPLICATION_STATUS.SCREENING,
    styles:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    description: "Application under review",
  },
  [APPLICATION_STATUS.INTERVIEW]: {
    label: APPLICATION_STATUS.INTERVIEW,
    styles:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    description: "Interview scheduled or in progress",
  },
  [APPLICATION_STATUS.OFFER]: {
    label: APPLICATION_STATUS.OFFER,
    styles:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    description: "Job offer received",
  },
  [APPLICATION_STATUS.ACCEPTED]: {
    label: APPLICATION_STATUS.ACCEPTED,
    styles: "bg-green-600 text-white dark:bg-green-600 dark:text-white",
    description: "Offer accepted",
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: APPLICATION_STATUS.REJECTED,
    styles: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    description: "Application rejected",
  },
};
