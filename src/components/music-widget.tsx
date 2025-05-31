"use client"

import { useState, useEffect, useCallback, useRef, memo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export interface Track {
  id: string
  title: string
  artist: string
  coverArt: string
  duration: number
  spotifyUrl: string
  audioPreviewUrl?: string
}

interface MusicWidgetProps {
  track?: Track
  tracks?: Track[]
  className?: string
  onPlaybackError?: () => void
  autoplay?: boolean
  initialTrack?: number
  onAudioReady?: () => void
}

const AUDIO_CONFIG = {
  progressUpdateInterval: 100,
  maxSeekOffset: 3,
  loadTimeout: 5000,
  colorExtractionSize: 100,
  colorSampleStep: 10
} as const;

const DEFAULT_COLORS = {
  primary: 'rgba(74, 59, 51, 0.9)',
  fallback: '#4A3B33'
} as const;

const useAudioPlayer = (
  track: Track | undefined, 
  tracks: Track[], 
  currentTrackIndex: number,
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>,
  onPlaybackError?: () => void,
  autoplay?: boolean,
  onAudioReady?: () => void
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const eventHandlersRef = useRef<{[key: string]: EventListener}>({});
  
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      Object.entries(eventHandlersRef.current).forEach(([eventName, handler]) => {
        audioRef.current?.removeEventListener(eventName, handler);
      });
      
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      audioRef.current = null;
    }
    
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    setIsLoading(false);
    setIsPlaying(false);
    setProgress(0);
    setIsReady(false);
    setError(null);
    setAudioInitialized(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
  }, [isMuted, volume]);

  const setVolumeLevel = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clampedVolume;
    }
    
    if (isMuted && clampedVolume > 0) {
      setIsMuted(false);
    }
  }, [isMuted]);
  
  useEffect(() => {
    if (autoplay && track?.audioPreviewUrl && !isPlaying && isReady && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Autoplay failed:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [autoplay, track?.audioPreviewUrl, isPlaying, isReady]);

  useEffect(() => {
    return cleanupAudio;
  }, [track?.id, cleanupAudio]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
          const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(currentProgress);
        }
      }, AUDIO_CONFIG.progressUpdateInterval);
    } else if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [isPlaying]);
  
  useEffect(() => {
    if (!audioRef.current || !isReady) return;

    if (isPlaying) {
      if (audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Error attempting to play audio:", err);
            setIsPlaying(false);
            setError("Failed to play audio");
          });
        }
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isReady]);
  
  const getErrorMessage = useCallback((e: Event) => {
    if (e.target && (e.target instanceof HTMLAudioElement) && (e.target as HTMLAudioElement).error) {
      const mediaError = (e.target as HTMLAudioElement).error;
      const errorMessages: { [key: number]: string } = {
        [MediaError.MEDIA_ERR_ABORTED]: "Playback aborted.",
        [MediaError.MEDIA_ERR_NETWORK]: "Network error.",
        [MediaError.MEDIA_ERR_DECODE]: "Decoding error.",
        [MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED]: "Source not supported."
      };
      
      const baseMessage = errorMessages[mediaError?.code || 0] || "Unknown error.";
      return `Error Code ${mediaError?.code}: ${baseMessage}${mediaError?.message ? ` (${mediaError.message})` : ''}`;
    }
    return "Audio playback error";
  }, []);

  const createAudioEventHandlers = useCallback(() => {
    const handleEnded: EventListener = () => {
      if (tracks.length > 1 && currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setProgress(0); 
      }
    };
    
    const handleCanPlay: EventListener = () => {
      setIsLoading(false);
      setIsReady(true); 
      if (onAudioReady) {
        onAudioReady();
      }
      
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          setError("Playback failed");
          setIsPlaying(false);
        });
      }
    };
    
    const handleError: EventListener = (e: Event) => {
      console.error("Audio Error:", e); 
      const errorMessage = getErrorMessage(e);

      setIsLoading(false);
      setIsPlaying(false);
      setIsReady(false);
      setError(errorMessage);
      if (onPlaybackError) onPlaybackError();
    };
    
    const handleStalled: EventListener = () => { 
      setIsLoading(true); 
      console.warn("Audio stalled."); 
    };

    const handleWaiting: EventListener = () => { 
      setIsLoading(true); 
      console.warn("Audio waiting (buffering)."); 
    };

    const handlePlaying: EventListener = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handlePause: EventListener = () => {
      setIsPlaying(false);
    };
    
    return {
      ended: handleEnded,
      canplaythrough: handleCanPlay,
      error: handleError,
      stalled: handleStalled,
      waiting: handleWaiting,
      playing: handlePlaying,
      pause: handlePause
    };
  }, [tracks.length, currentTrackIndex, setCurrentTrackIndex, onAudioReady, onPlaybackError, getErrorMessage]);

  const togglePlay = useCallback(() => {
    if (!track?.audioPreviewUrl) {
      setError("No audio available");
      return;
    }
    
    if (!audioInitialized) {
      setIsLoading(true);
      setError(null);
      
      try {
        const audioUrl = track.audioPreviewUrl.startsWith("http")
          ? track.audioPreviewUrl
          : `${window.location.origin}${track.audioPreviewUrl}`;
        
        const newAudio = new Audio();
        audioRef.current = newAudio;
        
        newAudio.volume = isMuted ? 0 : volume;
        
        const handlers = createAudioEventHandlers();
        eventHandlersRef.current = handlers;
        
        Object.entries(handlers).forEach(([eventName, handler]) => {
          newAudio.addEventListener(eventName, handler);
        });
        
        newAudio.src = audioUrl;
        newAudio.preload = "auto";
        newAudio.load();
        
        setAudioInitialized(true);
        setIsPlaying(true);
      } catch (err) {
        console.error("Failed to initialize audio:", err);
        setError("Failed to initialize audio player");
        setIsLoading(false);
      }
    } else {
      setError(null);
      setIsPlaying(prevIsPlaying => !prevIsPlaying);
    }
  }, [track, createAudioEventHandlers, audioInitialized, isMuted, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const handleNextTrack = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      cleanupAudio();
      setCurrentTrackIndex(prev => prev + 1);
      setProgress(0);
      setIsPlaying(false);
      setAudioInitialized(false);
    }
  }, [currentTrackIndex, tracks.length, setCurrentTrackIndex, cleanupAudio]);
  
  const handlePrevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > AUDIO_CONFIG.maxSeekOffset) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      if (!isPlaying) setIsPlaying(true);
      return;
    }
    
    if (currentTrackIndex > 0) {
      cleanupAudio();
      setCurrentTrackIndex(prev => prev - 1);
      setProgress(0);
      setIsPlaying(false);
      setAudioInitialized(false);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      if (!isPlaying) setIsPlaying(true);
    }
  }, [currentTrackIndex, setCurrentTrackIndex, isPlaying, cleanupAudio]);
  
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !track?.audioPreviewUrl || !isReady || isNaN(audioRef.current.duration)) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    audioRef.current.currentTime = percentage * audioRef.current.duration;
    setProgress(percentage * 100);
  }, [track?.audioPreviewUrl, isReady]);
  
  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);
  
  const currentTime = audioRef.current && !isNaN(audioRef.current.currentTime) ? audioRef.current.currentTime : 0;
  const duration = audioRef.current && !isNaN(audioRef.current.duration) ? audioRef.current.duration : (track?.duration || 0);
  
  return {
    isPlaying,
    isLoading,
    isReady,
    error,
    progress,
    setProgress,
    currentTime,
    duration,
    isMuted,
    volume,
    togglePlay,
    toggleMute,
    setVolumeLevel,
    handleNextTrack,
    handlePrevTrack,
    handleProgressClick,
    formatTime,
    audioRef
  };
};

