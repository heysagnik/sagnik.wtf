"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CornerUpLeft } from "lucide-react";

interface GridItem {
  id: string;
  title: string;
  date: string;
  media: {
    type: "image" | "video";
    src: string;
    alt?: string;
  };
}

const GRID_ITEMS: GridItem[] = [
  {
    id: "sidebar",
    title: "Sidebar",
    date: "February 2025",
    media: {
      type: "video",
      src: "https://cdn.rauno.me/sidebar.mp4#t=0.01"
    }
  },
  {
    id: "nextjs-dev-tools",
    title: "Next.js Dev Tools",
    date: "February 2025",
    media: {
      type: "video",
      src: "/videos/nextjs-demo.mp4"
    }
  },
  {
    id: "inline-conversion",
    title: "Inline Conversion",
    date: "November 2024",
    media: {
      type: "image",
      src: "/images/inline-conversion.jpg",
      alt: "Inline conversion example"
    }
  }
];

export default function CraftPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div 
        className="mx-auto scrollable-content" 
        style={{ 
          maxWidth: "500px", 
          height: "100vh",
          overflowY: "auto", 
          paddingTop: "20px",
          paddingBottom: "40px",
          paddingLeft: "16px",
          paddingRight: "16px"
        }}
      >
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-neutral-400 hover:text-neutral-100 py-4 transition-colors"
        >
          <CornerUpLeft className="w-4 h-4" />
          <span className="ml-2 text-sm">Back</span>
        </button>

        {/* Spacer */}
        <div className="h-12" />

        {/* Grid Items */}
        <div className="space-y-8">
          {GRID_ITEMS.map((item) => (
            <GridCard key={item.id} item={item} />
          ))}
        </div>

        {/* Hidden Scrollbar Styles */}
        <style jsx global>{`
          .scrollable-content {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollable-content::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}

function GridCard({ item }: { item: GridItem }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="group">
      {/* Media Container */}
      <div 
        className="relative w-full bg-neutral-900 rounded-lg overflow-hidden mb-3"
        style={{ aspectRatio: "1.32046 / 1" }}
      >
        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neutral-600 border-t-neutral-400 rounded-full animate-spin" />
          </div>
        )}
        
        {item.media.type === "image" ? (
          <Image
            src={item.media.src}
            alt={item.media.alt || item.title}
            fill
            className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="500px"
            onLoadingComplete={() => setIsLoaded(true)}
          />
        ) : (
          <video
            src={item.media.src}
            playsInline
            loop
            autoPlay
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoadedData={() => setIsLoaded(true)}
          />
        )}
      </div>

      {/* Title and Date */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-100">
          {item.title}
        </h3>
        <span className="text-sm text-neutral-500">
          {item.date}
        </span>
      </div>
    </div>
  );
}