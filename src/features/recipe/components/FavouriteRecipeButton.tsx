import { Heart } from "lucide-react";
import { useState } from "react";
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
  const [isFavourite, setIsFavourite] = useState(favourited);
  return (
    <Button
      size="icon"
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
