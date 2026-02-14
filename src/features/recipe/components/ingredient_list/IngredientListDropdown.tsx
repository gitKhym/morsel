import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import {
  Ellipsis,
  Printer,
  Pencil,
  StickyNote,
  ShoppingCart,
} from "lucide-react";

import { Button } from "~/components/ui/button";
export default function IngredientListDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="lg">
          Actions
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Printer className="h-4 w-4" />
          Print
        </DropdownMenuItem>

        <DropdownMenuItem>
          <ShoppingCart className="h-4 w-4" />
          Add to shopping list
        </DropdownMenuItem>

        <DropdownMenuItem>
          <StickyNote className="h-4 w-4" />
          Toggle notes
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
