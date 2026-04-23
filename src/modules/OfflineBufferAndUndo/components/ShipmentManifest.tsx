"use client";

import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    ColDef,
    IRowNode,
    ModuleRegistry,
    AllCommunityModule,
} from "ag-grid-community";

import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useShipments } from "../hooks/useShipments";
import type { Shipment } from "../schema/shipment.schema";

import { getShipmentColumnDefs } from "./grid/shipmentColumnDefs";
import { GridControls } from "./GridControls";
import { PaginationControls } from "./PaginationControls";

ModuleRegistry.registerModules([AllCommunityModule]);

export const ShipmentManifest = () => {
    const gridRef = useRef<AgGridReact>(null);

    const { isOnline } = useNetworkStatus();
    const { data, edit, undo, redo, canUndo, canRedo, cellState } =
        useShipments(isOnline);

    const [filterThreshold, setFilterThreshold] = useState<number | "">("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [selectedShipments, setSelectedShipments] = useState<Shipment[]>([]);

    const columnDefs = useMemo(() => getShipmentColumnDefs(), []);
    const defaultColDef = useMemo<ColDef>(
        () => ({
            editable: true,
            resizable: true,
            cellStyle: { textAlign: "left" },
        }),
        [],
    );

    const syncPaginationState = useCallback(() => {
        const api = gridRef.current?.api;
        if (!api) return;

        setCurrentPage(api.paginationGetCurrentPage() + 1);
        setTotalPages(Math.max(api.paginationGetTotalPages(), 1));
    }, []);

    const getRowId = useCallback((params: any) => params.data.id, []);

    const onCellValueChanged = useCallback(
        (event: any) => {
            const rowId = event.data?.id;
            const field = event.colDef?.field;

            if (!rowId || !field) return;

            edit({
                rowId: String(rowId),
                field,
                oldValue: event.oldValue,
                newValue: event.newValue,
            });

            gridRef.current?.api.refreshCells({ force: true });
        },
        [edit],
    );

    useEffect(() => {
        gridRef.current?.api?.onFilterChanged();
        syncPaginationState();
    }, [filterThreshold, syncPaginationState]);

    useEffect(() => {
        syncPaginationState();
    }, [data, syncPaginationState]);

    const isExternalFilterPresent = useCallback(
        () => filterThreshold !== "",
        [filterThreshold],
    );

    const doesExternalFilterPass = useCallback(
        (node: IRowNode) => {
            if (filterThreshold === "") return true;
            return node.data.weight * node.data.quantity > filterThreshold;
        },
        [filterThreshold],
    );

    return (
        <section className="mx-auto w-full max-w-[1400px] p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                        Shipment Manifest Editor
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Offline-first editing with validation, undo and redo.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <GridControls
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={() => {
                    undo();
                    gridRef.current?.api.refreshCells({ force: true });
                    syncPaginationState();
                }}
                onRedo={() => {
                    redo();
                    gridRef.current?.api.refreshCells({ force: true });
                    syncPaginationState();
                }}
                isOnline={isOnline}
                filterThreshold={filterThreshold}
                setFilterThreshold={setFilterThreshold}
                selectedShipments={selectedShipments}
            />
            

            <div className="ag-theme-quartz h-[560px] border-b border-border">
                <AgGridReact
                    ref={gridRef}
                    rowData={data}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    getRowId={getRowId}
                    stopEditingWhenCellsLoseFocus={true}
                    singleClickEdit={true}
                    context={{ cellStatuses: cellState }}
                    onCellValueChanged={onCellValueChanged}
                    isExternalFilterPresent={isExternalFilterPresent}
                    doesExternalFilterPass={doesExternalFilterPass}
                    rowSelection="multiple"
                    onSelectionChanged={(event) => {
                        const selectedRows = event.api.getSelectedRows() as Shipment[];
                        setSelectedShipments(selectedRows);
                    }}
                />
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={(page) => {
                    const api = gridRef.current?.api;
                    if (!api || page < 1 || page > totalPages) return;

                    api.paginationGoToPage(page - 1);
                    syncPaginationState();
                }}
                onPageSizeChange={(size) => {
                    const api = gridRef.current?.api;

                    setPageSize(size);

                    if (api) {
                        if (typeof (api as any).paginationSetPageSize === "function") {
                            (api as any).paginationSetPageSize(size);
                        } else {
                            api.setGridOption("paginationPageSize", size);
                        }

                        api.paginationGoToFirstPage();
                    }

                    syncPaginationState();
                }}
            />
            </div>
        </section>
    );
};
