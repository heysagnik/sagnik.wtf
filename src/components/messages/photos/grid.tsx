import { useMemo, useCallback } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";
import { isVideoFile } from "./preload";

const IMAGE_SIZES = {
  single: { height: "200px", minHeight: "200px" },
  double: { height: "140px", minHeight: "140px" },
  triple: { height: "110px", minHeight: "110px" },
  quad: { height: "110px", minHeight: "110px" },
  multiple: { height: "90px", minHeight: "90px" },
} as const;

export const PhotoGrid = ({
  photos,
  imageErrors,
  isLoaded,
  openLightbox,
  photoGridRef,
  content,
  handleImageError,
  setIsLoaded
}: {
  photos: Photo[],
  imageErrors: Record<number, boolean>,
  isLoaded: Record<number, boolean>,
  openLightbox: (photo: Photo, index: number) => void,
  photoGridRef: React.RefObject<HTMLDivElement | null>,
  content?: string,
  handleImageError: (index: number) => void,
  setIsLoaded: React.Dispatch<React.SetStateAction<Record<number, boolean>>>
}) => {
  const gridLayout = useMemo(() => {
    const layouts = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-[1fr_1fr_1fr]",
      4: "grid-cols-2 grid-rows-2",
    };
    return layouts[photos.length as keyof typeof layouts] || "grid-cols-3";
  }, [photos.length]);

  const getPhotoStyle = useCallback(() => {
    const sizeKeys = {
      1: 'single',
      2: 'double',
      3: 'triple',
      4: 'quad',
    } as const;

    const sizeKey = sizeKeys[photos.length as keyof typeof sizeKeys] || 'multiple';
    const dimensions = IMAGE_SIZES[sizeKey];

    return {
      ...dimensions,
      width: "100%",
      position: "relative" as const
    };
  }, [photos.length]);

  const getRoundedCorners = useCallback((index: number) => {
    const isFirst = index === 0;
    const isLast = index === photos.length - 1;
    const isTopLeft = isFirst;
    const isTopRight = photos.length === 2 ? isLast : index === 2;
    const isBottomLeft = photos.length === 3 ? false : photos.length === 4 && index === 2;
    const isBottomRight = photos.length > 2 && isLast;

    return `
      ${isTopLeft && !content ? 'rounded-tl-[16px]' : ''}
      ${isTopRight && !content ? 'rounded-tr-[16px]' : ''}
      ${isBottomLeft ? 'rounded-bl-[16px]' : ''}
      ${isBottomRight ? 'rounded-br-[16px]' : ''}
    `;
  }, [photos.length, content]);

  return (
    <div
      ref={photoGridRef}
      className={`grid ${gridLayout} overflow-hidden`}
      style={{ gap: "1px" }}
      tabIndex={0}
      role="grid"
      aria-label={`Photo gallery with ${photos.length} photos`}
    >
      {photos.map((photo, index) => {
        const showMoreCount = index === 3 && photos.length > 4;

        return (
          <div
            key={index}
            className={`relative overflow-hidden ${getRoundedCorners(index)} bg-gray-100 dark:bg-gray-800 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
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
                  <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">Media failed to load</span>
              </div>
            ) : index < 4 || photos.length <= 4 ? (
              <div className="w-full h-full">
                {isVideoFile(photo.src) ? (
                  <div className="relative w-full h-full">
                    {/* Video element for thumbnail */}
                    <video
                      src={photo.src}
                      preload="metadata"
                      className="w-full h-full object-cover"
                      onLoadedMetadata={() => {
                        setIsLoaded(prev => ({ ...prev, [index]: true }));
                      }}
                      onError={() => handleImageError(index)}
                      muted
                      playsInline
                    />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="translate-x-[2px]">
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
                    style={{ width: "100%", height: "100%" }}
                    onLoad={() => setIsLoaded(prev => ({ ...prev, [index]: true }))}
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
                    style={{ width: "100%", height: "100%" }}
                    onLoad={() => setIsLoaded(prev => ({ ...prev, [index]: true }))}
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
