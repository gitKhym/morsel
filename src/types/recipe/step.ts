import type { procedureSteps } from "~/server/db/schema";
import z from "zod";
import { ingredientSchema } from "~/types/recipe/ingredient";
import { NoteType } from "~/types/recipe/step_modules/noteTypeEnum";

export type ProcedureStep = typeof procedureSteps.$inferSelect;

export const procedureSchema = z.object({
  content: z
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
  notes: z.array(
    z
      .object({
        type: NoteType,
        content: z
          .string()
          .min(1, "Note cannot be empty.")
          .max(255, "Note is too long."),
      })
      .optional(),
  ),
  ingredients: z.array(ingredientSchema),
});
