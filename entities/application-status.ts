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
