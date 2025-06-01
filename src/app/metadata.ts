import type { Metadata } from "next";

export const DOMAIN = "https://sagnik-wtf.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: "Sagnik Sahoo | Full-Stack Software Developer & Interface Architect",
  description:
    "Expert software developer creating stunning web applications with React, Next.js, TypeScript & modern frontend architecture. View portfolio of high-performance, accessible digital experiences.",
  authors: [
    {
      name: "Sagnik Sahoo",
      url: DOMAIN,
    },
  ],
  creator: "Sagnik Sahoo",
  keywords: [
    // Primary keywords
    "Sagnik Sahoo",
    "Software Developer",
    "Frontend Engineer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",

    // Secondary keywords
    "TypeScript Expert",
    "JavaScript Specialist",
    "UI Developer",
    "Interface Designer",
    "Frontend Architect",
    "Web Application Developer",

    // Long-tail keywords
    "Custom React Component Developer",
    "Modern Web Applications Developer",
    "High-Performance Web Interfaces",
    "Responsive Design Expert",
    "User Experience Focused Developer",
    "Clean Code Practitioner",
    "Tailwind CSS Developer",
    "Frontend Performance Optimization",
    "Web Accessibility Specialist",
    "Interactive UI Developer",
    "Beautiful Digital Experiences",
    "React Hooks Expert",
    "API Integration Specialist",
    "State Management Expert",
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
    title: "Sagnik Sahoo | Full-Stack Software Developer & Interface Architect",
    description:
      "Discover the portfolio of Sagnik Sahoo, a software developer specializing in crafting beautiful web applications with React, Next.js & TypeScript. View projects demonstrating clean code, accessibility & stunning UIs.",
    siteName: "Sagnik Sahoo | Developer Portfolio",
    images: [
      {
        url: `${DOMAIN}/og.png`,
        width: 1200,
        height: 630,
        alt: "Sagnik Sahoo - Software Developer Portfolio featuring React and Next.js projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagnik Sahoo | Full-Stack Software Developer & Interface Architect",
    description:
      "Expert React & Next.js developer creating high-performance web applications with beautiful interfaces. View my portfolio of innovative digital experiences built with modern web technologies.",
    creator: "@heysagnik",
    images: [`${DOMAIN}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  verification: {
    google: "9DeudNztZelUduAow0vGahP",
    yandex: "e4d56f8fcfa8c002",
    other: {
      me: ["mailto:sahoosagnik1@gmail.com", "https://github.com/heysagnik"],
    },
  },
  alternates: {
    canonical: DOMAIN,
    languages: {
      "en-US": `${DOMAIN}/en-US`,
    },
    types: {
      "application/rss+xml": `${DOMAIN}/feed.xml`,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sagnik Sahoo | Developer Portfolio",
    startupImage: [
      {
        url: `${DOMAIN}/apple-touch-startup-image-640x1136.png`,
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: `${DOMAIN}/apple-touch-startup-image-750x1334.png`,
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  applicationName: "Sagnik Sahoo | Developer Portfolio",
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
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  archives: [`${DOMAIN}/projects`],
  bookmarks: [`${DOMAIN}/projects`],
  assets: [`${DOMAIN}/assets`],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark light",
};