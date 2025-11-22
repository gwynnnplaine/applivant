"use client";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Show, useApplicationService } from "./shared";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const service = useApplicationService();
  const applications = useLiveQuery(() => db.applications.toArray(), []);

  const { deleteJobApplication } = service;

  const handleDelete = (applicationId: string) => {
    deleteJobApplication(applicationId);
  };

  return (
    <div className="flex h-screen flex-col rounded-lg border bg-card p-6 text-center">
      <Button className="w-max" asChild>
        <Link passHref href="/applications/new"></Link>
      </Button>
      <Show when={Boolean(applications && applications.length === 0)}>
        <h2 className="text-5xl font-semibold">Your data stays local</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything you add is stored in your browser. No servers, no tracking.
        </p>
        <Button className="mt-6" asChild>
          <Link passHref href="/applications/new">
            Add Your First Application
          </Link>
        </Button>
      </Show>

      <Show when={Boolean(applications && applications.length > 0)}>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Your Applications</h1>
          {applications?.map((app) => (
            <div
              key={app.id}
              className="my-2 flex flex-col gap-2 rounded border p-4 shadow-sm hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{app.jobTitle}</h2>
              <p className="text-sm text-muted-foreground">{app.company}</p>
              <a
                href={app.jobUrl}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Job Posting
              </a>
              <Button className="ml-auto" asChild>
                <Link key={app.id} passHref href={`applications/${app.id}`}>
                  Edit Application
                </Link>
              </Button>
              <Button className="ml-auto" onClick={() => handleDelete(app.id)}>
                Delete Application
              </Button>
            </div>
          ))}
        </div>
      </Show>
    </div>
  );
}
