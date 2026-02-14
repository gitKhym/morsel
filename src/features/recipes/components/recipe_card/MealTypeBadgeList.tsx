import { Sandwich, Utensils, Cookie, IceCream, EggFried } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { mealTypeEnum } from "~/server/db/schema";

const mealTypeConfig = {
  breakfast: {
    label: "Breakfast",
    icon: EggFried,
    className: "bg-yellow-100 text-yellow-900 border-yellow-200",
  },
  lunch: {
    label: "Lunch",
    icon: Sandwich,
    className: "bg-green-100 text-green-900 border-green-200",
  },
  dinner: {
    label: "Dinner",
    icon: Utensils,
    className: "bg-blue-100 text-blue-900 border-blue-200",
  },
  snack: {
    label: "Snack",
    icon: Cookie,
    className: "bg-purple-100 text-purple-900 border-purple-200",
  },
  dessert: {
    label: "Dessert",
    icon: IceCream,
    className: "bg-pink-100 text-pink-900 border-pink-200",
  },
} as const;

export default function MealTypeBadgeList({
  mealTypes,
}: {
  mealTypes: (typeof mealTypeEnum.enumValues)[number][];
}) {
  return (
    <div className="flex flex-row gap-2">
      {mealTypes.map((type) => {
        const config = mealTypeConfig[type];
        if (!config) return null;

        const Icon = config.icon;

        return (
          <Badge
            key={type}
            className={`flex items-center gap-1 ${config.className}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
}
