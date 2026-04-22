// schema/trade.schema.ts
import { z } from 'zod';
import { regionSchema } from './region.schema';

export const tradeSchema = z.object({
  id: z.string(),
  parentId: z.string(),
  symbol: z.string(),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number(),
  price: z.number(),
  notional: z.number(),
  status: z.string(),
  traderName: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  prevPrice: z.number(),
  priceChange: z.number(),
});

export type Trade = z.infer<typeof tradeSchema>;

// This is the type we will use for our AG Grid row data moving forward.
// A row is either a Region (Parent) or a Trade (Child).
export type GridRowData = z.infer<typeof regionSchema> | Trade;

// Type Guard helper function to easily check if a row is a Trade
export const isTradeRow = (row: GridRowData): row is Trade => {
  return 'parentId' in row && 'symbol' in row;
};