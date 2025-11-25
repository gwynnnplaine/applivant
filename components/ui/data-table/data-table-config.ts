import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

interface FeatureOptions {
  enablePagination?: boolean;
  initialVisibility?: VisibilityState;
  emptyStateText?: string;
}

export interface DataTableProps<TData, TValue> extends FeatureOptions {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
}

export interface UseDataTableReturn<TData> {
  table: Table<TData>;
  enablePagination: boolean;
  onRowClick?: (data: TData) => void;
  emptyStateText?: string;
  columnsCount: number;
}

export function useDataTable<TData, TValue>(
  props: DataTableProps<TData, TValue>,
): UseDataTableReturn<TData> {
  const {
    columns,
    data,
    enablePagination = false,
    onRowClick,
    emptyStateText,
  } = props;

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    state: { sorting },
    onSortingChange: setSorting,
  });

  return {
    table,
    enablePagination,
    onRowClick,
    emptyStateText,
    columnsCount: columns.length,
  };
}
