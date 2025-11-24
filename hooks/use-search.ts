import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useSearch(paramName: string = "q") {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get(paramName) || "";

  const setQuery = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);

      if (value.trim()) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }

      // Preserve current pathname, update only query params
      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : "/");
    },
    [router, searchParams, paramName],
  );

  return { query, setQuery };
}
