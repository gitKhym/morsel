import type { ReactNode } from "react";

export default function FormCard({ children }: { children: ReactNode }) {
  return <div className="bg-accent/40 rounded-sm p-2">{children}</div>;
}
