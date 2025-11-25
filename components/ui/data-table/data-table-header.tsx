"use client";

import { cn } from "@/lib/utils";
import { Header, flexRender } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "../button";

interface DataTableHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
}

export function DataTableHeader<TData, TValue>({
  header,
}: DataTableHeaderProps<TData, TValue>) {
  if (header.isPlaceholder) {
    return null;
  }

  const isSortable = header.column.columnDef.enableSorting === true;

  const headerContent = flexRender(
    header.column.columnDef.header,
    header.getContext(),
  );

  if (!isSortable) {
    return <>{headerContent}</>;
  }

  return (
    <SortableHeaderButton header={header}>{headerContent}</SortableHeaderButton>
  );
}

interface SortableHeaderButtonProps<TData, TValue> {
  header: Header<TData, TValue>;
  children: React.ReactNode;
}

function SortableHeaderButton<TData, TValue>({
  header,
  children,
}: SortableHeaderButtonProps<TData, TValue>) {
  const isSorted = header.column.getIsSorted();

  return (
    <Button
      key={header.id}
      variant="ghost"
      type="button"
      className={cn(
        "flex items-center gap-1 font-medium transition-colors hover:text-foreground",
        isSorted && "text-foreground",
      )}
      onClick={header.column.getToggleSortingHandler()}
    >
      {children}
      <SortIndicator isSorted={isSorted} />
    </Button>
  );
}

function SortIndicator({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  const iconClass = "size-2";

  if (isSorted === "asc") {
    return <ArrowUp className={iconClass} aria-hidden="true" />;
  }

  if (isSorted === "desc") {
    return <ArrowDown className={iconClass} aria-hidden="true" />;
  }

  return (
    <ArrowUpDown className={cn(iconClass, "opacity-50")} aria-hidden="true" />
  );
}
