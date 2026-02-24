import type { ingredients } from "~/server/db/schema";
import z from "zod";
import { MEASUREMENT_UNIT } from "~/types/recipe/units";

export type Ingredient = typeof ingredients.$inferSelect;

export const ingredientSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, "Ingredient cannot be empty.")
    .max(50, "No ingredient can be that long."),
  value: z.coerce.number(),
  unit: z.nativeEnum(MEASUREMENT_UNIT),
  note: z.string().max(255, "Note is too long.").optional(),
  hasNote: z.boolean(),
});

export const createDefaultIngredient = () => ({
  id: crypto.randomUUID(),
  name: "",
  note: "",
  value: 0,
  unit: MEASUREMENT_UNIT.G,
  hasNote: false,
});
