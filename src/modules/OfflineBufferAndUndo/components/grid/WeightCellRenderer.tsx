"use client";

import React from "react";
import type { CustomCellRendererProps } from "ag-grid-react";

/**
 * Fix: In the error state, the original rendered `params.value` — but at the
 * moment the error state is set, params.value still reflects the optimistic
 * (invalid) value before the async revert lands. This showed "❌ 1500" even
 * though the data was already being reverted to the safe old value.
 *
 * Solution: show a static "Invalid" label instead of the raw value during
 * error state. The cell will naturally refresh to the correct number once
 * useShipments reverts the row data and AG Grid re-renders.
 *
 * The "idle" label is also removed from the normal state — it was unnecessary
 * visual noise that appeared briefly between status transitions.
 */
export const WeightCellRenderer: React.FC<CustomCellRendererProps> = (
    params,
) => {
    const rowId = params.node.id;
    const field = params.colDef?.field;

    const statuses = params.context?.cellStatuses || {};
    const status = statuses[`${rowId}-${field}`] || "idle";

    if (status === "loading") {
        return (
            <div className="flex items-center gap-2 text-amber-700">
                <span className="inline-block">⏳</span>
                <span className="text-sm font-medium">Validating</span>
            </div>
        );
    }

    if (status === "error") {
        return (
            // FIX: Don't render params.value here — it's the stale optimistic
            // value. Show a fixed label; the cell refreshes to the reverted
            // value once useShipments updates row data.
            <div className="flex items-center gap-2 font-medium text-red-700">
                <span>❌</span>
                <span className="text-sm">Invalid — reverted</span>
            </div>
        );
    }

    // Normal / idle state
    return (
        <div className="flex items-center gap-1">
            <span>{params.value}</span>
            <span className="text-gray-400 text-xs">kg</span>
        </div>
    );
};