import { z } from 'zod';

export const regionSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.string(),
  tradingDesk: z.string(),
  createdAt: z.iso.datetime(), 
});

export const paginatedRegionSchema = z.object({
  first: z.number().nullable(),
  prev: z.number().nullable(),
  next: z.number().nullable(),
  last: z.number().nullable(),
  pages: z.number(),
  items: z.number(),
  data: z.array(regionSchema),
});

export type Region = z.infer<typeof regionSchema>;
export type PaginatedRegions = z.infer<typeof paginatedRegionSchema>;