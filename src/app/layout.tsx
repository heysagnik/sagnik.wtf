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

const DOMAIN = "https://sagnik-wtf.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: "Sagnik Sahoo | Expert Product Designer & UI/UX Developer",
  description:
    "Sagnik Sahoo: Leading product designer and UI/UX developer crafting innovative, user-centric digital experiences and high-performance web applications. Discover my portfolio.",
  authors: [
    {
      name: "Sagnik Sahoo",
      url: DOMAIN,
    },
  ],
  creator: "Sagnik Sahoo",
  keywords: [
    "Sagnik Sahoo",
    "Product Designer",
    "UI/UX Developer",
    "Frontend Engineer",
    "Interactive Design",
    "User Experience",
    "User Interface",
    "Web Design",
    "Portfolio",
    "Design Systems",
    "React Developer",
    "NextJS Developer",
    "Web Applications",
    "Digital Products",
  ],
  publisher: "Sagnik Sahoo",
  category: "Technology",
  openGraph: {
    type: "profile",
    firstName: "Sagnik",
    lastName: "Sahoo",
    username: "heysagnik",
    gender: "male",
    locale: "en_US",
    url: DOMAIN,
    title: "Sagnik Sahoo | Expert Product Designer & UI/UX Developer",
    description:
      "Sagnik Sahoo: Leading product designer and UI/UX developer crafting innovative, user-centric digital experiences. Explore my work.",
    siteName: "Sagnik Sahoo | Portfolio",
    images: [
      {
        url: `${DOMAIN}/og.png`,
        width: 1200,
        height: 630,
        alt: "Sagnik Sahoo - Product Designer & UI/UX Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagnik Sahoo | Expert Product Designer & UI/UX Developer",
    description:
      "Sagnik Sahoo: Leading product designer and UI/UX developer crafting innovative, user-centric digital experiences. Explore my work.",
    creator: "@heysagnik",
    images: [`${DOMAIN}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
    title: "Sagnik Sahoo | Portfolio",
    startupImage: [
      { url: `${DOMAIN}/apple-touch-startup-image-640x1136.png`, media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" },
      { url: `${DOMAIN}/apple-touch-startup-image-750x1334.png`, media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
    ],
  },
  applicationName: "Sagnik Sahoo | Portfolio",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "YOUR_GOOGLE_SITE_VERIFICATION_TOKEN",
  },
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
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sagnik Sahoo",
    url: DOMAIN,
    sameAs: [
      "https://twitter.com/heysagnik",
      "https://www.linkedin.com/in/heysagnik/", // Replace with your LinkedIn
      "https://github.com/heysagnik", // Replace with your GitHub
    ],
    jobTitle: "Product Designer & UI/UX Developer",
    description: "Experienced product designer and developer specializing in creating intuitive UI/UX, interactive interfaces, and modern web applications.",
    image: `${DOMAIN}/og.png`,
    worksFor: {
      "@type": "Organization",
      name: "Sagnik Sahoo"
    },
    alumniOf: [
      // {
      //   "@type": "CollegeOrUniversity",
      //   "name": "Your University Name"
      // }
    ],
    knowsAbout: [
      "Product Design", "UI/UX Design", "Frontend Development", "Web Development",
      "Interactive Design", "Design Systems", "React", "Next.js", "User Experience", "User Interface"
    ],
    gender: "Male",
    nationality: "Indian"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sagnik Sahoo | Portfolio",
    url: DOMAIN,
    publisher: {
      "@type": "Person",
      name: "Sagnik Sahoo",
      url: DOMAIN
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${DOMAIN}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    description: "Portfolio of Sagnik Sahoo, a product designer and UI/UX developer.",
  };


  return (
    <html lang="en" className="h-full dark">
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
          id="schema-org-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          id="schema-org-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}
