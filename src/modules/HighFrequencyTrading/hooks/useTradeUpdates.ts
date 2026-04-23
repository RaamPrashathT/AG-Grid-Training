import { useEffect } from "react";
import type { AgGridReact } from "ag-grid-react";
import type { Trade } from "../schema/trade.schema";
import type { MonitorRowData } from "../hooks/useHierarchyStore";

type Params = {
    gridRef:     React.RefObject<AgGridReact<MonitorRowData> | null>;
    hierarchy: {
        updateTrade:   (trade: Trade, newPrice: number) => { updatedTrade: Trade; updatedParentTotal: number };
        getAllChildren: () => Trade[];
    };
    intervalMs?: number;
};

export function useTradeUpdates({ gridRef, hierarchy, intervalMs = 500 }: Params) {
    useEffect(() => {
        const interval = setInterval(() => {
            const api = gridRef.current?.api;
            if (!api) return;

            const allChildren = hierarchy.getAllChildren();
            if (allChildren.length === 0) return;

            // Pick up to 10 random children to update
            const targets = allChildren
                .toSorted(() => 0.5 - Math.random())
                .slice(0, 10);

            const updates: MonitorRowData[] = [];

            for (const trade of targets) {
                // Skip if this row isn't currently rendered (parent collapsed)
                if (!api.getRowNode(trade.id)) continue;

                const changePercent = Math.random() * 0.04 - 0.02;
                const newPrice      = Number((trade.price * (1 + changePercent)).toFixed(2));

                const { updatedTrade, updatedParentTotal } = hierarchy.updateTrade(trade, newPrice);

                updates.push(updatedTrade);

                const parentNode = api.getRowNode(trade.parentId);
                if (parentNode?.data) {
                    updates.push({
                        ...parentNode.data,
                        prevAggregatedTotal: parentNode.data.aggregatedTotal,
                        aggregatedTotal:     Number(updatedParentTotal.toFixed(2)),
                    });
                }
            }

            if (updates.length > 0) {
                api.applyTransactionAsync({ update: updates });
            }
        }, intervalMs);

        return () => clearInterval(interval);
    }, [gridRef, hierarchy, intervalMs]);
}