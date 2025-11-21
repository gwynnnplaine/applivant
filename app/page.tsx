"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
  const applications = [];

  return (
    <div className="">
      {applications.length === 0 && (
        <div className="flex h-screen flex-col items-center justify-center rounded-lg border bg-card p-6 text-center">
          <h2 className="text-5xl font-semibold">Your data stays local</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything you add is stored in your browser. No servers, no
            tracking.
          </p>
          <Button className="mt-4 w-max">Add Your First Application</Button>
        </div>
      )}
    </div>
  );
}
