import { pgEnum } from "drizzle-orm/pg-core";
import z from "zod";

export const mealDifficultyEnum = pgEnum("difficulty", [
  "easy",
  "medium",
  "hard",
]);

export const MealDifficulty = z.enum(mealDifficultyEnum.enumValues);
