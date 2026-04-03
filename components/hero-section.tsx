"use client"

import { motion } from "framer-motion"
import { ArrowRight, MapPin, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Google "G" logo — four-color SVG */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  )
}

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16"
    >
      {/* Depth overlays */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">

        {/* GDG Organizer badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20 mb-10 backdrop-blur-sm shadow-lg shadow-primary/5"
        >
          <GoogleLogo className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold text-foreground">
            Google Developer Groups On Campus, Penn State
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground mb-6 tracking-tight"
        >
          <span className="block text-balance">Solution</span>
          <span className="block mt-2">
            <span className="bg-gradient-to-r from-primary via-chart-5 to-chart-2 bg-clip-text text-transparent">
              Challenge
            </span>
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed text-pretty"
        >
          A thrilling two-day hackathon where you build technology solutions for the world&apos;s
          most pressing challenges. Winners advance to the{" "}
          <span className="text-foreground font-medium">North America regional round held by Google.</span>
        </motion.p>

        {/* Event details pill row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1.5 bg-card border border-border rounded-full px-4 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            April 11 – 12, 2026
          </span>
          <span className="flex items-center gap-1.5 bg-card border border-border rounded-full px-4 py-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            7:00 PM – 12:00 PM
          </span>
          <span className="flex items-center gap-1.5 bg-card border border-border rounded-full px-4 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            ECoRE Building, University Park, PA
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 group px-8 py-6 text-base font-semibold rounded-xl"
            asChild
          >
            <a href="/register">
              Register Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </Button>
          <a
            href="mailto:gdg@psu.edu?subject=Solution%20Challenge%20General%20Inquiry"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-muted-foreground border-2 border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground transition-all duration-300 rounded-xl backdrop-blur-sm"
          >
            Contact Us
          </a>
        </motion.div>

        {/* Google branding lockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex items-center justify-center gap-3 text-sm text-muted-foreground"
        >
          <span>Presented by</span>
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 shadow-sm">
            <GoogleLogo className="w-5 h-5" />
            <span className="font-semibold text-foreground">Google Developer Groups</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-3xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-6 md:p-10 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5">
            {[
              { value: "17h", label: "Of Hacking" },
              { value: "6", label: "Challenge Tracks" },
              { value: "4", label: "Members Per Team" },
              { value: "🌎", label: "Regional Finals" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group cursor-default"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-20 md:bottom-32 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
