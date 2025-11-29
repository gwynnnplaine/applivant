import { generateMockApplication } from "@/__tests__/helpers/mocks";
import { filterApplications } from "@/features/application-list/lib/filter-applications";
import { describe, expect, it } from "vitest";

const mockApplications = [
  generateMockApplication({
    company: "Acme Corp",
    jobTitle: "Software Engineer",
    status: "Applied",
    location: "New York",
  }),
  generateMockApplication({
    company: "Tech Inc",
    jobTitle: "Frontend Developer",
    status: "Interview",
    salary: "$120,000",
  }),
  generateMockApplication({
    company: "Startup LLC",
    jobTitle: "Full Stack Developer",
    status: "Offer",
    notes: "Great opportunity",
  }),
];

describe("filterApplications", () => {
  it("should return all applications when query is empty", () => {
    expect(filterApplications(mockApplications, "")).toHaveLength(3);
  });

  it("should return all applications when query is whitespace", () => {
    expect(filterApplications(mockApplications, "   ")).toHaveLength(3);
  });

  it("should filter by company name", () => {
    const result = filterApplications(mockApplications, "Acme");
    expect(result).toHaveLength(1);
    expect(result[0]?.company).toBe("Acme Corp");
  });

  it("should filter by job title", () => {
    const result = filterApplications(mockApplications, "Frontend");
    expect(result).toHaveLength(1);
    expect(result[0]?.jobTitle).toBe("Frontend Developer");
  });

  it("should filter by status", () => {
    const result = filterApplications(mockApplications, "Interview");
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe("Interview");
  });

  it("should filter by location", () => {
    const result = filterApplications(mockApplications, "New York");
    expect(result).toHaveLength(1);
    expect(result[0]?.location).toBe("New York");
  });

  it("should filter by salary", () => {
    const result = filterApplications(mockApplications, "$120,000");
    expect(result).toHaveLength(1);
    expect(result[0]?.salary).toBe("$120,000");
  });

  it("should filter by notes", () => {
    const result = filterApplications(mockApplications, "opportunity");
    expect(result).toHaveLength(1);
    expect(result[0]?.notes).toBe("Great opportunity");
  });

  it("should be case insensitive", () => {
    const result = filterApplications(mockApplications, "acme");
    expect(result).toHaveLength(1);
    expect(result[0]?.company).toBe("Acme Corp");
  });

  it("should match partial strings", () => {
    const result = filterApplications(mockApplications, "Engineer");
    expect(result).toHaveLength(1);
  });

  it("should return empty array when no matches", () => {
    expect(filterApplications(mockApplications, "nonexistent")).toHaveLength(0);
  });

  it("should handle empty applications array", () => {
    expect(filterApplications([], "test")).toHaveLength(0);
  });
});
