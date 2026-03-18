import { Clock, Flame, Heart, Plus, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import FavouriteRecipeButton from "~/features/recipe/components/FavouriteRecipeButton";
import AddRecipeToCollectionButton from "~/features/recipes/components/recipe_card/AddRecipeToCollectionButton";
import MealTypeBadgeList from "~/features/recipes/components/recipe_card/MealTypeBadgeList";
import TagsBadgeList from "~/features/recipes/components/recipe_card/TagsBadgeList";
import { minutesToDuration } from "~/lib/utils";
import type { Collection } from "~/types/recipe/collection";
import type { PGRecipe } from "~/types/recipe/recipe";

export default function RecipeCard({
  recipe,
  collections,
}: {
  recipe: PGRecipe;
  collections: Collection[];
}) {
  return (
    <div className="bg-card grid h-full w-full grid-cols-[1fr_3fr] overflow-hidden rounded-sm">
      <div className="relative h-full w-full">
        <FavouriteRecipeButton
          recipeId={recipe.id}
          favourited={recipe.favourited}
          className="absolute top-2 left-2 z-10"
        />

        <Image
          src={recipe.imageUrl}
          alt={`Image of ${recipe.name}`}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="grid grid-rows-[auto_1fr] gap-y-4 p-3">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{recipe.name}</h1>
          {recipe.description && (
            <p className="text-muted-foreground text-sm">
              {recipe.description}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <MealTypeBadgeList mealTypes={recipe.mealTypes} />
          <Separator orientation="vertical" />
          <TagsBadgeList tags={recipe.tags} />
        </div>

        <div className="text-muted-foreground bg-accent grid grid-cols-3 gap-4 rounded-sm p-2 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-wide">Calories</span>
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              {recipe.calories}
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
            <span className="text-xs tracking-wide">Cook Time</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {minutesToDuration(recipe.cookTimeMinutes)}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Link href={`/recipes/${recipe.id}`}>
            <Button>View Recipe</Button>
          </Link>

          <AddRecipeToCollectionButton
            recipe={recipe}
            collections={collections}
          />
        </div>
      </div>
    </div>
  );
}
