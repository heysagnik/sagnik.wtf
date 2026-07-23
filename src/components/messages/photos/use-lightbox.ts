// Lightbox state machine for PhotosMessage — open/close, swipe + keyboard nav,
// drag offset, and video playback toggle. Extracted verbatim from the original
// photos-message.tsx except the redundant `document.body.style.overflow`
// manipulation: background scroll is now locked purely via the CSS
// `body:has([aria-modal="true"])` rule in globals.css, which also keeps the lock
// active through the framer-motion exit animation (the old JS lock released the
// instant `closeLightbox` was called, slightly before the fade finished).

import { useState, useEffect, useRef, useCallback } from "react";
import { Photo } from "@/lib/types";

const SWIPE_THRESHOLD = 0.2;

export const useLightbox = (photos: Photo[]) => {
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
    if (imageErrors[index]) return;

    setLightboxPhoto(photo);
    setLightboxIndex(index);

    setTimeout(() => lightboxRef.current?.focus(), 100);
  }, []);

  const closeLightbox = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    setIsVideoPlaying(false);
    setLightboxPhoto(null);

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
    const actions = {
      ArrowLeft: () => navigateImage("prev"),
      ArrowRight: () => navigateImage("next"),
      Escape: closeLightbox,
    };

    const action = actions[e.key as keyof typeof actions];
    if (action) {
      action();
      e.preventDefault();
    }
  }, [navigateImage, closeLightbox]);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
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

    const threshold = window.innerWidth * SWIPE_THRESHOLD;

    if (Math.abs(offsetX) > threshold) {
      navigateImage(offsetX > 0 ? "prev" : "next");
    }

    setStartX(null);
    setOffsetX(0);
    setIsDragging(false);
  }, [startX, offsetX, navigateImage]);

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
    setOffsetX(0);
  }, [lightboxIndex]);

  useEffect(() => {
    setIsVideoPlaying(false);
  }, [lightboxIndex]);

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
