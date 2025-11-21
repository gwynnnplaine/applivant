"use client";

import { Eclipse } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme}>
      <Eclipse className="h-3 w-3" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
