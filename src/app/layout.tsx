import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShipDelhivery — Every Parcel. Every Mile. In Motion.",
    template: "%s | ShipDelhivery",
  },
  description:
    "Track shipments, explore smarter logistics, and follow every confirmed delivery milestone in one connected experience.",
  keywords: [
    "parcel tracking",
    "shipment tracking",
    "logistics",
    "delivery",
    "warehouse",
    "courier",
  ],
  authors: [{ name: "ShipDelhivery" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    siteName: "ShipDelhivery",
    title: "ShipDelhivery — Every Parcel. Every Mile. In Motion.",
    description:
      "Track shipments, explore smarter logistics, and follow every confirmed delivery milestone in one connected experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
