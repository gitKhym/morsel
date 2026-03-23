import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { FieldGroup, FieldSet } from "~/components/ui/field";
import IngredientForm from "./IngredientForm";
import { Button } from "~/components/ui/button";
import FormCard from "~/features/newRecipe/form/FormCard";
import { FormInput } from "~/components/ui/form";
import type { FRecipe } from "~/types/recipe/recipe";
import { X } from "lucide-react";
import { createDefaultIngredient } from "~/types/recipe/ingredient";

type IngredientGroupFormProps = {
  form: UseFormReturn<FRecipe>;
};

export default function IngredientGroupForm({
  form,
}: IngredientGroupFormProps) {
  const {
    fields: groups,
    append: addGroup,
    remove: removeGroup,
  } = useFieldArray({
    control: form.control,
    name: "ingredientGroups",
  });

  return (
    <FieldSet>
      <FieldGroup>
        {groups.map((group, index) => (
          <FormCard key={index} className="bg-accent flex flex-col gap-2">
            <div className="flex justify-between">
              <h1>Group {index + 1}</h1>
              <Button variant="destructive" onClick={() => removeGroup(index)}>
                <X />
              </Button>
            </div>
            <div className="bg-card rounded-sm p-4">
              <FormInput
                control={form.control}
                name={`ingredientGroups.${index}.name`}
                label="Group Name"
              />

              <IngredientForm
                key={group.id}
                form={form}
                ingredientGroup={{ index, ...group }}
              />
            </div>
          </FormCard>
        ))}
      </FieldGroup>

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          addGroup({
            name: "",
            ingredients: [createDefaultIngredient()],
          })
        }
      >
        New Group
      </Button>
    </FieldSet>
  );
}
