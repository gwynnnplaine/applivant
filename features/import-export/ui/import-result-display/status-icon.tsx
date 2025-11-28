import { AlertCircle, CheckCircle2 } from "lucide-react";

export function StatusIcon({ variant }: { variant: "success" | "warning" }) {
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;
  const color =
    variant === "success"
      ? "text-green-600 dark:text-green-400"
      : "text-yellow-600 dark:text-yellow-400";

  return <Icon className={`mt-0.5 h-5 w-5 ${color}`} />;
}
