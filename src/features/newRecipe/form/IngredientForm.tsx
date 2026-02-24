import { Trash } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "~/components/ui/field";
import {
  FormCheckbox,
  FormInput,
  FormSelect,
  FormTextarea,
} from "~/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from "~/components/ui/select";
import FormCard from "~/features/newRecipe/form/FormCard";
import { createDefaultIngredient } from "~/types/recipe/ingredient";
import { type RecipeForm } from "~/types/recipe/recipe";
import { measurements, type UnitOption } from "~/types/recipe/units";

type IngredientFormProps = {
  form: UseFormReturn<RecipeForm>;
};

export default function IngredientForm({ form }: IngredientFormProps) {
  const {
    fields: ingredients,
    append: addIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control: form.control, name: "ingredients" });

  return (
    <FormCard>
      <FieldSet>
        <FieldGroup className="flex flex-col">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.id}
              className="bg-accent/50 flex flex-col rounded-sm p-2"
            >
              <div className="flex gap-2">
                <Controller
                  control={form.control}
                  name={`ingredients.${index}.name`}
                  render={({ field, fieldState }) => (
                    <Field>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          placeholder="Carrots, Beef, Salt"
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            variant="ghost"
                            onClick={() => removeIngredient(index)}
                          >
                            Remove
                            <Trash />
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              {form.watch(`ingredients.${index}.hasNote`) && (
                <FormTextarea
                  control={form.control}
                  name={`ingredients.${index}.note`}
                  label=""
                />
              )}
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <div>
                  <FormInput
                    control={form.control}
                    name={`ingredients.${index}.value`}
                    input={{ onFocus: (e) => e.target.select() }}
                    label=""
                  />
                </div>
                <div>
                  <FormSelect
                    control={form.control}
                    name={`ingredients.${index}.unit`}
                    label=""
                  >
                    {measurements.metric.map((measurement) => (
                      <SelectGroup key={measurement.category}>
                        <SelectLabel>{measurement.category}</SelectLabel>

                        {measurement.items.map((item: UnitOption) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                            {measurement.category !== "Specific" &&
                              ` (${item.value})`}
                          </SelectItem>
                        ))}
                        {index < measurements.metric.length - 1 && (
                          <SelectSeparator />
                        )}
                      </SelectGroup>
                    ))}
                  </FormSelect>
                </div>
              </div>
              <div className="mt-2">
                <FormCheckbox
                  control={form.control}
                  name={`ingredients.${index}.hasNote`}
                  label="Add Note"
                />
              </div>
            </div>
          ))}
        </FieldGroup>
        <Button
          type="button"
          variant="outline"
          onClick={() => addIngredient(createDefaultIngredient())}
        >
          New Ingredient
        </Button>
      </FieldSet>
    </FormCard>
  );
}
