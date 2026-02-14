import { pgEnum } from "drizzle-orm/pg-core";
import z from "zod";

export const mealTypeEnum = pgEnum("meal_type", [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
]);

export const MealType = z.enum(mealTypeEnum.enumValues);
