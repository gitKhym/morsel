import "~/styles/globals.css";

import { type Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import { cn } from "~/lib/utils";
import { QueryProvider } from "~/components/QueryProvider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Morsel",
  description: "Morsel App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const font = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(font.variable)}>
      <body className="dark">
        <ClerkProvider>
          <QueryProvider>{children}</QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
