import {
  Controller,
  useFieldArray,
  useWatch,
  type ControllerRenderProps,
  type UseFieldArrayRemove,
  type UseFormReturn,
} from "react-hook-form";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "~/components/ui/combobox";
import {
  FieldGroup,
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
import { SelectItem } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import TimeInput from "~/components/ui/time-input";
import FormCard from "~/features/newRecipe/form/FormCard";
import {
  defaultNote,
  type FIngredientGroup,
  type FProcedureGroup,
  type FRecipe,
} from "~/types/recipe/recipe";
import { NoteType } from "~/types/recipe/step_modules/noteTypeEnum";

interface ProcedureItemProps {
  form: UseFormReturn<FRecipe>;
  index: number;
  removeProcedure: UseFieldArrayRemove;
  ingredientGroups: FIngredientGroup[];
  currGroup: FProcedureGroup & {
    index: number;
  };
}

function ProcedureItem({
  form,
  index,
  removeProcedure,
  ingredientGroups,
  currGroup,
}: ProcedureItemProps) {
  const {
    fields: noteFields,
    append: addNote,
    remove: removeNote,
  } = useFieldArray({
    control: form.control,
    name: `procedureGroups.${currGroup.index}.procedures.${index}.notes`,
  });

  const hasIngredients = form.watch(
    `procedureGroups.${currGroup.index}.procedures.${index}.hasIngredients`,
  );
  const hasTimer = form.watch(
    `procedureGroups.${currGroup.index}.procedures.${index}.hasTimer`,
  );
  const hasNotes = form.watch(
    `procedureGroups.${currGroup.index}.procedures.${index}.hasNotes`,
  );

  return (
    <div className="flex flex-col gap-2">
      <FormTextarea
        control={form.control}
        name={`procedureGroups.${currGroup.index}.procedures.${index}.instruction`}
        label={`Step ${index + 1}`}
      />

      {hasIngredients && (
        <FormCard>
          <FieldSet>
            <FieldLegend>Ingredient List</FieldLegend>
            <FieldGroup className="bg-card grid grid-cols-[1fr_auto_auto] gap-2 rounded-sm p-2">
              <Controller
                control={form.control}
                name={`procedureGroups.${currGroup.index}.procedures.${index}.ingredients`}
                render={({ field }) => (
                  <ProcedureCombobox
                    field={field}
                    ingredientGroups={ingredientGroups}
                  />
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
                  name={`procedureGroups.${currGroup.index}.procedures.${index}.timer.title`}
                  label="Timer title"
                  input={{ placeholder: "eg. Oven timer" }}
                />
              </div>
              <Separator orientation="vertical" />
              <div>
                <Controller
                  control={form.control}
                  name={`procedureGroups.${currGroup.index}.procedures.${index}.timer.timeSeconds`}
                  render={({ field }) => (
                    <TimeInput
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                      largeLabel="m"
                      smallLabel="s"
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
                    name={`procedureGroups.${currGroup.index}.procedures.${index}.notes.${noteIndex}.type`}
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
                    name={`procedureGroups.${currGroup.index}.procedures.${index}.notes.${noteIndex}.content`}
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
        name={`procedureGroups.${currGroup.index}.procedures.${index}.hasIngredients`}
        label="Include ingredients"
      />
      <FormCheckbox
        control={form.control}
        name={`procedureGroups.${currGroup.index}.procedures.${index}.hasTimer`}
        label="Include a timer"
      />
      <FormCheckbox
        control={form.control}
        name={`procedureGroups.${currGroup.index}.procedures.${index}.hasNotes`}
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
  field: ControllerRenderProps<
    FRecipe,
    `procedureGroups.${number}.procedures.${number}.ingredients`
  >;
  ingredientGroups: FIngredientGroup[];
}

function ProcedureCombobox({
  field,
  ingredientGroups,
}: ProcedureComboboxProps) {
  const anchor = useComboboxAnchor();

  const ingredients = ingredientGroups.flatMap((group) => group.ingredients);

  return (
    <Combobox
      multiple
      items={ingredients.map((i) => i.id)}
      value={(field.value ?? []).map((i) => i.id)}
      onValueChange={(ids) => {
        const selected = ingredients.filter((ing) => ids.includes(ing.id));
        field.onChange(selected);
      }}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(field.value ?? []).map((ingredient) => (
            <ComboboxChip key={ingredient.id}>{ingredient.name}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput />
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No ingredients found.</ComboboxEmpty>
        <ComboboxList>
          {ingredients.map((ingredient) => (
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
  procedureGroup: FProcedureGroup & { index: number };
  form: UseFormReturn<FRecipe>;
};

export default function ProcedureForm({
  procedureGroup: group,
  form,
}: ProcedureFormProps) {
  const {
    fields: procedures,
    append: addProcedure,
    remove: removeProcedure,
  } = useFieldArray({
    control: form.control,
    name: `procedureGroups.${group.index}.procedures`,
  });

  const ingredientGroups = useWatch({
    control: form.control,
    name: "ingredientGroups",
  });

  return (
    <FormCard className="bg-card flex flex-col gap-2">
      <FormInput
        control={form.control}
        name={`procedureGroups.${group.index}.name`}
        label="Group Name"
      />
      {procedures.length > 0 && (
        <FieldSet>
          <FieldGroup>
            {procedures.map((procedure, index) => (
              <ProcedureItem
                key={procedure.id}
                index={index}
                form={form}
                removeProcedure={removeProcedure}
                currGroup={group}
                ingredientGroups={ingredientGroups}
              />
            ))}
          </FieldGroup>
        </FieldSet>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          addProcedure({
            instruction: "",
            hasTimer: false,
            hasNotes: false,
            hasIngredients: false,
            ingredients: [],
            notes: [],
          })
        }
      >
        Add Step
      </Button>
    </FormCard>
  );
}
