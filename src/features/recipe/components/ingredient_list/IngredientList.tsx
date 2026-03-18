import { Badge } from "~/components/ui/badge";
import Ingredient from "~/features/recipe/components/ingredient_list/Ingredient";

import { Separator } from "~/components/ui/separator";
import IngredientListDropdown from "~/features/recipe/components/ingredient_list/IngredientListDropdown";
import type { Recipe } from "~/types/recipe/recipe";
export default function IngredientList({
  ingredientGroups,
}: {
  ingredientGroups: Recipe["ingredientGroups"];
}) {
  return (
    <div className="bg-accent/50 mt-4 flex flex-col gap-2 overflow-hidden rounded-sm p-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <h1>Ingredients</h1>
          <Badge>
            {ingredientGroups.reduce(
              (count, group) => count + group.ingredients.length,
              0,
            )}
          </Badge>
        </div>
        <IngredientListDropdown />
      </div>

      <Separator />
      <div>
        {ingredientGroups.map((group) => (
          <div key={group.id} className="py-2">
            <h2 className="mb-2">{group.name}</h2>
            {group.ingredients.map((ingredient) => (
              <Ingredient key={ingredient.id} ingredient={ingredient} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
