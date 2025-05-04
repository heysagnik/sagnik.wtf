import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const DOMAIN = "https://sagnik-wtf.vercel.app"; // Replace with your actual domain

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: "Sagnik Sahoo | Product Designer & UI/UX Developer",
  description:
    "Experienced product designer and developer with expertise in UI/UX, interactive interfaces, and modern web technologies. Explore my portfolio of innovative digital products and design systems.",
  authors: [
    {
      name: "Sagnik Sahoo",
      url: "https://twitter.com/heysagnik",
    },
  ],
  creator: "Sagnik Sahoo",
  keywords: [
    "Sagnik Sahoo",
    "Product Designer",
    "UI/UX Designer",
    "Frontend Developer",
    "Web Developer",
    "Interactive Design",
    "Portfolio",
    "Design Systems",
    "React Developer",
    "NextJS",
  ],
  publisher: "Sagnik Sahoo",
  category: "Portfolio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: DOMAIN,
    title: "Sagnik Sahoo | Product Designer & UI/UX Developer",
    description:
      "Experienced product designer and developer creating beautiful, functional interfaces. View my portfolio and get in touch for collaborations.",
    siteName: "Sagnik Sahoo Portfolio",
    images: [
      {
        url: `${DOMAIN}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Sagnik Sahoo - Product Designer & Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagnik Sahoo | Product Designer & UI/UX Developer",
    description:
      "Experienced product designer and developer creating beautiful, functional interfaces. View my portfolio and get in touch for collaborations.",
    creator: "@heysagnik",
    images: [`${DOMAIN}/twitter-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: DOMAIN,
    types: {
      "application/rss+xml": `${DOMAIN}/feed.xml`,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sagnik | Product Designer",
    startupImage: [`${DOMAIN}/apple-touch-startup-image.png`],
  },
  applicationName: "Sagnik Sahoo's Portfolio",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased h-full w-full bg-black text-white overflow-hidden`}
      >
        {children}
        <Script
          id="schema-org-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Sagnik Sahoo",
              url: DOMAIN,
             
            }),
          }}
        />
      </body>
    </html>
  );
}
