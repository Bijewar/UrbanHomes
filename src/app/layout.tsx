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
  title: "Urban Homes — Construction · Interior · Modular Kitchen · Painting",
  description:
    "Urban Homes is a planning, designing and execution studio for residential and commercial projects — construction & renovation, interior design, modular kitchens, custom furniture, false ceiling, painting & finishing, wall solutions and bespoke art work. Request a free quote on WhatsApp.",
  keywords: [
    "construction",
    "renovation",
    "interior design",
    "modular kitchen",
    "custom furniture",
    "false ceiling",
    "painting",
    "finishing",
    "wall solutions",
    "mural art",
    "residential",
    "commercial",
  ],
  authors: [{ name: "Urban Homes" }],
  openGraph: {
    title: "Urban Homes — Construction · Interior · Modular Kitchen · Painting",
    description:
      "Planning, Designing & Execution for Residential and Commercial projects. Get a free quote on WhatsApp.",
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
