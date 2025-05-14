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

function useAudioPlayer(
  track: Track | undefined, 
  tracks: Track[], 
  currentTrackIndex: number,
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>,
  onPlaybackError?: () => void,
  autoplay?: boolean,
  onAudioReady?: () => void
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
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
  }, [autoplay, track, isPlaying, isReady]);

  useEffect(() => {
    if (!track?.audioPreviewUrl || typeof window === 'undefined') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ""; 
      }
      audioRef.current = null;
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      setIsLoading(false);
      setIsPlaying(false);
      setProgress(0);
      setIsReady(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setIsReady(false);
    setProgress(0);
    setError(null); 

    const audioUrl = track.audioPreviewUrl.startsWith("http")
      ? track.audioPreviewUrl
      : `${window.location.origin}${track.audioPreviewUrl}`;
    
    const newAudio = new Audio(audioUrl);
    audioRef.current = newAudio;

    const handleEnded = () => {
      if (tracks.length > 1 && currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setProgress(0); 
      }
    };
    
    const handleCanPlay = () => {
      setIsLoading(false);
      setIsReady(true); 
      if (onAudioReady) {
        onAudioReady();
      }
    };
    
    const handleError = (e: Event | string) => {
      console.error("Raw Audio Error Event:", e); 
      let errorMessage = "Audio playback error";
      if (typeof e !== 'string' && e.target && (e.target instanceof HTMLAudioElement) && (e.target as HTMLAudioElement).error) {
        const mediaError = (e.target as HTMLAudioElement).error;
        errorMessage = `Error Code ${mediaError?.code}: `;
        switch (mediaError?.code) {
          case MediaError.MEDIA_ERR_ABORTED: errorMessage += "Playback aborted."; break;
          case MediaError.MEDIA_ERR_NETWORK: errorMessage += "Network error."; break;
          case MediaError.MEDIA_ERR_DECODE: errorMessage += "Decoding error."; break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: errorMessage += "Source not supported."; break;
          default: errorMessage += "Unknown error.";
        }
        if (mediaError?.message && mediaError.message.trim() !== "") errorMessage += ` (${mediaError.message})`;
        console.error("Detailed MediaError:", mediaError);
      } else if (typeof e === 'string') { errorMessage = e; }

      setIsLoading(false);
      setIsPlaying(false);
      setIsReady(false);
      setError(errorMessage);
      if (onPlaybackError) onPlaybackError();
    };
    
    const handleStalled = () => { setIsLoading(true); console.warn("Audio stalled."); };
    const handleWaiting = () => { setIsLoading(true); console.warn("Audio waiting (buffering)."); };
    const handlePlayingInternal = () => {
        setIsLoading(false);
        setIsPlaying(true);
    };
    const handlePauseInternal = () => {
        setIsPlaying(false);
    };
    const handleLoadStart = () => { setIsLoading(true); };

    newAudio.addEventListener("ended", handleEnded);
    newAudio.addEventListener("canplaythrough", handleCanPlay);
    newAudio.addEventListener("error", handleError);
    newAudio.addEventListener("stalled", handleStalled);
    newAudio.addEventListener("waiting", handleWaiting);
    newAudio.addEventListener("playing", handlePlayingInternal);
    newAudio.addEventListener("pause", handlePauseInternal);
    newAudio.addEventListener("loadstart", handleLoadStart);

    newAudio.load();
    
    return () => {
      newAudio.pause();
      newAudio.removeEventListener("ended", handleEnded);
      newAudio.removeEventListener("canplaythrough", handleCanPlay);
      newAudio.removeEventListener("error", handleError);
      newAudio.removeEventListener("stalled", handleStalled);
      newAudio.removeEventListener("waiting", handleWaiting);
      newAudio.removeEventListener("playing", handlePlayingInternal);
      newAudio.removeEventListener("pause", handlePauseInternal);
      newAudio.removeEventListener("loadstart", handleLoadStart);
      newAudio.src = "";
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [track, currentTrackIndex, tracks.length, setCurrentTrackIndex, onPlaybackError, autoplay, onAudioReady]);
  
  useEffect(() => {
    if (!audioRef.current || !isReady) return;

    if (isPlaying) {
      if (audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error("Error attempting to play audio:", err);
            setIsPlaying(false);
          });
        }
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isReady]);
  
  const togglePlay = useCallback(() => {
    if (!track?.audioPreviewUrl) {
      setError("No audio available");
      return;
    }
    if (!audioRef.current || !isReady) {
        if(audioRef.current) {
            setIsLoading(true);
            audioRef.current.play().catch(err => {
                setIsLoading(false);
                setError("Playback initiation failed.");
                console.error("Toggle Play (not ready) Error:", err);
            });
        } else {
            setError("Audio element not initialized.");
        }
        return;
    }
    
    setError(null);
    setIsPlaying(prevIsPlaying => !prevIsPlaying);

  }, [track, isReady]);

  const handleNextTrack = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setProgress(0);
      setIsPlaying(autoplay || false);
    }
  }, [currentTrackIndex, tracks.length, setCurrentTrackIndex, autoplay]);
  
  const handlePrevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      if (!isPlaying) setIsPlaying(true);
      return;
    }
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
      setProgress(0);
      setIsPlaying(autoplay || false);
    } else {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setProgress(0);
            if (!isPlaying) setIsPlaying(true);
        }
    }
  }, [currentTrackIndex, setCurrentTrackIndex, isPlaying, autoplay]);
  
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !track?.audioPreviewUrl || !isReady || isNaN(audioRef.current.duration)) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    
    audioRef.current.currentTime = percentage * audioRef.current.duration;
    setProgress(percentage * 100);
  }, [track, isReady]);
  
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
    currentTime,
    duration,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    handleProgressClick,
    formatTime,
    audioRef
  };
}

