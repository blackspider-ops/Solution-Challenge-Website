"use client"

import { motion } from "framer-motion"
import { ArrowRight, MapPin, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RegisterDialog } from "@/components/auth/register-dialog"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

/** GDG PSU logo */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <img 
      src="https://www.gdgpsu.dev/api/media?path=1762291432641-c8uv057d7gi.png" 
      alt="GDG PSU" 
      className={className}
    />
  )
}

export function HeroSection() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Disable animations on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const shouldAnimate = !isMobile

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24 pb-16 px-4"
    >
      {/* Depth overlays */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full sm:px-6 lg:px-8 text-center relative">

        {/* GDG Organizer badge */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20 mb-6 sm:mb-10 backdrop-blur-sm shadow-lg shadow-primary/5"
        >
          <GoogleLogo className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-foreground">
            <span className="hidden sm:inline">Google Developer Groups On Campus, Penn State</span>
            <span className="sm:hidden">GDG Penn State</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: shouldAnimate ? 0.1 : 0 }}
          className="text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight leading-tight"
        >
          <span className="block">Solution</span>
          <span className="block mt-1 sm:mt-2">
            <span className="bg-gradient-to-r from-primary via-chart-5 to-chart-2 bg-clip-text text-transparent">
              Challenge
            </span>
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: shouldAnimate ? 0.15 : 0 }}
          className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2"
        >
          A thrilling two-day hackathon where you build technology solutions for the world&apos;s
          most pressing challenges. Winners advance to the{" "}
          <span className="text-foreground font-medium">North America regional round held by Google.</span>
        </motion.p>

        {/* Event details pill row */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: shouldAnimate ? 0.2 : 0 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 text-xs sm:text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 sm:px-4 py-1.5 whitespace-nowrap">
            <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary shrink-0" />
            April 11 – 12, 2026
          </span>
          <span className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 sm:px-4 py-1.5 text-center">
            <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary shrink-0" />
            <span className="hidden sm:inline">April 11, 7:00 PM – April 12, 12:00 PM (Noon)</span>
            <span className="sm:hidden">Apr 11, 7PM – Apr 12, 12PM</span>
          </span>
          <span className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 sm:px-4 py-1.5 whitespace-nowrap">
            <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary shrink-0" />
            <a 
              href="https://www.google.com/maps?q=40.79299139676293,-77.87067405918272" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <span className="hidden sm:inline">ECoRE Building, University Park, PA</span>
              <span className="sm:hidden">ECoRE Building, PSU</span>
            </a>
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: shouldAnimate ? 0.25 : 0 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-5 max-w-md sm:max-w-none mx-auto"
          suppressHydrationWarning
        >
          {!mounted || status === "loading" ? (
            <div className="h-12 sm:h-14 w-full sm:w-48 bg-muted animate-pulse rounded-xl" />
          ) : session ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 sm:hover:scale-105 transition-all duration-200 group px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          ) : (
            <RegisterDialog>
              <Button
                size="lg"
                className="w-full sm:w-auto relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 sm:hover:scale-105 transition-all duration-200 group px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl"
              >
                Register Now
                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </RegisterDialog>
          )}
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 text-sm sm:text-base font-medium text-muted-foreground border-2 border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground active:scale-95 transition-all duration-200 rounded-xl backdrop-blur-sm"
          >
            Contact Us
          </a>
        </motion.div>

        {/* Google branding lockup */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: shouldAnimate ? 0.35 : 0 }}
          className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
        >
          <span>Presented by</span>
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 sm:px-4 py-2 shadow-sm">
            <GoogleLogo className="w-4 sm:w-5 h-4 sm:h-5 shrink-0" />
            <span className="font-semibold text-foreground text-xs sm:text-sm">
              <span className="hidden sm:inline">Google Developer Groups</span>
              <span className="sm:hidden">GDG</span>
            </span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: shouldAnimate ? 0.4 : 0 }}
          className="mt-12 sm:mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-2xl sm:rounded-3xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5">
            {[
              { value: "17h", label: "Of Hacking" },
              { value: "6", label: "Challenge Tracks" },
              { value: "4", label: "Members Per Team" },
              { value: "🌎", label: "Regional Finals" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      {shouldAnimate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
          onClick={() => {
            const tracksSection = document.getElementById('tracks');
            if (tracksSection) {
              tracksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          <motion.button
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Scroll to tracks section"
          >
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Scroll</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-primary rounded-full"
              />
            </div>
          </motion.button>
        </motion.div>
      )}
    </section>
  )
}
