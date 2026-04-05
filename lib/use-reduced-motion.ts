import { useEffect, useState } from "react";

/**
 * Hook to detect if user prefers reduced motion or is on mobile
 * Returns true if animations should be reduced/disabled
 */
export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = () => {
      setShouldReduceMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return shouldReduceMotion;
}

/**
 * Hook to detect mobile devices
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Get optimized animation variants based on device and preferences
 */
export function getAnimationConfig(isMobile: boolean, shouldReduceMotion: boolean) {
  if (shouldReduceMotion) {
    return {
      initial: {},
      animate: {},
      transition: { duration: 0 },
    };
  }

  if (isMobile) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, ease: "easeOut" },
    };
  }

  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  };
}
