import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "fiat.markets",
  description: "Macro analysis through the 4Fs framework",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "fiat.markets",
    description: "Macro analysis through the 4Fs framework",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "fiat.markets - Stablecoin macro dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "fiat.markets",
    description: "Macro analysis through the 4Fs framework",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
