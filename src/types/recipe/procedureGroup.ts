import type { procedureGroups } from "~/server/db/schema";
import z from "zod";

export type ProcedureGroup = typeof procedureGroups.$inferSelect;

export const procedureGroupSchema = z.object({
  id: z.number(),
  recipeId: z.number(),
  name: z.string().length(256),
});
