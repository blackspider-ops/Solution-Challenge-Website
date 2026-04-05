"use client"

import { motion } from "framer-motion"
import { Heart, Leaf, GraduationCap, ShieldCheck, Accessibility, Zap, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { TRACKS } from "@/lib/tracks-data"
import type { LucideIcon } from "lucide-react"
import { useIsMobile } from "@/lib/use-reduced-motion"

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Leaf, GraduationCap, ShieldCheck, Accessibility, Zap,
}

export function TracksSection() {
  const isMobile = useIsMobile();

  return (
    <section id="tracks" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 via-muted/30 to-background" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={isMobile ? {} : { opacity: 0, y: 20 }}
          whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Challenge Categories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Impact Area
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Select a track aligned with your passion and build solutions that address the
            United Nations Sustainable Development Goals.
          </p>
        </motion.div>

        {/* Tracks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRACKS.map((track, index) => {
            const Icon = ICON_MAP[track.icon] ?? Zap
            return (
              <motion.div
                key={track.slug}
                initial={isMobile ? {} : { opacity: 0, y: 20 }}
                whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.4, 
                  delay: isMobile ? 0 : index * 0.05, 
                  ease: "easeOut" 
                }}
              >
                {/* Card links to the detail page — the page itself enforces visibility */}
                <Link href={`/tracks/${track.slug}`} className="block h-full">
                  <motion.div
                    whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group relative h-full bg-card border-2 border-border rounded-3xl p-8 cursor-pointer hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    {/* Hover Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${track.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl ${track.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-8 h-8 ${track.iconColor}`} />
                      </div>

                      {/* Title */}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-foreground pr-4">
                          {track.name}
                        </h3>
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0 shrink-0`}>
                          <ArrowUpRight className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Description — only the short public summary */}
                      <p className="text-muted-foreground leading-relaxed">
                        {track.description}
                      </p>
                    </div>

                    {/* Bottom gradient line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${track.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
