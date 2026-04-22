import { useRef, useCallback } from "react";
import type { AgGridReact } from "ag-grid-react";
import type { GridRowData, Trade } from "../schema/trade.schema";

export function useHierarchyStore(
    gridRef: React.RefObject<AgGridReact<GridRowData>>,
    fetchTrades: (parentId: string) => Promise<Trade[]>,
) {
    const expanded = useRef<Set<string>>(new Set());
    const childrenByParent = useRef<Map<string, Trade[]>>(new Map());
    const parentTotals = useRef<Map<string, number>>(new Map());

    const expand = useCallback(
        async (parentId: string) => {
            const api = gridRef.current?.api;
            if (!api) return;

            if (expanded.current.has(parentId)) return;

            const parentNode = api.getRowNode(parentId);
            if (parentNode?.rowIndex == null) return;

            let children = childrenByParent.current.get(parentId);

            if (!children) {
                children = await fetchTrades(parentId);

                childrenByParent.current.set(parentId, children);

                const total = children.reduce((sum, t) => sum + t.price, 0);
                parentTotals.current.set(parentId, total);
            }

            api.applyTransaction({
                add: children,
                addIndex: parentNode.rowIndex + 1,
            });

            expanded.current.add(parentId);
        },
        [gridRef, fetchTrades],
    );

    const collapse = useCallback(
        (parentId: string) => {
            const api = gridRef.current?.api;
            if (!api) return;

            const children = childrenByParent.current.get(parentId);
            if (!children || children.length === 0) return;

            api.applyTransaction({
                remove: children,
            });

            expanded.current.delete(parentId);
        },
        [gridRef],
    );

    const toggle = useCallback(
        async (parentId: string) => {
            if (expanded.current.has(parentId)) {
                collapse(parentId);
            } else {
                await expand(parentId);
            }
        },
        [expand, collapse],
    );

    const isExpanded = useCallback((parentId: string) => {
        return expanded.current.has(parentId);
    }, []);

    const getParentTotal = useCallback((parentId: string) => {
        return parentTotals.current.get(parentId) ?? 0;
    }, []);

    const updateTrade = useCallback((trade: Trade, newPrice: number) => {
        const parentId = trade.parentId;

        const oldPrice = trade.price;
        const delta = newPrice - oldPrice;

        trade.prevPrice = oldPrice;
        trade.price = newPrice;

        const currentTotal = parentTotals.current.get(parentId) ?? 0;
        const newTotal = currentTotal + delta;

        parentTotals.current.set(parentId, newTotal);

        return {
            updatedTrade: trade,
            updatedParentTotal: newTotal,
        };
    }, []);

    return {
        toggle,
        expand,
        collapse,
        isExpanded,
        updateTrade,
        getParentTotal,
    };
}
