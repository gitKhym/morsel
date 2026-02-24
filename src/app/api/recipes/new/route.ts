import { type NextRequest, NextResponse } from "next/server";
import { recipeFormSchema, type RecipeForm } from "~/types/recipe/recipe";

export async function POST(req: NextRequest) {
  try {
    const unsafeData = (await req.json()) as RecipeForm;
    console.log("Incoming body:", unsafeData);

    const result = recipeFormSchema.safeParse(unsafeData);

    console.log(result.error?.format());
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.format() },
        { status: 400 },
      );
    }
    const validatedRecipe = result.data;
    console.log(validatedRecipe);

    // db call here

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
