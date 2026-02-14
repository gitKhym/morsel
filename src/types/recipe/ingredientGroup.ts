import type { ingredientGroups } from "~/server/db/schema";
import z from "zod";

export type IngredientGroup = typeof ingredientGroups.$inferSelect;

export const ingredientGroupSchema = z.object({
  id: z.number(),
  recipeId: z.number(),
  name: z.string().length(256),
  order: z.number(),
});
