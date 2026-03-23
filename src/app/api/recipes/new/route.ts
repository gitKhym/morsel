import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import {
  ingredientGroups,
  ingredients,
  instructionIngredients,
  instructionNotes,
  instructionTimer,
  procedureGroups,
  procedures,
  recipes,
} from "~/server/db/schema";
<<<<<<< HEAD
=======
import type { Ingredient } from "~/types/recipe/ingredient";
>>>>>>> c161058857004b1ad16535c85f615c8eb595e879
import { recipeFormSchema, type FRecipe } from "~/types/recipe/recipe";

export async function POST(req: NextRequest) {
  try {
<<<<<<< HEAD
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

=======
>>>>>>> c161058857004b1ad16535c85f615c8eb595e879
    const unsafeData = (await req.json()) as FRecipe;
    console.log("Incoming body:", unsafeData);

    const result = recipeFormSchema.safeParse(unsafeData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.format() },
        { status: 400 },
      );
    }
    const incoming = result.data;

    let newRecipeId: number | undefined;

    await db.transaction(async (tx) => {
      const insertedRecipe = await tx
        .insert(recipes)
        .values({
          // From form
          name: incoming.name,
          description: incoming.description,
          mealTypes: incoming.mealTypes,
          prepTimeMinutes: incoming.prepTimeMinutes,
          cookTimeMinutes: incoming.cookTimeMinutes,
          calories: incoming.calories,
          servings: incoming.servings,
          difficulty: incoming.difficulty,
          imageUrl: incoming.imageUrl,
<<<<<<< HEAD
          userId: userId,
=======
>>>>>>> c161058857004b1ad16535c85f615c8eb595e879
        })
        .returning({ id: recipes.id });

      newRecipeId = insertedRecipe[0]!.id;

      // Ingredient Groups
      const ingredientGroupInserts = incoming.ingredientGroups.map((group) => ({
        name: group.name,
        recipeId: insertedRecipe[0]!.id,
      }));

      const insertedIngredientGroups = await tx
        .insert(ingredientGroups)
        .values(ingredientGroupInserts)
        .returning({ id: ingredientGroups.id });

      const ingredientsToInsert: (typeof ingredients.$inferInsert)[] = [];
      incoming.ingredientGroups.forEach((group, index) => {
        const groupId = insertedIngredientGroups[index]!.id;

        group.ingredients.forEach((ingredient) => {
          ingredientsToInsert.push({
            groupId,
            name: ingredient.name,
            unitType: ingredient.unitType,
            amount: ingredient.amount,
            note: ingredient.note ?? null,
          });
        });
      });

      // Procedure Groups
      const procedureGroupInserts = incoming.procedureGroups.map((group) => ({
        name: group.name,
        recipeId: insertedRecipe[0]!.id,
      }));

      const insertedProcedureGroups = await tx
        .insert(procedureGroups)
        .values(procedureGroupInserts)
        .returning({ id: procedureGroups.id });

      const proceduresToInsert: (typeof procedures.$inferInsert)[] = [];

      incoming.procedureGroups.forEach((group, index) => {
        const groupId = insertedProcedureGroups[index]!.id;

        group.procedures.forEach((procedure) => {
          proceduresToInsert.push({
            groupId,
            instruction: procedure.instruction,
            instructionNumber: 1,
          });
        });
      });

      const insertedProcedures = await tx
        .insert(procedures)
        .values(proceduresToInsert)
        .returning({ id: procedures.id });

      const timersToInsert: (typeof instructionTimer.$inferInsert)[] = [];
      const notesToInsert: (typeof instructionNotes.$inferInsert)[] = [];
      const instructionIngredientsToInsert: (typeof instructionIngredients.$inferInsert)[] =
        [];

      let procedurePointer = 0;

      incoming.procedureGroups.forEach((group) => {
        group.procedures.forEach((procedure) => {
          // Get the ID of the procedure we just inserted
          const procedureId = insertedProcedures[procedurePointer]!.id;

          // Map Timers
          if (procedure.hasTimer && procedure.timer) {
            timersToInsert.push({
              instructionId: procedureId,
              timeSeconds: procedure.timer.timeSeconds,
              title: procedure.timer.title,
            });
          }

          // Map Notes
          if (procedure.hasNotes && procedure.notes) {
            procedure.notes.forEach((note) => {
              notesToInsert.push({
                instructionId: procedureId,
                content: note.content,
                type: note.type,
              });
            });
          }

          // Map Ingredients
          if (procedure.hasIngredients && procedure.ingredients) {
            procedure.ingredients.forEach((ingredient) => {
              instructionIngredientsToInsert.push({
                instructionId: procedureId,
                ingredient: ingredient.name,
              });
            });
          }

          procedurePointer++;
        });
      });

      if (timersToInsert.length > 0) {
        await tx.insert(instructionTimer).values(timersToInsert);
      }
      if (notesToInsert.length > 0) {
        await tx.insert(instructionNotes).values(notesToInsert);
      }
      if (instructionIngredientsToInsert.length > 0) {
        await tx
          .insert(instructionIngredients)
          .values(instructionIngredientsToInsert);
      }

      await tx.insert(ingredients).values(ingredientsToInsert);
    });
    return NextResponse.json({
      parsed: result,
      success: true,
      recipeId: newRecipeId,
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
