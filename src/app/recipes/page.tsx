"use client";
import { useQuery } from "@tanstack/react-query";
import RecipeList from "~/features/recipes/components/RecipeList";
import RecipeListSkeleton from "~/features/recipes/components/RecipeList_Skeleton";
import type { Collection, Recipe } from "~/types/recipe";

export default function RecipesPage() {
  const {
    isLoading,
    error,
    data: recipes,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: async (): Promise<Recipe[]> => {
      const res = await fetch("/api/recipes");
      const data = (await res.json()) as { recipes: Recipe[] };
      return data.recipes;
    },
  });

  const { data: collections = [], isLoading: collectionsLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async (): Promise<Collection[]> => {
      const res = await fetch("/api/collections");
      const data = (await res.json()) as { collections: Collection[] };
      return data.collections;
    },
  });

  if (error) {
    return <div>Error</div>;
  }
  if (isLoading) {
    return <RecipeListSkeleton />;
  }
  if (!recipes || recipes.length === 0) {
    return <div>No recipes found</div>;
  }

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4">
      <h1 className="mb-6 text-xl font-bold">My Recipes</h1>
      <h3>Favourites</h3>
      <RecipeList recipes={recipes} collections={collections} />
      <h3>Recipes</h3>
      <RecipeList recipes={recipes} collections={collections} />
    </div>
  );
}
