// ============================================
// FILE: src/hooks/useCountUp.js - FIXED
// ============================================
import { useEffect, useRef, useState } from 'react';

export const useCountUp = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const resetRef = useRef(true);

  useEffect(() => {
    resetRef.current = true;
    
    if (end === 0) return; // Don't animate if end is 0
    
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (resetRef.current) {
        setCount(start);
        resetRef.current = false;
      }
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      if (progress < 1) {
        setCount(Math.floor(start + (end - start) * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start]);

  return count;
};