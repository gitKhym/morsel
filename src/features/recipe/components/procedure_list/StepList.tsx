import Step from "~/features/recipe/components/procedure_list/Step";
import type { Step as StepType } from "~/types/recipe";

export default function StepList({ steps }: { steps: StepType[] }) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step) => (
        <Step key={step.id} step={step} />
      ))}
    </div>
  );
}
