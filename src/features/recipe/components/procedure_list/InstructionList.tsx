import Instruction from "~/features/recipe/components/procedure_list/Instruction";
import type { Recipe } from "~/types/recipe/recipe";

export default function InstructionList({
  instructions,
}: {
  instructions: Recipe["procedureGroups"][number]["instructions"];
}) {
  return (
    <div className="flex flex-col gap-2">
      {instructions.map((instruction) => (
        <Instruction key={instruction.id} instruction={instruction} />
      ))}
    </div>
  );
}
