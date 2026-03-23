import { Clock, Ellipsis, Flame, UsersRound } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import FavouriteRecipeButton from "~/features/recipe/components/FavouriteRecipeButton";
import RecipeActionDropdown from "~/features/recipe/components/RecipeActionDropdown";
import AddRecipeToCollectionButton from "~/features/recipes/components/recipe_card/AddRecipeToCollectionButton";
import { minutesToDuration } from "~/lib/utils";
import type { Collection } from "~/types/recipe/collection";
import type { PGRecipe } from "~/types/recipe/recipe";

export default function RecipeSummaryHeader({
  recipe,
  collections,
}: {
  recipe: PGRecipe;
  collections: Collection[];
}) {
  return (
    <div className="grid grid-cols-[5fr_8fr] rounded-t-sm">
      <div className="grid grid-rows-[1fr_auto]">
        <div
          className="relative rounded-sm"
          style={{ backgroundColor: `#${recipe.color || "cccccc"}` }}
        >
          <Image
            src={recipe.imageUrl}
            alt={`Image of ${recipe.name}`}
            fill
            className="rounded-sm object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 pl-4">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{recipe.name}</h1>
          {recipe.description && (
            <p className="text-muted-foreground text-sm">
              {recipe.description}
            </p>
          )}
        </div>

        <div className="text-muted-foreground bg-accent grid grid-cols-4 gap-4 rounded-sm p-2 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-wide">Cook Time</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {minutesToDuration(recipe.cookTimeMinutes)}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-wide">Prep Time</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {minutesToDuration(recipe.prepTimeMinutes)}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-wide">Servings</span>
            <div className="flex items-center gap-1">
              <UsersRound className="h-4 w-4" />
              {recipe.servings}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-wide">Difficulty</span>
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              {recipe.difficulty}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <FavouriteRecipeButton
            recipeId={recipe.id}
            favourited={recipe.favourited}
          />
          <AddRecipeToCollectionButton
            recipe={recipe}
            collections={collections}
          />
          <RecipeActionDropdown recipeId={recipe.id} />
        </div>
      </div>
    </div>
  );
}
