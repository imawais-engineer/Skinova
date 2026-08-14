import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skinova — Understand Your Skin. Improve with Intelligence.",
  description:
    "AI-powered skincare intelligence that helps you understand your skin and make better skincare decisions."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
