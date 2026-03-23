"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Recipe } from "~/types/recipe/recipe";

interface GroupSelectionProps {
  procedureGroups: Recipe["procedureGroups"];
  completedGroupIds: Set<number>;
  onSelectGroup: (id: number) => void;
}

export function GroupSelection({
  procedureGroups,
  completedGroupIds,
  onSelectGroup,
}: GroupSelectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {procedureGroups.map((group) => {
        const isCompleted = completedGroupIds.has(group.id);
        return (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={cn(
              "flex flex-col items-start p-6 rounded-xl border-2 text-left transition-all hover:bg-accent/50 cursor-pointer",
              isCompleted 
                ? "border-primary bg-primary/5" 
                : "border-border bg-card"
            )}
          >
            <div className="flex w-full items-center justify-between mb-1">
              <span className="text-sm font-semibold text-muted-foreground tracking-tight">
                {group.instructions.length} steps
              </span>
              {isCompleted && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </div>
            <h3 className="text-xl font-bold leading-tight">{group.name}</h3>
          </button>
        );
      })}
    </div>
  );
}
