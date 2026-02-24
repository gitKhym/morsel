"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultRecipe,
  recipeFormSchema,
  type RecipeForm,
} from "~/types/recipe/recipe";
import { useMutation } from "@tanstack/react-query";
import { FieldGroup } from "~/components/ui/field";
import { Button } from "~/components/ui/button";
import RecipeMetaForm from "~/features/newRecipe/form/RecipeMetaForm";
import IngredientForm from "~/features/newRecipe/form/IngredientForm";
import ProcedureForm from "~/features/newRecipe/form/ProcedureForm";
export default function RecipeForm() {
  const form = useForm<RecipeForm>({
    defaultValues: defaultRecipe,
    resolver: zodResolver(recipeFormSchema),
  });

  const createRecipe = useMutation({
    mutationFn: async (recipe: RecipeForm) => {
      const res = await fetch("/api/recipes/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      });
    },
  });

  return (
    <div>
      <form
        onSubmit={form.handleSubmit((data) => createRecipe.mutate(data))}
        className="flex flex-col gap-2"
      >
        <RecipeMetaForm form={form} />
        <div className="grid grid-cols-2 gap-2">
          <IngredientForm form={form} />
          <ProcedureForm form={form} />
        </div>
        <Button>Next</Button>
      </form>
    </div>
  );
}
