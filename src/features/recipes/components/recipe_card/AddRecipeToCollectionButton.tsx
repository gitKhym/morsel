"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "~/components/ui/combobox";
import { useMutation } from "@tanstack/react-query";
import type { Recipe } from "~/types/recipe/recipe";
import type { Collection } from "~/types/recipe/collection";
import { toast } from "sonner";

export default function AddRecipeToCollectionButton({
  recipe,
  collections,
}: {
  recipe: Recipe;
  collections: Collection[];
}) {
  const [localCollectionIds, setLocalCollectionIds] = useState<number[]>(
    recipe.collectionIds,
  );

  // Add mutation
  const addToCollectionMutation = useMutation({
    mutationFn: async ({
      collectionId,
    }: {
      collectionId: number;
      collectionName: string;
    }) => {
      const res = await fetch("/api/collections/add-recipe", {
        method: "POST",
        body: JSON.stringify({
          recipeId: recipe.id,
          collectionId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add recipe to collection");
      }
    },
    onSuccess: (_, vars) => {
      toast.success(`${recipe.name} has been added to ${vars.collectionName}`, {
        position: "bottom-center",
      });
    },
  });

  // Remove mutation
  const removeFromCollectionMutation = useMutation({
    mutationFn: async ({
      collectionId,
    }: {
      collectionId: number;
      collectionName: string;
    }) => {
      const res = await fetch("/api/collections/remove-recipe", {
        method: "POST",
        body: JSON.stringify({
          recipeId: recipe.id,
          collectionId,
        }),
      });
      if (!res.ok) throw new Error("Failed to remove recipe from collection");
    },
    onSuccess: (_, vars) => {
      toast.success(
        `${recipe.name} has been removed from ${vars.collectionName}`,
        {
          position: "bottom-center",
        },
      );
    },
  });

  const handleCollectionClick = (collection: Collection) => {
    const isInCollection = localCollectionIds.includes(collection.id);

    if (isInCollection) {
      // Remove tick immediately
      setLocalCollectionIds((ids) => ids.filter((id) => id !== collection.id));
      void removeFromCollectionMutation.mutate({
        collectionId: collection.id,
        collectionName: collection.name,
      });
    } else {
      toast.loading("loading");
      // Add tick immediately
      setLocalCollectionIds((ids) => [...ids, collection.id]);
      void addToCollectionMutation.mutate({
        collectionId: collection.id,
        collectionName: collection.name,
      });
    }
  };

  return (
    <div className="relative">
      <Combobox<Collection> items={collections}>
        <ComboboxTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
              disabled={
                addToCollectionMutation.isPending ||
                removeFromCollectionMutation.isPending
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Collection
            </Button>
          }
        />

        <ComboboxContent>
          <ComboboxInput showTrigger={false} placeholder="Search collections" />
          <ComboboxEmpty>No collections found.</ComboboxEmpty>

          <ComboboxList>
            {collections.map((collection) => (
              <ComboboxItem
                key={collection.id}
                value={collection.id}
                className="flex items-center justify-between"
                onClick={() => handleCollectionClick(collection)}
              >
                <span>{collection.name}</span>
                {localCollectionIds.includes(collection.id) && (
                  <Check className="h-4 w-4" />
                )}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
