import { Ellipsis, Play } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import ProcedureGroup from "~/features/recipe/components/procedure_list/ProcedureGroup";
import type { Recipe } from "~/types/recipe/recipe";

export default function ProcedureArea({
  procedureGroups,
  onStartCooking,
}: {
  procedureGroups: Recipe["procedureGroups"];
  onStartCooking: () => void;
}) {
  return (
    <div className="bg-accent/50 mt-4 flex flex-col gap-2 overflow-hidden rounded-sm p-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <h1>Directions</h1>
        </div>
        <div className="flex gap-2">
          <Button size="lg" onClick={onStartCooking}>
            Start cooking
            <Play className="fill-primary-foreground" />
          </Button>
          <Button variant="secondary" size="lg">
            Actions
            <Ellipsis className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Separator className="my-1" />
      <div className="flex flex-col gap-2">
        <ProcedureGroup procedureGroups={procedureGroups} />
      </div>
    </div>
  );
}
