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
import { eq } from "drizzle-orm";
import { recipeFormSchema, type FRecipe } from "~/types/recipe/recipe";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ recipeId: string }> },
) {
  try {
    const params = await context.params;
    const recipeId = Number(params.recipeId);

    const rawRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, recipeId),
      with: {
        ingredientGroups: {
          with: {
            ingredients: true,
          },
        },
        procedureGroups: {
          with: {
            instructions: {
              with: {
                notes: true,
                timer: true,
                ingredients: true,
              },
            },
          },
        },
      },
    });

    if (!rawRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const recipe = {
      ...rawRecipe,
      procedureGroups: rawRecipe.procedureGroups.map((pg) => ({
        ...pg,
        instructions: pg.instructions.map((instruction) => ({
          ...instruction,
          ingredients: instruction.ingredients
            ? instruction.ingredients.map((i) => i.ingredient)
            : [],
        })),
      })),
    };
    return NextResponse.json({ recipe });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ recipeId: string }> },
) {
  try {
    const params = await context.params;
    const recipeId = Number(params.recipeId);

    await db.delete(recipes).where(eq(recipes.id, recipeId));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ recipeId: string }> },
) {
  try {
    const params = await context.params;
    const recipeId = Number(params.recipeId);

    const unsafeData = (await req.json()) as FRecipe;
    const result = recipeFormSchema.safeParse(unsafeData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.format() },
        { status: 400 },
      );
    }
    const incoming = result.data;

    await db.transaction(async (tx) => {
      // Update basic recipe info
      await tx
        .update(recipes)
        .set({
          name: incoming.name,
          description: incoming.description,
          mealTypes: incoming.mealTypes,
          prepTimeMinutes: incoming.prepTimeMinutes,
          cookTimeMinutes: incoming.cookTimeMinutes,
          calories: incoming.calories,
          servings: incoming.servings,
          difficulty: incoming.difficulty,
          imageUrl: incoming.imageUrl,
          updatedAt: new Date(),
        })
        .where(eq(recipes.id, recipeId));

      // Delete existing related data to simplify update
      await tx
        .delete(ingredientGroups)
        .where(eq(ingredientGroups.recipeId, recipeId));
      await tx
        .delete(procedureGroups)
        .where(eq(procedureGroups.recipeId, recipeId));

      // Re-insert Ingredient Groups
      const insertedIngredientGroups = await tx
        .insert(ingredientGroups)
        .values(
          incoming.ingredientGroups.map((group) => ({
            name: group.name,
            recipeId: recipeId,
          })),
        )
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

      if (ingredientsToInsert.length > 0) {
        await tx.insert(ingredients).values(ingredientsToInsert);
      }

      // Re-insert Procedure Groups
      const insertedProcedureGroups = await tx
        .insert(procedureGroups)
        .values(
          incoming.procedureGroups.map((group) => ({
            name: group.name,
            recipeId: recipeId,
          })),
        )
        .returning({ id: procedureGroups.id });

      const proceduresToInsert: (typeof procedures.$inferInsert)[] = [];
      const procedureMetadata: {
        procedureIndex: number;
        sourceProcedure: (typeof incoming.procedureGroups)[number]["procedures"][number];
      }[] = [];

      let globalProcedureIndex = 0;
      incoming.procedureGroups.forEach((group, groupIdx) => {
        const groupId = insertedProcedureGroups[groupIdx]!.id;
        group.procedures.forEach((procedure) => {
          proceduresToInsert.push({
            groupId,
            instruction: procedure.instruction,
            instructionNumber: 1, // Will be updated to match InstructionList numbering if needed
          });
          procedureMetadata.push({
            procedureIndex: globalProcedureIndex,
            sourceProcedure: procedure,
          });
          globalProcedureIndex++;
        });
      });

      if (proceduresToInsert.length > 0) {
        const insertedProcedures = await tx
          .insert(procedures)
          .values(proceduresToInsert)
          .returning({ id: procedures.id });

        const timersToInsert: (typeof instructionTimer.$inferInsert)[] = [];
        const notesToInsert: (typeof instructionNotes.$inferInsert)[] = [];
        const instructionIngredientsToInsert: (typeof instructionIngredients.$inferInsert)[] =
          [];

        insertedProcedures.forEach((proc, idx) => {
          const procedureId = proc.id;
          const source = procedureMetadata[idx]!.sourceProcedure;

          if (source.hasTimer && source.timer) {
            timersToInsert.push({
              instructionId: procedureId,
              timeSeconds: source.timer.timeSeconds,
              title: source.timer.title,
            });
          }

          if (source.hasNotes && source.notes) {
            source.notes.forEach((note) => {
              notesToInsert.push({
                instructionId: procedureId,
                content: note.content,
                type: note.type,
              });
            });
          }

          if (source.hasIngredients && source.ingredients) {
            source.ingredients.forEach((ing) => {
              instructionIngredientsToInsert.push({
                instructionId: procedureId,
                ingredient: ing.name,
              });
            });
          }
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
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
