import type { Metadata } from "next";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import "./globals.css";
import { Providers } from "./providers";
import { type Theme } from "./theme-context";

export const metadata: Metadata = {
  title: "Networkia",
  description: "Your personal CRM for managing relationships",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const storedTheme = cookieStore.get("theme")?.value;
  const initialTheme: Theme = storedTheme === "dark" ? "dark" : "light";
  const session = await auth();

  return (
    <html lang="en" data-theme={initialTheme} suppressHydrationWarning>
      <body>
        <Providers initialTheme={initialTheme} session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
