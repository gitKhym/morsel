import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import NavMenu from "~/features/navigation/navbar/components/nav-menu";

export default function NavBar() {
  return (
    <nav className="bg-background h-16 border-b">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavMenu />

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Get Started</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
}
