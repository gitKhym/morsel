"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import RecipeForm from "~/features/newRecipe/form/RecipeForm";
import type { Recipe, FRecipe } from "~/types/recipe/recipe";
import { PageHeader } from "~/components/navigation/PageHeader";

export default function EditRecipePage() {
  const params = useParams();
  const recipeId = params.recipeId as string;

  const {
    isLoading,
    error,
    data: recipe,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: async (): Promise<Recipe> => {
      const res = await fetch(`/api/recipes/${recipeId}`);
      if (!res.ok) throw new Error("Failed to fetch recipe");

      const data = (await res.json()) as { recipe: Recipe };
      return data.recipe;
    },
  });

  if (isLoading) return <div className="p-4">Loading recipe...</div>;
  if (error || !recipe) return <div className="p-4">Failed to load recipe</div>;

  // Map Recipe to FRecipe (form format)
  const initialData: FRecipe = {
    name: recipe.name,
    description: recipe.description ?? "",
    imageUrl: recipe.imageUrl,
    difficulty: recipe.difficulty,
    cookTimeMinutes: recipe.cookTimeMinutes,
    prepTimeMinutes: recipe.prepTimeMinutes,
    calories: recipe.calories,
    servings: recipe.servings,
    mealTypes: recipe.mealTypes,
    ingredientGroups: recipe.ingredientGroups.map((group) => ({
      name: group.name,
      ingredients: group.ingredients.map((ing) => ({
        id: crypto.randomUUID(),
        name: ing.name,
        amount: ing.amount,
        unitType: ing.unitType,
        hasNote: !!ing.note,
        note: ing.note ?? "",
      })),
    })) as any,
    procedureGroups: recipe.procedureGroups.map((group) => ({
      name: group.name,
      procedures: group.instructions.map((inst) => ({
        instruction: inst.instruction,
        hasTimer: !!inst.timer,
        timer: inst.timer ? {
          timeSeconds: inst.timer.timeSeconds,
          title: inst.timer.title ?? "",
        } : undefined,
        hasNotes: inst.notes.length > 0,
        notes: inst.notes.map(n => ({
          type: n.type,
          content: n.content
        })),
        hasIngredients: inst.ingredients.length > 0,
        ingredients: inst.ingredients.map(ingName => ({
          id: crypto.randomUUID(),
          name: ingName,
          amount: 0,
          unitType: "unit" as any,
          hasNote: false,
          note: ""
        }))
      })),
    })) as any,
  };

  return (
    <div className="bg-accent/40 flex flex-col gap-4 rounded-sm p-4 md:mx-0 xl:mx-52 min-h-screen">
      <PageHeader
        backLabel="Back to recipe"
        backHref={`/recipes/${recipeId}`}
        breadcrumbs={[
          { label: "Recipes", href: "/recipes" },
          { label: recipe.name, href: `/recipes/${recipeId}` },
          { label: "Edit", isCurrent: true },
        ]}
      />
      <RecipeForm 
        initialData={initialData} 
        recipeId={Number(recipeId)} 
        submitLabel="Update Recipe" 
      />
    </div>
  );
}
