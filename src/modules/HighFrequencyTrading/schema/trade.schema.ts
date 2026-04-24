import { z } from "zod";
import { type Region } from "./region.schema";

export const tradeSchema = z.object({
    id: z.string(),
    parentId: z.string(),
    symbol: z.string(),
    side: z.enum(["BUY", "SELL"]),
    quantity: z.number(),
    price: z.number(),
    notional: z.number(),
    status: z.string(),
    traderName: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});

export type Trade = z.infer<typeof tradeSchema>;

export type TradeRow = Trade & {
    prevPrice?: number;
    priceChange?: number;
};

export type GridRowData = Region | TradeRow;

export const isTradeRow = (row: GridRowData): row is TradeRow =>
    "symbol" in row;
export const isRegionRow = (row: GridRowData): row is Region => "name" in row;
