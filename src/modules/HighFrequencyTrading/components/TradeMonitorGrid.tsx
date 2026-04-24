"use client";

import { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    ModuleRegistry,
    AllCommunityModule,
    themeQuartz,
    type ColDef,
    type GetRowIdParams,
} from "ag-grid-community";

import { useRegions } from "../hooks/useRegions";
import { useLazyFetchTrades } from "../hooks/useTrades";
import { useDebounce } from "../hooks/useDebounce";
import { useHierarchyStore } from "../hooks/useHierarchyStore";
import { useTradeUpdates } from "../hooks/useTradeUpdates";
import { DOTS, usePagination } from "../hooks/usePagination";

import { columnDefs, type MonitorRowData } from "./grid/columnDefs";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

ModuleRegistry.registerModules([AllCommunityModule]);

type SortState = { field: string; direction: "asc" | "desc" } | null;

function cmp(a: string | number, b: string | number, dir: "asc" | "desc"): number {
    if (a < b) return dir === "asc" ? -1 : 1;
    if (a > b) return dir === "asc" ?  1 : -1;
    return 0;
}

function sortValue(row: MonitorRowData, field: string): string | number {
    switch (field) {
        case "hierarchy":
            return ("name" in row ? row.name as string : "") ?? "";
        case "currencyOrPrice":
            return row.aggregatedTotal ?? ("currency" in row ? row.currency as string : "") ?? "";
        default:
            return (row[field as keyof MonitorRowData] as string | number) ?? "";
    }
}

function sortParents(rows: MonitorRowData[], sort: SortState): MonitorRowData[] {
    if (!sort) return rows;
    return [...rows].sort((a, b) => cmp(sortValue(a, sort.field), sortValue(b, sort.field), sort.direction));
}

export function TradeMonitorGrid() {
    const gridRef = useRef<AgGridReact<MonitorRowData>>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 300);

    const [sort, setSort] = useState<SortState>(null);

    const { data, isLoading, isError } = useRegions({
        page: currentPage,
        perPage: pageSize,
        search: debouncedSearch,
    });

    const paginationRange = usePagination(data?.items ?? 0, pageSize, currentPage);

    const { mutateAsync: fetchTrades } = useLazyFetchTrades();
    const hierarchy = useHierarchyStore(fetchTrades);

    const visibleRows = useMemo(() => {
        const sorted = sortParents(data?.data ?? [], sort);
        return hierarchy.getVisibleRows(sorted);
    }, [data, hierarchy, sort]);

    const gridContext = useMemo(
        () => ({
            toggleExpand: hierarchy.toggle,
            isExpanded:   hierarchy.isExpanded,
        }),
        [hierarchy],
    );

    const defaultColDef = useMemo<ColDef>(
        () => ({ sortable: true, comparator: () => 0 }),
        [],
    );

    const getRowId = useMemo(
        () => (params: GetRowIdParams<MonitorRowData>) => params.data.id,
        [],
    );

    useTradeUpdates({ gridRef, hierarchy });

    if (isError) {
        return <div className="p-4 text-red-600">Failed to load regions.</div>;
    }

    return (
        <div className="p-6 space-y-4">
            <input
                type="text"
                placeholder="Search regions..."
                value={searchInput}
                onChange={(e) => {
                    setSearchInput(e.target.value);
                    setCurrentPage(1);
                }}
                className="border px-3 py-2 rounded"
            />

            <div style={{ height: 700 }}>
                <AgGridReact<MonitorRowData>
                    ref={gridRef}
                    theme={themeQuartz}
                    rowData={visibleRows}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    getRowId={getRowId}
                    context={gridContext}
                    loading={isLoading} 
                    onSortChanged={(e) => {
                        const sorted = e.api.getColumnState().find((c) => c.sort != null);
                        setSort(
                            sorted
                                ? { field: sorted.colId!, direction: sorted.sort as "asc" | "desc" }
                                : null,
                        );
                    }}
                />
            </div>

            {(data?.pages ?? 0) > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {paginationRange.map((page, i) => (
                            <PaginationItem key={`${page}-${i}`}>
                                {page === DOTS ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page as number)}
                                        isActive={currentPage === page}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage((p) => Math.min(data?.pages ?? p, p + 1))}
                                className={currentPage === (data?.pages ?? 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}