const SpeakerIconFilled = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    role="presentation" 
    version="1.1" 
    viewBox="0 0 64 64"
    fill="currentColor"
  >
    <path transform="translate(2,11.149)" d="m23.477 39.911c1.4129 0 2.431-1.0389 2.431-2.431v-33.141c0-1.3921-1.0181-2.5349-2.4726-2.5349-1.0181 0-1.7038 0.43634-2.805 1.4752l-9.2046 8.6644c-0.14545 0.12464-0.31166 0.18698-0.51945 0.18698h-6.2126c-2.9297 0-4.5088 1.5999-4.5088 4.7374v8.0411c0 3.1167 1.5791 4.7166 4.5088 4.7166h6.2126c0.20779 0 0.374 0.06234 0.51945 0.18698l9.2046 8.7475c0.99732 0.93501 1.8285 1.3506 2.8466 1.3506z"></path>
    <path className="chrome-volume__wave-1" transform="translate(2,11.149)" d="m34.864 29.959c0.70647 0.49868 1.7246 0.35323 2.3271-0.47787 1.6205-2.1817 2.5971-5.3815 2.5971-8.6436 0-3.2621-0.9766-6.4411-2.5971-8.6436-0.60255-0.83111-1.5999-0.97655-2.3271-0.49868-0.89345 0.62336-1.0181 1.683-0.35319 2.5765 1.2051 1.6207 1.9323 4.0932 1.9323 6.5658 0 2.4726-0.76881 4.9451-1.9531 6.5866-0.62332 0.89345-0.51945 1.9116 0.374 2.5349z"></path>
    <path className="chrome-volume__wave-2" transform="translate(2,11.149)" d="m43.154 35.569c0.81021 0.54023 1.8077 0.33245 2.3894-0.49867 2.7426-3.8231 4.3426-8.9137 4.3426-14.233 0-5.3399-1.5583-10.451-4.3426-14.254-0.60255-0.81034-1.5791-1.0181-2.3894-0.47787-0.78979 0.54021-0.91447 1.5583-0.29106 2.4518 2.2647 3.3245 3.6779 7.6878 3.6779 12.28s-1.3923 8.9969-3.6779 12.28c-0.60255 0.89345-0.49872 1.9116 0.29106 2.4518z"></path>
    <path className="chrome-volume__wave-3" transform="translate(2,11.149)" d="m51.527 41.241c0.76894 0.51945 1.7872 0.31166 2.3898-0.54021 3.8438-5.423 6.0255-12.446 6.0255-19.864s-2.2443-14.42-6.0255-19.864c-0.60255-0.87268-1.6209-1.0805-2.3898-0.54021-0.78936 0.56098-0.91404 1.5791-0.31149 2.4518 3.3451 4.9244 5.423 11.241 5.423 17.952 0 6.7113-1.9945 13.132-5.423 17.952-0.60255 0.87268-0.47787 1.8908 0.31149 2.4518z"></path>
  </svg>
 );

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
  }) => (
    <div className="flex items-center justify-center gap-5">
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        className="flex items-center justify-center text-gray-300 hover:text-white disabled:text-gray-500 transition-colors"
        aria-label="Previous track"
      >
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
      </button>

      <button
        onClick={onPlay}
        disabled={isLoading && !isReady}
        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white text-[#4A3B33] hover:bg-gray-200 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-md"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {(isLoading && !isReady) ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-[#4A3B33] rounded-full animate-spin"></div>
        ) : isPlaying ? (
          <svg viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7">
            <path d="M13.293 22.772c.955 0 1.436-.481 1.436-1.436V6.677c0-.98-.481-1.427-1.436-1.427h-2.457c-.954 0-1.436.473-1.436 1.427v14.66c-.008.954.473 1.435 1.436 1.435h2.457zm7.87 0c.954 0 1.427-.481 1.427-1.436V6.677c0-.98-.473-1.427-1.428-1.427h-2.465c-.955 0-1.428.473-1.428 1.427v14.66c0 .954.473 1.435 1.428 1.435h2.465z" fillRule="nonzero"></path>
          </svg>
        ) : (
        <svg viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7">
          <path d="M10.345 23.287c.415 0 .763-.15 1.22-.407l12.742-7.404c.838-.481 1.178-.855 1.178-1.46 0-.599-.34-.972-1.178-1.462L11.565 5.158c-.457-.265-.805-.407-1.22-.407-.789 0-1.345.606-1.345 1.57V21.71c0 .971.556 1.577 1.345 1.577z" fillRule="nonzero"></path>
        </svg>
        )}
      </button>

      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className="flex items-center justify-center text-gray-300 hover:text-white disabled:text-gray-500 transition-colors"
        aria-label="Next track"
      >
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
      </button>
    </div>
  )
);

