import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from '@/components/Footer'; // Import Footer

const Wotfard = localFont({
  src: "./fonts/wotfard.woff2",
  variable: "--font-wotfard",
  weight: "100 900",
});

const Cartograph = localFont({
  src: "./fonts/cartograph-regular-italic.woff2",
  variable: "--font-cartograph",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Sagnik Sahoo – Product Developer & Entrepreneur",
  description:
    "19-year-old product developer and entrepreneur building sleek products that make life easier.",
  keywords: [
    "Sagnik Sahoo",
    "Product Developer",
    "Entrepreneur",
    "Software Engineer",
    "Portfolio",
  ],
  
  openGraph: {
    title: "Sagnik Sahoo – Product Developer & Entrepreneur",
    siteName: "Sagnik Sahoo",
    description:
      "19-year-old product developer and entrepreneur building sleek products that make life easier.",
    type: "website",
    url: "https://sagnik-wtf.vercel.app",
    images: [
      {
        url: "https://sagnik-wtf.vercel.app/og-card.png",
        width: 1200,
        height: 630,
        alt: "Sagnik Sahoo",
      },
    ],
  },
  twitter: {
    creator: "@heysagnik",
    site: "https://sagnik-wtf.vercel.app",
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://sagnik-wtf.vercel.app",
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
        className={`${Wotfard.variable} ${Cartograph.variable} antialiased min-h-screen p-8 md:p-24 `}
      >
        {children}
        <SpeedInsights />
        <div className="max-w-2xl mx-auto ">
          <hr className="border-t border-gray-400" />
          <Footer />
        </div>
      </body>
    </html>
  );
}
