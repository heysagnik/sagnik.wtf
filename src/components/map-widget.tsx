"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import type { Location } from "@/lib/types"
import type { DivIcon } from "leaflet" // Make sure this is included
import { useMap as useLeafletMap } from "react-leaflet"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

function MapControls() {
  const map = useLeafletMap()
  
  const handleZoomIn = useCallback(() => {
    map.zoomIn()
  }, [map])
  
  const handleZoomOut = useCallback(() => {
    map.zoomOut()
  }, [map])
  
  return (
    <div className="absolute bottom-16 right-3 z-[1000] flex flex-col space-y-2">
      <button 
        onClick={handleZoomIn}
        className="bg-white/90 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        aria-label="Zoom in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>
      <button 
        onClick={handleZoomOut}
        className="bg-white/90 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        aria-label="Zoom out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>
    </div>
  )
}

interface LeafletType {
  DivIcon: new (options: DivIconOptions) => DivIcon;
}

interface DivIconOptions {
  html: string;
  className: string;
  iconSize: [number, number];
  iconAnchor: [number, number];
  popupAnchor: [number, number];
}

const createCustomIcon = (L: LeafletType) => {
  return new L.DivIcon({
    html: `
      <div style="position: relative; width: 50px; height: 50px;">
        <!-- Shadow beneath pin -->
        <div style="
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 4px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          filter: blur(2px);
        "></div>
        
        <!-- Pin Leg -->
        <div style="
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 10px;
          background: linear-gradient(to bottom, #FF3B5C, #BC1F40);
          z-index: 1;
        "></div>
        
        <!-- Main pin body -->
        <div style="
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: 26px;
          height: 26px;
          background: linear-gradient(135deg, #FF3B5C 0%, #BC1F40 100%);
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3),
                    inset 0 -2px 0 rgba(0,0,0,0.1),
                    inset 2px 2px 0 rgba(255,255,255,0.2);
          z-index: 2;
          animation: pulsePin 2s infinite ease-out;
        "></div>
        
        <!-- Inner white circle -->
        <div style="
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          background: linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%);
          border-radius: 50%;
          box-shadow: inset 0 0 2px rgba(0,0,0,0.1);
          z-index: 3;
        "></div>
      </div>
      
      <style>
        @keyframes pulsePin {
          0% { transform: translateX(-50%) scale(1); }
          10% { transform: translateX(-50%) scale(1.1); }
          20% { transform: translateX(-50%) scale(1); }
          100% { transform: translateX(-50%) scale(1); }
        }
      </style>
    `,
    className: '',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -30]
  });
};

async function fetchLocationCoordinates(searchTerm: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchTerm
      )}&format=json&limit=1`
    );
    const data = await response.json();
    if (data && data[0]) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
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
  const [customIcon, setCustomIcon] = useState<DivIcon | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const initializeLocation = async () => {
      const L = await import("leaflet");
      setCustomIcon(createCustomIcon(L));
      try {
        if (location.coordinates) {
          const { lat, lng } = location.coordinates;
          setPosition([lat, lng]);
        } else if (location.city || location.name) {
          const searchTerm = location.city || location.name;
          const coords = await fetchLocationCoordinates(searchTerm!);
          if (coords) {
            setPosition([coords.lat, coords.lng]);
          }
        }
      } catch (error) {
        console.error("Error initializing location:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, [location]);

  const openDirections = useCallback(() => {
    if (!position) return;
    
    const destination = location.name || location.city || `${position[0]},${position[1]}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  }, [position, location]);

  return (
    <div className="mt-2 rounded-xl overflow-hidden shadow-md relative" style={{ height: "252px" }}>
      <div className="absolute inset-0 z-10 pointer-events-none shadow-inner rounded-2xl" 
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
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-2.5 flex items-center justify-center shadow-md transition-all hover:shadow-lg hover:from-blue-600 hover:to-blue-700 active:scale-[0.98] relative overflow-hidden"
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
        <MapContainer
          center={[position[0], position[1]]}
          zoom={17}
          zoomControl={false}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
          doubleClickZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {customIcon && (
            <Marker position={position} icon={customIcon}>
              <Popup className="apple-maps-popup">
                <div className="text-center">
                  <p className="font-semibold">{location.name || location.city}</p>
                  {location.city && location.name !== location.city && <p className="text-sm text-gray-600">{location.city}</p>}
                </div>
              </Popup>
            </Marker>
          )}
          
          <MapControls />
        </MapContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            {isLoading ? (
              <>
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-2"></div>
                <p className="text-sm text-gray-500">Loading map...</p>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-gray-500">Location not found</p>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="absolute top-0 left-0 z-[999] w-4 h-4 bg-gradient-radial from-white/30 to-transparent pointer-events-none rounded-tl-2xl"></div>
      <div className="absolute top-0 right-0 z-[999] w-4 h-4 bg-gradient-radial from-white/30 to-transparent pointer-events-none rounded-tr-2xl"></div>
    </div>
  )
}