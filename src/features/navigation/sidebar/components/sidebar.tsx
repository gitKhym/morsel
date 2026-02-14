import {
  ArrowDownAZ,
  ArrowDownZA,
  ArrowUpDown,
  Book,
  Cookie,
  EggFried,
  Gem,
  IceCream,
  Plus,
  Rabbit,
  Sandwich,
  Turtle,
  Utensils,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar";
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>Morsels</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button>
                <Plus /> New Recipe
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
        {/* Meal Types */}
        <SidebarGroup>
          <SidebarGroupLabel>Meals</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost">
                    <Book /> All
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Separator className="my-2" />
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost">
                    <EggFried /> Breakfast
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost">
                    <Sandwich /> Lunch
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost">
                    <Utensils /> Dinner
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Separator className="my-2" />
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost">
                    <IceCream /> Dessert
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button>
                    <Cookie /> Snack
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Filters */}
        <SidebarGroup>
          <SidebarGroupLabel>Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Sort By */}
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <ArrowUpDown />
                      Sort By
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Gem />
                        Recently Added
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowDownAZ />
                        Alphabetical (A to Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowDownZA />
                        Alphabetical (Z to A)
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Rabbit />
                        Fastest First
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Turtle />
                        Slowest First
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <ArrowDownAZ />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Recently Added</DropdownMenuItem>
                      <DropdownMenuItem></DropdownMenuItem>
                      <DropdownMenuItem>Alphabetical (Z to A)</DropdownMenuItem>
                      <DropdownMenuItem>Fastest First</DropdownMenuItem>
                      <DropdownMenuItem>Slowest First</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
