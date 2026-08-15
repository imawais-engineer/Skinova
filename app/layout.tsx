import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://skinova-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Skinova — Understand Your Skin. Improve with Intelligence.",
  description:
    "AI-powered skincare intelligence that helps you understand your skin and make better skincare decisions.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [{ url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }]
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Skinova — Understand Your Skin. Improve with Intelligence.",
    description:
      "AI-powered skin analysis and personalized skincare guidance built with YouCam Skin AI.",
    images: [
      {
        url: "/screenshots/project-cover.png",
        width: 1920,
        height: 1080,
        alt: "Skinova — AI-powered skin analysis and personalized skincare guidance"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Skinova — Understand Your Skin. Improve with Intelligence.",
    description:
      "AI-powered skin analysis and personalized skincare guidance built with YouCam Skin AI.",
    images: ["/screenshots/project-cover.png"]
  }
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
