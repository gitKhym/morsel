import type { recipes } from "~/server/db/schema";
import z from "zod";
import { MealType } from "~/types/recipe/mealTypeEnum";
import { MealDifficulty } from "~/types/recipe/mealDifficultyEnum";

export type Recipe = typeof recipes.$inferSelect;

export const recipeSchema = z.object({
  id: z.number(),
  name: z.string().length(256),
  description: z.string().length(256).optional(),
  imageUrl: z.string().url(),
  color: z.string().length(35).default("E5E5E5"),
  favourited: z.boolean().default(false),
  prepTimeMinutes: z.number().min(1).max(10080, "Prepping takes too long!"), // Max: 7 Days
  cookTimeMinutes: z.number().min(1).max(10080, "Cooking takes too long!"),
  servings: z.number().min(1).max(100, "Serving size is too large."),
  calories: z.number().min(1).max(100000, "Too much calories."),
  mealTypes: z.array(MealType),
  tags: z.array(z.string().min(1).length(30)),
  difficulty: MealDifficulty,
  collectionIds: z.array(z.number()), // TODO: Still hesitant to just use collectionId array
});