const SpeakerIcon = memo(({ 
  className, 
  isMuted, 
  volume, 
  onClick 
}: { 
  className?: string;
  isMuted: boolean;
  volume: number;
  onClick: () => void;
}) => {
  const getVolumeLevel = () => {
    if (isMuted || volume === 0) return 'muted';
    if (volume < 0.3) return 'low';
    if (volume < 0.7) return 'medium';
    return 'high';
  };

  const volumeLevel = getVolumeLevel();

  const renderVolumeWaves = () => {
    const waves = [
      { level: 'low', opacity: volumeLevel === 'low' ? 0.6 : 1, path: "m34.864 29.959c0.70647 0.49868 1.7246 0.35323 2.3271-0.47787 1.6205-2.1817 2.5971-5.3815 2.5971-8.6436 0-3.2621-0.9766-6.4411-2.5971-8.6436-0.60255-0.83111-1.5999-0.97655-2.3271-0.49868-0.89345 0.62336-1.0181 1.683-0.35319 2.5765 1.2051 1.6207 1.9323 4.0932 1.9323 6.5658 0 2.4726-0.76881 4.9451-1.9531 6.5866-0.62332 0.89345-0.51945 1.9116 0.374 2.5349z" },
      { level: 'medium', opacity: volumeLevel === 'medium' ? 0.7 : 1, path: "m43.154 35.569c0.81021 0.54023 1.8077 0.33245 2.3894-0.49867 2.7426-3.8231 4.3426-8.9137 4.3426-14.233 0-5.3399-1.5583-10.451-4.3426-14.254-0.60255-0.81034-1.5791-1.0181-2.3894-0.47787-0.78979 0.54021-0.91447 1.5583-0.29106 2.4518 2.2647 3.3245 3.6779 7.6878 3.6779 12.28s-1.3923 8.9969-3.6779 12.28c-0.60255 0.89345-0.49872 1.9116 0.29106 2.4518z" },
      { level: 'high', opacity: 1, path: "m51.527 41.241c0.76894 0.51945 1.7872 0.31166 2.3898-0.54021 3.8438-5.423 6.0255-12.446 6.0255-19.864s-2.2443-14.42-6.0255-19.864c-0.60255-0.87268-1.6209-1.0805-2.3898-0.54021-0.78936 0.56098-0.91404 1.5791-0.31149 2.4518 3.3451 4.9244 5.423 11.241 5.423 17.952 0 6.7113-1.9945 13.132-5.423 17.952-0.60255 0.87268-0.47787 1.8908 0.31149 2.4518z" }
    ];

    return waves.map((wave, index) => {
      const shouldShow = (
        (wave.level === 'low' && ['low', 'medium', 'high'].includes(volumeLevel)) ||
        (wave.level === 'medium' && ['medium', 'high'].includes(volumeLevel)) ||
        (wave.level === 'high' && volumeLevel === 'high')
      );

      return shouldShow ? (
        <path 
          key={index}
          transform="translate(2,11.149)" 
          d={wave.path}
          opacity={wave.opacity}
        />
      ) : null;
    });
  };

  return (
    <button
      onClick={onClick}
      className={`${className} transition-colors`}
      aria-label={isMuted ? "Unmute" : "Mute"}
      title={isMuted ? "Unmute" : "Mute"}
    >
      <svg 
        role="presentation" 
        aria-hidden="true"
        version="1.1" 
        viewBox="0 0 64 64"
        fill="currentColor"
        className="w-full h-full"
      >
        <path transform="translate(2,11.149)" d="m23.477 39.911c1.4129 0 2.431-1.0389 2.431-2.431v-33.141c0-1.3921-1.0181-2.5349-2.4726-2.5349-1.0181 0-1.7038 0.43634-2.805 1.4752l-9.2046 8.6644c-0.14545 0.12464-0.31166 0.18698-0.51945 0.18698h-6.2126c-2.9297 0-4.5088 1.5999-4.5088 4.7374v8.0411c0 3.1167 1.5791 4.7166 4.5088 4.7166h6.2126c0.20779 0 0.374 0.06234 0.51945 0.18698l9.2046 8.7475c0.99732 0.93501 1.8285 1.3506 2.8466 1.3506z"></path>
        {!isMuted && renderVolumeWaves()}
      </svg>
    </button>
  );
});

