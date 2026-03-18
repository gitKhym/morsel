import z from "zod";
import type { procedures } from "~/server/db/schema";
import { ingredientSchema } from "~/types/recipe/ingredient";
import { NoteType } from "~/types/recipe/step_modules/noteTypeEnum";

export type Procedure = typeof procedures.$inferSelect;

export const procedureSchema = z.object({
  instruction: z
    .string()
    .min(1, "Step cannot be empty.")
    .max(255, "Step too long."),
  hasTimer: z.boolean(),
  hasNotes: z.boolean(),
  hasIngredients: z.boolean(),
  timer: z
    .object({
      title: z
        .string()
        .min(1, "Title cannot be empty.")
        .max(30, "Title too long."),
      timeSeconds: z.coerce.number({
        invalid_type_error: "Must be a valid number.",
      }),
    })
    .optional(),
  notes: z
    .array(
      z.object({
        type: NoteType,
        content: z
          .string()
          .max(255, "Note is too long.")
          .refine((val) => val.trim().length > 0, {
            message: "Note cannot be empty.",
          }),
      }),
    )
    .optional(),
  ingredients: z.array(ingredientSchema),
});
