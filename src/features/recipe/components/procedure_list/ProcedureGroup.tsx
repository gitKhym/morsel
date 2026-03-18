import InstructionList from "~/features/recipe/components/procedure_list/InstructionList";
import type { Recipe } from "~/types/recipe/recipe";

export default function ProcedureGroup({
  procedureGroups,
}: {
  procedureGroups: Recipe["procedureGroups"];
}) {
  return (
    <>
      {procedureGroups.map((group) => (
        <div key={group.id}>
          <h2 className="mb-2">{group.name}</h2>
          <InstructionList instructions={group.instructions} />
        </div>
      ))}
    </>
  );
}
