import { memo, useRef, useEffect } from "react";
import Image from "next/image";

interface HeaderProps {
    onTimestampVisibilityChange?: (isVisible: boolean) => void;
}

const Header = memo(({ onTimestampVisibilityChange }: HeaderProps) => {
    // Get current date for the timestamp in format: "04 SUN 09:43 AM"
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const dayName = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const timestamp = `${day} ${dayName} ${formattedHours}:${minutes} ${ampm}`;

    // Ref for the timestamp line to observe
    const timestampRef = useRef<HTMLDivElement>(null);

    // Setup intersection observer for the timestamp line
    useEffect(() => {
        if (!timestampRef.current || !onTimestampVisibilityChange) return;
        
        // Store a reference to the current DOM node
        const currentNode = timestampRef.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                onTimestampVisibilityChange(entry.isIntersecting);
            },
            {
                threshold: 0.1, // Trigger when at least 10% is visible
                rootMargin: "0px 0px 0px 0px"
            }
        );

        observer.observe(currentNode);

        return () => {
            // Use the stored reference in cleanup
            observer.unobserve(currentNode);
        };
    }, [onTimestampVisibilityChange]);

    return (
        <div className="w-full px-4 sm:px-6">
            {/* Full profile section - always visible */}
            <div className="flex flex-col items-center">
                {/* Avatar with online indicator */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full relative mb-2 sm:mb-3">
                    <Image
                        src="/globe.svg"
                        alt="User Avatar"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-full border-2 border-white/10"
                        priority
                    />
                    {/* Online indicator dot */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
                
                <h1 className="font-bold text-white/95 text-base sm:text-lg md:text-xl tracking-tight">Sagnik Sahoo</h1>
                <p className="text-white/60 text-xs sm:text-sm mb-1">@heysagnik</p>
                
                <p className="text-white/80 text-xs sm:text-sm text-center max-w-xs mb-2 px-4">
                    Product designer & developer. Always curious.
                </p>
                                
                <div className="flex items-center flex-wrap justify-center gap-1 text-white/50 text-xs px-2">
                    <span>Estd. 2005</span>
                    <span className="mx-0.5">•</span>
                    <span>Haldia, India</span>
                    <span className="mx-0.5">•</span>
                    <span>he/him</span>
                </div>
                
                {/* Timestamp line - we'll observe this element */}
                <div 
                    ref={timestampRef}
                    className="text-white/40 text-xs mt-3 sm:mt-4 w-full pt-2 sm:pt-3"
                >
                    <div className="flex items-center w-full">
                        <div className="flex-grow h-[1px] bg-white/20"></div>
                        <span className="px-3">{timestamp}</span>
                        <div className="flex-grow h-[1px] bg-white/20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
});

Header.displayName = 'Header';
export default Header;