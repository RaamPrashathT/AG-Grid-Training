import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { tradeSchema, type Trade } from "../schema/trade.schema";

const fetchTradesByRegion = async (parentId: string): Promise<Trade[]> => {
    const response = await fetch(
        `http://localhost:4000/trades?parentId=${parentId}`,
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch trades for region ${parentId}`);
    }

    const rawData = await response.json();
    const parsedTrades = z.array(tradeSchema).parse(rawData);
    return parsedTrades.slice(0, 5);
};

export function useLazyFetchTrades() {
    return useMutation({
        mutationFn: fetchTradesByRegion,
    });
}
