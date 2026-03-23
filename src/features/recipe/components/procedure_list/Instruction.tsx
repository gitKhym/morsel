import { Badge } from "~/components/ui/badge";
import StepNote from "~/features/recipe/components/step_modules/StepNote";
import Timer from "~/features/recipe/components/step_modules/Timer";
import { cn } from "~/lib/utils";

import type { PGNote, PGProcedure, PGTimer } from "~/types/recipe/recipe";

export default function Instruction({
  instruction,
}: {
  instruction: PGProcedure & {
    ingredients: string[];
    notes: PGNote[];
    timer: PGTimer;
  };
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        instruction.timer ? "grid-cols-[1fr_auto]" : "grid-cols-1",
      )}
    >
      <div className="bg-accent-secondary grid grid-cols-[auto_1fr] gap-4 rounded-sm p-4">
        <div className="text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full bg-white p-2">
          {instruction.instructionNumber + 1}
        </div>
        <div className="flex flex-col gap-2">
          <span>{instruction.instruction}</span>
          {instruction.ingredients.length > 0 && (
            <div className="text-muted-foreground flex flex-wrap gap-1 text-xs">
              Using:
              {instruction.ingredients.map((ingredient, i) => (
                <Badge key={i} variant="secondary">
                  {ingredient}
                </Badge>
              ))}
            </div>
          )}
          {instruction.notes.length > 0 && (
            <div className="flex flex-col gap-2">
              {instruction.notes.map((note) => (
                <StepNote
                  key={note.id}
                  variant={note.type}
                  note={note.content}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {instruction.timer && (
        <Timer
          time={instruction.timer.timeSeconds * 60}
          title={instruction.timer.title}
        />
      )}
    </div>
  );
}
