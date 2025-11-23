import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  TableOptions,
  VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface FeatureOptions {
  enablePagination?: boolean;
  enableSorting?: boolean;
  initialVisibility?: VisibilityState;
  emptyStateText?: string;
}

export interface CustomTableProps<TData, TValue> extends FeatureOptions {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
}

export function useTableConfig<TData, TValue>(
  props: CustomTableProps<TData, TValue>,
): TableOptions<TData> {
  const {
    columns,
    data,
    enablePagination = false,
    enableSorting = false,
    initialVisibility = {},
  } = props;

  const [sorting, setSorting] = useState<SortingState>([]);

  const options = useMemo(() => {
    const tableOptions: TableOptions<TData> = {
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      initialState: {
        columnVisibility: initialVisibility,
      },
      state: {
        ...(enableSorting ? { sorting } : {}),
      },
      onSortingChange: setSorting,
    };

    if (enablePagination) {
      tableOptions.getPaginationRowModel = getPaginationRowModel();
    }

    if (enableSorting) {
      tableOptions.getSortedRowModel = getSortedRowModel();
    }

    return tableOptions;
  }, [
    columns,
    data,
    enablePagination,
    enableSorting,
    initialVisibility,
    sorting,
    setSorting,
  ]);

  return options;
}
