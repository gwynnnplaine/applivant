"use client";
import { ApplicationsTable } from "./widgets";

export default function Home() {
  return (
    <div className="flex h-screen flex-col rounded-lg border bg-card px-2 py-4 text-center">
      <ApplicationsTable />
    </div>
  );
}
