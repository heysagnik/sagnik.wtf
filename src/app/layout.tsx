import { Poppins } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Script from "next/script";
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
    name: "Sagnik Sahoo",
    url: DOMAIN,
    sameAs: [
      "https://twitter.com/heysagnik",
      "https://www.linkedin.com/in/heysagnik/",
      "https://github.com/heysagnik",
      "https://dribbble.com/heysagnik",
      "https://medium.com/@heysagnik",
    ],
    jobTitle: "Product Designer & UI/UX Developer",
    description: "Experienced product designer and developer specializing in creating intuitive UI/UX, interactive interfaces, and modern web applications.",
    image: `${DOMAIN}/og.png`,
    worksFor: {
      "@type": "Organization",
      name: "Sagnik Sahoo"
    },
    alumniOf: [],
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

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sagnik Sahoo's Portfolio",
    description: "Showcasing the design and development work of Sagnik Sahoo",
    url: `${DOMAIN}/projects`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: []
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
          id="schema-org-portfolio"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
        />
        <Script
          id="analytics-script"
          src="https://raw.githubusercontent.com/heysagnik/track-script/refs/heads/main/script.js"
          async
          defer
        />
      </body>
    </html>
  );
}