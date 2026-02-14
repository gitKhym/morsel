import { type ComponentProps } from "react";
import { cn } from "~/lib/utils";
import RecipeCard from "./RecipeCard";
import type { Collection, Recipe } from "~/types/recipe";

type RecipeListProps = {
  recipes: Recipe[];
  collections: Collection[];
} & ComponentProps<"div">;

export default function RecipeList({
  recipes,
  className,
  collections,
  ...props
}: RecipeListProps) {
  return (
    <div
      className={cn("grid h-full w-full grid-cols-2 gap-4", className)}
      {...props}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} collections={collections} />
      ))}
    </div>
  );
}
