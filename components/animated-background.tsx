"use client"

import { motion } from "framer-motion"

// Small illustrated characters doing hackathon activities
function CodingPerson({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className}>
      {/* Person sitting at laptop */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Chair */}
        <rect x="25" y="55" width="30" height="5" rx="2" fill="currentColor" opacity="0.3" />
        <rect x="38" y="55" width="4" height="10" fill="currentColor" opacity="0.2" />
        {/* Body */}
        <ellipse cx="40" cy="45" rx="12" ry="15" fill="currentColor" opacity="0.6" />
        {/* Head */}
        <circle cx="40" cy="28" r="10" fill="currentColor" opacity="0.8" />
        {/* Laptop */}
        <rect x="28" y="50" width="24" height="2" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="30" y="42" width="20" height="10" rx="2" fill="currentColor" opacity="0.5" />
        {/* Screen glow */}
        <motion.rect
          x="32" y="44" width="16" height="6" rx="1"
          fill="currentColor"
          opacity="0.3"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Arms */}
        <ellipse cx="28" cy="45" rx="4" ry="6" fill="currentColor" opacity="0.5" />
        <ellipse cx="52" cy="45" rx="4" ry="6" fill="currentColor" opacity="0.5" />
      </motion.g>
    </svg>
  )
}

function BrainstormingPerson({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className}>
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Body */}
        <ellipse cx="40" cy="55" rx="14" ry="18" fill="currentColor" opacity="0.6" />
        {/* Head */}
        <circle cx="40" cy="30" r="12" fill="currentColor" opacity="0.8" />
        {/* Hand raised with lightbulb */}
        <ellipse cx="58" cy="35" rx="5" ry="7" fill="currentColor" opacity="0.5" />
        {/* Lightbulb */}
        <motion.g
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <circle cx="62" cy="22" r="6" fill="currentColor" opacity="0.4" />
          <circle cx="62" cy="22" r="4" fill="currentColor" opacity="0.6" />
        </motion.g>
        {/* Idea sparkles */}
        <motion.circle
          cx="55" cy="18" r="2"
          fill="currentColor"
          opacity="0.4"
          animate={{ scale: [0, 1, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="68" cy="15" r="1.5"
          fill="currentColor"
          opacity="0.3"
          animate={{ scale: [0, 1, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        />
      </motion.g>
    </svg>
  )
}

function CollaboratingPeople({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" className={className}>
      <motion.g
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Person 1 */}
        <ellipse cx="30" cy="55" rx="12" ry="16" fill="currentColor" opacity="0.6" />
        <circle cx="30" cy="32" r="10" fill="currentColor" opacity="0.8" />
        {/* Person 2 */}
        <ellipse cx="70" cy="55" rx="12" ry="16" fill="currentColor" opacity="0.6" />
        <circle cx="70" cy="32" r="10" fill="currentColor" opacity="0.8" />
        {/* Whiteboard between them */}
        <rect x="40" y="25" width="20" height="30" rx="2" fill="currentColor" opacity="0.3" />
        {/* Content on board */}
        <motion.rect
          x="43" y="30" width="14" height="2" rx="1"
          fill="currentColor" opacity="0.5"
          animate={{ width: [14, 10, 14] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <rect x="43" y="35" width="10" height="2" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="43" y="40" width="12" height="2" rx="1" fill="currentColor" opacity="0.4" />
        {/* Arms pointing */}
        <ellipse cx="42" cy="45" rx="5" ry="4" fill="currentColor" opacity="0.5" />
        <ellipse cx="58" cy="45" rx="5" ry="4" fill="currentColor" opacity="0.5" />
      </motion.g>
    </svg>
  )
}

function RocketPerson({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" fill="none" className={className}>
      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Person */}
        <ellipse cx="30" cy="65" rx="12" ry="16" fill="currentColor" opacity="0.6" />
        <circle cx="30" cy="42" r="10" fill="currentColor" opacity="0.8" />
        {/* Arm holding rocket */}
        <ellipse cx="42" cy="55" rx="6" ry="5" fill="currentColor" opacity="0.5" />
        {/* Rocket */}
        <motion.g
          animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path d="M55 55 L65 35 L75 55 Z" fill="currentColor" opacity="0.7" />
          <rect x="58" y="55" width="14" height="8" rx="2" fill="currentColor" opacity="0.5" />
          {/* Flame */}
          <motion.ellipse
            cx="65" cy="68" rx="5" ry="8"
            fill="currentColor" opacity="0.4"
            animate={{ scaleY: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        </motion.g>
      </motion.g>
    </svg>
  )
}

function CoffeePerson({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className}>
      <motion.g
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Body */}
        <ellipse cx="40" cy="55" rx="12" ry="16" fill="currentColor" opacity="0.6" />
        {/* Head */}
        <circle cx="40" cy="32" r="10" fill="currentColor" opacity="0.8" />
        {/* Arm with coffee */}
        <ellipse cx="55" cy="48" rx="6" ry="5" fill="currentColor" opacity="0.5" />
        {/* Coffee cup */}
        <rect x="58" y="42" width="10" height="14" rx="2" fill="currentColor" opacity="0.6" />
        <rect x="68" y="46" width="4" height="6" rx="1" fill="currentColor" opacity="0.4" />
        {/* Steam */}
        <motion.path
          d="M61 38 Q63 34 61 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
          animate={{ y: [0, -3, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M65 38 Q67 34 65 30"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
          animate={{ y: [0, -3, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </motion.g>
    </svg>
  )
}

function PresentingPerson({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" className={className}>
      <motion.g
        animate={{ x: [-1, 1, -1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Presentation screen */}
        <rect x="10" y="15" width="50" height="35" rx="3" fill="currentColor" opacity="0.25" />
        <rect x="30" y="50" width="10" height="8" fill="currentColor" opacity="0.2" />
        <rect x="20" y="58" width="30" height="3" rx="1" fill="currentColor" opacity="0.2" />
        {/* Chart on screen */}
        <rect x="15" y="35" width="6" height="10" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="24" y="30" width="6" height="15" rx="1" fill="currentColor" opacity="0.4" />
        <rect x="33" y="25" width="6" height="20" rx="1" fill="currentColor" opacity="0.4" />
        <motion.rect
          x="42" y="20" width="6" height="25" rx="1"
          fill="currentColor" opacity="0.5"
          animate={{ height: [25, 28, 25] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Presenter */}
        <ellipse cx="78" cy="55" rx="12" ry="16" fill="currentColor" opacity="0.6" />
        <circle cx="78" cy="32" r="10" fill="currentColor" opacity="0.8" />
        {/* Pointing arm */}
        <motion.ellipse
          cx="65" cy="40" rx="8" ry="4"
          fill="currentColor" opacity="0.5"
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>
    </svg>
  )
}

function HighFivePeople({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" className={className}>
      <motion.g
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Person 1 */}
        <ellipse cx="30" cy="55" rx="12" ry="16" fill="currentColor" opacity="0.6" />
        <circle cx="30" cy="32" r="10" fill="currentColor" opacity="0.8" />
        {/* Person 2 */}
        <ellipse cx="70" cy="55" rx="12" ry="16" fill="currentColor" opacity="0.6" />
        <circle cx="70" cy="32" r="10" fill="currentColor" opacity="0.8" />
        {/* Arms meeting in high five */}
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <ellipse cx="42" cy="35" rx="6" ry="5" fill="currentColor" opacity="0.5" />
          <ellipse cx="58" cy="35" rx="6" ry="5" fill="currentColor" opacity="0.5" />
          {/* Impact burst */}
          <motion.circle
            cx="50" cy="32" r="8"
            fill="currentColor" opacity="0.2"
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.g>
        {/* Celebration sparkles */}
        <motion.circle
          cx="45" cy="22" r="2"
          fill="currentColor" opacity="0.4"
          animate={{ y: [-2, -8], opacity: [0.4, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.circle
          cx="55" cy="20" r="1.5"
          fill="currentColor" opacity="0.3"
          animate={{ y: [-2, -10], opacity: [0.3, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
        />
      </motion.g>
    </svg>
  )
}

function FloatingCode({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" fill="none" className={className}>
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="5" y="5" width="50" height="30" rx="4" fill="currentColor" opacity="0.15" />
        <motion.rect
          x="10" y="10" width="20" height="3" rx="1"
          fill="currentColor" opacity="0.4"
          animate={{ width: [20, 25, 20] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <rect x="10" y="16" width="30" height="3" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="10" y="22" width="15" height="3" rx="1" fill="currentColor" opacity="0.3" />
        <motion.rect
          x="28" y="22" width="12" height="3" rx="1"
          fill="currentColor" opacity="0.5"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>
    </svg>
  )
}

const characters = [
  { Component: CodingPerson, position: "top-[15%] left-[5%]", size: "w-20 h-20", color: "text-primary/30", delay: 0 },
  { Component: BrainstormingPerson, position: "top-[8%] right-[12%]", size: "w-16 h-16", color: "text-chart-2/25", delay: 0.5 },
  { Component: CollaboratingPeople, position: "top-[35%] left-[3%]", size: "w-24 h-20", color: "text-chart-5/25", delay: 1 },
  { Component: RocketPerson, position: "bottom-[30%] right-[5%]", size: "w-18 h-24", color: "text-chart-3/30", delay: 1.5 },
  { Component: CoffeePerson, position: "bottom-[15%] left-[8%]", size: "w-16 h-16", color: "text-primary/25", delay: 2 },
  { Component: PresentingPerson, position: "top-[55%] right-[3%]", size: "w-24 h-20", color: "text-chart-2/30", delay: 0.3 },
  { Component: HighFivePeople, position: "bottom-[40%] left-[2%]", size: "w-24 h-20", color: "text-chart-5/30", delay: 0.8 },
  { Component: FloatingCode, position: "top-[25%] right-[6%]", size: "w-16 h-12", color: "text-primary/20", delay: 1.2 },
  { Component: CodingPerson, position: "bottom-[20%] right-[10%]", size: "w-14 h-14", color: "text-chart-3/25", delay: 1.8 },
  { Component: FloatingCode, position: "top-[60%] left-[6%]", size: "w-14 h-10", color: "text-chart-2/20", delay: 2.2 },
]

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-chart-2/[0.02]" />
      
      {/* Animated gradient orbs */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, -60, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-chart-2/10 to-transparent rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-chart-5/8 to-transparent rounded-full blur-[100px]" 
      />

      {/* Subtle dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Animated characters */}
      {characters.map((char, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: char.delay,
            ease: [0.22, 1, 0.36, 1]
          }}
          className={`absolute ${char.position} ${char.size} ${char.color}`}
        >
          <char.Component className="w-full h-full" />
        </motion.div>
      ))}

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
          style={{
            left: `${10 + (i * 7)}%`,
            top: `${15 + ((i * 13) % 70)}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}
