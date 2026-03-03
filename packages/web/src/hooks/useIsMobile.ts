import { useEffect, useState } from "react";

/** lg breakpoint (1024px) — matches the dashboard sidebar toggle */
const LG_BREAKPOINT = "(min-width: 1024px)";

/**
 * Returns `true` when the viewport is narrower than 1024px (below Tailwind `lg`).
 * Uses `window.matchMedia` so it updates in real-time on resize.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? !window.matchMedia(LG_BREAKPOINT).matches
      : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(LG_BREAKPOINT);
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mql.addEventListener("change", handler);
    // sync on mount in case SSR hydration differs
    setIsMobile(!mql.matches);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
};
