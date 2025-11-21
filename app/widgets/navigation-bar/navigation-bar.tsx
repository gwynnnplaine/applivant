"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { ModeToggle } from "./mode-toggle";
import { MobileMenu } from "./mobile-navigation-bar";
import { DesktopNavigationBar } from "./desktop-navigation-bar";

const MOBILE_BREAKPOINT = 768;

const NAV_LINKS = [] as const;

export function NavigationBar() {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const checkWidth = useCallback(() => {
    if (!containerRef.current) return;
    setIsMobile(containerRef.current.offsetWidth < MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    checkWidth();
    const resizeObserver = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [checkWidth]);

  return (
    <header
      ref={containerRef}
      className="sticky top-0 z-50 w-full border-b border-border bg-card backdrop-blur"
    >
      <div className="mx-4 flex h-16 w-auto items-center justify-between">
        <div className="flex w-full items-center gap-2">
          {isMobile && <MobileMenu links={NAV_LINKS} />}
          <span className="flex w-full gap-2 text-primary">
            {/* Logo */}
            <span className="w-full text-xl font-semibold sm:inline-block sm:items-center">
              Applivant
            </span>
          </span>
          {!isMobile && <DesktopNavigationBar links={NAV_LINKS} />}
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
