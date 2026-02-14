import type { procedureSteps } from "~/server/db/schema";
import z from "zod";

export type ProcedureStep = typeof procedureSteps.$inferSelect;

export const procedureStepSchema = z.object({
  id: z.number(),
  procedureId: z.number(),
  stepNumber: z.number(),
  content: z.string().length(256),
});
