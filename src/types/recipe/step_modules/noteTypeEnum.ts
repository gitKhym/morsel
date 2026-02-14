import { pgEnum } from "drizzle-orm/pg-core";
import z from "zod";

export const noteTypeEnum = pgEnum("step_note_type", [
  "tip",
  "warning",
  "note",
]);

export const NoteType = z.enum(noteTypeEnum.enumValues);
