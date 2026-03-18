import { unitTypeEnum, type ingredients } from "~/server/db/schema";
import z from "zod";

export type Ingredient = typeof ingredients.$inferSelect;

export const ingredientSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, "Ingredient cannot be empty.")
    .max(50, "No ingredient can be that long."),
  amount: z.coerce.number(),
  unitType: z.enum(unitTypeEnum.enumValues),
  note: z.string().max(255, "Note is too long.").optional(),
  hasNote: z.boolean(),
});

export const createDefaultIngredient = () => ({
  id: crypto.randomUUID(),
  name: "",
  note: "",
  amount: 0,
  unitType: unitTypeEnum.enumValues[0],
  hasNote: false,
});
