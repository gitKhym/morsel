"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultRecipe,
  recipeFormSchema,
  type FRecipe,
} from "~/types/recipe/recipe";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import RecipeMetaForm from "~/features/newRecipe/form/RecipeMetaForm";
import IngredientGroupForm from "~/features/newRecipe/form/IngredientGroupForm";
import ProcedureGroupForm from "~/features/newRecipe/form/ProcedureGroupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type RecipeFormProps = {
  initialData?: FRecipe;
  recipeId?: number;
  submitLabel?: string;
};

export default function RecipeForm({
  initialData,
  recipeId,
  submitLabel = "Create Recipe",
}: RecipeFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<FRecipe>({
    defaultValues: initialData ?? defaultRecipe,
    resolver: zodResolver(recipeFormSchema),
  });

  const mutation = useMutation({
    mutationFn: async (recipe: FRecipe) => {
      const url = recipeId ? `/api/recipes/${recipeId}` : "/api/recipes/new";
      const method = recipeId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${recipeId ? "update" : "create"} recipe`);
      }

      return res.json() as Promise<{ recipeId?: number; success: boolean }>;
    },
    onSuccess: (data) => {
      toast.success(`Recipe ${recipeId ? "updated" : "created"} successfully`);
      const id = recipeId ?? data.recipeId;
      if (recipeId) {
        void queryClient.invalidateQueries({ queryKey: ["recipe", String(recipeId)] });
      }
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      if (id) {
        router.push(`/recipes/${id}`);
      } else {
        router.push("/recipes");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="relative">
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            mutation.mutate(data);
          },
          (errors) => {
            console.log("FORM ERRORS:", errors);
            toast.error("Please check the form for errors");
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
                !!form.formState.errors.difficulty ||
                !!form.formState.errors.imageUrl
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
            <Button disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : submitLabel}
            </Button>
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
