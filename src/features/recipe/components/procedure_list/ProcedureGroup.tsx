import StepList from "~/features/recipe/components/procedure_list/StepList";
import type { ProcedureGroup as ProcedureGroupType } from "~/types/recipe";

export default function ProcedureGroup({
  procedureGroups,
}: {
  procedureGroups: ProcedureGroupType[];
}) {
  return (
    <>
      {procedureGroups.map((group) => (
        <div key={group.id}>
          <h2 className="mb-2">{group.name}</h2>
          <StepList steps={group.steps} />
        </div>
      ))}
    </>
  );
}
