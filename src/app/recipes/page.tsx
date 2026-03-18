"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import RecipeList from "~/features/recipes/components/RecipeList";
import RecipeListSkeleton from "~/features/recipes/components/RecipeList_Skeleton";
import type { Collection } from "~/types/recipe/collection";
import type { Recipe } from "~/types/recipe/recipe";
import { MEAL_TYPES } from "~/types/recipe/mealTypeEnum";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Page() {
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState("all");

  const {
    isLoading,
    error,
    data: recipes,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: async (): Promise<Recipe[]> => {
      const res = await fetch("/api/recipes");
      const data = (await res.json()) as { recipes: Recipe[] };
      return data.recipes;
    },
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: async (): Promise<Collection[]> => {
      const res = await fetch("/api/collections");
      const data = (await res.json()) as { collections: Collection[] };
      return data.collections;
    },
  });

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];

    return recipes
      .filter((recipe) => {
        const matchesSearch =
          recipe.name.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(search.toLowerCase());
        const matchesMealType =
          mealType === "all" || recipe.mealTypes.includes(mealType as any);
        const matchesTab = activeTab === "all" || recipe.favourited;

        return matchesSearch && matchesMealType && matchesTab;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (sortBy === "oldest")
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      });
  }, [recipes, search, mealType, activeTab, sortBy]);

  if (error) {
    return <div>Error loading recipes</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Recipes</h1>
          <Link href="/recipes/new">
            <Button size="sm">
              <Plus className="mr-1 size-4" />
              New Recipe
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All Recipes</TabsTrigger>
              <TabsTrigger value="favourites">Favourites</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Meal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Meals</SelectItem>
                {MEAL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <RecipeListSkeleton />
      ) : filteredRecipes.length > 0 ? (
        <RecipeList recipes={filteredRecipes} collections={collections} />
      ) : (
        <div className="text-muted-foreground flex h-40 items-center justify-center rounded-lg border border-dashed">
          No recipes found matching your criteria
        </div>
      )}
    </div>
  );
}
