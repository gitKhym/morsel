import type { Note, Timer } from "~/types/recipe";
import type { Ingredient } from "~/types/recipe/ingredient";
import type { ProcedureGroup as Group } from "~/types/recipe/procedureGroup";
import type { ProcedureStep } from "~/types/recipe/step";

export type Step = ProcedureStep & {
  ingredients: Ingredient[];
  notes: Note[];
  timer: Timer | null;
};

export type ProcedureGroup = Group & {
  steps: Step[];
};
