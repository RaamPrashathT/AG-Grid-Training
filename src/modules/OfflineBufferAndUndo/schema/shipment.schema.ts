import { z } from 'zod';

export const shipmentSchema = z.object({
  id: z.string(),
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
  weight: z.number().positive("Weight must be greater than 0"),
  destination: z.string().min(1, "Destination is required"),
  createdAt: z.iso.datetime().optional(), 
  updatedAt: z.iso.datetime().optional()
});

export type Shipment = z.infer<typeof shipmentSchema>;