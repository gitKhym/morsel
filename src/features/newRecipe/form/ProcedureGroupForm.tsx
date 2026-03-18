import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { FieldGroup, FieldSet } from "~/components/ui/field";
import { Button } from "~/components/ui/button";
import ProcedureForm from "~/features/newRecipe/form/ProcedureForm";
import { FormInput } from "~/components/ui/form";
import FormCard from "~/features/newRecipe/form/FormCard";
import type { FRecipe } from "~/types/recipe/recipe";
import { X } from "lucide-react";

type ProcedureGroupFormProps = {
  form: UseFormReturn<FRecipe>;
};

export default function ProcedureGroupForm({ form }: ProcedureGroupFormProps) {
  const {
    fields: groups,
    append: addGroup,
    remove: removeGroup,
  } = useFieldArray({
    control: form.control,
    name: "procedureGroups",
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
            <ProcedureForm
              key={group.id}
              form={form}
              procedureGroup={{ index, ...group }}
            />
          </FormCard>
        ))}
      </FieldGroup>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          addGroup({
            name: "what",
            procedures: [],
          })
        }
      >
        New Group
      </Button>
    </FieldSet>
  );
}
