import { useRef, useCallback, useState } from "react";
import type { Trade, GridRowData } from "../schema/trade.schema";

export type MonitorRowData = GridRowData & {
    aggregatedTotal?: number;
    prevAggregatedTotal?: number;
};

export function useHierarchyStore(
    fetchTrades: (parentId: string) => Promise<Trade[]>,
) {
    const expanded = useRef<Set<string>>(new Set());
    const childrenByParent = useRef<Map<string, Trade[]>>(new Map());
    const parentTotals = useRef<Map<string, number>>(new Map());

    const [, forceRender] = useState(0);
    const rerender = () => forceRender((n) => n + 1);

    const toggle = useCallback(
        async (parentId: string) => {
            if (expanded.current.has(parentId)) {
                expanded.current.delete(parentId);
                rerender();
                return;
            }

            if (!childrenByParent.current.has(parentId)) {
                const children = await fetchTrades(parentId);
                childrenByParent.current.set(parentId, children);
                parentTotals.current.set(
                    parentId,
                    children.reduce((sum, t) => sum + t.price, 0),
                );
            }

            expanded.current.add(parentId);
            rerender();
        },
        [fetchTrades],
    );

    const isExpanded = useCallback(
        (id: string) => expanded.current.has(id),
        [],
    );

    const getVisibleRows = useCallback(
        (parents: GridRowData[]): MonitorRowData[] => {
            const rows: MonitorRowData[] = [];

            for (const parent of parents) {
                rows.push({
                    ...parent,
                    aggregatedTotal: parentTotals.current.get(parent.id),
                });

                if (expanded.current.has(parent.id)) {
                    const children =
                        childrenByParent.current.get(parent.id) ?? [];
                    rows.push(...children);
                }
            }

            return rows;
        },
        [],
    );

    const updateTrade = useCallback(
        (
            trade: Trade,
            newPrice: number,
        ): { updatedTrade: Trade; updatedParentTotal: number } => {
            const delta = newPrice - trade.price;

            const siblings = childrenByParent.current.get(trade.parentId);
            if (siblings) {
                const idx = siblings.findIndex((t) => t.id === trade.id);
                if (idx !== -1) {
                    siblings[idx] = {
                        ...trade,
                        price: newPrice,
                        prevPrice: trade.price,
                    };
                }
            }

            const newTotal =
                (parentTotals.current.get(trade.parentId) ?? 0) + delta;
            parentTotals.current.set(trade.parentId, newTotal);

            return {
                updatedTrade: {
                    ...trade,
                    price: newPrice,
                    prevPrice: trade.price,
                },
                updatedParentTotal: newTotal,
            };
        },
        [],
    );

    const getAllChildren = useCallback((): Trade[] => {
        const all: Trade[] = [];
        childrenByParent.current.forEach((arr) => all.push(...arr));
        return all;
    }, []);

    return {
        toggle,
        isExpanded,
        getVisibleRows,
        updateTrade,
        getAllChildren,
    };
}
