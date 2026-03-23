import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {
  Ellipsis,
  Printer,
  Pencil,
  StickyNote,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";

export default function RecipeActionDropdown({ recipeId }: { recipeId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteRecipe = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete recipe");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Recipe deleted successfully");
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      router.push("/recipes");
    },
    onError: () => {
      toast.error("Failed to delete recipe");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe.mutate();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg">
          Actions
          <Ellipsis className="h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Printer className="h-4" />
          Print
        </DropdownMenuItem>

        <DropdownMenuItem>
          <ShoppingCart className="h-4 w-full" />
          Add to ingredients shopping list
        </DropdownMenuItem>

        <DropdownMenuItem>
          <StickyNote className="h-4" />
          Toggle notes
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/recipes/${recipeId}/edit`}>
            <Pencil className="h-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <Trash2 className="h-4" />
          Delete Recipe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
