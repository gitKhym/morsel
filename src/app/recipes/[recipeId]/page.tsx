"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import IngredientList from "~/features/recipe/components/ingredient_list/IngredientList";
import ProcedureArea from "~/features/recipe/components/procedure_list/ProcedureArea";
import RecipeSummaryHeader from "~/features/recipe/components/RecipeSummaryHeader";
import type { Collection } from "~/types/recipe/collection";
import type { Recipe } from "~/types/recipe/recipe";
import { PageHeader } from "~/components/navigation/PageHeader";

export default function Page() {
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

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: async (): Promise<Collection[]> => {
      const res = await fetch("/api/collections");
      const data = (await res.json()) as { collections: Collection[] };
      return data.collections;
    },
  });

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!recipeId || !recipe) {
    return <div>Invalid recipe</div>;
  }

  return (
    <div className="bg-accent/40 flex flex-col gap-4 rounded-sm p-4 md:mx-0 xl:mx-52 min-h-screen">
      <PageHeader 
        backLabel="Back to recipes"
        backHref="/recipes"
        breadcrumbs={[
          { label: "Recipes", href: "/recipes" },
          { label: recipe.name, isCurrent: true }
        ]}
      />

      <RecipeSummaryHeader recipe={recipe} collections={collections} />
      <div className="grid grid-cols-[7fr_11fr] gap-4">
        <IngredientList ingredientGroups={recipe.ingredientGroups} />
        <ProcedureArea
          procedureGroups={recipe.procedureGroups}
          onStartCooking={() => window.location.href = `/recipes/${recipeId}/focus`}
        />
      </div>
    </div>
  );
}