Controls.displayName = "Controls";

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
  const [bgColor, setBgColor] = useState('rgba(74, 59, 51, 0.9)');

  const track = tracks[currentTrackIndex];

  useEffect(() => {
    if (!track?.coverArt || typeof window === 'undefined') {
      setBgColor('rgba(74, 59, 51, 0.9)');
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = track.coverArt;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Failed to get canvas context.");
        setBgColor('rgba(74, 59, 51, 0.9)');
        return;
      }

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        let count = 0;
        
        const step = Math.max(1, Math.floor(Math.min(canvas.width, canvas.height) / 20));

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
          setBgColor('rgba(74, 59, 51, 0.9)');
        }
      } catch (e) {
        console.error("Error processing image for dominant color (CORS issue?):", e);
        setBgColor('rgba(74, 59, 51, 0.9)');
      }
    };

    img.onerror = () => {
      console.error("Error loading image for color extraction:", track.coverArt);
      setBgColor('rgba(74, 59, 51, 0.9)');
    };
  }, [track?.coverArt]);
  
  const {
    isPlaying,
    isLoading,
    isReady,
    error,
    progress,
    currentTime,
    duration,
    togglePlay,
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
    <div className={`max-w-sm w-full mx-auto ${className}`}>
      <motion.div
        key={track.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="backdrop-blur-md rounded-xl shadow-lg p-4 flex"
        style={{ backgroundColor: bgColor, transition: 'background-color 0.5s ease' }}
      >
        <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 relative">
          <Image
            src={track.coverArt}
            alt={`${track.title} by ${track.artist}`}
            layout="fill"
            objectFit="cover"
            className={`rounded-lg ${error ? "opacity-60" : ""}`}
            priority
            unoptimized
          />
          {error && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-1 rounded-lg">
              <span className="text-[9px] text-center text-white/80 leading-tight">{error}</span>
            </div>
          )}
          {(isLoading && !isReady && !error) && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
              <div className="w-6 h-6 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow ml-3 md:ml-4 justify-between min-w-0 py-1">
          <div className="flex justify-between items-start">
            <TrackInfo title={track.title} artist={track.artist} />
            <SpeakerIconFilled className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer flex-shrink-0" />
          </div>

          <div className="my-1 md:my-2">
            <div 
              className="h-1 bg-white/20 rounded-full cursor-pointer relative group"
              onClick={handleProgressClick}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Track progress: ${Math.round(progress)}%`}
            >
              <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
              <div 
                className="absolute w-3 h-3 bg-white rounded-full top-1/2 transform -translate-y-1/2 shadow-md group-hover:scale-110 transition-transform"
                style={{ left: `calc(${progress}% - 6px)` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-300 mt-1 px-0.5">
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
            isPrevDisabled={currentTrackIndex === 0 && (!audioRef.current || audioRef.current.currentTime <= 3)}
            isNextDisabled={currentTrackIndex === tracks.length - 1}
          />
        </div>
      </motion.div>
    </div>
  );
}

// Add props interface for MusicPlaylist
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
  
  // Preloading logic for all tracks in the playlist
  useEffect(() => {
    if (typeof window === 'undefined') {
      const urlsToPreloadForSsrCheck = tracks
        .map(track => track.audioPreviewUrl)
        .filter((url): url is string => typeof url === 'string' && url.length > 0);
      if (onAllAudiosProcessed && urlsToPreloadForSsrCheck.length === 0) {
          onAllAudiosProcessed();
      }
      return;
    }

    const urlsToPreload = tracks
      .map(track => track.audioPreviewUrl)
      .filter((url): url is string => typeof url === 'string' && url.length > 0);

    if (urlsToPreload.length === 0) {
      onAllAudiosProcessed?.();
      return;
    }

    let processedCount = 0;
    const eventHandlers: Array<{ 
      audio: HTMLAudioElement;
      boundOnCanPlayThrough: () => void; 
      boundOnError: () => void;
    }> = [];

    urlsToPreload.forEach(rawUrl => {
      const audio = new Audio();
      const audioUrl = rawUrl.startsWith("http") ? rawUrl : `${window.location.origin}${rawUrl}`;

      const handleCanPlayThrough = () => {
        processedCount++;
        if (processedCount === urlsToPreload.length) {
          onAllAudiosProcessed?.();
        }
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
      };
      
      const handleError = () => {
        console.warn(`Failed to preload audio: ${audioUrl}`);
        processedCount++;
        if (processedCount === urlsToPreload.length) {
          onAllAudiosProcessed?.();
        }
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
      };
      
      eventHandlers.push({ audio, boundOnCanPlayThrough: handleCanPlayThrough, boundOnError: handleError });

      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('error', handleError);
      audio.src = audioUrl;
      audio.load(); // Start loading
    });

    return () => {
      eventHandlers.forEach(({ audio, boundOnCanPlayThrough, boundOnError }) => {
        audio.pause();
        audio.removeEventListener('canplaythrough', boundOnCanPlayThrough);
        audio.removeEventListener('error', boundOnError);
        audio.src = ""; // Release resources
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [onAllAudiosProcessed]); // `tracks` is stable, effect runs based on onAllAudiosProcessed.

  return (
    <MusicWidget 
        tracks={tracks} 
        autoplay={false} 
        initialTrack={0}
        onAudioReady={() => { 
            console.log("Audio is ready to play!");
        }}
        onPlaybackError={() => console.error("Playback error occurred from MusicWidget callback.")}
    />
  );
}