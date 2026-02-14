import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { recipes } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { recipeId, collectionId } = (await req.json()) as {
      recipeId: number;
      collectionId: number;
    };

    if (!recipeId || !collectionId) {
      return NextResponse.json(
        { error: "Missing recipeId or collectionId" },
        { status: 400 },
      );
    }

    // Get the existing recipe
    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, recipeId),
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Remove the collectionId if it exists
    const updatedCollectionIds = (recipe.collectionIds || []).filter(
      (id) => id !== collectionId,
    );

    // Update the recipe
    await db
      .update(recipes)
      .set({ collectionIds: updatedCollectionIds })
      .where(eq(recipes.id, recipeId));

    return NextResponse.json({
      success: true,
      collectionIds: updatedCollectionIds,
    });
  } catch (err) {
    console.error("Failed to remove recipe from collection:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
