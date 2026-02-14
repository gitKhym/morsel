import type { Ingredient } from "~/types/recipe/ingredient";
import type { IngredientGroup as Group } from "~/types/recipe/ingredientGroup";

export type IngredientGroup = Group & {
  ingredients: Ingredient[];
};
