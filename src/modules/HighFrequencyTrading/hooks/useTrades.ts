// hooks/useTrades.ts
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { tradeSchema, type Trade } from '../schema/trade.schema';

/**
 * Fetches trades for a specific region ID.
 * json-server v1 filters via query params: ?parentId=xyz
 */
const fetchTradesByRegion = async (parentId: string): Promise<Trade[]> => {
  const response = await fetch(`http://localhost:4000/trades?parentId=${parentId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch trades for region ${parentId}`);
  }
  
  const rawData = await response.json();
  
  // Validate the incoming array against our schema
  const parsedTrades = z.array(tradeSchema).parse(rawData);
  
  // Challenge 1 explicitly requires exactly 5 child rows
  return parsedTrades.slice(0, 5);
};

export function useLazyFetchTrades() {
  return useMutation({
    mutationFn: fetchTradesByRegion,
  });
}