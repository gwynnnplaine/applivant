"use client";

import { Separator } from "@/components/ui/separator";
import { useModalState } from "@/hooks/use-modal-state";
import { ImportExportModal } from "../import-export-modal/import-export-modal";
import { ModeToggle } from "./mode-toggle";
import { SearchInput } from "./search-input";
import { AddApplicationButton } from "./add-application-button";
import { ImportExportButton } from "./import-export-button";
import { AppLogo } from "./app-logo";

export function NavigationBar() {
  const { isOpen, openModal, closeModal } = useModalState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card backdrop-blur">
      <div className="mx-4 flex flex-col gap-2 py-2 md:h-16 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between md:h-16 md:flex-grow">
          <div className="flex items-center gap-2">
            <AppLogo />
            <div className="hidden md:block">
              <SearchInput />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AddApplicationButton />
            <ImportExportButton onClick={openModal} />
            <Separator
              className="hidden h-10 md:block"
              orientation="vertical"
            />
            <ModeToggle />
          </div>
        </div>

        <div className="w-full md:hidden">
          <SearchInput />
        </div>
      </div>

      <ImportExportModal isOpen={isOpen} onClose={closeModal} />
    </header>
  );
}
