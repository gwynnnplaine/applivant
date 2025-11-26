import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type ViewMode = "table" | "grid";

const VIEW_MODE_PARAM = "view";

function isValidViewMode(value: string | null): value is ViewMode {
  return value === "table" || value === "grid";
}

export function useViewMode() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const viewParam = searchParams.get(VIEW_MODE_PARAM);
  const viewMode: ViewMode = isValidViewMode(viewParam) ? viewParam : "table";

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      const params = new URLSearchParams(searchParams);

      if (mode === "table") {
        // "table" is the default, remove from URL to keep it clean
        params.delete(VIEW_MODE_PARAM);
      } else {
        params.set(VIEW_MODE_PARAM, mode);
      }

      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : "/", { scroll: false });
    },
    [router, searchParams],
  );

  return { viewMode, setViewMode };
}
