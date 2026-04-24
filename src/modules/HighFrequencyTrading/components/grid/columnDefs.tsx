"use client";

import { useState } from "react";
import type { ColDef, ValueGetterParams } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { TradeRow } from "../../schema/trade.schema";
import { isTradeRow } from "../../schema/trade.schema";
import { Region } from "../../schema/region.schema";
import { SideFilter } from "./Filter";

export type MonitorRowData = (Region | TradeRow) & {
    readonly aggregatedTotal?: number;
    readonly prevAggregatedTotal?: number;
};

function RegionNameCellRenderer(props: CustomCellRendererProps<Region>) {
    const { data, value, context } = props;
    const [loading, setLoading] = useState(false);

    if (!data) return null;

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
                {loading ? "…" : context.isExpanded(data.id) ? "−" : "+"}
            </button>
            <span>{value}</span>
        </div>
    );
}

function TradeSymbolCellRenderer(props: CustomCellRendererProps<TradeRow>) {
    return (
        <div className="pl-8 flex items-center text-sm text-gray-600">
            {props.value}
        </div>
    );
}

function TradePriceCellRenderer(
    props: CustomCellRendererProps<MonitorRowData>,
) {
    const { data } = props;
    if (!data || !isTradeRow(data)) return null;

    const prev = data.prevPrice;
    const up = prev === undefined ? null : data.price >= prev;

    return (
        <div
            className={`flex items-center gap-1 font-mono ${up === null ? "" : up ? "text-green-600" : "text-red-600"}`}
        >
            {up !== null && <span className="text-xs">{up ? "▲" : "▼"}</span>}
            <span>${data.price.toFixed(2)}</span>
        </div>
    );
}

function RegionPriceCellRenderer(
    props: CustomCellRendererProps<MonitorRowData>,
) {
    const { data } = props;
    if (!data || isTradeRow(data)) return null;

    const current = data.aggregatedTotal;
    const prev = data.prevAggregatedTotal;
    const up =
        prev === undefined || current === undefined ? null : current >= prev;

    return (
        <div
            className={`flex items-center gap-1 font-mono ${up === null ? "" : up ? "text-green-600" : "text-red-600"}`}
        >
            {up !== null && <span className="text-xs">{up ? "▲" : "▼"}</span>}
            <span>
                {current !== undefined
                    ? `Sum: $${current.toFixed(2)}`
                    : data.currency}
            </span>
        </div>
    );
}

export const columnDefs: ColDef<MonitorRowData>[] = [
    {
        headerName: "Region / Symbol",
        colId: "hierarchy",
        cellRendererSelector: (params) => {
            if (!params.data) return undefined;
            return isTradeRow(params.data)
                ? { component: TradeSymbolCellRenderer }
                : { component: RegionNameCellRenderer };
        },
        valueGetter: (params: ValueGetterParams<MonitorRowData>) => {
            if (!params.data) return "";
            return isTradeRow(params.data)
                ? params.data.symbol
                : params.data.name;
        },
        flex: 1,
    },
    {
        headerName: "Desk / Trader",
        colId: "deskOrTrader",
        valueGetter: (params: ValueGetterParams<MonitorRowData>) => {
            if (!params.data) return "";
            return isTradeRow(params.data)
                ? params.data.traderName
                : params.data.tradingDesk;
        },
        flex: 1,
    },
    {
        headerName: "Currency / Price",
        colId: "currencyOrPrice",
        cellRendererSelector: (params) => {
            if (!params.data) return undefined;
            return isTradeRow(params.data)
                ? { component: TradePriceCellRenderer }
                : { component: RegionPriceCellRenderer };
        },
        valueGetter: (params: ValueGetterParams<MonitorRowData>) => {
            if (!params.data) return "";
            return isTradeRow(params.data)
                ? params.data.price
                : (params.data.aggregatedTotal ?? params.data.currency);
        },
        flex: 1,
        editable: true,
    },
    {
        headerName: "Side",
        colId: "side",
        filter: SideFilter,
        valueGetter: (params: ValueGetterParams<MonitorRowData>) => {
            if (!params.data) return "";
            return isTradeRow(params.data) ? params.data.side : "";
        },
        flex: 1,
    },
    {
        headerName: "Quantity",
        colId: "quantity",
        valueGetter: (params: ValueGetterParams<MonitorRowData>) => {
            if (!params.data) return "";
            return isTradeRow(params.data) ? params.data.quantity : "";
        },
        flex: 1,
    },
];
