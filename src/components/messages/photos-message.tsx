import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types"; 
import { motion, AnimatePresence } from "framer-motion";

const Z_INDICES = {
  MODAL_OVERLAY: 9990,
  MODAL_CONTENT: 9995,
  MODAL_CONTROLS: 9997,
  MODAL_BACKDROP: 9985,
};

const ANIMATION_SETTINGS = {
  duration: 0.25,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

const IMAGE_SIZES = {
  single: { height: "200px", minHeight: "200px" },
  double: { height: "140px", minHeight: "140px" },
  triple: { height: "110px", minHeight: "110px" },
  quad: { height: "110px", minHeight: "110px" },
  multiple: { height: "90px", minHeight: "90px" },
};

const isVideoFile = (src: string): boolean => {
  if (!src) return false;
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.avi'];
  return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
};

const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

interface PhotosMessageProps {
  content?: string;
  photos: Photo[];
  bubbleClass: string;
  bubbleMaxWidth: string;
}

const useImageLoading = (photos: Photo[]) => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isLoaded, setIsLoaded] = useState<Record<number, boolean>>({});
  
  const handleImageError = useCallback((index: number) => {
    console.error(`Failed to load image at index ${index}:`, photos[index]?.src);
    console.error("Check that file exists at:", photos[index]?.src);
    setImageErrors(prev => ({...prev, [index]: true}));
  }, [photos]);
  
  useEffect(() => {
    if (!photos || photos.length === 0) {
      console.error("PhotosMessage: No photos provided");
      return;
    }
    
    const preloadImages = async () => {
      const chunks = chunkArray([...photos], 3);
      
      for (const chunk of chunks) {
        await Promise.allSettled(
          chunk.map((photo) => {
            const actualIndex = photos.indexOf(photo);
            
            if (!photo.src) {
              console.error(`PhotosMessage: Missing src for photo at index ${actualIndex}`);
              setImageErrors(prev => ({...prev, [actualIndex]: true}));
              return Promise.reject();
            }
            
            if (isVideoFile(photo.src)) {
              return new Promise<void>((resolve, reject) => {
                const video = document.createElement('video');
                video.onloadeddata = () => {
                  setIsLoaded(prev => ({...prev, [actualIndex]: true}));
                  resolve();
                };
                video.onerror = () => {
                  handleImageError(actualIndex);
                  reject();
                };
                video.preload = "metadata";
                video.src = photo.src;
                video.load();
              });
            } else {
              return new Promise<void>((resolve, reject) => {
                const img = new window.Image();
                img.onload = () => {
                  setIsLoaded(prev => ({...prev, [actualIndex]: true}));
                  resolve();
                };
                img.onerror = () => {
                  handleImageError(actualIndex);
                  reject();
                };
                img.src = photo.src;
              });
            }
          })
        );
      }
    };
    
    preloadImages();
  }, [photos, handleImageError]);
  
  return { imageErrors, isLoaded, setIsLoaded, handleImageError };
};

const useVideoThumbnails = () => {
  const [videoThumbnails, setVideoThumbnails] = useState<Record<number, string>>({});
  
  const generateVideoThumbnail = useCallback((video: HTMLVideoElement, index: number) => {
    try {
      if (!video.videoWidth || !video.videoHeight) {
        setTimeout(() => generateVideoThumbnail(video, index), 100);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        if (video.duration) {
          video.currentTime = Math.min(0.5, video.duration * 0.1);
        }
        
        const captureFrame = () => {
          try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg');
            setVideoThumbnails(prev => ({...prev, [index]: thumbnailUrl}));
          } catch (err) {
            console.error(`Error capturing frame for video ${index}:`, err);
          }
        };
        
        if (video.duration) {
          video.addEventListener('seeked', captureFrame, { once: true });
        } else {
          captureFrame();
        }
      }
    } catch (error) {
      console.error(`Error generating thumbnail for video ${index}:`, error);
    }
  }, []);
  
  return { videoThumbnails, generateVideoThumbnail };
};

