import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POS Indonesia - Super Holding Logistik Nasional | Mega Blueprint 2025-2045",
  description: "Transformasi PT POS Indonesia menjadi Super Holding Logistik Nasional dan Raksasa Logistik Terbesar di Asia tahun 2045. 279 tahun warisan, 4.000+ kantor pos, 514 kabupaten/kota terjangkau.",
  keywords: ["POS Indonesia", "Logistik", "Super Holding", "BUMN", "Indonesia", "2045", "ASEAN", "Delivery", "E-commerce"],
  authors: [{ name: "PT POS Indonesia Holdings" }],
  icons: {
    icon: "https://posindonesia.co.id/favicon.ico",
  },
  openGraph: {
    title: "POS Indonesia - Super Holding Logistik Nasional",
    description: "Mega Blueprint Transformasi 2025-2045: Dari BUMN Tertua Menjadi Raksasa Logistik Asia",
    url: "https://posindonesia.co.id",
    siteName: "POS Indonesia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "POS Indonesia - Super Holding Logistik Nasional",
    description: "Mega Blueprint Transformasi 2025-2045",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
