import { useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Photo } from "@/lib/types";
import type { BubbleProps } from "@/lib/message-styles";
import { useImageLoading } from "./photos/preload";
import { useLightbox } from "./photos/use-lightbox";
import { PhotoGrid } from "./photos/grid";
import { PhotoLightbox } from "./photos/lightbox";

interface PhotosMessageProps extends BubbleProps {
  content?: string;
  photos: Photo[];
}

export const PhotosMessage = ({
  content,
  photos,
  isUser,
  maxWidth
}: PhotosMessageProps) => {
  const { imageErrors, isLoaded, handleImageError, setIsLoaded } = useImageLoading(photos);
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

  const photosBubbleClass = isUser ? 'ios-photos-sent' : 'ios-photos-received';

  return (
    <>
      <div
        className={`photo-message-container ${photosBubbleClass} ${maxWidth} overflow-hidden`}
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
          openLightbox={openLightbox}
          photoGridRef={photoGridRef}
          content={content}
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
    </>
  );
};
