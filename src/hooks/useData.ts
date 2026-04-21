import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const BASE_URL = "http://localhost:4000";

/* =========================
   ZOD SCHEMAS
========================= */

const RegionSchema = z.object({
    id: z.string(),
    name: z.string(),
    currency: z.string(),
    tradingDesk: z.string(),
    createdAt: z.string(),
});

const TradeSchema = z.object({
    id: z.string(),
    parentId: z.string(),

    symbol: z.string(),
    side: z.enum(["BUY", "SELL"]),

    quantity: z.number(),
    price: z.number(),
    notional: z.number(),

    status: z.enum(["OPEN", "CLOSED"]),
    traderName: z.string(),

    createdAt: z.string(),
    updatedAt: z.string(),

    prevPrice: z.number(),
    priceChange: z.number(),
});

/* =========================
   TYPES (inferred)
========================= */

type Trade = z.infer<typeof TradeSchema>;

type CreateTradeInput = Omit<Trade, "id">;
type UpdateTradeInput = Partial<Trade> & { id: string };

type TradeParams = {
    parentId?: string;
    page?: number;
    limit?: number;
    search?: string;
};

/* =========================
   HELPERS
========================= */

async function fetchJSON<T>(url: string, schema: z.ZodType<T>): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${url}`);

    const data = await res.json();
    return schema.parse(data);
}

/* =========================
   HOOK
========================= */

export function useData() {
    const queryClient = useQueryClient();

    // 🔹 Regions
    const regionsQuery = useQuery({
        queryKey: ["regions"],
        queryFn: () => fetchJSON(`${BASE_URL}/regions`, z.array(RegionSchema)),
    });

    // 🔹 Trades (dynamic)
    const useTrades = (params?: TradeParams) => {
        const { parentId, page = 1, limit = 5, search } = params || {};

        const query = new URLSearchParams();

        if (parentId) query.append("parentId", parentId);

        // JSON Server v1 pagination
        query.append("_page", String(page));
        query.append("_per_page", String(limit));

        if (search) query.append("symbol_like", search);

        return useQuery({
            queryKey: ["trades", params],
            queryFn: () =>
                fetchJSON(
                    `${BASE_URL}/trades?${query.toString()}`,
                    z.array(TradeSchema),
                ),
            enabled: !!parentId,
        });
    };

    // 🔹 Create
    const createTrade = useMutation({
        mutationFn: async (newTrade: CreateTradeInput) => {
            const res = await fetch(`${BASE_URL}/trades`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTrade),
            });
            const data = await res.json();
            return TradeSchema.parse(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trades"] });
        },
    });

    // 🔹 Update
    const updateTrade = useMutation({
        mutationFn: async (updated: UpdateTradeInput) => {
            const res = await fetch(`${BASE_URL}/trades/${updated.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });
            const data = await res.json();
            return TradeSchema.parse(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trades"] });
        },
    });

    // 🔹 Delete
    const deleteTrade = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${BASE_URL}/trades/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Delete failed");
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trades"] });
        },
    });

    return {
        regionsQuery,
        useTrades,

        createTrade,
        updateTrade,
        deleteTrade,
    };
}
