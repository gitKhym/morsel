import type { collections } from "~/server/db/schema";

import z from "zod";

export type Collection = typeof collections.$inferSelect;

export const collectionSchema = z.object({
  id: z.number(),
  name: z.string().length(256),
});
