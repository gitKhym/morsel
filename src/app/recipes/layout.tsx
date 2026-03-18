import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="h-full w-full p-4">{children}</main>
      <Toaster />
    </>
  );
}
