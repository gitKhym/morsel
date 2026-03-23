import { useState, useEffect } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { Field, FieldGroup } from "~/components/ui/field";
import {
  FormInput,
  FormMultiSelect,
  FormSelect,
  FormTextarea,
  FormTimeInput,
} from "~/components/ui/form";
import { InputGroup, InputGroupInput } from "~/components/ui/input-group";
import { SelectItem } from "~/components/ui/select";
import FormCard from "~/features/newRecipe/form/FormCard";
import { mealTypeEnum } from "~/server/db/schema";
import { MEAL_DIFFICULTY } from "~/types/recipe/mealDifficultyEnum";
import { MEAL_TYPES } from "~/types/recipe/mealTypeEnum";
import type { FRecipe } from "~/types/recipe/recipe";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";

type RecipeMetaFormProps = {
  form: UseFormReturn<FRecipe>;
};

export default function RecipeMetaForm({ form }: RecipeMetaFormProps) {
  const recipeName = useWatch({
    control: form.control,
    name: "name",
  });
  const imageUrl = useWatch({
    control: form.control,
    name: "imageUrl",
  });

  const searchOnUnsplash = () => {
    const query = recipeName || "food";
    window.open(
      `https://unsplash.com/s/photos/${encodeURIComponent(query)}`,
      "_blank",
    );
  };

  return (
    <FormCard>
      <FieldGroup>
        <FormInput control={form.control} name="name" label="Recipe Name" />
        <FormTextarea
          control={form.control}
          name="description"
          label="Description"
        />

        <div className="flex flex-col gap-2">
          <FormInput
            control={form.control}
            name="imageUrl"
            label="Image URL"
            input={{
              placeholder: "Paste an Unsplash image URL here.",
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={searchOnUnsplash}
          >
            <Search className="mr-2 h-4 w-4" />
            Search on Unsplash
          </Button>
          {imageUrl && (
            <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Recipe preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/400x225?text=Invalid+Image+URL";
                }}
              />
            </div>
          )}
        </div>

        <FormMultiSelect
          control={form.control}
          name="mealTypes"
          label="Type of meal?"
          options={MEAL_TYPES.map((type) => ({
            label: type,
            value: type,
          }))}
        />
        <div>
          <FormTimeInput
            label="Prep Time"
            control={form.control}
            name="prepTimeMinutes"
          />
        </div>
        <div>
          <FormTimeInput
            label="Cooking Time"
            control={form.control}
            name="cookTimeMinutes"
          />
        </div>
        <FormInput
          control={form.control}
          name="calories"
          label="Calories"
          input={{ onFocus: (e) => e.target.select() }}
        />
        <FormInput
          control={form.control}
          name="servings"
          label="Servings"
          input={{ onFocus: (e) => e.target.select() }}
        />
        <FormSelect control={form.control} name="difficulty" label="Difficulty">
          {MEAL_DIFFICULTY.map((difficulty) => (
            <SelectItem key={difficulty} value={difficulty}>
              {difficulty}
            </SelectItem>
          ))}
        </FormSelect>
      </FieldGroup>
    </FormCard>
  );
}
