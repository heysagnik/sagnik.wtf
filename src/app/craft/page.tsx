import { Metadata } from "next";
import CraftPageClient from "./CraftPageClient";
import { DOMAIN } from "../metadata";

export const metadata: Metadata = {
  title: "Craft & Projects | Sagnik Sahoo — Full-Stack Developer",
  description:
    "Explore web applications, interactive components, mobile apps, and developer tools built by Sagnik Sahoo. Highlights include Phisguard, Doctor Booking, and ScreenREC.",
  keywords: [
    "Sagnik Sahoo Projects",
    "Sagnik Sahoo Craft",
    "Phisguard App",
    "Doctor Booking App",
    "ScreenREC",
    "Linkees",
    "React Projects",
    "UI/UX Portfolio",
    "Frontend Showcase"
  ],
  alternates: {
    canonical: `${DOMAIN}/craft`,
  },
  openGraph: {
    type: "website",
    url: `${DOMAIN}/craft`,
    title: "Craft & Projects | Sagnik Sahoo — Full-Stack Developer",
    description:
      "Explore web applications, interactive components, mobile apps, and developer tools built by Sagnik Sahoo.",
    images: [
      {
        url: `${DOMAIN}/og.png`,
        width: 1200,
        height: 630,
        alt: "Sagnik Sahoo - Portfolio Projects & Craft Showcase",
      },
    ],
    siteName: "Sagnik Sahoo Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Craft & Projects | Sagnik Sahoo — Full-Stack Developer",
    description:
      "Explore web applications, interactive components, mobile apps, and developer tools built by Sagnik Sahoo.",
    creator: "@heysagnik",
    images: [`${DOMAIN}/og.png`],
  },
};

export default function CraftPage() {
  return <CraftPageClient />;
}