import { type CustomFilterProps, useGridFilter } from "ag-grid-react";
import { useCallback } from "react";
import { isTradeRow, TradeRow } from "../../schema/trade.schema";
import type { MonitorRowData } from "./columnDefs";

const SIDES = ["BUY", "SELL"];

export function SideFilter({ model, onModelChange }: CustomFilterProps) {
    useGridFilter({
        doesFilterPass: useCallback((params) => {
            if (!params.data) return true;
            if (!isTradeRow(params.data as MonitorRowData)) return true;
            return (params.data as TradeRow).side === model;
        }, [model]),
    });

    return (
        <div className="p-3 flex flex-col gap-2">
            <button
                onClick={() => onModelChange(null)}
                className={`px-2 py-1 rounded text-sm border ${model === null ? "bg-blue-500 text-white" : ""}`}
            >
                All
            </button>
            {SIDES.map((side) => (
                <button
                    key={side}
                    onClick={() => onModelChange(model === side ? null : side)}
                    className={`px-2 py-1 rounded text-sm border ${model === side ? "bg-blue-500 text-white" : ""}`}
                >
                    {side}
                </button>
            ))}
        </div>
    );
}
