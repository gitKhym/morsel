import { Toaster } from "sonner";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/features/navigation/sidebar/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-full w-full p-4">{children}</main>
      <Toaster />
    </SidebarProvider>
  );
}
