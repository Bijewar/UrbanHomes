import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison Studio — Civil Engineering · Architecture · Finishing",
  description:
    "Boutique design-build studio crafting civil engineering, architectural and painting & finishing solutions — end-to-end, with precision. Request a human-reviewed quote today.",
  keywords: [
    "civil engineering",
    "architecture",
    "painting",
    "finishing",
    "design-build",
    "construction studio",
    "boutique contractor",
  ],
  authors: [{ name: "Maison Studio" }],
  openGraph: {
    title: "Maison Studio — Civil Engineering · Architecture · Finishing",
    description:
      "Civil Engineering, Architecture & Finishing Solutions — Crafted End-to-End.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
