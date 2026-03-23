"use client";

import { useState } from "react";
import type { Recipe } from "~/types/recipe/recipe";
import { GroupSelection } from "./components/GroupSelection";
import { WalkthroughView } from "./components/WalkthroughView";

interface FocusModeProps {
  recipe: Recipe;
}

export default function FocusMode({ recipe }: FocusModeProps) {
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedGroupIds, setCompletedGroupIds] = useState<Set<number>>(
    new Set(),
  );

  const activeGroup = recipe.procedureGroups.find(
    (g) => g.id === activeGroupId,
  );
  const currentInstruction = activeGroup?.instructions[currentStepIndex];

  const handleNext = () => {
    if (activeGroup && currentStepIndex < activeGroup.instructions.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleToggleGroupComplete = (groupId: number) => {
    setCompletedGroupIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleCompleteSection = () => {
    if (activeGroupId !== null) {
      handleToggleGroupComplete(activeGroupId);
      setActiveGroupId(null);
      setCurrentStepIndex(0);
    }
  };

  const handleExitGroup = () => {
    setActiveGroupId(null);
    setCurrentStepIndex(0);
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-4">
      {!activeGroup ? (
        <div className="flex flex-col gap-6">
          <h2 className="px-4 text-2xl font-bold">Select a section to start</h2>
          <GroupSelection
            procedureGroups={recipe.procedureGroups}
            completedGroupIds={completedGroupIds}
            onSelectGroup={setActiveGroupId}
          />
        </div>
      ) : (
        <WalkthroughView
          instruction={currentInstruction!}
          groupName={activeGroup.name}
          currentIndex={currentStepIndex}
          totalSteps={activeGroup.instructions.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onComplete={handleCompleteSection}
          onExit={handleExitGroup}
        />
      )}
    </div>
  );
}
