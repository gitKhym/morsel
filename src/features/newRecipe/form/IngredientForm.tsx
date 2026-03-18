import { Trash } from "lucide-react";
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "~/components/ui/field";
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
import { type FIngredientGroup, type FRecipe } from "~/types/recipe/recipe";
import { measurements, type UnitOption } from "~/types/recipe/units";

type IngredientFormProps = {
  ingredientGroup: FIngredientGroup & { index: number };
  form: UseFormReturn<FRecipe>;
};

export default function IngredientForm({
  ingredientGroup: group,
  form,
}: IngredientFormProps) {
  const {
    fields: ingredients,
    append: addIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: `ingredientGroups.${group.index}.ingredients`,
  });

  return (
    <FormCard className="bg-card flex flex-col gap-2">
      {ingredients.length > 0 && (
        <FieldSet>
          <FieldGroup className="flex flex-col">
            {ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
                className="bg-card flex flex-col rounded-sm p-2"
              >
                <div className="flex gap-2">
                  <Controller
                    control={form.control}
                    name={`ingredientGroups.${group.index}.ingredients.${index}.name`}
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
                {form.watch(
                  `ingredientGroups.${group.index}.ingredients.${index}.hasNote`,
                ) && (
                  <FormTextarea
                    control={form.control}
                    name={`ingredientGroups.${group.index}.ingredients.${index}.note`}
                    label=""
                  />
                )}
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <div>
                    <FormInput
                      control={form.control}
                      name={`ingredientGroups.${group.index}.ingredients.${index}.amount`}
                      input={{ onFocus: (e) => e.target.select() }}
                      label=""
                    />
                  </div>
                  <div>
                    <FormSelect
                      control={form.control}
                      name={`ingredientGroups.${group.index}.ingredients.${index}.unitType`}
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
                    name={`ingredientGroups.${group.index}.ingredients.${index}.hasNote`}
                    label="Add Note"
                  />
                </div>
              </div>
            ))}
          </FieldGroup>
        </FieldSet>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() => addIngredient(createDefaultIngredient())}
      >
        New Ingredient
      </Button>
    </FormCard>
  );
}
