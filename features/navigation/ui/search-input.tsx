"use client";

import { Input } from "@/components/ui/input";
import { useSearch } from "@/shared/hooks";

const SEARCH_QUERY_PARAM = "search";

export function SearchInput() {
  const { query, setQuery } = useSearch(SEARCH_QUERY_PARAM);

  return (
    <Input
      className="py-1"
      placeholder="Search applications..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Search applications"
    />
  );
}
