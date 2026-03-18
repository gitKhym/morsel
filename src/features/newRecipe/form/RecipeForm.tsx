"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultRecipe,
  recipeFormSchema,
  type FRecipe,
} from "~/types/recipe/recipe";
import { useMutation } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import RecipeMetaForm from "~/features/newRecipe/form/RecipeMetaForm";
import IngredientGroupForm from "~/features/newRecipe/form/IngredientGroupForm";
import ProcedureGroupForm from "~/features/newRecipe/form/ProcedureGroupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
export default function RecipeForm() {
  const form = useForm<FRecipe>({
    defaultValues: defaultRecipe,
    resolver: zodResolver(recipeFormSchema),
  });

  const createRecipe = useMutation({
    mutationFn: async (recipe: FRecipe) => {
      const res = await fetch("/api/recipes/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });
    },
  });

  return (
    <div className="relative">
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            console.log("submitted");
            createRecipe.mutate(data);
          },
          (errors) => {
            console.log("FORM ERRORS:", errors);
          },
        )}
        className="flex flex-col gap-2"
      >
        <Tabs defaultValue="details" orientation="vertical">
          <TabsList variant="line" className="sticky top-4 flex flex-col gap-2">
            <TabsTrigger
              value="details"
              aria-invalid={
                !!form.formState.errors.name ||
                !!form.formState.errors.description ||
                !!form.formState.errors.mealTypes ||
                !!form.formState.errors.cookTimeMinutes ||
                !!form.formState.errors.prepTimeMinutes ||
                !!form.formState.errors.calories ||
                !!form.formState.errors.servings ||
                !!form.formState.errors.difficulty
              }
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="ingredients"
              aria-invalid={!!form.formState.errors.ingredientGroups}
            >
              Ingredients
            </TabsTrigger>
            <TabsTrigger
              value="directions"
              aria-invalid={!!form.formState.errors.procedureGroups}
            >
              Directions
            </TabsTrigger>
            <Button>Create Recipe</Button>
          </TabsList>
          <TabsContent value="details">
            <RecipeMetaForm form={form} />
          </TabsContent>
          <TabsContent value="ingredients">
            <IngredientGroupForm form={form} />
          </TabsContent>
          <TabsContent value="directions">
            <ProcedureGroupForm form={form} />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
