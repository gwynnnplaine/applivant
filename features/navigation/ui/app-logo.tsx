import { ApplivantLogo } from "@/icons/app-logo";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export function AppLogo() {
  return (
    <Link
      href={ROUTES.HOME}
      className="flex items-center gap-1 text-xl font-semibold text-primary transition-colors hover:text-primary/90"
    >
      <ApplivantLogo />
      Applivant
    </Link>
  );
}
