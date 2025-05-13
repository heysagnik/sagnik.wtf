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

interface SpotifyWidgetProps {
  track?: Track
  tracks?: Track[]
  className?: string
  onPlaybackError?: () => void
  autoplay?: boolean
  initialTrack?: number
  onAudioReady?: () => void; // Add this line
}

function useAudioPlayer(
  track: Track | undefined, 
  tracks: Track[], 
  currentTrackIndex: number,
  setCurrentTrackIndex: React.Dispatch<React.SetStateAction<number>>,
  onPlaybackError?: () => void,
  autoplay?: boolean,
  onAudioReady?: () => void // Add this parameter
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (autoplay && track?.audioPreviewUrl && !isPlaying && isReady) {
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [autoplay, track, isPlaying, isReady]);

  useEffect(() => {
    if (!track?.audioPreviewUrl || typeof window === 'undefined') {
      return () => {};
    }
    
    setIsLoading(true);
    setIsReady(false);
    setProgress(0);
    
    const audioUrl = track.audioPreviewUrl.startsWith("http")
      ? track.audioPreviewUrl
      : `${window.location.origin}${track.audioPreviewUrl}`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioUrl);
    const audio = audioRef.current;
    
    const handleEnded = () => {
      if (tracks.length > 1 && currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
        setProgress(0);
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    };
    
    const handleCanPlay = () => {
      setIsLoading(false);
      setIsReady(true);
      if (onAudioReady) { // Call the callback when audio is ready
        onAudioReady();
      }
    };
    
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setError("Unable to play audio");
      if (onPlaybackError) onPlaybackError();
    };
    
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    
    audio.load();
    
    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [track, currentTrackIndex, onPlaybackError, setCurrentTrackIndex, tracks.length, onAudioReady]);
  
  useEffect(() => {
    if (isPlaying && audioRef.current && isReady) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [track, isPlaying, isReady]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current && audioRef.current.duration) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      }, 100);
    } else if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);
  
  const togglePlay = useCallback(() => {
    setError(null);
    
    if (!audioRef.current || !track?.audioPreviewUrl) {
      setError("No audio available");
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
          if (err.name === "NotAllowedError") {
            setError("Browser blocked autoplay");
          } else if (err.name === "NotSupportedError") {
            setError("Audio format not supported");
          } else {
            setError("Playback failed");
          }
        });
    }
  }, [isPlaying, track]);
  
  const handleNextTrack = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setProgress(0);
    }
  }, [currentTrackIndex, tracks.length, setCurrentTrackIndex]);
  
  const handlePrevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentTrackIndex, setCurrentTrackIndex]);
  
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !track?.audioPreviewUrl) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    
    audioRef.current.currentTime = percentage * audioRef.current.duration;
    setProgress(percentage * 100);
  }, [track]);
  
  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);
  
  const currentTime = audioRef.current ? audioRef.current.currentTime : 0;
  const duration = audioRef.current ? audioRef.current.duration : (track?.duration || 0);
  
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
    formatTime
  };
}

const TrackInfo = memo(({ 
  title, 
  artist, 
  onAddToPlaylist 
}: { 
  title: string; 
  artist: string;
  onAddToPlaylist: (e: React.MouseEvent) => void;
}) => (
  <div className="flex-grow min-w-0 flex flex-col">
    <p className="text-white text-xs sm:text-sm font-medium truncate">{title}</p>
    <p className="text-white/60 text-[10px] sm:text-xs truncate">{artist}</p>
    <button 
      className="mt-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-[#1DB954]/90 hover:bg-[#1DB954] text-black/90 hover:text-black transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#1DB954]/50 flex items-center gap-0.5 sm:gap-1"
      onClick={onAddToPlaylist}
      aria-label={`Open ${title} by ${artist} in Spotify`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm31.07,145.74a8,8,0,0,1-10.81,3.33,42.79,42.79,0,0,0-40.52,0,8,8,0,0,1-7.48-14.14,59.33,59.33,0,0,1,55.48,0A8,8,0,0,1,159.07,169.74Zm16-28a8,8,0,0,1-10.82,3.3,77.07,77.07,0,0,0-72.48,0,8,8,0,0,1-7.52-14.12,93,93,0,0,1,87.52,0A8,8,0,0,1,175.06,141.76Zm16-28a8,8,0,0,1-10.83,3.29,110.62,110.62,0,0,0-104.46,0,8,8,0,0,1-7.54-14.12,126.67,126.67,0,0,1,119.54,0A8,8,0,0,1,191.06,113.76Z"></path>
      </svg>
      Add
    </button>
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
    <div className="flex items-center gap-0.5 sm:gap-1">
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white/70 hover:text-white disabled:text-white/30"
        aria-label="Previous track"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="sm:w-5 sm:h-5"
        >
          <path d="M208,47.88V208.12a16,16,0,0,1-24.43,13.43L64,146.77V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0v69.23L183.57,34.45A15.95,15.95,0,0,1,208,47.88Z"></path>
        </svg>
      </button>

      <button
        onClick={onPlay}
        disabled={!isReady && isLoading}
        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isLoading ? (
          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
        ) : isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="#000000" className="sm:w-6 sm:h-6">
            <path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="sm:w-6 sm:h-6"
          >
            <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
          </svg>
        )}
      </button>

      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white/70 hover:text-white disabled:text-white/30"
        aria-label="Next track"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="sm:w-5 sm:h-5"
        >
          <path d="M208,40V216a8,8,0,0,1-16,0V146.77L72.43,221.55A15.95,15.95,0,0,1,48,208.12V47.88A15.95,15.95,0,0,1,72.43,34.45L192,109.23V40a8,8,0,0,1,16,0Z" />
        </svg>
      </button>
    </div>
  )
);

