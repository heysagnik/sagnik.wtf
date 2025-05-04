import { useRef, useState, useEffect, useCallback } from 'react';

const SCROLL_THRESHOLD = 20;
const AUTO_SCROLL_DELAY = 300;

export function useScrollBehavior() {
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialScroll = useRef(true);
  const isAutoScrolling = useRef(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isAutoScrolling.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
    
    setIsScrolledUp(!isAtBottom);
    setIsHeaderScrolled(scrollTop > 60);
    
    lastScrollTop.current = scrollTop;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;
    
    isAutoScrolling.current = true;
    setIsScrolledUp(false);
    
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      isAutoScrolling.current = false;
    }, AUTO_SCROLL_DELAY);
  }, []);

  const autoScrollOnNewContent = useCallback(() => {
    if (!containerRef.current) return;
    
    if (isInitialScroll.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      isInitialScroll.current = false;
    } else if (!isScrolledUp) {
      isAutoScrolling.current = true;
      
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, AUTO_SCROLL_DELAY);
    }
  }, [isScrolledUp]);

  return {
    containerRef,
    isScrolledUp,
    isHeaderScrolled,
    scrollToBottom,
    autoScrollOnNewContent,
    isAutoScrolling
  };
}