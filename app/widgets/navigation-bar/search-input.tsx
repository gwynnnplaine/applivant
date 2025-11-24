"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { SEARCH_QUERY_PARAM } from "../consts";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get(SEARCH_QUERY_PARAM) || "";

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(SEARCH_QUERY_PARAM, value);
    } else {
      params.delete(SEARCH_QUERY_PARAM);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <Input
      className="py-1"
      placeholder="Search applications..."
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      aria-label="Search applications"
    />
  );
}