SpeakerIcon.displayName = "SpeakerIcon";

const TrackInfo = memo(({ 
  title, 
  artist
}: { 
  title: string; 
  artist: string;
}) => (
  <div className="flex-grow min-w-0 flex flex-col mr-2">
    <p className="text-white text-base font-semibold truncate" title={title}>{title}</p>
    <p className="text-gray-300 text-xs truncate" title={artist}>{artist}</p>
  </div>
));

TrackInfo.displayName = "TrackInfo";

const PlayButton = memo(({ isPlaying, isLoading, isReady, onClick }: {
  isPlaying: boolean;
  isLoading: boolean;
  isReady: boolean;
  onClick: () => void;
}) => {
  const renderIcon = () => {
    if (isLoading && !isReady) {
      return (
        <div className="w-5 h-5 border-2 border-t-transparent border-[#4A3B33] rounded-full animate-spin" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
    
    if (isPlaying) {
      return (
        <svg viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true">
          <path d="M13.293 22.772c.955 0 1.436-.481 1.436-1.436V6.677c0-.98-.481-1.427-1.436-1.427h-2.457c-.954 0-1.436.473-1.436 1.427v14.66c-.008.954.473 1.435 1.436 1.435h2.457zm7.87 0c.954 0 1.427-.481 1.427-1.436V6.677c0-.98-.473-1.427-1.428-1.427h-2.465c-.955 0-1.428.473-1.428 1.427v14.66c0 .954.473 1.435 1.428 1.435h2.465z" fillRule="nonzero"></path>
        </svg>
      );
    }
    
    return (
      <svg viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" aria-hidden="true">
        <path d="M10.345 23.287c.415 0 .763-.15 1.22-.407l12.742-7.404c.838-.481 1.178-.855 1.178-1.46 0-.599-.34-.972-1.178-1.462L11.565 5.158c-.457-.265-.805-.407-1.22-.407-.789 0-1.345.606-1.345 1.57V21.71c0 .971.556 1.577 1.345 1.577z" fillRule="nonzero"></path>
      </svg>
    );
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading && !isReady}
      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white text-[#4A3B33] hover:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      {renderIcon()}
    </button>
  );
});

PlayButton.displayName = "PlayButton";

const Controls = memo(
  ({
    onPrev,
    onPlay,
    onNext,
    isPlaying,
    isLoading,
    isReady,
    isPrevDisabled,
    isNextDisabled
  }: {
    onPrev: () => void;
    onPlay: () => void;
    onNext: () => void;
    isPlaying: boolean;
    isLoading: boolean;
    isReady: boolean;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
  }) => {
  
  const IconButton = ({ onClick, disabled, ariaLabel, children }: {
    onClick: () => void;
    disabled: boolean;
    ariaLabel: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center text-gray-300 hover:text-white disabled:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-1"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-5">
      <IconButton onClick={onPrev} disabled={isPrevDisabled} ariaLabel="Previous track">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <path d="M208,47.88V208.12a16,16,0,0,1-24.43,13.43L64,146.77V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0v69.23L183.57,34.45A15.95,15.95,0,0,1,208,47.88Z"></path>
        </svg>
      </IconButton>

      <PlayButton 
        isPlaying={isPlaying}
        isLoading={isLoading}
        isReady={isReady}
        onClick={onPlay}
      />

      <IconButton onClick={onNext} disabled={isNextDisabled} ariaLabel="Next track">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <path d="M208,40V216a8,8,0,0,1-16,0V146.77L72.43,221.55A15.95,15.95,0,0,1,48,208.12V47.88A15.95,15.95,0,0,1,72.43,34.45L192,109.23V40a8,8,0,0,1,16,0Z" />
        </svg>
      </IconButton>
    </div>
  );
});

Controls.displayName = "Controls";

const useImageColor = (coverArt: string | undefined) => {
  const [bgColor, setBgColor] = useState<string>(DEFAULT_COLORS.primary);
  const extractionAttemptedRef = useRef(false);
  
  useEffect(() => {
    if (!coverArt || typeof window === 'undefined') {
      setBgColor(DEFAULT_COLORS.primary);
      return;
    }

    extractionAttemptedRef.current = false;
    
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    
    const timeoutId = setTimeout(() => {
      if (!extractionAttemptedRef.current) {
        console.warn("Color extraction timed out for:", coverArt);
        setBgColor(DEFAULT_COLORS.primary);
      }
    }, AUDIO_CONFIG.loadTimeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      extractionAttemptedRef.current = true;
      
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error("Failed to get canvas context.");
          setBgColor(DEFAULT_COLORS.primary);
          return;
        }

        const scale = Math.min(1, AUDIO_CONFIG.colorExtractionSize / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let r = 0, g = 0, b = 0;
          let count = 0;
          
          const step = Math.max(1, Math.floor(Math.min(canvas.width, canvas.height) / AUDIO_CONFIG.colorSampleStep));

          for (let y = 0; y < canvas.height; y += step) {
            for (let x = 0; x < canvas.width; x += step) {
              const index = (y * canvas.width + x) * 4;
              if (index < data.length) {
                r += data[index];
                g += data[index + 1];
                b += data[index + 2];
                count++;
              }
            }
          }

          if (count > 0) {
            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);
            setBgColor(`rgba(${r}, ${g}, ${b}, 0.9)`);
          } else {
            setBgColor(DEFAULT_COLORS.primary);
          }
        } catch (e) {
          console.error("Error processing image for dominant color (CORS issue?):", e);
          setBgColor(DEFAULT_COLORS.primary);
        }
      } catch (err) {
        console.error("Error during color extraction:", err);
        setBgColor(DEFAULT_COLORS.primary);
      }
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      extractionAttemptedRef.current = true;
      console.error("Error loading image for color extraction:", coverArt);
      setBgColor(DEFAULT_COLORS.primary);
    };
    
    img.src = coverArt;
    
    return () => {
      clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };
  }, [coverArt]);
  
  return bgColor;
};

