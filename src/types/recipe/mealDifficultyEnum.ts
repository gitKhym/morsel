import z from "zod";
import { difficultyEnum } from "~/server/db/schema";

export const MEAL_DIFFICULTY = difficultyEnum.enumValues;

export const MealDifficulty = z.enum(difficultyEnum.enumValues);
