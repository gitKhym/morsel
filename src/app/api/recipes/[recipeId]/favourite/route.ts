import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { recipes } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ recipeId: string }> },
) {
  try {
    const params = await context.params;
    const recipeId = Number(params.recipeId);

    if (isNaN(recipeId)) {
      return NextResponse.json(
        { error: "Invalid recipe ID" },
        { status: 400 },
      );
    }

    const currentRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, recipeId),
      columns: {
        favourited: true,
      },
    });

    if (!currentRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const [updatedRecipe] = await db
      .update(recipes)
      .set({ favourited: !currentRecipe.favourited })
      .where(eq(recipes.id, recipeId))
      .returning({ favourited: recipes.favourited });

    return NextResponse.json({ favourited: updatedRecipe?.favourited });
  } catch (err) {
    console.error("Error toggling favourite:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
