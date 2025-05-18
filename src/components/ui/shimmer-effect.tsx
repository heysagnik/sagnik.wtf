import { useState, memo, useEffect } from "react";

interface ShimmerEffectProps {
    direction?: "ltr" | "rtl" | "ttb" | "btt";
    speed?: number;
    color?: string;
    size?: string;
    intensity?: number; // Controls the overall effect intensity
}

interface Particle {
    type: 'dust' | 'highlight' | 'glint';
    size: number;
    opacity: number;
    xOffset: number;
    yOffset: number;
    duration: number;
    delay: number;
    blur?: number;
    left?: string;
    top?: string;
}

export const ShimmerEffect = memo(({
    direction = "ltr",
    speed = 1.8,
    color = "white",
    intensity = 1,
}: ShimmerEffectProps) => {
    const isHorizontal = direction === "ltr" || direction === "rtl";
    
    // Enhanced particles with different types
    const [particles, setParticles] = useState<Particle[]>([]);
    
    useEffect(() => {
        // Create diverse particles on mount
        const newParticles: Particle[] = [
            // Small dust-like particles
            ...Array.from({ length: 8 }).map(() => ({
                type: 'dust' as const,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.1,
                xOffset: Math.random() * 12 - 6,
                yOffset: Math.random() * 12 - 6,
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            })),
            // Medium highlight particles
            ...Array.from({ length: 5 }).map(() => ({
                type: 'highlight' as const,
                size: Math.random() * 5 + 3,
                opacity: Math.random() * 0.6 + 0.4,
                xOffset: Math.random() * 15 - 7.5,
                yOffset: Math.random() * 15 - 7.5,
                duration: Math.random() * 4 + 3,
                delay: Math.random() * 1.5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            })),
            // Occasional larger "glint" particles
            ...Array.from({ length: 3 }).map(() => ({
                type: 'glint' as const,
                size: Math.random() * 6 + 4,
                opacity: Math.random() * 0.7 + 0.3,
                xOffset: Math.random() * 20 - 10,
                yOffset: Math.random() * 20 - 10,
                duration: Math.random() * 5 + 4,
                delay: Math.random() * 3,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                blur: Math.random() * 3 + 1,
            })),
        ];
        
        setParticles(newParticles);
    }, []);
    
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
            {/* Primary shimmer layer */}
            <div 
                className="absolute inset-0 w-[200%] h-[200%]"
                style={{
                    background: isHorizontal 
                        ? `linear-gradient(90deg, transparent 0%, ${color}/15 40%, ${color}/20 50%, ${color}/15 60%, transparent 100%)` 
                        : `linear-gradient(180deg, transparent 0%, ${color}/15 40%, ${color}/20 50%, ${color}/15 60%, transparent 100%)`,
                    backgroundSize: isHorizontal ? '50% 100%' : '100% 50%',
                    animation: `shimmer-${direction} ${speed}s cubic-bezier(0.4, 0.0, 0.2, 1) infinite`,
                    opacity: 0.9 * intensity,
                }}
            />
            
            {/* Secondary shimmer layer */}
            <div 
                className="absolute inset-0 w-[200%] h-[200%] opacity-70"
                style={{
                    background: isHorizontal 
                        ? `linear-gradient(90deg, transparent 10%, ${color}/10 45%, ${color}/15 50%, ${color}/10 55%, transparent 90%)` 
                        : `linear-gradient(180deg, transparent 10%, ${color}/10 45%, ${color}/15 50%, ${color}/10 55%, transparent 90%)`,
                    backgroundSize: isHorizontal ? '70% 100%' : '100% 70%',
                    animation: `shimmer-${direction} ${speed * 1.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
                    animationDelay: `${speed * 0.2}s`,
                    opacity: 0.8 * intensity,
                }}
            />
            
            {/* Tertiary layer - subtle edge highlights */}
            <div 
                className="absolute inset-0 w-[200%] h-[200%] opacity-50"
                style={{
                    background: isHorizontal 
                        ? `linear-gradient(90deg, transparent 30%, ${color}/5 48%, ${color}/25 50%, ${color}/5 52%, transparent 70%)` 
                        : `linear-gradient(180deg, transparent 30%, ${color}/5 48%, ${color}/25 50%, ${color}/5 52%, transparent 70%)`,
                    backgroundSize: isHorizontal ? '30% 100%' : '100% 30%',
                    animation: `shimmer-${direction} ${speed * 0.8}s cubic-bezier(0.3, 0.1, 0.7, 0.9) infinite`,
                    animationDelay: `${speed * 0.1}s`,
                    filter: 'blur(0.5px)',
                    opacity: 0.7 * intensity,
                }}
            />
            
            {/* Enhanced particle effects */}
            <div className="absolute inset-0">
                {particles.map((particle, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.type === 'glint' ? `${color}` : `${color}/25`,
                            left: particle.left,
                            top: particle.top,
                            opacity: particle.opacity * intensity,
                            filter: particle.type === 'glint' ? `blur(${particle.blur}px)` : 
                                         particle.type === 'highlight' ? 'blur(0.7px)' : 'none',
                            boxShadow: particle.type === 'glint' ? `0 0 ${particle.size/2}px ${particle.size/4}px ${color}/30` : 'none',
                            animation: `particle-fade-${i} ${particle.duration}s ease-in-out infinite alternate`,
                            animationDelay: `${particle.delay}s`
                        }}
                    />
                ))}
            </div>
            
            {/* Soft light overlay for dimension */}
            <div className="absolute inset-0 opacity-30" 
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${color}/5 0%, transparent 70%)`,
                    mixBlendMode: 'soft-light'
                }}
            />
            
            <style jsx>{`
                @keyframes shimmer-ltr {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes shimmer-rtl {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes shimmer-ttb {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes shimmer-btt {
                    0% { transform: translateY(100%); }
                    100% { transform: translateY(-100%); }
                }
                
                ${particles.map((particle, i) => `
                    @keyframes particle-fade-${i} {
                        0% { 
                            opacity: ${particle.opacity * 0.4}; 
                            transform: translate(0, 0) scale(0.8);
                        }
                        50% {
                            opacity: ${particle.opacity};
                        }
                        100% { 
                            opacity: ${particle.opacity * 0.7}; 
                            transform: translate(${particle.xOffset}px, ${particle.yOffset}px) scale(1.2);
                        }
                    }
                `).join('\n')}
            `}</style>
        </div>
    );
});

ShimmerEffect.displayName = "ShimmerEffect";