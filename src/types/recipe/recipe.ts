import {
  ingredientGroups,
  ingredients,
  instructionIngredients,
  instructionNotes,
  instructionTimer,
  procedureGroups,
  procedures,
  unitTypeEnum,
  type recipes,
} from "~/server/db/schema";
import z from "zod";
import { MEAL_DIFFICULTY } from "~/types/recipe/mealDifficultyEnum";
import { MEAL_TYPES } from "~/types/recipe/mealTypeEnum";
import { ingredientSchema } from "~/types/recipe/ingredient";
import { noteTypeEnum } from "~/types/recipe/step_modules/noteTypeEnum";
import { procedureSchema } from "~/types/recipe/step";

export const NoteType = z.enum(noteTypeEnum.enumValues);
export const UnitType = z.enum(unitTypeEnum.enumValues);

export type FRecipe = z.infer<typeof recipeFormSchema>;
export type FIngredientGroup = z.infer<typeof ingredientGroupSchema>;
export type FProcedureGroup = z.infer<typeof procedureGroupSchema>;
export type FProcedure = z.infer<typeof procedureSchema>;
export type FIngredient = z.infer<typeof ingredientSchema>;

export type PGRecipe = typeof recipes.$inferSelect;
export type PGIngredientGroup = typeof ingredientGroups.$inferSelect;
export type PGProcedureGroup = typeof procedureGroups.$inferSelect;
export type PGProcedure = typeof procedures.$inferSelect;
export type PGIngredient = typeof ingredients.$inferSelect;
export type PGNote = typeof instructionNotes.$inferSelect;
export type PGTimer = typeof instructionTimer.$inferSelect;
export type PGInstructionIngredient =
  typeof instructionIngredients.$inferSelect;

export type Recipe = PGRecipe & {
  ingredientGroups: (PGIngredientGroup & {
    ingredients: PGIngredient[];
  })[];

  procedureGroups: (PGProcedureGroup & {
    instructions: (PGProcedure & {
      ingredients: PGIngredient[];
      notes: PGNote[];
      timer: PGTimer;
    })[];
  })[];
};
export const ingredientGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty.")
    .max(255, "Name is too long."),
  ingredients: z
    .array(ingredientSchema)
    .nonempty("At least one ingredient is required."),
});

export const procedureGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty.")
    .max(255, "Name is too long."),
  procedures: z
    .array(procedureSchema)
    .nonempty("At least one instruction is required."),
});

export const recipeFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty.")
    .max(255, "Name is too long."),
  description: z
    .string()
    .max(255, "Description is too long.")
    .transform((v) => v || undefined)
    .optional(),
  // imageUrl: z.string().url("Image is not a valid url."),
  prepTimeMinutes: z.coerce
    .number({
      invalid_type_error: "Must be a valid number",
    })
    .min(1, "Please provide prep time in minutes.")
    .max(10080, "Prepping takes too long!"), // Max: 7 Days
  cookTimeMinutes: z.coerce
    .number({
      invalid_type_error: "Must be a valid number",
    })
    .min(1, "Please provide cook time in minutes.")
    .max(10080, "Cooking takes too long!"),
  servings: z.coerce
    .number({
      invalid_type_error: "Must be a valid number.",
    })
    .min(1, "Please provide how many this recipe serves.")
    .max(100, "Serving size is too large."),
  calories: z.coerce
    .number({
      invalid_type_error: "Must be a valid number",
    })
    .min(1, "Calorie cannot be empty.")
    .max(100000, "Too much calories."),
  mealTypes: z.array(z.enum(MEAL_TYPES)),
  // tags: z.array(
  //   z.string().min(1, "Tag cannot be empty.").length(30, "Tag is too long."),
  // ),
  difficulty: z.enum(MEAL_DIFFICULTY),

  ingredientGroups: z.array(ingredientGroupSchema).nonempty(),
  procedureGroups: z.array(procedureGroupSchema).nonempty(),
});

export const defaultIngredient: FIngredient = {
  id: crypto.randomUUID(),
  name: "",
  amount: 0,
  unitType: UnitType.enum.g,
  hasNote: false,
};

export const defaultProcedure: FProcedure = {
  instruction: "",
  hasTimer: false,
  hasNotes: false,
  hasIngredients: false,
  notes: [],
  ingredients: [],
};

export const defaultNote = {
  type: NoteType.enum.note,
  content: "",
};

export const defaultRecipe: FRecipe = {
  name: "",
  description: "",
  // imageUrl: "",
  difficulty: "Easy",
  cookTimeMinutes: 0,
  prepTimeMinutes: 0,
  calories: 0,
  servings: 0,
  mealTypes: [],
  // tags: [],

  ingredientGroups: [{ name: "", ingredients: [defaultIngredient] }],
  procedureGroups: [{ name: "", procedures: [defaultProcedure] }],
};
