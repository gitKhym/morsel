import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function FavouriteRecipeButton({
  recipeId,
  favourited,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  recipeId: number;
  favourited: boolean;
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/recipes/${recipeId}/favourite`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to toggle favourite");
      }
      return (await res.json()) as { favourited: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });

  return (
    <Button
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutate();
      }}
      disabled={isPending}
      className={cn(
        "bg-accent cursor-pointer rounded-full hover:bg-red-200/60",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition",
          favourited ? "fill-red-500 text-red-500" : "text-white",
        )}
      />
    </Button>
  );
}
