import { motion } from "framer-motion";
import Image from "next/image";
import { Photo } from "@/lib/types";
import { lightbox } from "@/lib/motion";
import { isVideoFile } from "./preload";

const Z_INDICES = {
  MODAL_OVERLAY: 9990,
  MODAL_CONTENT: 9995,
  MODAL_CONTROLS: 9997,
  MODAL_BACKDROP: 9985,
} as const;

export const PhotoLightbox = ({
  photos,
  lightboxPhoto,
  lightboxIndex,
  offsetX,
  isDragging,
  isVideoPlaying,
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

  const NavigationButton = ({ direction, onClick }: { direction: 'prev' | 'next', onClick: () => void }) => (
    <div
      className={`absolute ${direction === 'prev' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 z-[9999] pointer-events-none`}
      style={{ zIndex: Z_INDICES.MODAL_CONTROLS }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 hover:text-white transition-all pointer-events-auto"
        aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} photo`}
        data-testid={`lightbox-${direction}`}
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={direction === 'prev' ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
        </svg>
      </button>
    </div>
  );

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
        {...lightbox}
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
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-6">
            <button
              aria-label="Save photo"
              className="text-white/90 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" />
              </svg>
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
                    className="w-full h-full object-contain"
                    controls={isVideoPlaying}
                    onClick={toggleVideoPlayback}
                    onError={() => console.error(`Failed to load lightbox video: ${lightboxPhoto.src}`)}
                  />

                  {!isVideoPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      onClick={toggleVideoPlayback}
                    >
                      <div className="w-16 h-16 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" className="translate-x-[2px]">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                  )}
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
                  onError={() => console.error(`Failed to load lightbox image: ${lightboxPhoto.src}`)}
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
              <NavigationButton direction="prev" onClick={() => navigateImage("prev")} />
              <NavigationButton direction="next" onClick={() => navigateImage("next")} />
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
