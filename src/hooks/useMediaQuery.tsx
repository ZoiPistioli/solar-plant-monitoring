import { useCallback, useEffect, useState } from 'react';

/**
 * Detects if a media query matches the current viewport
 * @param width - Breakpoint width in pixels
 * @returns boolean indicating if the viewport width is less than or equal to the specified width
 */
export const useMediaQuery = (width: number) => {
    const [targetReached, setTargetReached] = useState(false);
  
    const updateTarget = useCallback((e: MediaQueryListEvent) => {
      if (e.matches) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }
    }, []);
  
    useEffect(() => {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      if (media.addEventListener) {
        media.addEventListener("change", updateTarget);
      } else {
        media.addListener(updateTarget);
      }
      if (media.matches) {
        setTargetReached(true);
      }
      if (media.removeEventListener) {
        return () => media.removeEventListener('change', updateTarget);
      } else {
        return () => media.removeListener(updateTarget);
      }
    }, []);
  
    return targetReached;
  };