"use client";

import { useEffect, useState } from "react";

export function MobilePreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = window.innerWidth < 768;
    setIsMobile(checkMobile);

    if (checkMobile) {
      // Wait for everything to load
      const handleLoad = () => {
        // Add a small delay to ensure everything is rendered
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      };

      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Don't show preloader on desktop
  if (!isMobile || !isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* GDG Logo */}
        <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center">
          <img 
            src="https://www.gdgpsu.dev/api/media?path=1762291432641-c8uv057d7gi.png" 
            alt="GDG PSU" 
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary rounded-full animate-spin" />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground mb-1">Loading Solution Challenge</p>
          <p className="text-xs text-muted-foreground">Preparing your experience...</p>
        </div>
      </div>
    </div>
  );
}
