import type { ingredients } from "~/server/db/schema";
import z from "zod";

export type Ingredient = typeof ingredients.$inferSelect;

export const ingredientSchema = z.object({
  id: z.number(),
  groupId: z.number(),
  name: z.string().length(256),
  measurment: z.string().length(256),
  note: z.string().length(256),
  value: z.number(),
});
