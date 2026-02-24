import type { UseFormReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { FieldGroup } from "~/components/ui/field";
import {
  FormInput,
  FormMultiSelect,
  FormSelect,
  FormTextarea,
} from "~/components/ui/form";
import { SelectItem } from "~/components/ui/select";
import FormCard from "~/features/newRecipe/form/FormCard";
import { MEAL_DIFFICULTY } from "~/types/recipe/mealDifficultyEnum";
import { MEAL_TYPES } from "~/types/recipe/mealTypeEnum";
import type { RecipeForm } from "~/types/recipe/recipe";

type RecipeMetaFormProps = {
  form: UseFormReturn<RecipeForm>;
};

export default function RecipeMetaForm({ form }: RecipeMetaFormProps) {
  return (
    <FormCard>
      <FieldGroup>
        <FormInput control={form.control} name="name" label="Recipe Name" />
        <FormTextarea
          control={form.control}
          name="description"
          label="Description"
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
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FormInput
              control={form.control}
              name="prepTimeMinutes"
              label="Prep Time (minutes)"
              input={{ onFocus: (e) => e.target.select() }}
            />
          </div>
          <div>
            <FormInput
              control={form.control}
              name="cookTimeMinutes"
              label="Cook Time (minutes)"
              input={{ onFocus: (e) => e.target.select() }}
            />
          </div>
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
