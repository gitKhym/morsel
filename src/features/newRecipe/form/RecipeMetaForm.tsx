import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "~/components/ui/combobox";
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

type RecipeMetaFormProps = {
  form: UseFormReturn<FRecipe>;
};

export default function RecipeMetaForm({ form }: RecipeMetaFormProps) {
  const anchor = useComboboxAnchor();

  return (
    <FormCard>
      <FieldGroup>
        <FormInput control={form.control} name="name" label="Recipe Name" />
        <FormTextarea
          control={form.control}
          name="description"
          label="Description"
        />
        <Controller
          control={form.control}
          name="mealTypes"
          render={({ field }) => (
            <Combobox
              multiple
              items={mealTypeEnum.enumValues}
              value={field.value}
              onValueChange={field.onChange}
            >
              <ComboboxChips ref={anchor}>
                <ComboboxValue>
                  {field.value.map((type) => (
                    <ComboboxChip key={type}>{type}</ComboboxChip>
                  ))}
                </ComboboxValue>
                <ComboboxChipsInput placeholder="Choose meal types." />
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxList>
                  {(item: (typeof field.value)[number]) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        />

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
