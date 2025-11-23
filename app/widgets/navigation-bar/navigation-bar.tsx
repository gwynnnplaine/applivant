"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/routes";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const QUERY_PARAM = "search";
  const query = searchParams.get(QUERY_PARAM) || "";

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(QUERY_PARAM, value);
    } else {
      params.delete(QUERY_PARAM);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <Input
      className="hidden md:block md:py-1"
      placeholder="Search applications..."
      value={query}
      onChange={(e) => {
        // e.preventDefault();
        handleSearch(e.target.value);
      }}
    />
  );
}

export function NavigationBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card backdrop-blur">
      <div className="mx-4 flex flex-col gap-2 py-2 md:h-16 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between md:h-16 md:flex-grow">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-primary">
              <Link href={ROUTES.HOME}>Applivant</Link>
            </span>

            <SearchInput />
          </div>

          <div className="flex items-center gap-2">
            <AddNewApplication />
            <Separator
              className="hidden h-10 md:block"
              orientation="vertical"
            />
            <ModeToggle />
          </div>
        </div>

        <div className="w-full md:hidden md:w-max md:flex-grow md:pl-8">
          <Input
            className="py-3 md:py-1"
            placeholder="Search applications..."
          />
        </div>
      </div>
    </header>
  );
}

function AddNewApplication() {
  const router = useRouter();

  function handleClick() {
    router.push(ROUTES.ADD_APPLICATION);
  }

  return (
    <Button onClick={handleClick} className="w-min p-1 sm:p-2">
      <Plus className="h-3 w-3" aria-hidden="true" />
      <p className="hidden sm:inline-block">Add new application</p>
    </Button>
  );
}
