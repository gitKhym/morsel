import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { recipes } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
            steps: {
              with: {
                notes: true,
                timer: true,
                ingredients: {
                  with: {
                    ingredient: true,
                  },
                },
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
        steps: pg.steps.map((step) => ({
          ...step,
          ingredients: step.ingredients.map((i) => i.ingredient),
        })),
      })),
    };

    return NextResponse.json({ recipe });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
