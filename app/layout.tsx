import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Networkia",
  description: "Built with Next.js, Prisma, and Neon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