Controls.displayName = "Controls";

export default function SpotifyWidget({
  track: singleTrack,
  tracks: trackList,
  className = "",
  onPlaybackError,
  autoplay = false,
  initialTrack = 0,
  onAudioReady // Destructure the new prop
}: SpotifyWidgetProps) {
  const tracks = trackList || (singleTrack ? [singleTrack] : []);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrack);
  
  const track = tracks[currentTrackIndex];
  
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
    formatTime
  } = useAudioPlayer(
    track,
    tracks,
    currentTrackIndex,
    setCurrentTrackIndex,
    onPlaybackError,
    autoplay,
    onAudioReady // Pass it to the hook
  );
  
  const openInSpotify = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (track?.spotifyUrl) {
      window.open(track.spotifyUrl, "_blank", "noopener,noreferrer");
    }
  }, [track]);
  
  if (!track) return null;
  
  return (
    <div className={`max-w-sm mx-auto ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-lg border border-white/10 p-2 sm:p-3"
      >
        <div className="flex items-center gap-2 sm:gap-0">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 mr-2 sm:mr-4 rounded-md overflow-hidden shadow-md">
            <Image
              src={track.coverArt}
              alt={`${track.title} by ${track.artist}`}
              width={64}
              height={64}
              className={`object-cover h-full w-full ${error ? "opacity-70" : ""}`}
              priority
            />
            {error && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-[8px] sm:text-[10px] text-white/90 px-1 py-0.5 bg-black/50 rounded">{error}</span>
              </div>
            )}
            
            {isLoading && !isReady && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          <TrackInfo 
            title={track.title} 
            artist={track.artist} 
            onAddToPlaylist={openInSpotify} 
          />
          
          <Controls
            onPrev={handlePrevTrack}
            onPlay={togglePlay}
            onNext={handleNextTrack}
            isPlaying={isPlaying}
            isLoading={isLoading}
            isReady={isReady}
            isPrevDisabled={currentTrackIndex === 0 && (!currentTime || currentTime <= 3)}
            isNextDisabled={currentTrackIndex === tracks.length - 1}
          />
        </div>
        
        <div className="mt-3 sm:mt-4">
          <div 
            className="h-1 bg-white/10 rounded-full cursor-pointer relative" 
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Track progress: ${Math.round(progress)}%`}
          >
            <div className="h-full bg-[#1DB954] rounded-full" style={{ width: `${progress}%` }} />
          </div>
          
          <div className="flex justify-between mt-0.5 sm:mt-1">
            <span className="text-white/50 text-[10px] sm:text-xs">{formatTime(currentTime)}</span>
            <span className="text-white/50 text-[10px] sm:text-xs">{formatTime(duration)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function SpotifyPlaylist() {
  const tracks: Track[] = [
    {
      id: "1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      coverArt: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
      duration: 203,
      spotifyUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
      audioPreviewUrl: "/1.mp3"
    },
    {
      id: "2",
      title: "Save Your Tears",
      artist: "The Weeknd",
      coverArt: "https://i.scdn.co/image/ab67616d00001e026e7aabc7eaf60f2c1eee2b16",
      duration: 215,
      spotifyUrl: "https://open.spotify.com/track/5QO79kh1waicV47BqGRL3g",
      audioPreviewUrl: "/1.mp3"
    },
    {
      id: "3",
      title: "Take My Breath",
      artist: "The Weeknd",
      coverArt: "https://i.scdn.co/image/ab67616d0000b273b560693c17b20f01614c585c",
      duration: 211,
      spotifyUrl: "https://open.spotify.com/track/6OGogr19zPTM4BALXuMQpF",
      audioPreviewUrl: "/1.mp3"
    }
  ];
  
  return <SpotifyWidget tracks={tracks} />;
}