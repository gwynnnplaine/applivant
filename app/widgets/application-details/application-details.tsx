"use client";

import { ApplicationStatusBadge } from "@/app/widgets/application-status-badge/application-status-badge";
import { JobApplication } from "@/entities/job-application";
import { Calendar, DollarSign, ExternalLink, MapPin } from "lucide-react";

interface ApplicationDetailsProps {
  application: JobApplication;
}

export function ApplicationDetails({ application }: ApplicationDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {application.company}
          </h2>
          <p className="mt-1 text-lg font-medium text-muted-foreground">
            {application.jobTitle}
          </p>
        </div>
        <ApplicationStatusBadge
          status={application.status}
          className="px-3 py-1.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {application.salary && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm">{application.salary}</span>
          </div>
        )}
        {application.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm">{application.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm">
            Added {new Date(application.dateAdded).toLocaleDateString()}
          </span>
        </div>
        {application.jobUrl && (
          <div className="flex items-center gap-2">
            <ExternalLink
              className="h-5 w-5 flex-shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              View Job Posting
            </a>
          </div>
        )}
      </div>

      {application.notes && (
        <div className="rounded-lg bg-muted p-4">
          <h4 className="mb-2 text-sm font-semibold text-foreground">Notes</h4>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {application.notes}
          </p>
        </div>
      )}
    </div>
  );
}
