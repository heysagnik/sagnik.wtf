"use client";

import { useState, useCallback, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CornerUpLeft } from "lucide-react";

// Types
interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

interface GridItem {
  id: string;
  title: string;
  date: string;
  media: MediaItem | MediaItem[];
  category: "web" | "mobile" | "design";
}

// Configuration
const CONFIG = {
  layout: {
    maxWidth: "540px",
    padding: {
      top: "20px",
      bottom: "60px",
      horizontal: "20px"
    },
    spacing: {
      grid: "40px",
      titleSection: "16px"
    }
  },
  media: {
    mobile: {
      width: "160px",
      height: "336px",
      gap: "12px"
    },
    web: {
      maxHeight: "580px",
      aspectRatio: "16 / 9"
    }
  },
  animation: {
    duration: "300ms",
    hoverScale: "1.01"
  }
};

// Data
const GRID_ITEMS: GridItem[] = [
  {
    id: "sidebar",
    title: "Sidebar",
    date: "February 2025",
    category: "web",
    media: {
      type: "video",
      src: "https://cdn.rauno.me/sidebar.mp4#t=0.01",
      alt: "Interactive sidebar component demo"
    }
  },
  {
    id: "nextjs-dev-tools",
    title: "Next.js Dev Tools",
    date: "February 2025",
    category: "web",
    media: {
      type: "video",
      src: "/chikki.mp4",
      alt: "Next.js developer tools visualization demo"
    }
  },
  {
    id: "phisguard-app",
    title: "Phisguard Phishing Protection App",
    date: "February 2025",
    category: "mobile",
    media: [
      {
        type: "image",
        src: "/projects/phisguard1.jpg",
        alt: "Phisguard anti-phishing app home dashboard"
      },
      {
        type: "image",
        src: "/projects/phisguard2.jpg",
        alt: "Phisguard real-time threat tracking interface"
      },
      {
        type: "image",
        src: "/projects/phisguard3.jpg",
        alt: "Phisguard detailed security analytics screen"
      }
    ]
  },
  {
    id: "doctor-booking-app",
    title: "Doctor Booking Healthcare App",
    date: "January 2025",
    category: "mobile",
    media: [
      {
        type: "image",
        src: "/projects/docq1.jpg",
        alt: "Doctor appointment booking home screen"
      },
      {
        type: "video",
        src: "https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/Wuw3QaTpbIaj3gEuqGhFJyK1asO2/newProfileItem/11daf7f9-25aa-47fe-8e73-b9cb64ebf20f.mp4?_a=DATAdtAAZAA0",
        alt: "AI doctor recommendation preview animation",
      },
      {
        type: "image",
        src: "/projects/docq3.jpg",
        alt: "Doctor specializations list"
      },
      {
        type: "image",
        src: "/projects/docq4.jpg",
        alt: "Search medical specialists interface"
      },
      {
        type: "image",
        src: "/projects/docq5.jpg",
        alt: "Doctor detailed profile and review screen"
      },
      {
        type: "image",
        src: "/projects/docq6.jpg",
        alt: "Select booking time slot screen"
      },
      {
        type: "image",
        src: "/projects/docq7.jpg",
        alt: "Confirm appointment screen"
      },
      {
        type: "image",
        src: "/projects/docq8.jpg",
        alt: "Payment and booking success confirmation"
      },
      {
        type: "image",
        src: "/projects/docq9.jpg",
        alt: "Upcoming doctor appointments dashboard"
      },
      {
        type: "image",
        src: "/projects/docq10.jpg",
        alt: "Patient settings profile"
      },
      {
        type: "image",
        src: "/projects/docq11.jpg",
        alt: "Welcome onboarding screen"
      },
      {
        type: "image",
        src: "/projects/docq12.jpg",
        alt: "User login screen"
      },
      {
        type: "image",
        src: "/projects/docq13.jpg",
        alt: "User signup screen"
      }
    ]
  },
  {
    id: "screenrec",
    title: "ScreenREC Web Screen Recorder",
    date: "December 2021",
    category: "web",
    media: {
      type: "image",
      src: "/projects/screenrec.png",
      alt: "ScreenREC web screen recorder tool interface"
    }
  },
  {
    id: "linkees",
    title: "Linkees Bio Link Platform",
    date: "February 2022",
    category: "web",
    media: {
      type: "image",
      src: "/projects/linkees.png",
      alt: "Linkees bio link aggregator web application"
    },
  },
];