export default function MusicWidget({
  track: singleTrack,
  tracks: trackList,
  className = "",
  onPlaybackError,
  autoplay = false,
  initialTrack = 0,
  onAudioReady
}: MusicWidgetProps) {
  const tracks = trackList || (singleTrack ? [singleTrack] : []);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrack);
  const [thumbOffset, setThumbOffset] = useState(6);

  const track = tracks[currentTrackIndex];
  const bgColor = useImageColor(track?.coverArt);

  useEffect(() => {
    const handleResize = () => {
      setThumbOffset(window.innerWidth < 640 ? 4 : 6);
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const {
    isPlaying,
    isLoading,
    isReady,
    error,
    progress,
    setProgress,
    currentTime,
    duration,
    isMuted,
    volume,
    togglePlay,
    toggleMute,
    handleNextTrack,
    handlePrevTrack,
    handleProgressClick,
    formatTime,
    audioRef
  } = useAudioPlayer(
    track,
    tracks,
    currentTrackIndex,
    setCurrentTrackIndex,
    onPlaybackError,
    autoplay,
    onAudioReady
  );
    
  if (!track) return null;
  
  const remainingTime = duration > 0 ? Math.max(0, duration - currentTime) : 0;

  return (
    <div className={`max-w-sm w-full mx-auto ${className}`} role="region" aria-label="Music Player">
      <motion.div
        key={track.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-md rounded-xl shadow-lg p-2 sm:p-4 flex"
        style={{ backgroundColor: bgColor, transition: 'background-color 0.5s ease' }}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex-shrink-0 relative">
          <Image
            src={track.coverArt}
            alt={`Album artwork for ${track.title} by ${track.artist}`}
            width={112}
            height={112}
            className={`rounded-lg object-cover w-full h-full ${error ? "opacity-60" : ""}`}
            priority
            unoptimized
          />
          {error && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-1 rounded-lg">
              <span className="text-[8px] sm:text-[9px] text-center text-white/80 leading-tight">{error}</span>
            </div>
          )}
          {(isLoading && !isReady && !error) && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-white/80 border-t-transparent rounded-full animate-spin" role="status">
                <span className="sr-only">Loading audio...</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow ml-2 sm:ml-3 md:ml-4 justify-between min-w-0 py-0 sm:py-1">
          <div className="flex justify-between items-start">
            <TrackInfo title={track.title} artist={track.artist} />
            <SpeakerIcon 
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 flex-shrink-0" 
              isMuted={isMuted}
              volume={volume}
              onClick={toggleMute}
            />
          </div>

          <div className="my-1 md:my-2">
            <div 
              className="h-1 bg-white/20 rounded-full cursor-pointer relative group"
              onClick={handleProgressClick}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  if (!audioRef.current || !isReady) return;
                  
                  const step = e.key === 'ArrowLeft' ? -5 : 5;
                  const newTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + step));
                  audioRef.current.currentTime = newTime;
                  setProgress((newTime / audioRef.current.duration) * 100);
                }
              }}
              role="slider"
              tabIndex={0}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Track progress: ${Math.round(progress)}%`}
              style={{ touchAction: 'none' }}
            >
              <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
              <div 
                className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full top-1/2 transform -translate-y-1/2 shadow-md group-hover:scale-110 transition-transform"
                style={{ left: `calc(${progress}% - ${thumbOffset}px)` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-300 mt-1 px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(remainingTime)}</span>
            </div>
          </div>
          
          <Controls
            onPrev={handlePrevTrack}
            onPlay={togglePlay}
            onNext={handleNextTrack}
            isPlaying={isPlaying}
            isLoading={isLoading}
            isReady={isReady}
            isPrevDisabled={currentTrackIndex === 0 && (!audioRef.current || audioRef.current.currentTime <= AUDIO_CONFIG.maxSeekOffset)}
            isNextDisabled={currentTrackIndex === tracks.length - 1}
          />
        </div>
      </motion.div>
    </div>
  );
}

interface MusicPlaylistProps {
  onAllAudiosProcessed?: () => void;
}

export function MusicPlaylist({ onAllAudiosProcessed }: MusicPlaylistProps) {
  const tracks: Track[] = [
    {
      id: "1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      coverArt: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
      duration: 30,
      spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
      audioPreviewUrl: "/1.mp3" 
    },
    {
      id: "2",
      title: "Save Your Tears",
      artist: "The Weeknd",
      coverArt: "https://i.scdn.co/image/ab67616d00001e026e7aabc7eaf60f2c1eee2b16",
      duration: 30,
      spotifyUrl: "https://open.spotify.com/track/5QO79kh1waicV47BqGRL3g",
      audioPreviewUrl: "/1.mp3" 
    },
    {
      id: "3",
      title: "Take My Breath",
      artist: "The Weeknd",
      coverArt: "https://i.scdn.co/image/ab67616d0000b273b560693c17b20f01614c585c",
      duration: 30,
      spotifyUrl: "https://open.spotify.com/track/6OGogr19zPTM4BALXuMQpF",
      audioPreviewUrl: "/1.mp3" 
    }
  ];
  
  useEffect(() => {
    if (onAllAudiosProcessed) {
      onAllAudiosProcessed();
    }
  }, [onAllAudiosProcessed]);

  return (
    <MusicWidget 
      tracks={tracks} 
      autoplay={false} 
      initialTrack={0}
      onAudioReady={() => console.log("Audio is ready to play!")}
      onPlaybackError={() => console.error("Playback error occurred")}
    />
  );
}

export const MusicMessage = ({
  content,
  bubbleClass,
  bubbleMaxWidth
}: {
  content?: string;
  bubbleClass: string;
  bubbleMaxWidth: string;
}) => {
  if (!content) {
    return (
      <div className="rounded-[18px] overflow-hidden shadow-sm w-full max-w-[85%] sm:max-w-[300px] md:max-w-[320px]">
        <MusicPlaylist />
      </div>
    );
  }

  return (
    <div className={`${bubbleClass} px-4 py-2 ${bubbleMaxWidth} relative`}>
      <div className="space-y-2">
        <p className="text-[14px] leading-tight">{content}</p>
        <div className="overflow-hidden rounded-xl mt-1.5">
          <MusicPlaylist />
        </div>
      </div>
    </div>
  );
};