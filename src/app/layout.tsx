import { Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import {Analytics} from "@vercel/analytics/next";
import { DOMAIN, metadata as appMetadata, viewport as appViewport } from "./metadata";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = appMetadata;
export const viewport = appViewport;


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${DOMAIN}/#person`,
    name: "Sagnik Sahoo",
    givenName: "Sagnik",
    familyName: "Sahoo",
    alternateName: ["heysagnik", "Sagnik"],
    url: DOMAIN,
    sameAs: [
      "https://twitter.com/heysagnik",
      "https://www.linkedin.com/in/heysagnik/",
      "https://github.com/heysagnik",
      "https://dribbble.com/heysagnik",
      "https://medium.com/@heysagnik",
    ],
    jobTitle: "Full-Stack Software Developer & Interface Architect",
    description: "Full-stack software developer and product designer creating high-performance web applications with React, Next.js & TypeScript.",
    image: `${DOMAIN}/og.png`,
    knowsAbout: [
      "Product Design", "UI/UX Design", "Frontend Development", "Web Development",
      "TypeScript", "React", "Next.js", "Tailwind CSS", "Design Systems", "Web Architecture", "Software Engineering"
    ],
    email: "mailto:sahoosagnik1@gmail.com",
    gender: "Male",
    nationality: "Indian"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${DOMAIN}/#website`,
    name: "Sagnik Sahoo | Developer & Interface Architect",
    alternateName: ["sagnik-wtf", "Sagnik Sahoo Portfolio"],
    url: DOMAIN,
    publisher: {
      "@id": `${DOMAIN}/#person`
    },
    description: "Portfolio of Sagnik Sahoo, showcasing full-stack projects, UI/UX designs, and technical articles.",
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${DOMAIN}/#profilepage`,
    url: DOMAIN,
    name: "Sagnik Sahoo Profile & Portfolio",
    mainEntity: {
      "@id": `${DOMAIN}/#person`
    }
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${DOMAIN}/#craftpage`,
    name: "Sagnik Sahoo's Projects & Crafts",
    description: "Showcasing web applications, mobile tools, and design projects by Sagnik Sahoo.",
    url: `${DOMAIN}/craft`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Sidebar Component",
          url: `${DOMAIN}/craft`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Phisguard Security App",
          url: `${DOMAIN}/craft`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Doctor Booking App",
          url: `${DOMAIN}/craft`
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "ScreenREC",
          url: `${DOMAIN}/craft`
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "Linkees",
          url: `${DOMAIN}/craft`
        }
      ]
    }
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
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" hrefLang="en" href={DOMAIN} />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="google-site-verification" content="9DeudNztZelUduAow0vGahP-8zLV5mk9f1JZ4_8CVVk" />
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
        <Script
          id="schema-org-profile"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
        />
        <Script
          id="schema-org-portfolio"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
        />
        <Script
          id="analytics-script"
          src="https://my-github-cdn.vercel.app/api/cdn?file=script.js"
          strategy="afterInteractive"
        />
        <Analytics />
      </body>
    </html>
  );
}