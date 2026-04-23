import type { ColDef, ValueGetterParams } from "ag-grid-community";
import type { GridRowData } from "../../schema/trade.schema";
import { HierarchyCellRenderer } from "../HierarchyCellRenderer";
import { isTradeRow } from "../../schema/trade.schema";

export type MonitorRowData = GridRowData & {
    aggregatedTotal?: number;
    prevAggregatedTotal?: number;
};

export const columnDefs: ColDef<MonitorRowData>[] = [
    {
        headerName: "Region / Symbol",
        colId: "hierarchy",
        cellRenderer: HierarchyCellRenderer,
        valueGetter: (params: ValueGetterParams<MonitorRowData>) => {
            const { data } = params;
            if (!data) return "";
            return isTradeRow(data) ? data.symbol : data.name;
        },
        flex: 1,
    },
    {
        headerName: "Trading Desk",
        field: "tradingDesk",
        flex: 1,
    },
    {
        headerName: "Currency / Price",
        colId: "currencyOrPrice",
        valueGetter: (params: ValueGetterParams<MonitorRowData>) => {
            const { data } = params;
            if (!data) return "";
            return isTradeRow(data) ? data.price : (data.aggregatedTotal ?? data.currency);
        },
        valueFormatter: (params) => {
            const { data } = params;
            if (!data) return "";
            if (isTradeRow(data)) return `$${Number(params.value).toFixed(2)}`;
            return typeof params.value === "number"
                ? `Sum: $${params.value.toFixed(2)}`
                : String(params.value);
        },
        flex: 1,
    },
    {
        headerName: "Created At",
        field: "createdAt",
        flex: 1,
    },
];