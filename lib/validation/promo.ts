import { z } from "zod";

export const claimPromoSchema = z.object({
  userId: z.string().min(1).max(200),
  score: z.number().int().min(0).max(10),
});

export type ClaimPromoInput = z.infer<typeof claimPromoSchema>;
