import { useCallback, useSyncExternalStore } from "react";

function getServerSnapshot(): boolean {
  // Default to false on server (will be hydrated on client)
  return false;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);
      return () => {
        mediaQuery.removeEventListener("change", callback);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}

export function useIsTablet(): boolean {
  const isMdOrLarger = useMediaQuery("(min-width: 768px)");
  const isLgOrLarger = useMediaQuery("(min-width: 1024px)");
  return isMdOrLarger && !isLgOrLarger;
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

export function useIsMdOrLarger(): boolean {
  return useMediaQuery("(min-width: 768px)");
}
