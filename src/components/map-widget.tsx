"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import type { Location } from "@/lib/types"

const locationCache = new Map<string, {lat: number, lng: number}>();

const MapWrapper = dynamic(() => import("./map-components").then(mod => mod.MapWrapper), {
  ssr: false,
  loading: () => <MapPlaceholder isLoading={true} />
});

function MapPlaceholder({ isLoading = true, error = false }: { isLoading?: boolean, error?: boolean }) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        {isLoading ? (
          <>
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-2"></div>
            <p className="text-sm text-gray-500">Loading map...</p>
          </>
        ) : error ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm text-gray-500">Location not found</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

async function fetchLocationCoordinates(searchTerm: string) {
  const cacheKey = searchTerm.toLowerCase();
  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchTerm
      )}&format=json&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch location: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data && data[0]) {
      const { lat, lon } = data[0];
      const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
      locationCache.set(cacheKey, coords);
      return coords;
    }
    return null;
  } catch (error) {
    console.error("Error fetching location coordinates:", error);
    return null;
  }
}

export default function MapWidget({ location }: { location: Location }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const initializeLocation = async () => {
      try {
        if (location.coordinates) {
          const { lat, lng } = location.coordinates;
          setPosition([lat, lng]);
        } else if (location.city || location.name) {
          const searchTerm = location.city || location.name;
          const coords = await fetchLocationCoordinates(searchTerm!);
          if (coords) {
            setPosition([coords.lat, coords.lng]);
          } else {
            setHasError(true);
          }
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error("Error initializing location:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
    
    return () => {
      // Clean up any potential memory leaks
    };
  }, [location]);

  const openDirections = useCallback(() => {
    if (!position) return;
    
    const destination = location.name || location.city || `${position[0]},${position[1]}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [position, location]);

  return (
    <div className="mt-2 rounded-xl overflow-hidden shadow-md relative" style={{ height: "252px" }}>
      <link rel="preconnect" href="https://tile.openstreetmap.org" />
      
      <div className="absolute inset-0 z-5 pointer-events-none shadow-inner rounded-2xl" 
           style={{ 
             boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.1)",
             background: "linear-gradient(to bottom, transparent 90%, rgba(0,0,0,0.05))"
           }}>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[1000]">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        
        <div className="bg-white/85 backdrop-blur-md px-1 py-1 border-t border-white/30 shadow-sm">
          <button 
            onClick={openDirections}
            disabled={!position}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-2.5 flex items-center justify-center shadow-md transition-all hover:shadow-lg hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] relative overflow-hidden disabled:opacity-50 disabled:pointer-events-none"
            aria-label={`Get directions to ${location.name || location.city || 'this location'}`}
          >
            <span className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></span>
            <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></span>
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
            
            <span className="flex items-center justify-center relative">
              <div className="mr-2 bg-white/30 backdrop-blur-sm p-1 rounded-full shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                <g transform="scale(-1,1) translate(-256,0)">
                  <rect width="256" height="256" fill="none"/>
                  <path d="M152,152,234.35,129a8,8,0,0,0,.27-15.21l-176-65.28A8,8,0,0,0,48.46,58.63l65.28,176a8,8,0,0,0,15.21-.27Z" fill="#ffffff" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
                </g>
              </svg></div>
              <span className="font-medium tracking-wide text-sm">Directions</span>
            </span>
          </button>
        </div>
      </div>
      
      {position ? (
        <MapWrapper 
          position={position}
          locationName={location.name}
          locationCity={location.city}
        />
      ) : (
        <MapPlaceholder isLoading={isLoading} error={hasError} />
      )}
      
      <div className="absolute top-0 left-0 z-[999] w-4 h-4 bg-gradient-radial from-white/30 to-transparent pointer-events-none rounded-tl-2xl"></div>
      <div className="absolute top-0 right-0 z-[999] w-4 h-4 bg-gradient-radial from-white/30 to-transparent pointer-events-none rounded-tr-2xl"></div>
    </div>
  );
}