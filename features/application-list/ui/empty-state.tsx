import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center">
      <h2 className="text-5xl font-semibold">Your data stays local</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Everything you add is stored in your browser. No servers, no tracking.
      </p>
      <Button className="mt-6" asChild>
        <Link passHref href={ROUTES.ADD_APPLICATION}>
          Add Your First Application
        </Link>
      </Button>
    </div>
  );
}
