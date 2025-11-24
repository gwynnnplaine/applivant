import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export function AppLogo() {
  return (
    <Link
      href={ROUTES.HOME}
      className="text-xl font-semibold text-primary transition-colors hover:text-primary/90"
    >
      Applivant
    </Link>
  );
}
