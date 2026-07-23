// Photo/video preload helpers + loading state for PhotosMessage.
// Extracted verbatim from the original monolithic photos-message.tsx; behavior
// is unchanged — only the physical location moved.

import { useState, useEffect, useCallback } from "react";
import { Photo } from "@/lib/types";

export const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.ogg', '.avi'];

export const isVideoFile = (src: string): boolean => {
  if (!src) return false;
  return VIDEO_EXTENSIONS.some(ext => src.toLowerCase().endsWith(ext));
};

export const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

export const useImageLoading = (photos: Photo[]) => {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isLoaded, setIsLoaded] = useState<Record<number, boolean>>({});

  const handleImageError = useCallback((index: number) => {
    console.error(`Failed to load image at index ${index}:`, photos[index]?.src);
    setImageErrors(prev => ({...prev, [index]: true}));
  }, [photos]);

  useEffect(() => {
    if (!photos?.length) return;

    const preloadImages = async () => {
      const chunks = chunkArray([...photos], 3);

      for (const chunk of chunks) {
        await Promise.allSettled(
          chunk.map((photo) => {
            const actualIndex = photos.indexOf(photo);

            if (!photo.src) {
              setImageErrors(prev => ({...prev, [actualIndex]: true}));
              return Promise.reject();
            }

            if (isVideoFile(photo.src)) {
              // For videos, mark as loaded when metadata is available
              return new Promise<void>((resolve, reject) => {
                const video = document.createElement('video');
                video.onloadedmetadata = () => {
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
