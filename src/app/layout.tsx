import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luca - Art Portfolio",
  description:
    "Professional oil painting portfolio showcasing original artwork and commissions",
  keywords: [
    "oil painting",
    "artist",
    "portfolio",
    "artwork",
    "paintings",
    "commissions",
  ],
  icons: {
    icon: [
      {
        url: "/images/gallery/human_figure/coronel_aureliano_buendia.JPG",
        type: "image/jpeg",
      },
    ],
    shortcut: "/images/gallery/human_figure/coronel_aureliano_buendia.JPG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
