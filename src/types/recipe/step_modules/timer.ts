import type { stepTimer } from "~/server/db/schema";
import z from "zod";

export type StepTimer = typeof stepTimer.$inferSelect;

export const stepTimerSchema = z.object({
  id: z.number(),
  stepId: z.number(),
  timeSeconds: z.number().int(),
  title: z.string().length(256),
});