const useLightbox = (photos: Photo[]) => {
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const lightboxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoGridRef = useRef<HTMLDivElement>(null);
  
  const openLightbox = useCallback((photo: Photo, index: number, imageErrors: Record<number, boolean>) => {
    if (imageErrors[index]) {
      return;
    }
    setLightboxPhoto(photo);
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
    
    setTimeout(() => {
      lightboxRef.current?.focus();
    }, 100);
  }, []);

  const closeLightbox = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    setIsVideoPlaying(false);
    setLightboxPhoto(null);
    document.body.style.overflow = "auto";
    
    photoGridRef.current?.focus();
  }, []);

  const navigateImage = useCallback((direction: "next" | "prev") => {
    if (!photos.length) return;
    
    const newIndex = direction === "next" 
      ? (lightboxIndex + 1) % photos.length 
      : (lightboxIndex - 1 + photos.length) % photos.length;
    
    setLightboxIndex(newIndex);
    setLightboxPhoto(photos[newIndex]);
  }, [lightboxIndex, photos]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        navigateImage("prev");
        e.preventDefault();
        break;
      case "ArrowRight":
        navigateImage("next");
        e.preventDefault();
        break;
      case "Escape":
        closeLightbox();
        e.preventDefault();
        break;
    }
  }, [navigateImage, closeLightbox]);
  
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
    setIsDragging(true);
  }, []);
  
  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (startX === null || !isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    
    const resistance = 0.4;
    const isAtEdge = (diff > 0 && lightboxIndex === 0) || 
                     (diff < 0 && lightboxIndex === photos.length - 1);
    
    setOffsetX(isAtEdge ? diff * resistance : diff);
    
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [startX, isDragging, lightboxIndex, photos.length]);
  
  const handleTouchEnd = useCallback(() => {
    if (startX === null) return;
    
    const threshold = window.innerWidth * 0.2;
    
    if (Math.abs(offsetX) > threshold) {
      if (offsetX > 0) {
        navigateImage("prev");
      } else {
        navigateImage("next");
      }
    }
    
    setStartX(null);
    setOffsetX(0);
    setIsDragging(false);
  }, [startX, offsetX, navigateImage]);
  
  useEffect(() => {
    setOffsetX(0);
  }, [lightboxIndex]);
  
  const toggleVideoPlayback = useCallback(() => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => setIsVideoPlaying(true))
        .catch(err => console.error("Error playing video:", err));
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  }, []);

  useEffect(() => {
    setIsVideoPlaying(false);
  }, [lightboxIndex]);
  
  useEffect(() => {
    return () => {
      if (lightboxPhoto) {
        document.body.style.overflow = "auto";
      }
    };
  }, [lightboxPhoto]);
  
  return {
    lightboxPhoto,
    lightboxIndex,
    offsetX,
    isDragging,
    isVideoPlaying,
    lightboxRef,
    videoRef,
    photoGridRef,
    openLightbox,
    closeLightbox,
    navigateImage,
    handleKeyDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    toggleVideoPlayback,
    setLightboxIndex,
    setLightboxPhoto
  };
};

