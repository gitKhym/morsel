import { Pencil, Lightbulb, AlertTriangle, CircleAlert } from "lucide-react";

type StepNoteVariant = "note" | "tip" | "warning";

const variantConfig: Record<
  StepNoteVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  note: {
    icon: Pencil,
  },
  tip: {
    icon: Lightbulb,
  },
  warning: {
    icon: CircleAlert,
  },
};

export default function StepNote({
  variant,
  note,
}: {
  variant: StepNoteVariant;
  note: string;
}) {
  const Icon = variantConfig[variant].icon;

  return (
    <div className="bg-accent grid grid-cols-[auto_1fr] gap-2 rounded-sm p-2 text-xs">
      <Icon className="h-3 w-3" />
      <span>{note}</span>
    </div>
  );
}
