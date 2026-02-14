import { Badge } from "~/components/ui/badge";
import StepNote from "~/features/recipe/components/step_modules/StepNote";
import Timer from "~/features/recipe/components/step_modules/Timer";
import { cn } from "~/lib/utils";

import { type Step as StepType } from "~/features/recipe/components/procedure_list/types";

export default function Step({ step }: { step: StepType }) {
  return (
    <div
      className={cn(
        "grid gap-2",
        step.timer ? "grid-cols-[1fr_auto]" : "grid-cols-1",
      )}
    >
      <div className="bg-accent-secondary grid grid-cols-[auto_1fr] gap-4 rounded-sm p-4">
        <div className="text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full bg-white p-2">
          {step.stepNumber + 1}
        </div>
        <div className="flex flex-col gap-2">
          <span>{step.content}</span>
          {step.ingredients.length > 0 && (
            <div className="text-muted-foreground flex flex-wrap gap-1 text-xs">
              Using:
              {step.ingredients.map((ingredient) => (
                <Badge key={ingredient.id} variant="secondary">
                  {ingredient.name}
                </Badge>
              ))}
            </div>
          )}
          {step.notes.length > 0 && (
            <div className="flex flex-col gap-2">
              {step.notes.map((note) => (
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
      {step.timer && (
        <Timer time={step.timer.timeSeconds} title={step.timer.title} />
      )}
    </div>
  );
}
