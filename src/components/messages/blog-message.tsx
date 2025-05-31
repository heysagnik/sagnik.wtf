import { useState, useCallback, useRef, useMemo, memo } from "react"
import { motion } from "framer-motion"

interface BlogItemType {
  title: string;
  description: string;
  link?: string;
}

const HOVER_ROTATION_MULTIPLIER = 10;
const HOVER_SCALE = 1.02;
const ANIMATION_DURATION = "0.2s";

export const BlogItem = memo(({ blog }: { blog: BlogItemType }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * HOVER_ROTATION_MULTIPLIER;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * HOVER_ROTATION_MULTIPLIER;
    
    setRotation({ x: rotateX, y: rotateY });
  }, []);
  
  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  }, []);

  const handleBlogClick = useCallback(() => {
    if (!blog.link) return;
    
    const separator = blog.link.includes('?') ? '&' : '?';
    const linkWithParam = `${blog.link}${separator}from=home`;
    window.location.href = linkWithParam;
  }, [blog.link]);

  const cardTransformStyle = useMemo(() => ({
    transform: isHovering
      ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${HOVER_SCALE})` 
      : 'rotateX(0deg) rotateY(0deg) scale(1)',
    transition: `transform ${ANIMATION_DURATION} ease-out`
  }), [isHovering, rotation.x, rotation.y]);

  const getTransform3D = useCallback((translateZ: number) => ({
    transform: isHovering ? `translateZ(${translateZ}px)` : 'translateZ(0)',
    transition: `transform ${ANIMATION_DURATION} ease-out`
  }), [isHovering]);

  const contentTransformStyle = useMemo(() => getTransform3D(10), [getTransform3D]);
  const iconTransformStyle = useMemo(() => getTransform3D(20), [getTransform3D]);

  return (
    <motion.div
      ref={cardRef}
      className={`
        group relative [perspective:800px]
        ${blog.link ? 'cursor-pointer' : ''}
      `}
      onClick={handleBlogClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="
          relative rounded-xl p-3 bg-[#1A1A1A]
          hover:shadow-lg transition-all duration-200 ease-out
          [transform-style:preserve-3d]
        "
        style={cardTransformStyle}
      >
        <div 
          className="relative transition-transform duration-300 ease-out"
          style={contentTransformStyle}
        >
          <h3 className="text-white-100 text-sm font-semibold line-clamp-2 pr-7">
            {blog.title}
          </h3>
          <p className="text-white-400 text-xs leading-snug line-clamp-3 mt-0.5">
            {blog.description}
          </p>
        </div>

        {blog.link && (
          <div
            className="
              absolute top-2.5 right-2.5 p-1 rounded-full
              text-slate-400 group-hover:text-slate-100 
              group-hover:bg-slate-600/50
              transition-all duration-300 ease-out
            "
            style={iconTransformStyle}
            aria-label={`Open ${blog.title}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
});

BlogItem.displayName = "BlogItem";

interface BlogMessageProps {
  content?: string;
  blogs?: BlogItemType[];
  bubbleClass: string;
  bubbleMaxWidth: string;
}

export const BlogMessage = ({ content, blogs, bubbleClass, bubbleMaxWidth }: BlogMessageProps) => {
  return (
    <div className={`${bubbleClass} px-4 py-2 ${bubbleMaxWidth} relative`}>
      <div className="space-y-2">
        {content && (
          <p className="text-[14px] leading-tight mb-3">{content}</p>
        )}
        {blogs?.length && (
          <div className="space-y-2 mt-3">
            {blogs.map((blog, index) => (
              <BlogItem key={index} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};