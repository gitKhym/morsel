import type { recipes } from "~/server/db/schema";
import z from "zod";
import { MEAL_DIFFICULTY } from "~/types/recipe/mealDifficultyEnum";
import { MEAL_TYPES } from "~/types/recipe/mealTypeEnum";
import { ingredientSchema } from "~/types/recipe/ingredient";
import { MEASUREMENT_UNIT } from "~/types/recipe/units";
import { procedureSchema } from "~/types/recipe/step";
import {
  NoteType,
  STEP_NOTE_TYPE,
} from "~/types/recipe/step_modules/noteTypeEnum";

export type Recipe = typeof recipes.$inferSelect;

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

  ingredients: z.array(ingredientSchema),
  procedures: z.array(procedureSchema),
});

export type RecipeForm = z.output<typeof recipeFormSchema>;

export const defaultIngredient = {
  id: crypto.randomUUID(),
  name: "",
  value: 0,
  unit: NoteType, // TODO: Turn to zod enum
  hasNote: false,
};

export const defaultProcedure = {
  content: "",
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

export const defaultRecipe: RecipeForm = {
  name: "",
  description: "",
  // imageUrl: "",
  difficulty: "easy",
  cookTimeMinutes: 0,
  prepTimeMinutes: 0,
  calories: 0,
  servings: 0,
  mealTypes: [],
  // tags: [],

  ingredients: [],
  procedures: [],
};
