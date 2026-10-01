import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quizer — Interactive Learning",
  description: "A modern, local-first interactive quiz powered by a JSON quiz file.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
