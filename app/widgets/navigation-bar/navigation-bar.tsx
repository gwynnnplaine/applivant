"use client";
import { ModeToggle } from "./mode-toggle";
import { MobileMenu } from "./mobile-navigation-bar";
import { DesktopNavigationBar } from "./desktop-navigation-bar";

const NAV_LINKS = [] as const;

export function NavigationBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card backdrop-blur">
      <div className="mx-4 flex h-16 w-auto items-center justify-between">
        <div className="flex w-full items-center gap-2">
          <div className="md:hidden">
            <MobileMenu links={NAV_LINKS} />
          </div>

          <span className="flex w-full gap-2 text-primary">
            {/* Logo */}
            <span className="w-full text-xl font-semibold sm:inline-block sm:items-center">
              Applivant
            </span>
          </span>
          <div className="hidden md:block">
            <DesktopNavigationBar links={NAV_LINKS} />
          </div>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
