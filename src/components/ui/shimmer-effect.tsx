import { useState, memo, useEffect } from "react";

interface ShimmerEffectProps {
    direction?: "ltr" | "rtl" | "ttb" | "btt";
    speed?: number; // Speed of the main shimmer gradient
    color?: string;
    intensity?: number; // Controls the overall opacity/visibility
}

interface Particle {
    size: number;
    initialOpacity: number;
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    duration: number;
    delay: number;
    left: string;
    top: string;
}

export const ShimmerEffect = memo(({
    direction = "ltr",
    speed = 3, 
    color = "rgba(40, 40, 40, 0.6)", // Changed to a dark grey for a darker theme
    intensity = 0.7, // Slightly increased default intensity for darker theme
}: ShimmerEffectProps) => {
    const isHorizontal = direction === "ltr" || direction === "rtl";
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const numParticles = Math.floor(5 * intensity); 
        const newParticles: Particle[] = Array.from({ length: numParticles }).map(() => {
            const particleSize = Math.random() * 2 + 0.5; 
            return {
                size: particleSize,
                initialOpacity: Math.random() * 0.3 + 0.1, 
                xStart: Math.random() * 10 - 5,
                yStart: Math.random() * 10 - 5,
                xEnd: Math.random() * 20 - 10, 
                yEnd: Math.random() * 20 - 10, 
                duration: Math.random() * 5 + 4, 
                delay: Math.random() * 4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            };
        });
        setParticles(newParticles);
    }, [intensity]);
    
    const baseColor = color.startsWith('rgba') ? color.substring(0, color.lastIndexOf(',')) : color;
    const alphaLow = 0.03 * intensity;
    const alphaMid = 0.08 * intensity;
    const alphaHigh = 0.12 * intensity;

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Single, more fluid shimmer layer */}
            <div 
                className="absolute inset-0 w-[200%] h-[200%]"
                style={{
                    background: isHorizontal 
                        ? `linear-gradient(90deg, transparent 20%, ${baseColor}, ${alphaLow}) 35%, ${baseColor}, ${alphaMid}) 45%, ${baseColor}, ${alphaHigh}) 50%, ${baseColor}, ${alphaMid}) 55%, ${baseColor}, ${alphaLow}) 65%, transparent 80%)` 
                        : `linear-gradient(180deg, transparent 20%, ${baseColor}, ${alphaLow}) 35%, ${baseColor}, ${alphaMid}) 45%, ${baseColor}, ${alphaHigh}) 50%, ${baseColor}, ${alphaMid}) 55%, ${baseColor}, ${alphaLow}) 65%, transparent 80%)`,
                    backgroundSize: isHorizontal ? '50% 100%' : '100% 50%', 
                    animation: `shimmer-${direction} ${speed}s ease-in-out infinite`, 
                }}
            />
            
            {/* Minimalist particle effects */}
            {particles.length > 0 && (
                <div className="absolute inset-0">
                    {particles.map((particle, i) => (
                        <div 
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                backgroundColor: `${baseColor}, ${particle.initialOpacity * intensity})`,
                                left: particle.left,
                                top: particle.top,
                                animation: `particle-drift-${i} ${particle.duration}s ease-in-out infinite alternate`,
                                animationDelay: `${particle.delay}s`,
                            }}
                        />
                    ))}
                </div>
            )}
            
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
                    @keyframes particle-drift-${i} {
                        0% { 
                            opacity: ${particle.initialOpacity * 0.5 * intensity}; 
                            transform: translate(${particle.xStart}px, ${particle.yStart}px) scale(0.9);
                        }
                        100% { 
                            opacity: ${particle.initialOpacity * intensity}; 
                            transform: translate(${particle.xEnd}px, ${particle.yEnd}px) scale(1.1);
                        }
                    }
                `).join('\n')}
            `}</style>
        </div>
    );
});

ShimmerEffect.displayName = "ShimmerEffect";