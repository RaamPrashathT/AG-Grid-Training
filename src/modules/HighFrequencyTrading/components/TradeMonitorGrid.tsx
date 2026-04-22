"use client";

import React, { useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    ColDef,
    ModuleRegistry,
    AllCommunityModule,
    GetRowIdParams,
    themeQuartz,
} from "ag-grid-community";

import { useRegions } from "../hooks/useRegions";
import { useDebounce } from "../hooks/useDebounce";
import type { GridRowData } from "../schema/trade.schema";

ModuleRegistry.registerModules([AllCommunityModule]);

export function TradeMonitorGrid() {
    const gridRef = useRef<AgGridReact<GridRowData>>(null);

    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 300);

    const { data, isLoading, isError } = useRegions({
        page: 1,
        perPage: 10,
        search: debouncedSearch,
    });

    const columnDefs = useMemo<ColDef<GridRowData>[]>(
        () => [
            {
                headerName: "Region Name",
                field: "name",
            },
            {
                headerName: "Trading Desk",
                field: "tradingDesk",
            },
            {
                headerName: "Currency",
                field: "currency",
            },
            {
                headerName: "Created At",
                field: "createdAt",
            },
        ],
        [],
    );

    const defaultColDef = useMemo<ColDef>(
        () => ({
            flex: 1,
            minWidth: 150,
        }),
        [],
    );

    const getRowId = useMemo(() => {
        return (params: GetRowIdParams<GridRowData>) => params.data.id;
    }, []);

    if (isError) {
        return <div className="p-4 text-red-600">Failed to load regions.</div>;
    }

    return (
        <div className="p-6 space-y-4">
            <input
                type="text"
                placeholder="Search regions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="border px-3 py-2 rounded"
            />

            <div style={{ height: 500 }}>
                <AgGridReact<GridRowData>
                    ref={gridRef}
                    theme={themeQuartz}
                    rowData={data?.data || []}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    getRowId={getRowId}
                    loading={isLoading}
                />
            </div>
        </div>
    );
}
