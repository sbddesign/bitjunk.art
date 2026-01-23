import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BITJUNK | Premium Streetwear, Lightning Payments",
  description:
    "Premium streetwear merch store. Pay with Lightning Network. No banks, no bullshit.",
  keywords: ["streetwear", "bitcoin", "lightning", "merch", "fashion"],
  openGraph: {
    title: "BITJUNK",
    description: "Premium streetwear. Pay with Lightning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-black font-sans antialiased`}>
        <Auth0Provider>
          <Header />
          {children}
          <Footer />
        </Auth0Provider>
      </body>
    </html>
  );
}
