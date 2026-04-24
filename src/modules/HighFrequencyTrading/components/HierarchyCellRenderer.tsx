"use client";

import React, { useState } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import { isTradeRow, type GridRowData } from "../schema/trade.schema";

export function HierarchyCellRenderer(
    props: Readonly<CustomCellRendererProps<GridRowData>>,
) {
    const { data, value, context } = props;
    const [loading, setLoading]    = useState(false);

    if (!data) return null;

    if (isTradeRow(data)) {
        return (
            <div className="pl-8 flex items-center text-sm text-gray-600">
                {value}
            </div>
        );
    }

    const isExpanded = context.isExpanded(data.id);

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setLoading(true);
        await context.toggleExpand(data.id);
        setLoading(false);
    };

    return (
        <div className="flex items-center">
            <button
                onClick={handleToggle}
                disabled={loading}
                className="mr-2 w-5 h-5 border rounded flex items-center justify-center text-xs"
            >
                {loading ? "…" : isExpanded ? "−" : "+"}
            </button>
            <span>{value}</span>
        </div>
    );
}