const PhotoGrid = ({ 
  photos, 
  imageErrors, 
  isLoaded, 
  videoThumbnails, 
  openLightbox, 
  photoGridRef,
  content,
  generateVideoThumbnail,
  handleImageError,
  setIsLoaded
}: {
  photos: Photo[],
  imageErrors: Record<number, boolean>,
  isLoaded: Record<number, boolean>,
  videoThumbnails: Record<number, string>,
  openLightbox: (photo: Photo, index: number) => void,
  photoGridRef: React.RefObject<HTMLDivElement | null>,
  content?: string,
  generateVideoThumbnail: (video: HTMLVideoElement, index: number) => void,
  handleImageError: (index: number) => void,
  setIsLoaded: React.Dispatch<React.SetStateAction<Record<number, boolean>>>
}) => {
  const gridLayout = useMemo(() => {
    switch (photos.length) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-[1fr_1fr_1fr]";
      case 4: return "grid-cols-2 grid-rows-2";
      default: return "grid-cols-3";
    }
  }, [photos.length]);
  
  const getPhotoStyle = useCallback(() => {
    let dimensions;
    
    switch(photos.length) {
      case 1: dimensions = IMAGE_SIZES.single; break;
      case 2: dimensions = IMAGE_SIZES.double; break;
      case 3: dimensions = IMAGE_SIZES.triple; break;
      case 4: dimensions = IMAGE_SIZES.quad; break;
      default: dimensions = IMAGE_SIZES.multiple;
    }
    
    return { 
      ...dimensions, 
      width: "100%",
      position: "relative" as const
    };
  }, [photos.length]);
  
  return (
    <div 
      ref={photoGridRef}
      className={`grid ${gridLayout} overflow-hidden`} 
      style={{gap: "1px"}}
      tabIndex={0}
      role="grid"
      aria-label={`Photo gallery with ${photos.length} photos`}
    >
      {photos.map((photo, index) => {
        const isFirst = index === 0;
        const isLast = index === photos.length - 1;
        const isTopLeft = isFirst;
        const isTopRight = photos.length === 2 ? isLast : index === 2;
        const isBottomLeft = photos.length === 3 ? false : photos.length === 4 && index === 2;
        const isBottomRight = photos.length > 2 && isLast;
        
        const roundedCorners = `
          ${isTopLeft && !content ? 'rounded-tl-[16px]' : ''} 
          ${isTopRight && !content ? 'rounded-tr-[16px]' : ''}
          ${isBottomLeft ? 'rounded-bl-[16px]' : ''}
          ${isBottomRight ? 'rounded-br-[16px]' : ''}
        `;
        
        const showMoreCount = isLast && photos.length > 4 && index === 3;
        
        return (
          <div
            key={index}
            className={`relative overflow-hidden ${roundedCorners} bg-gray-100 dark:bg-gray-800 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
            style={getPhotoStyle()}
            onClick={() => openLightbox(photo, index)}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(photo, index)}
            tabIndex={0}
            role="button"
            aria-label={`View photo ${index + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ''}`}
            data-testid={`photo-item-${index}`}
          >
            {!isLoaded[index] && !imageErrors[index] && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" 
                   aria-hidden="true" />
            )}
            
            {imageErrors[index] ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                  <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="sr-only">Media failed to load</span>
              </div>
            ) : index < 4 || photos.length <= 4 ? (
              <div className="w-full h-full">
                {isVideoFile(photo.src) ? (
                  <div className="relative w-full h-full">
                    <video
                      src={photo.src}
                      preload="metadata"
                      className="w-full h-full object-cover"
                      onLoadedMetadata={() => {
                        setIsLoaded(prev => ({...prev, [index]: true}));
                      }}
                      onLoadedData={(e) => {
                        generateVideoThumbnail(e.currentTarget, index);
                      }}
                      onError={() => handleImageError(index)}
                    />
                    {videoThumbnails[index] && (
                      <div className="absolute inset-0">
                        <Image
                          src={videoThumbnails[index]}
                          alt={photo.alt || `Video ${index + 1}`}
                          fill
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="11" fill="rgba(255,255,255,0.95)" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.2))" />
                        <path d="M16 12L10 16.5V7.5L16 12Z" fill="#000000" fillOpacity="0.8" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={photo.src}
                    alt={photo.alt || `Photo ${index + 1}`}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                    onLoad={() => setIsLoaded(prev => ({...prev, [index]: true}))}
                    onError={() => handleImageError(index)}
                    priority={index < 2}
                    sizes="(max-width: 500px) 100vw, 300px"
                    fetchPriority={index < 2 ? "high" : "auto"}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                )}
              </div>
            ) : showMoreCount ? (
              <>
                <div className="w-full h-full">
                  <Image
                    src={photo.src}
                    alt={photo.alt || `Photo ${index + 1}`}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover brightness-[0.6]"
                    onLoad={() => setIsLoaded(prev => ({...prev, [index]: true}))}
                    onError={() => handleImageError(index)}
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    +{photos.length - 4}
                  </span>
                </div>
              </>
            ) : null}
            
            {/* This caption block is removed from PhotoGrid
            {photo.caption && !imageErrors[index] && (
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-[10px] leading-tight truncate">
                  {photo.caption}
                </p>
              </div>
            )} */}
            
            <div 
              className="absolute inset-0 opacity-0 hover:opacity-100 bg-white/10 transition-opacity duration-200"
              aria-hidden="true"
            />
          </div>
        );
      })}
    </div>
  );
};

const PhotoLightbox = ({
  photos,
  lightboxPhoto,
  lightboxIndex,
  offsetX,
  isDragging,
  isVideoPlaying,
  videoThumbnails,
  lightboxRef,
  videoRef,
  closeLightbox,
  navigateImage,
  handleKeyDown,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  toggleVideoPlayback,
  setLightboxIndex,
  setLightboxPhoto
}: {
  photos: Photo[],
  lightboxPhoto: Photo | null,
  lightboxIndex: number,
  offsetX: number,
  isDragging: boolean,
  isVideoPlaying: boolean,
  videoThumbnails: Record<number, string>,
  lightboxRef: React.RefObject<HTMLDivElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  closeLightbox: () => void,
  navigateImage: (direction: "next" | "prev") => void,
  handleKeyDown: (e: React.KeyboardEvent) => void,
  handleTouchStart: (e: React.TouchEvent | React.MouseEvent) => void,
  handleTouchMove: (e: React.TouchEvent | React.MouseEvent) => void,
  handleTouchEnd: () => void,
  toggleVideoPlayback: () => void,
  setLightboxIndex: React.Dispatch<React.SetStateAction<number>>,
  setLightboxPhoto: React.Dispatch<React.SetStateAction<Photo | null>>
}) => {
  if (!lightboxPhoto) return null;
  
  return (
    <div 
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer - ${lightboxPhoto.alt || `Photo ${lightboxIndex + 1} of ${photos.length}`}`}
      style={{ zIndex: Z_INDICES.MODAL_BACKDROP }}
    >
      <motion.div
        ref={lightboxRef}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
        transition={ANIMATION_SETTINGS}
        className="w-full max-w-[500px] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-32px)]"
        style={{ zIndex: Z_INDICES.MODAL_CONTENT }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        data-testid="photo-lightbox"
      >
        <div className="h-12 flex items-center justify-between px-4 backdrop-blur-md bg-black/60 border-b border-white/10">
          <button
            onClick={closeLightbox}
            className="text-white/90 hover:text-white p-2 -ml-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
            aria-label="Close photo viewer"
            data-testid="lightbox-close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="flex items-center gap-6">
            <button
              aria-label="Save photo"
              className="text-white/90 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
            </button>
          </div>
        </div>
        
        <div 
          className="flex-1 relative flex items-center justify-center bg-black/30"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={isDragging ? handleTouchMove : undefined}
          onMouseUp={handleTouchEnd}
          onMouseLeave={isDragging ? handleTouchEnd : undefined}
          data-testid="lightbox-image-container"
        >
          <motion.div
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full flex items-center justify-center"
            style={{ transform: `translateX(${offsetX}px)` }}
          >
            <div className="relative w-full h-full">
              {isVideoFile(lightboxPhoto.src) ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={lightboxPhoto.src}
                    poster={videoThumbnails[lightboxIndex]}
                    className="w-full h-full object-contain"
                    onClick={toggleVideoPlayback}
                    onError={() => {
                      console.error(`Failed to load lightbox video: ${lightboxPhoto.src}`);
                    }}
                  />
                  
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={toggleVideoPlayback}
                  >
                    <div className={`bg-black/30 backdrop-blur-sm rounded-full p-4 transition-opacity ${isVideoPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                      {isVideoPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                      ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={lightboxPhoto.src}
                  alt={lightboxPhoto.alt || `Photo ${lightboxIndex + 1} of ${photos.length}`}
                  fill
                  sizes="(max-width: 500px) 100vw, 500px"
                  className="object-contain"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdgJngp6NkgAAAABJRU5ErkJggg=="
                  data-testid={`lightbox-image-${lightboxIndex}`}
                  fetchPriority="high"
                  onError={() => {
                    console.error(`Failed to load lightbox image: ${lightboxPhoto.src}`);
                  }}
                />
              )}
              {lightboxPhoto.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-center bg-gradient-to-t from-black/75 via-black/60 to-transparent pointer-events-none">
                  <p className="text-white text-sm sm:text-base leading-snug sm:leading-normal shadow-md">{lightboxPhoto.caption}</p>
                </div>
              )}
            </div>
          </motion.div>
          
          <div className="sr-only">
            Use arrow keys to navigate between photos. Press Escape to close the viewer.
          </div>
          
          {photos.length > 1 && (
            <>
              <div 
                className="absolute left-3 top-1/2 -translate-y-1/2 z-[9999] pointer-events-none"
                style={{ zIndex: Z_INDICES.MODAL_CONTROLS }}
              >
                <button 
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
                  className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 hover:text-white transition-all pointer-events-auto"
                  aria-label="Previous photo"
                  data-testid="lightbox-prev"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                </button>
              </div>
              
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 z-[9999] pointer-events-none"
                style={{ zIndex: Z_INDICES.MODAL_CONTROLS }}
              >
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigateImage("next");
                  }}
                  className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 hover:text-white transition-all pointer-events-auto"
                  aria-label="Next photo"
                  data-testid="lightbox-next"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </>
          )}
        </div>
        
        <div className="h-10 flex items-center justify-center backdrop-blur-md bg-black/60 border-t border-white/10">
          {photos.length > 1 && (
            <div 
              className="flex items-center"
              role="tablist"
              aria-label="Photo navigation"
            >
              {photos.map((_, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxPhoto(photos[idx]);
                  }}
                  className={`w-1.5 h-1.5 mx-0.5 rounded-full cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50`}
                  animate={{
                    backgroundColor: idx === lightboxIndex ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.3)',
                    scale: idx === lightboxIndex ? 1.2 : 1
                  }}
                  transition={{ duration: 0.2 }}
                  role="tab"
                  tabIndex={0}
                  aria-label={`View photo ${idx + 1}`}
                  aria-selected={idx === lightboxIndex ? "true" : "false"}
                  data-testid={`lightbox-indicator-${idx}`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
      
      <div 
        className="absolute inset-0" 
        onClick={closeLightbox}
        style={{ cursor: 'zoom-out', zIndex: Z_INDICES.MODAL_OVERLAY }}
        aria-hidden="true"
        data-testid="lightbox-overlay"
      />
    </div>
  );
};

export const PhotosMessage = ({
  content,
  photos,
  bubbleClass,
  bubbleMaxWidth
}: PhotosMessageProps) => {
  const { imageErrors, isLoaded, handleImageError, setIsLoaded } = useImageLoading(photos);
  const { videoThumbnails, generateVideoThumbnail } = useVideoThumbnails();
  const { 
    lightboxPhoto, lightboxIndex, offsetX, isDragging, isVideoPlaying,
    lightboxRef, videoRef, photoGridRef, openLightbox: openLightboxBase,
    closeLightbox, navigateImage, handleKeyDown, handleTouchStart,
    handleTouchMove, handleTouchEnd, toggleVideoPlayback,
    setLightboxIndex, setLightboxPhoto
  } = useLightbox(photos);
  
  const openLightbox = useCallback((photo: Photo, index: number) => {
    openLightboxBase(photo, index, imageErrors);
  }, [openLightboxBase, imageErrors]);
  
  const isUserBubble = bubbleClass.includes('bubble-sent');
  const isDarkMode = bubbleClass.includes('theme-dark');

  const photosBubbleClass = useMemo(() => `
    ${isUserBubble ? 'ios-photos-sent' : 'ios-photos-received'} 
    ${isDarkMode && !isUserBubble ? 'ios-photos-dark' : ''}
  `, [isUserBubble, isDarkMode]);
  
  return (
    <>
      <div 
        className={`photo-message-container ${photosBubbleClass} ${bubbleMaxWidth} overflow-hidden`} 
        data-photo-count={photos.length}
        data-testid="photo-message"
      >
        {content && (
          <div className="px-3 pt-2 pb-1">
            <p className="text-[14px] leading-tight">{content}</p>
          </div>
        )}
        
        <PhotoGrid 
          photos={photos}
          imageErrors={imageErrors}
          isLoaded={isLoaded}
          videoThumbnails={videoThumbnails}
          openLightbox={openLightbox}
          photoGridRef={photoGridRef}
          content={content}
          generateVideoThumbnail={generateVideoThumbnail}
          handleImageError={handleImageError}
          setIsLoaded={setIsLoaded}
        />
      </div>

      <AnimatePresence>
        {lightboxPhoto && (
          <PhotoLightbox
            photos={photos}
            lightboxPhoto={lightboxPhoto}
            lightboxIndex={lightboxIndex}
            offsetX={offsetX}
            isDragging={isDragging}
            isVideoPlaying={isVideoPlaying}
            videoThumbnails={videoThumbnails}
            lightboxRef={lightboxRef}
            videoRef={videoRef}
            closeLightbox={closeLightbox}
            navigateImage={navigateImage}
            handleKeyDown={handleKeyDown}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
            toggleVideoPlayback={toggleVideoPlayback}
            setLightboxIndex={setLightboxIndex}
            setLightboxPhoto={setLightboxPhoto}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .photo-message-container {
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 1px 1px rgba(0,0,0,0.08);
          transform: translateZ(0);
          will-change: transform;
        }

        .ios-photos-sent {
          background: #0b93f6;
          color: white;
        }

        .ios-photos-received {
          background: #e5e5ea;
          color: black;
        }

        .ios-photos-dark {
          background: #3C3C3E;
          color: white;
        }

        .photo-message-container p {
          margin: 0;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          will-change: opacity;
        }
        
        @keyframes sheen {
          100% { transform: translateX(100%); }
        }
        
        .ios-sheen::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-20deg);
          will-change: transform;
        }
        
        .ios-sheen:hover::after {
          animation: sheen 0.75s;
        }
        
        @media (max-width: 640px) {
          .photo-message-container [role="button"] {
            min-height: 44px;
          }
        }
        
        :focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        body:has([aria-modal="true"]) {
          overflow: hidden;
          padding-right: var(--scrollbar-width, 0);
        }
      `}</style>
    </>
  );
};