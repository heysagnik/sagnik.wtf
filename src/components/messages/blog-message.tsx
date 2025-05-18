import { useState, useCallback, useRef, useMemo, memo } from "react"
import { motion } from "framer-motion"

interface BlogItemType {
  title: string;
  description: string;
  link?: string;
}

export const BlogItem = memo(({ blog }: { blog: BlogItemType }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isTransitioning) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 10;
    
    setRotation({ x: rotateX, y: rotateY });
  }, [isTransitioning]);
  
  const handleMouseEnter = useCallback(() => {
    if (!isTransitioning) setIsHovering(true);
  }, [isTransitioning]);
  
  const handleMouseLeave = useCallback(() => {
    if (!isTransitioning) {
      setIsHovering(false);
      setRotation({ x: 0, y: 0 });
    }
  }, [isTransitioning]);

  const handleBlogClick = useCallback(() => {
    if (!blog.link || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Prepare URL with the 'from' parameter
    const separator = blog.link.includes('?') ? '&' : '?';
    const linkWithParam = `${blog.link}${separator}from=home`;
    
    // Add transition class to body to handle page-level animation
    document.body.classList.add('page-transitioning');
    
    // Navigate after the zoom animation completes
    setTimeout(() => {
      window.location.href = linkWithParam;
    }, 400); // Match this with the CSS transition duration
  }, [blog.link, isTransitioning]);

  // Card transform style derived from state
  const cardTransformStyle = useMemo(() => ({
    transform: isHovering && !isTransitioning
      ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.05)` 
      : 'rotateX(0deg) rotateY(0deg) scale(1)',
    transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
  }), [isHovering, isTransitioning, rotation.x, rotation.y]);

  // Content transform style
  const contentTransformStyle = useMemo(() => ({
    transform: isHovering && !isTransitioning ? 'translateZ(20px)' : 'translateZ(0)'
  }), [isHovering, isTransitioning]);

  // Icon transform style
  const iconTransformStyle = useMemo(() => ({
    transform: isHovering ? 'translateZ(40px)' : 'translateZ(0)'
  }), [isHovering]);

  return (
    <motion.div
      ref={cardRef}
      className={`
        group relative
        ${blog.link ? 'cursor-pointer' : ''}
        [perspective:800px]
      `}
      onClick={handleBlogClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isTransitioning ? 1.2 : 1,
        opacity: isTransitioning ? 0 : 1,
        zIndex: isTransitioning ? 50 : 'auto',
      }}
      transition={{
        scale: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
        opacity: { duration: 0.3, delay: 0.1 }
      }}
    >
      <div
        className={`
          relative rounded-xl p-3
          bg-[#1A1A1A]
          hover:shadow-xl
          transition-all duration-300 ease-out
          [transform-style:preserve-3d]
        `}
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

        {blog.link && !isTransitioning && (
          <div
            className="absolute top-2.5 right-2.5 text-slate-400 group-hover:text-slate-100 
                     p-1 rounded-full group-hover:bg-slate-600/50
                     transition-all duration-300 ease-out"
            style={iconTransformStyle}
            aria-label={`Open ${blog.title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
});

BlogItem.displayName = "BlogItem";

export const BlogMessage = ({ content, blogs, bubbleClass, bubbleMaxWidth }: {
  content?: string;
  blogs?: BlogItemType[];
  bubbleClass: string;
  bubbleMaxWidth: string;
}) => {
  return (
    <div className={`${bubbleClass} px-4 py-2 ${bubbleMaxWidth} relative`}>
      <div className="space-y-2">
        {content && <p className="text-[14px] leading-tight mb-3">{content}</p>}
        {blogs && blogs.length > 0 && (
          <div className="space-y-2 mt-3">
            {blogs.map((blog, index) => (
              <BlogItem key={index} blog={blog}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};