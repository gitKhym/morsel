import { Badge } from "~/components/ui/badge";
import type { recipes } from "~/server/db/schema";

export default function TagsBadgeList({
  tags,
}: {
  tags: typeof recipes.$inferSelect.tags;
}) {
  return (
    <div className="flex flex-row gap-2">
      {tags.map((tag) => {
        return <Badge key={tag}>{tag}</Badge>;
      })}
    </div>
  );
}
