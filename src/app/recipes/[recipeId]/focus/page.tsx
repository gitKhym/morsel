"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import type { Recipe } from "~/types/recipe/recipe";
import { useEffect } from "react";
import FocusMode from "~/features/recipe/components/cooking_mode/FocusMode";
import { PageHeader } from "~/components/navigation/PageHeader";

export default function FocusPage() {
  const params = useParams();
  const router = useRouter();
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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleBack = () => {
    router.push(`/recipes/${recipeId}`);
  };

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
    <div className="bg-accent/40 flex min-h-screen flex-col gap-4 rounded-sm p-4 md:mx-0 xl:mx-52">
      <PageHeader
        backLabel="Back to recipe"
        onBackClick={handleBack}
        breadcrumbs={[
          { label: "Recipes", href: "/recipes" },
          { label: recipe.name, href: `/recipes/${recipeId}` },
          { label: "Focus Mode", isCurrent: true },
        ]}
      />

      <FocusMode recipe={recipe} />
    </div>
  );
}
