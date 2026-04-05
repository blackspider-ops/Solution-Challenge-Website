"use client";

import { motion, type MotionProps } from "framer-motion";
import { useIsMobile } from "@/lib/use-reduced-motion";
import type { ReactNode } from "react";

/**
 * Wrapper around motion.div that disables animations on mobile
 */
export function ConditionalMotion({ 
  children, 
  className,
  ...motionProps 
}: MotionProps & { children: ReactNode; className?: string }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
