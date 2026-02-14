import type { stepIngredients } from "~/server/db/schema";
import z from "zod";

export type StepIngredients = typeof stepIngredients.$inferSelect;

export const stepIngredientsSchema = z.object({
  id: z.number(),
  stepId: z.number(),
  ingredientId: z.number(),
});
