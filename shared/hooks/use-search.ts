import { useQueryState } from "nuqs";

export function useSearch(paramName: string = "q") {
  const [query, setQuery] = useQueryState(paramName, {
    defaultValue: "",
    shallow: false,
  });

  return { query, setQuery };
  return { query, setQuery };
}
