import type { stepNotes } from "~/server/db/schema";
import z from "zod";
import { NoteType } from "~/types/recipe/step_modules/noteTypeEnum";

export type StepNotes = typeof stepNotes.$inferSelect;

export const stepNotesSchema = z.object({
  id: z.number(),
  stepId: z.number(),
  type: NoteType,
  content: z.string().length(1024),
});
