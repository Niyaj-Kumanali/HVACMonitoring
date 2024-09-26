// src/hooks/useIdle.ts
import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to detect user inactivity based on a specified timeout.
 * @param timeout Time in milliseconds before the app is considered idle.
 * @returns Boolean value indicating whether the app is idle.
 */
const useIdle = (timeout: number) => {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);



  useEffect(() => {
    const resetIdleTimer = () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        setIsIdle(false);
        timerRef.current = setTimeout(() => {
          setIsIdle(true);
        }, timeout);
      };
      
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    events.forEach((event) => window.addEventListener(event, resetIdleTimer));

    resetIdleTimer(); // Initialize the idle timer when the component mounts

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeout]);

  return isIdle;
};

export default useIdle;
