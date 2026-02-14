import { Check, Square } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { type Ingredient } from "~/types/recipe/ingredient";

export default function Ingredient({ ingredient }: { ingredient: Ingredient }) {
  const [ticked, setTicked] = useState(false);

  function toggleTick() {
    setTicked((prev) => !prev);
  }

  return (
    <div
      key={ingredient.id}
      className="odd:bg-accent even:bg-accent-secondary/40 odd:hover:bg-accent/70 even:hover:bg-accent-secondary/80 cursor-pointer p-2 select-none"
      onClick={toggleTick}
    >
      <div className="grid grid-cols-[auto_1fr] gap-x-2">
        {ticked ? (
          <Check className="row-span-2 my-auto h-6 w-6" />
        ) : (
          <Square className="row-span-2 my-auto h-6 w-6" />
        )}

        <div
          className={cn(
            "transition-all",
            ticked && "text-muted-foreground line-through opacity-70",
          )}
        >
          <div className="flex justify-between">
            <span className="flex gap-2 font-medium">{ingredient.name}</span>
            <span>
              {ingredient.value}
              {ingredient.measurement && ` ${ingredient.measurement}`}
            </span>
          </div>

          {ingredient.note && (
            <span className="text-muted-foreground text-sm italic">
              {ingredient.note}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
