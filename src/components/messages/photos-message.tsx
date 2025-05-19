import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types"; 
import { motion, AnimatePresence } from "framer-motion";

// Constants to avoid magic numbers/strings
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

// Helper to detect if a photo src is a video
const isVideoFile = (src: string): boolean => {
  if (!src) return false;
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg', '.avi'];
  return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
};

export const PhotosMessage = ({
  content,
  photos,
  bubbleClass,
  bubbleMaxWidth
}: {
  content?: string;
  photos: Photo[];
  bubbleClass:string;
  bubbleMaxWidth: string;
}) => {
  // State management
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isLoaded, setIsLoaded] = useState<Record<number, boolean>>({});
  const [videoThumbnails, setVideoThumbnails] = useState<Record<number, string>>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Refs
  const photoGridRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle image error with better logging
  const handleImageError = useCallback((index: number) => {
    console.error(`Failed to load image at index ${index}:`, photos[index]?.src);
    console.error("Check that file exists at:", photos[index]?.src);
    setImageErrors(prev => ({...prev, [index]: true}));
  }, [photos]);

  // Validate and preload images
  useEffect(() => {
    if (!photos || photos.length === 0) {
      console.error("PhotosMessage: No photos provided");
      return;
    }
    
    // Validate and preload images in chunks to prevent browser overload
    const preloadImages = async () => {
      const chunks = chunkArray([...photos], 3);
      
      for (const chunk of chunks) {
        await Promise.allSettled(
          chunk.map((photo) => { // Changed idx to _ as it's not used
            const actualIndex = photos.indexOf(photo);
            
            if (!photo.src) {
              console.error(`PhotosMessage: Missing src for photo at index ${actualIndex}`);
              setImageErrors(prev => ({...prev, [actualIndex]: true}));
              return Promise.reject();
            }
            
            // Video preloading is different from image preloading
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
                // Just to start loading, not to play
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
    
    // Helper function to chunk array
    function chunkArray<T>(array: T[], chunkSize: number): T[][] {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    }
  }, [photos, handleImageError]); // Added handleImageError to dependency array
  
  // Grid layout based on photo count (iOS style)
  const gridLayout = useMemo(() => {
    switch (photos.length) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-[1fr_1fr_1fr]"; // Equal width columns
      case 4: return "grid-cols-2 grid-rows-2";
      default: return "grid-cols-3";
    }
  }, [photos.length]);
  
  // iOS-specific photo dimensions based on count
  const getPhotoStyle = useCallback(() => { // Removed unused 'index' parameter
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
  
  // Open the lightbox with the clicked photo
  const openLightbox = useCallback((photo: Photo, index: number) => {
    if (imageErrors[index]) {
      console.warn("Not opening lightbox for failed image");
      return;
    }
    setLightboxPhoto(photo);
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
    
    // Set focus on lightbox for keyboard navigation
    setTimeout(() => {
      lightboxRef.current?.focus();
    }, 100);
  }, [imageErrors]);

  // Close the lightbox
  const closeLightbox = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    setIsVideoPlaying(false);
    setLightboxPhoto(null);
    document.body.style.overflow = "auto";
    
    // Restore focus to the grid
    photoGridRef.current?.focus();
  }, []);

  // Navigate to another image
  const navigateImage = useCallback((direction: "next" | "prev") => {
    if (!photos.length) return;
    
    const newIndex = direction === "next" 
      ? (lightboxIndex + 1) % photos.length 
      : (lightboxIndex - 1 + photos.length) % photos.length;
    
    setLightboxIndex(newIndex);
    setLightboxPhoto(photos[newIndex]);
  }, [lightboxIndex, photos]);
  
  // Handle keyboard navigation
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
  
  // Touch/mouse handlers with performance optimizations
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
    
    // Add resistance at edges
    const resistance = 0.4;
    const isAtEdge = (diff > 0 && lightboxIndex === 0) || 
                     (diff < 0 && lightboxIndex === photos.length - 1);
    
    setOffsetX(isAtEdge ? diff * resistance : diff);
    
    // Prevent default on touch devices to avoid page scrolling
    if ('touches' in e) {
      e.preventDefault();
    }
  }, [startX, isDragging, lightboxIndex, photos.length]);
  
  const handleTouchEnd = useCallback(() => {
    if (startX === null) return;
    
    const threshold = window.innerWidth * 0.2; // 20% of screen width
    
    if (Math.abs(offsetX) > threshold) {
      // Swipe threshold met
      if (offsetX > 0) {
        navigateImage("prev");
      } else {
        navigateImage("next");
      }
    }
    
    // Reset touch state
    setStartX(null);
    setOffsetX(0);
    setIsDragging(false);
  }, [startX, offsetX, navigateImage]);
  
  // Reset offset when lightbox index changes
  useEffect(() => {
    setOffsetX(0);
  }, [lightboxIndex]);

  // Extract bubble type to determine iOS styling
  const isUserBubble = bubbleClass.includes('bubble-sent');
  const isDarkMode = bubbleClass.includes('theme-dark');

  // Apply iOS-style bubble classes for photos
  const photosBubbleClass = useMemo(() => `
    ${isUserBubble ? 'ios-photos-sent' : 'ios-photos-received'} 
    ${isDarkMode && !isUserBubble ? 'ios-photos-dark' : ''}
  `, [isUserBubble, isDarkMode]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Make sure body overflow is restored if component unmounts while lightbox is open
      if (lightboxPhoto) {
        document.body.style.overflow = "auto";
      }
    };
  }, [lightboxPhoto]);

  // Add this function in the component to generate thumbnails from videos
  const generateVideoThumbnail = useCallback((video: HTMLVideoElement, index: number) => {
    try {
      // Ensure we have a valid video element with dimensions
      if (!video.videoWidth || !video.videoHeight) {
        console.log(`Video dimensions not available for index ${index}, waiting...`);
        // Try again in a moment when dimensions might be available
        setTimeout(() => generateVideoThumbnail(video, index), 100);
        return;
      }

      // Create canvas to capture the frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Try to seek to a good frame if possible
        if (video.duration) {
          // Seek to 0.5 seconds or 10% of the video, whichever is less
          video.currentTime = Math.min(0.5, video.duration * 0.1);
        }
        
        // Function to capture frame once it's ready
        const captureFrame = () => {
          try {
            // Draw the current frame to the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert to data URL (thumbnail)
            const thumbnailUrl = canvas.toDataURL('image/jpeg');
            console.log(`Thumbnail generated for video ${index}`);
            setVideoThumbnails(prev => ({...prev, [index]: thumbnailUrl}));
          } catch (err) {
            console.error(`Error capturing frame for video ${index}:`, err);
          }
        };
        
        // If we sought to a specific time, wait for that frame to be loaded
        if (video.duration) {
          video.addEventListener('seeked', captureFrame, { once: true });
        } else {
          // Otherwise just capture the current frame
          captureFrame();
        }
      }
    } catch (error) {
      console.error(`Error generating thumbnail for video ${index}:`, error);
    }
  }, []);

  // Function to handle video playback toggle in lightbox
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

  // Reset video playing state when lightbox photo changes
  useEffect(() => {
    setIsVideoPlaying(false);
  }, [lightboxIndex]);

  return (
    <>
      <div 
        className={`photo-message-container ${photosBubbleClass} ${bubbleMaxWidth} overflow-hidden`} 
        data-photo-count={photos.length}
        data-testid="photo-message"
      >
        {/* Content text appears at the top if present */}
        {content && (
          <div className="px-3 pt-2 pb-1">
            <p className="text-[14px] leading-tight">{content}</p>
          </div>
        )}
        
        {/* Photo grid with zero gap for iOS look */}
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
            
            // iOS-style rounded corners - only on the outer edges of the grid
            const roundedCorners = `
              ${isTopLeft && !content ? 'rounded-tl-[16px]' : ''} 
              ${isTopRight && !content ? 'rounded-tr-[16px]' : ''}
              ${isBottomLeft ? 'rounded-bl-[16px]' : ''}
              ${isBottomRight ? 'rounded-br-[16px]' : ''}
            `;
            
            // Show "+X more" overlay on last image when there are more than 4 photos
            const showMoreCount = isLast && photos.length > 4 && index === 3;
            
            return (
              <div
                key={index}
                className={`relative overflow-hidden ${roundedCorners} bg-gray-100 dark:bg-gray-800 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                style={getPhotoStyle()} // Removed 'index' as it's not used by the function
                onClick={() => openLightbox(photo, index)}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(photo, index)}
                tabIndex={0}
                role="button"
                aria-label={`View photo ${index + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ''}`}
                data-testid={`photo-item-${index}`}
              >
                {/* Loading pulse animation */}
                {!isLoaded[index] && !imageErrors[index] && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" 
                       aria-hidden="true" />
                )}
                
                {/* Show error placeholder if media failed to load */}
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
                          onLoadedMetadata={() => { // Changed e to _
                            console.log(`Video metadata loaded for index ${index}`);
                            setIsLoaded(prev => ({...prev, [index]: true}));
                          }}
                          onLoadedData={(e) => {
                            console.log(`Video data loaded for index ${index}`);
                            generateVideoThumbnail(e.currentTarget, index);
                          }}
                          onError={() => handleImageError(index)}
                        />
                        {/* Show thumbnail if available, otherwise show the video */}
                        {videoThumbnails[index] && (
                          <div className="absolute inset-0">
                            <Image
                              src={videoThumbnails[index]}
                              alt={photo.alt || `Video ${index + 1}`}
                              fill // Use fill for absolute positioning
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {/* Video play indicator overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/40 rounded-full p-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide-play">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </div>
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
                
                {photo.caption && !imageErrors[index] && (
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-[10px] leading-tight truncate">
                      {photo.caption}
                    </p>
                  </div>
                )}
                
                {/* iOS-style subtle sheen effect on hover */}
                <div 
                  className="absolute inset-0 opacity-0 hover:opacity-100 bg-white/10 transition-opacity duration-200"
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* iOS 17 lightbox with proper accessibility */}
      <AnimatePresence>
        {lightboxPhoto && (
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
              {/* iOS-style top bar with frosted glass effect */}
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
                  {/* iOS-style action buttons with hover effect */}
                {/* <button
                    aria-label="Share photo"
                    className="text-white/90 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-share-icon lucide-share"><path d="M12 2v13"/><path d="m16 6-4-4-4 4"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/></svg>
                  </button>
                   */}
                  <button
                    aria-label="Save photo"
                    className="text-white/90 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
                  </button>
                </div>
              </div>
              
              {/* iOS-style image view with swipe - full height */}
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
                  {/* Media with object-fit:contain to maintain aspect ratio */}
                  <div className="relative w-full h-full">
                    {isVideoFile(lightboxPhoto.src) ? (
                      <div className="relative w-full h-full">
                        <video
                          ref={videoRef}
                          src={lightboxPhoto.src}
                          // Use generated thumbnail as poster if available
                          poster={videoThumbnails[lightboxIndex]}
                          className="w-full h-full object-contain"
                          onClick={toggleVideoPlayback}
                          onError={() => {
                            console.error(`Failed to load lightbox video: ${lightboxPhoto.src}`);
                          }}
                          // No controls - we'll use our custom UI
                        />
                        
                        {/* Custom video control overlay */}
                        <div 
                          className="absolute inset-0 flex items-center justify-center cursor-pointer"
                          onClick={toggleVideoPlayback}
                        >
                          <div className={`bg-black/30 backdrop-blur-sm rounded-full p-4 transition-opacity ${isVideoPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                            {isVideoPlaying ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  </div>
                </motion.div>
                
                {/* Nav instructions for screen readers */}
                <div className="sr-only">
                  Use arrow keys to navigate between photos. Press Escape to close the viewer.
                </div>
                
                {/* iOS 17-style navigation arrows with debug logging */}
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
                          console.log("Prev button clicked");
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
                          console.log("Next button clicked");
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
              
              {/* iOS 17-style bottom bar with page indicator */}
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
                
                {/* Display caption in the footer if available */}
                {lightboxPhoto.caption && (
                  <div className="absolute bottom-12 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm text-center">
                    <p className="text-white text-sm">{lightboxPhoto.caption}</p>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Close when clicking outside the lightbox */}
            <div 
              className="absolute inset-0" 
              onClick={closeLightbox}
              style={{ cursor: 'zoom-out', zIndex: Z_INDICES.MODAL_OVERLAY }}
              aria-hidden="true"
              data-testid="lightbox-overlay"
            />
          </div>
        )}
      </AnimatePresence>

      {/* iOS style for photo bubbles - with improved animations */}
      <style jsx global>{`
        .photo-message-container {
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 1px 1px rgba(0,0,0,0.08);
          transform: translateZ(0); /* Force GPU acceleration */
          will-change: transform; /* Hint browser for hardware acceleration */
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
        
        /* Loading animation */
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          will-change: opacity; /* Hint browser for optimization */
        }
        
        /* iOS-style hover sheen effect */
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
          will-change: transform; /* Hint browser for optimization */
        }
        
        .ios-sheen:hover::after {
          animation: sheen 0.75s;
        }
        
        /* Larger touch targets on mobile */
        @media (max-width: 640px) {
          .photo-message-container [role="button"] {
            min-height: 44px;
          }
        }
        
        /* Improve focus visibility for keyboard users */
        :focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        
        /* Prevent body scroll when lightbox is open */
        body:has([aria-modal="true"]) {
          overflow: hidden;
          padding-right: var(--scrollbar-width, 0);
        }
      `}</style>
    </>
  );
};