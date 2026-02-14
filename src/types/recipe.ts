import type {
  collections,
  ingredientGroups,
  ingredients,
  procedureGroups,
  procedureSteps,
  recipes,
  stepNotes,
  stepTimer,
  stepTimers,
} from "~/server/db/schema";

export type Step = typeof procedureSteps.$inferSelect & {
  ingredients: {
    ingredient: Ingredient;
  }[];
  notes: Note[];
  timer: Timer;
};
export type Note = typeof stepNotes.$inferSelect;
export type Timer = typeof stepTimer.$inferSelect;
export type ProcedureGroup = typeof procedureGroups.$inferSelect & {
  steps: Step[] & {
    ingredients: Ingredient[];
  };
  notes: Note[];
  timer: Timer;
};
