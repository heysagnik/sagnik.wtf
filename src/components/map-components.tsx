"use client"

import { useState, useCallback, useEffect, memo } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import type { DivIcon } from "leaflet"

interface MapControlsProps {
  className?: string;
}

export const MapControls = memo(({ className = "" }: MapControlsProps) => {
  const map = useMap();
  
  const handleZoomIn = useCallback(() => {
    map.zoomIn();
  }, [map]);
  
  const handleZoomOut = useCallback(() => {
    map.zoomOut();
  }, [map]);
  
  return (
    <div className={`absolute bottom-16 right-3 z-[1000] flex flex-col space-y-2 ${className}`}>
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
  );
});

MapControls.displayName = "MapControls";

interface MapWrapperProps {
  position: [number, number];
  locationName?: string;
  locationCity?: string;
}

// Import the proper type for Leaflet

export const MapWrapper = memo(({ position, locationName, locationCity }: MapWrapperProps) => {
  // Remove the unused L state variable
  const [customIcon, setCustomIcon] = useState<DivIcon | null>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const leaflet = await import("leaflet");
        
        const icon = new leaflet.DivIcon({
          html: `
            <div class="map-marker">
              <div class="map-marker-shadow"></div>
              <div class="map-marker-pin"></div>
              <div class="map-marker-body"></div>
              <div class="map-marker-center"></div>
            </div>
          `,
          className: '',
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [0, -40]
        });
        
        setCustomIcon(icon);
      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };
    
    loadLeaflet();
  }, []);

  return (
    <>
      <style jsx global>{`
        .map-marker {
          position: relative;
          width: 30px;
          height: 42px;
        }
        .map-marker-shadow {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 3px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          filter: blur(1px);
        }
        .map-marker-pin {
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 8px;
          background: #d11b40;
          z-index: 1;
        }
        .map-marker-body {
          position: absolute;
          bottom: 11px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: #ff3b5c;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          z-index: 2;
          animation: pulsePin 2s infinite ease-out;
        }
        .map-marker-center {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          z-index: 3;
        }
        @keyframes pulsePin {
          0% { transform: translateX(-50%) scale(1); }
          10% { transform: translateX(-50%) scale(1.1); }
          20% { transform: translateX(-50%) scale(1); }
          100% { transform: translateX(-50%) scale(1); }
        }
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
        .leaflet-popup-content {
          margin: 10px 14px;
          line-height: 1.4;
        }
      `}</style>
      <MapContainer
        center={position}
        zoom={17}
        zoomControl={false}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
        doubleClickZoom={false}
        placeholder={<div className="h-full w-full bg-gray-100 animate-pulse" />}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {customIcon && (
          <Marker position={position} icon={customIcon}>
            <Popup className="apple-maps-popup">
              <div className="text-center">
                <p className="font-semibold">{locationName || locationCity}</p>
                {locationCity && locationName !== locationCity && (
                  <p className="text-sm text-gray-600">{locationCity}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        
        <MapControls />
      </MapContainer>
    </>
  );
});

MapWrapper.displayName = "MapWrapper";