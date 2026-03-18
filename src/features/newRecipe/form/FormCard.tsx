import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export default function FormCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-accent/40 rounded-sm p-2", className)}>
      {children}
    </div>
  );
}
