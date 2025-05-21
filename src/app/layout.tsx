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
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ 
            __html: `

             
(function() {
  console.log('[Analytics] Script Initializing (Ignoring DNT)...');
  const config = {
    endpoint: "https://diy-analytics.vercel.app/api/track",
    sessionTimeout: 20 * 60 * 1000
  };
  console.log('[Analytics] Config:', config);
  
  let currentUrl = location.href;
  let sessionId = getSessionId();
  let lastActivityTime = Date.now();
  
  function getSessionId() {
    if (localStorage.getItem('_ia_optout')) {
      console.log('[Analytics] Opt-out flag is set. No session ID.');
      return null;
    }
    let id = sessionStorage.getItem('_ia_sid');
    if (!id) {
      id = Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('_ia_sid', id);
      console.log('[Analytics] New session ID created:', id);
    } else {
      console.log('[Analytics] Existing session ID found:', id);
    }
    return id;
  }
  
  function refreshSession() {
    const now = Date.now();
    if (now - lastActivityTime > config.sessionTimeout) {
      console.log('[Analytics] Session timeout. Refreshing session ID.');
      sessionId = Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('_ia_sid', sessionId);
    }
    lastActivityTime = now;
  }
  
  ["mousedown", "keydown", "touchstart", "scroll"].forEach(eventType => {
    window.addEventListener(eventType, refreshSession, { passive: true });
  });
  
  function trackPageView() {
    // Removed navigator.doNotTrack check here
    console.log('[Analytics] trackPageView called. SessionID:', sessionId);
    if (!sessionId) { // Still check for sessionId and opt-out
      console.log('[Analytics] Tracking conditions (no sessionID or opt-out) not met. Exiting trackPageView.');
      return;
    }
    
    refreshSession();
    
    const payload = {
      type: "pageview",
      domain: location.hostname,
      url: location.href,
      path: location.pathname,
      referrer: document.referrer || null,
      utmSource: new URLSearchParams(window.location.search).get('utm_source'),
      utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
      utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
      utmTerm: new URLSearchParams(window.location.search).get('utm_term'),
      utmContent: new URLSearchParams(window.location.search).get('utm_content'),
      sessionId: sessionId,
      timestamp: Date.now()
    };
    console.log('[Analytics] Payload to send:', payload);
    sendPayload(payload);
  }
  
  function sendPayload(data) {
    const jsonData = JSON.stringify(data);
    console.log('[Analytics] Attempting to send payload. Endpoint:', config.endpoint);
    
    // Add this line to show the exact request format
    console.log('[Analytics] Full request URL:', config.endpoint);
    
    // Try fetch API for more reliable error reporting
    fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData,
    })
    .then(response => {
      
      return response.json();
    })
    .then(data => console.log('[Analytics] Fetch response:', data))
    .catch(error => {
      console.error('[Analytics] Fetch error:', error);
      // Fall back to original methods
      if (navigator.sendBeacon) {
        try {
          console.log('[Analytics] Using navigator.sendBeacon.');
          if (navigator.sendBeacon(config.endpoint, jsonData)) {
            console.log('[Analytics] sendBeacon call successful (queued).');
            return;
          } else {
            console.warn('[Analytics] sendBeacon call returned false (not queued). Falling back.');
          }
        } catch (error) {
          console.error('[Analytics] sendBeacon error. Falling back.', error);
        }
      } else {
        console.log('[Analytics] navigator.sendBeacon not available. Using image fallback.');
      }
      
      const img = new Image();
      img.onload = () => console.log('[Analytics] Image fallback: request likely sent (onload).');
      img.onerror = () => console.error('[Analytics] Image fallback: request error (onerror).');
      img.src = config.endpoint + "?d=" + encodeURIComponent(jsonData);
      console.log('[Analytics] Image fallback src:', img.src);
    });
  }
  
  function handleNavigationChange() {
    if (currentUrl !== location.href) {
      console.log('[Analytics] Navigation detected. Old URL:', currentUrl, 'New URL:', location.href);
      currentUrl = location.href;
      setTimeout(trackPageView, 100);
    }
  }
  
  function initializeAnalytics() {
    console.log('[Analytics] Initializing analytics interface...');
    window.insightAnalytics = {
      optOut: function() {
        localStorage.setItem('_ia_optout', '1');
        sessionStorage.removeItem('_ia_sid');
        sessionId = null;
        console.log('[Analytics] Opted out.');
        return "Analytics tracking disabled.";
      },
      optIn: function() {
        localStorage.removeItem('_ia_optout');
        console.log('[Analytics] Opted in.');
        sessionId = getSessionId(); 
        if (!sessionId) { 
          sessionId = Math.random().toString(36).substring(2, 10);
          sessionStorage.setItem('_ia_sid', sessionId);
        }
        trackPageView();
        return "Analytics tracking enabled.";
      },
      isOptedOut: function() {
        return !!localStorage.getItem('_ia_optout');
      }
    };
    
    // Removed navigator.doNotTrack check here
    console.log('[Analytics] Checking initial tracking conditions. OptOutFlag:', localStorage.getItem('_ia_optout'));
    if (!localStorage.getItem('_ia_optout')) { // Only check for opt-out
      console.log('[Analytics] Initial trackPageView call (DNT Ignored).');
      trackPageView();
      
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function() {
        originalPushState.apply(this, arguments);
        handleNavigationChange();
      };
      
      history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        handleNavigationChange();
      };
      
      window.addEventListener('popstate', handleNavigationChange);
      
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          refreshSession();
        }
      });
    } else {
      console.log('[Analytics] Initial tracking conditions (opt-out) not met. No initial pageview track.');
    }
  }
  
  initializeAnalytics();
  console.log('[Analytics] Script Fully Initialized.');
})();



            `
          }}
        />
      </body>
    </html>
  );
}