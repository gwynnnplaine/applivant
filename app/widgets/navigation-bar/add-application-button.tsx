"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddApplicationButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push(ROUTES.ADD_APPLICATION);
  };

  return (
    <Button onClick={handleClick} className="w-min p-1 sm:p-2">
      <Plus className="h-3 w-3" aria-hidden="true" />
      <span className="hidden sm:inline-block">Add new application</span>
    </Button>
  );
}
