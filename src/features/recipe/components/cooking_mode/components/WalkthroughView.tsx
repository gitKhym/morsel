"use client";

import { Button } from "~/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import StepNote from "~/features/recipe/components/step_modules/StepNote";
import { CookingTimer } from "./CookingTimer";
import type {
  PGProcedure,
  PGIngredient,
  PGNote,
  PGTimer,
} from "~/types/recipe/recipe";

interface WalkthroughViewProps {
  instruction: PGProcedure & {
    ingredients: string[];
    notes: PGNote[];
    timer: PGTimer;
  };
  groupName: string;
  currentIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onExit: () => void;
}

export function WalkthroughView({
  instruction,
  groupName,
  currentIndex,
  totalSteps,
  onNext,
  onPrev,
  onComplete,
  onExit,
}: WalkthroughViewProps) {
  const isLastStep = currentIndex === totalSteps - 1;
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="relative flex flex-col gap-6 px-4 pb-12">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          className="hover:bg-accent -ml-2 h-10 w-10 rounded-full"
          title="Exit section"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-3xl font-bold">{groupName}</h2>
          <div className="flex items-center gap-2">
            <span className="text-primary">Step {currentIndex + 1}</span>
            <span className="text-muted-foreground text-sm font-medium">
              of {totalSteps}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-col">
        <h2 className="text-muted-foreground bg-accent-secondary w-fit rounded-t-sm px-4 pt-1 text-sm font-medium select-none">
          {`Instruction`}
        </h2>
        <div className="bg-accent-secondary flex items-start gap-4 rounded-tr-sm rounded-b-sm p-6 shadow-sm">
          <p className="text-2xl leading-relaxed">{instruction.instruction}</p>
        </div>
      </div>

      {instruction.ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 py-2">
          {instruction.ingredients.map((ingredient, i) => (
            <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
              {ingredient}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="lg"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="h-12 px-8"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back
          </Button>

          {isLastStep ? (
            <Button
              onClick={onComplete}
              variant="default"
              size="lg"
              className="bg-primary hover:bg-primary/90 h-12 px-8"
            >
              Complete section
              <CheckCircle2 className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button onClick={onNext} size="lg" className="h-12 px-8">
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {instruction.timer && (
            <CookingTimer
              initialTime={instruction.timer.timeSeconds * 60}
              title={instruction.timer.title}
            />
          )}
        </div>
      </div>

      {instruction.notes.length > 0 && (
        <div className="mt-8 flex max-w-2xl flex-col gap-4">
          {instruction.notes.map((note) => (
            <StepNote key={note.id} variant={note.type} note={note.content} />
          ))}
        </div>
      )}

      <div className="bg-secondary/50 fixed bottom-0 left-0 z-50 h-1.5 w-full">
        <div
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