// Utility Functions
const isClusteredMedia = (media: MediaItem | MediaItem[]): media is MediaItem[] => {
  return Array.isArray(media);
};

const getMediaAspectRatio = (category: string) => {
  return category === "web" ? CONFIG.media.web.aspectRatio : "9 / 16";
};

// Custom Hooks
const useMediaLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const handleLoad = useCallback(() => setIsLoaded(true), []);
  
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);
  
  return { isLoaded, hasError, handleLoad, handleError };
};

// Components
const LoadingSpinner = memo(({ size = "w-6 h-6" }: { size?: string }) => (
  <div className="absolute inset-0 bg-neutral-800/80 flex items-center justify-center backdrop-blur-sm">
    <div className={`${size} border-2 border-neutral-600 border-t-neutral-300 rounded-full animate-spin`} />
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

const VideoPlayer = memo(({ 
  src,  
  className = "", 
  onLoad,
  onError
}: { 
  src: string; 
  alt?: string; 
  className?: string; 
  onLoad: () => void;
  onError: () => void;
}) => (
  <video
    src={src}
    playsInline
    loop
    autoPlay
    muted
    preload="metadata"
    className={`w-full h-full object-cover ${className}`}
    onCanPlay={onLoad}
    onError={onError}
  >
    <source src={src} type="video/mp4" />
  </video>
));
VideoPlayer.displayName = 'VideoPlayer';

const MediaErrorFallback = memo(() => (
  <div className="w-full h-full bg-neutral-800/50 flex items-center justify-center">
    <span className="text-neutral-400 text-sm">Media unavailable</span>
  </div>
));
MediaErrorFallback.displayName = 'MediaErrorFallback';

const MediaContent = memo(({ 
  media, 
  title, 
  index = 0, 
  className = "",
  style = {}
}: { 
  media: MediaItem; 
  title: string; 
  index?: number; 
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { isLoaded, hasError, handleLoad, handleError } = useMediaLoader();
  const isImage = media.type === "image";

  return (
    <div className={`relative bg-neutral-900/90 rounded-lg overflow-hidden ${className}`} style={style}>
      {!isLoaded && <LoadingSpinner />}
      
      {hasError ? (
        <MediaErrorFallback />
      ) : isImage ? (
        <Image
          src={media.src}
          alt={media.alt || `${title} screenshot ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="140px"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <VideoPlayer
          src={media.src}
          alt={media.alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
});
MediaContent.displayName = 'MediaContent';

const MobileScreenshot = memo(({ 
  media, 
  title, 
  index 
}: { 
  media: MediaItem; 
  title: string; 
  index: number; 
}) => (
  <MediaContent
    media={media}
    title={title}
    index={index}
    className="flex-shrink-0 shadow-md"
    style={{ 
      width: CONFIG.media.mobile.width, 
      height: CONFIG.media.mobile.height,
      borderRadius: "12px"
    }}
  />
));
MobileScreenshot.displayName = 'MobileScreenshot';

const MobileCluster = memo(({ item }: { item: GridItem }) => {
  const mediaArray = item.media as MediaItem[];

  return (
    <div className="w-full bg-neutral-900/40 rounded-lg p-4 backdrop-blur-sm">
      <div className="horizontal-scroll overflow-x-auto pb-1">
        <div 
          className="flex pb-2" 
          style={{ 
            width: 'max-content',
            gap: CONFIG.media.mobile.gap
          }}
        >
          {mediaArray.map((media, index) => (
            <MobileScreenshot 
              key={`${item.id}-${index}`}
              media={media}
              title={item.title}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
MobileCluster.displayName = 'MobileCluster';

const SingleMedia = memo(({ item }: { item: GridItem }) => {
  const { isLoaded, hasError, handleLoad, handleError } = useMediaLoader();
  const media = item.media as MediaItem;
  const isWebCategory = item.category === "web";

  return (
    <div 
      className="relative w-full bg-neutral-900/80 rounded-lg overflow-hidden shadow-md"
      style={{ 
        aspectRatio: isWebCategory ? CONFIG.media.web.aspectRatio : getMediaAspectRatio(item.category),
        maxHeight: isWebCategory ? CONFIG.media.web.maxHeight : undefined
      }}
    >
      {!isLoaded && <LoadingSpinner />}
      
      {hasError ? (
        <MediaErrorFallback />
      ) : media.type === "image" ? (
        <Image
          src={media.src}
          alt={media.alt || item.title}
          fill={true}
          className={`${isWebCategory ? 'object-contain' : 'object-cover'} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="(max-width: 540px) 100vw, 540px" 
          onLoad={handleLoad}
          onError={handleError}
          priority={true}
        />
      ) : (
        <VideoPlayer
          src={media.src}
          alt={media.alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
});
SingleMedia.displayName = 'SingleMedia';

const ProjectMetadata = memo(({ title, date, category }: { title: string; date: string; category: string }) => (
  <div className="flex items-center justify-between mt-3">
    <div>
      <h2 className="text-base font-medium text-neutral-100">
        {title}
      </h2>
      <span className="text-xs text-neutral-400 uppercase tracking-wider">
        {category}
      </span>
    </div>
    <span className="text-sm text-neutral-500">
      {date}
    </span>
  </div>
));
ProjectMetadata.displayName = 'ProjectMetadata';

const GridCard = memo(({ item }: { item: GridItem }) => (
  <article className="group transition-transform hover:scale-[1.01] duration-300">
    <div className="rounded-lg overflow-hidden">
      {isClusteredMedia(item.media) ? (
        <MobileCluster item={item} />
      ) : (
        <SingleMedia item={item} />
      )}
    </div>
    <ProjectMetadata title={item.title} date={item.date} category={item.category} />
  </article>
));
GridCard.displayName = 'GridCard';

const BackButton = memo(({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="flex items-center text-neutral-400 hover:text-neutral-100 py-3 transition-colors"
    aria-label="Back to home page"
  >
    <CornerUpLeft className="w-4 h-4" />
    <span className="ml-2 text-sm">Back</span>
  </button>
));
BackButton.displayName = 'BackButton';

const PageTitle = memo(() => (
  <header className="mb-8">
    <h1 className="text-xl font-bold text-white mb-1">Craft & Projects</h1>
    <p className="text-sm text-neutral-400">A collection of web tools, mobile apps, and interactive components by Sagnik Sahoo</p>
  </header>
));
PageTitle.displayName = 'PageTitle';

const GlobalStyles = () => (
  <style jsx global>{`
    body {
      background-color: #0a0a0a;
      color: #fff;
    }
    .scrollable-content,
    .horizontal-scroll {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollable-content::-webkit-scrollbar,
    .horizontal-scroll::-webkit-scrollbar {
      display: none;
    }
  `}</style>
);

export default function CraftPageClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main 
        className="mx-auto scrollable-content" 
        style={{ 
          maxWidth: CONFIG.layout.maxWidth,
          height: "100vh",
          overflowY: "auto", 
          paddingTop: CONFIG.layout.padding.top,
          paddingBottom: CONFIG.layout.padding.bottom,
          paddingLeft: CONFIG.layout.padding.horizontal,
          paddingRight: CONFIG.layout.padding.horizontal
        }}
      >
        <BackButton onClick={() => router.back()} />
        
        <div style={{ height: CONFIG.layout.spacing.titleSection }} />
        
        <PageTitle />
        
        <section style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: CONFIG.layout.spacing.grid 
        }}>
          {GRID_ITEMS.map((item) => (
            <GridCard key={item.id} item={item} />
          ))}
        </section>
        
        <GlobalStyles />
      </main>
    </div>
  );
}
