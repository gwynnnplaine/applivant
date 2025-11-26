import { ExternalLink } from "lucide-react";

interface JobLinkProps {
  url?: string;
  label?: string;
}

export function JobLink({ url, label = "View Job Posting" }: JobLinkProps) {
  if (!url) return null;

  return (
    <div className="flex items-center gap-2">
      <ExternalLink
        className="h-5 w-5 flex-shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {label}
      </a>
    </div>
  );
}
