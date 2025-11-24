"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push(ROUTES.HOME);
  };

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-8">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">
            Something went wrong
          </CardTitle>
          <CardDescription>
            An unexpected error occurred. This has been logged for
            investigation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4">
            <p className="font-mono text-sm text-muted-foreground">
              {error.message || "Unknown error"}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset} variant="default">
            Try Again
          </Button>
          <Button onClick={handleGoHome} variant="outline">
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
