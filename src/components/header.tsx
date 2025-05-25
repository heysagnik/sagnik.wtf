import { memo, useRef, useEffect, useMemo } from "react"
import Image from "next/image"

interface HeaderProps {
  onTimestampVisibilityChange?: (isVisible: boolean) => void
}

const PROFILE_DATA = {
  name: "Sagnik Sahoo",
  username: "@heysagnik",
  bio: "Product developer. Always curious.",
  details: ["Estd. 2005", "Haldia, India", "he/him"]
} as const

const Header = memo<HeaderProps>(({ onTimestampVisibilityChange }) => {
  const timestampRef = useRef<HTMLDivElement>(null)

  const timestamp = useMemo(() => {
    const now = new Date()
    const day = now.getDate().toString().padStart(2, '0')
    const dayName = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()]
    const hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')
    return `${day} ${dayName} ${formattedHours}:${minutes} ${ampm}`
  }, [])

  useEffect(() => {
    const currentNode = timestampRef.current
    if (!currentNode || !onTimestampVisibilityChange) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        onTimestampVisibilityChange(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px 0px 0px"
      }
    )

    observer.observe(currentNode)
    return () => observer.unobserve(currentNode)
  }, [onTimestampVisibilityChange])

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full relative mb-2 sm:mb-3">
          <Image
            src="/char.png"
            alt="User Avatar"
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full border-2 border-white/10"
            priority
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black" />
        </div>
        
        <h1 className="font-bold text-white/95 text-base sm:text-lg md:text-xl tracking-tight">
          {PROFILE_DATA.name}
        </h1>
        <p className="text-white/60 text-xs sm:text-sm mb-1">
          {PROFILE_DATA.username}
        </p>
        
        <p className="text-white/80 text-xs sm:text-sm text-center max-w-xs mb-2 px-4">
          {PROFILE_DATA.bio}
        </p>
                        
        <div className="flex items-center flex-wrap justify-center gap-1 text-white/50 text-xs px-2">
          {PROFILE_DATA.details.map((detail, index) => (
            <span key={detail}>
              {detail}
              {index < PROFILE_DATA.details.length - 1 && (
                <span className="mx-0.5">•</span>
              )}
            </span>
          ))}
        </div>
        
        <div 
          ref={timestampRef}
          className="text-white/40 text-xs mt-3 sm:mt-4 w-full pt-2 sm:pt-3"
        >
          <div className="flex items-center w-full">
            <div className="flex-grow h-[1px] bg-white/20" />
            <span className="px-3">{timestamp}</span>
            <div className="flex-grow h-[1px] bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
})

Header.displayName = 'Header'
export default Header