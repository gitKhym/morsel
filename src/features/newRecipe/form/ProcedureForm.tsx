import {
  Controller,
  useFieldArray,
  useWatch,
  type ControllerRenderProps,
  type UseFormReturn,
} from "react-hook-form";
import type z from "zod";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "~/components/ui/combobox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field";
import {
  FormCheckbox,
  FormInput,
  FormSelect,
  FormTextarea,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { SelectItem } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import TimeInput from "~/components/ui/time-input";
import FormCard from "~/features/newRecipe/form/FormCard";
import type { ingredientSchema } from "~/types/recipe/ingredient";
import {
  defaultNote,
  defaultProcedure,
  type RecipeForm,
} from "~/types/recipe/recipe";
import { NoteType } from "~/types/recipe/step_modules/noteTypeEnum";

interface ProcedureItemProps {
  form: UseFormReturn<RecipeForm>;
  index: number;
  removeProcedure: (index: number) => void;
  ingredients: z.infer<typeof ingredientSchema>[];
}

function ProcedureItem({
  form,
  index,
  removeProcedure,
  ingredients,
}: ProcedureItemProps) {
  const {
    fields: noteFields,
    append: addNote,
    remove: removeNote,
  } = useFieldArray({
    control: form.control,
    name: `procedures.${index}.notes`,
  });

  const hasIngredients = form.watch(`procedures.${index}.hasIngredients`);
  const hasTimer = form.watch(`procedures.${index}.hasTimer`);
  const hasNotes = form.watch(`procedures.${index}.hasNotes`);

  return (
    <div className="flex flex-col gap-2">
      <FormTextarea
        control={form.control}
        name={`procedures.${index}.content`}
        label={`Step ${index + 1}`}
      />

      {hasIngredients && (
        <FormCard>
          <FieldSet>
            <FieldLegend>Ingredient List</FieldLegend>
            <FieldGroup className="bg-accent/20 grid grid-cols-[1fr_auto_auto] gap-2 rounded-sm p-2">
              <Controller
                control={form.control}
                name={`procedures.${index}.ingredients`}
                render={({ field }) => (
                  <ProcedureCombobox field={field} ingredients={ingredients} />
                )}
              />
            </FieldGroup>
          </FieldSet>
        </FormCard>
      )}

      {hasTimer && (
        <FormCard>
          <FieldSet>
            <FieldLegend>Timer</FieldLegend>
            <FieldGroup className="bg-accent/20 grid grid-cols-[1fr_auto_auto] gap-2 rounded-sm p-2">
              <div>
                <FormInput
                  control={form.control}
                  name={`procedures.${index}.timer.title`}
                  label="Timer title"
                  input={{ placeholder: "eg. Oven timer" }}
                />
              </div>
              <Separator orientation="vertical" />
              <div>
                <Controller
                  control={form.control}
                  name={`procedures.${index}.timer.timeSeconds`}
                  render={({ field }) => (
                    <TimeInput
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>
        </FormCard>
      )}

      {hasNotes && (
        <FormCard>
          <FieldSet>
            <FieldLegend>Notes</FieldLegend>
            <FieldGroup className="bg-accent/20 gap-2 rounded-sm p-2">
              {noteFields.map((note, noteIndex) => (
                <div key={note.id} className="flex flex-col gap-2">
                  <FormSelect
                    control={form.control}
                    name={`procedures.${index}.notes.${noteIndex}.type`}
                    label="Note type"
                  >
                    {NoteType.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </FormSelect>
                  <FormTextarea
                    control={form.control}
                    name={`procedures.${index}.notes.${noteIndex}.content`}
                    label={`Note ${noteIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeNote(noteIndex)}
                  >
                    Remove Note
                  </Button>

                  <FieldSeparator />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => addNote(defaultNote)}
              >
                Add Note
              </Button>
            </FieldGroup>
          </FieldSet>
        </FormCard>
      )}

      <FormCheckbox
        control={form.control}
        name={`procedures.${index}.hasIngredients`}
        label="Include ingredients"
      />
      <FormCheckbox
        control={form.control}
        name={`procedures.${index}.hasTimer`}
        label="Include a timer"
      />
      <FormCheckbox
        control={form.control}
        name={`procedures.${index}.hasNotes`}
        label="Include notes"
      />

      <FieldSeparator />

      <Button
        type="button"
        variant="destructive"
        onClick={() => removeProcedure(index)}
      >
        Remove Step
      </Button>
    </div>
  );
}

interface ProcedureComboboxProps {
  field: ControllerRenderProps<RecipeForm, `procedures.${number}.ingredients`>;
  ingredients: z.infer<typeof ingredientSchema>[];
}

function ProcedureCombobox({ field, ingredients }: ProcedureComboboxProps) {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      multiple
      autoHighlight
      items={ingredients.map((i) => i.id)}
      value={field.value.map((i) => i.id)}
      onValueChange={(ids) =>
        field.onChange(ingredients.filter((i) => ids.includes(i.id)))
      }
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {() =>
            field.value.map((ingredient) => (
              <ComboboxChip key={ingredient.id}>{ingredient.name}</ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No ingredients found.</ComboboxEmpty>
        <ComboboxList>
          {ingredients
            .filter((ingredient) => !!ingredient.name)
            .map((ingredient) => (
              <ComboboxItem key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </ComboboxItem>
            ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

type ProcedureFormProps = {
  form: UseFormReturn<RecipeForm>;
};
export default function ProcedureForm({ form }: ProcedureFormProps) {
  const {
    fields: procedures,
    append: addProcedure,
    remove: removeProcedure,
  } = useFieldArray({ control: form.control, name: "procedures" });

  const ingredients = useWatch({
    control: form.control,
    name: "ingredients",
  });

  return (
    <FormCard>
      <FieldSet>
        <FieldGroup>
          {procedures.map((procedure, index) => (
            <ProcedureItem
              key={index}
              index={index}
              form={form}
              ingredients={ingredients}
              removeProcedure={removeProcedure}
            />
          ))}
        </FieldGroup>

        <Button
          type="button"
          variant="outline"
          onClick={() => addProcedure(defaultProcedure)}
        >
          Add Step
        </Button>
      </FieldSet>
    </FormCard>
  );
}
