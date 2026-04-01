"use client"

import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const sponsors = {
  platinum: [
    { name: "TechCorp", initial: "T" },
    { name: "InnovateLabs", initial: "I" },
  ],
  gold: [
    { name: "CloudSync", initial: "C" },
    { name: "DataFlow", initial: "D" },
    { name: "DevStudio", initial: "D" },
  ],
  silver: [
    { name: "CodeBase", initial: "C" },
    { name: "AppWorks", initial: "A" },
    { name: "ByteShift", initial: "B" },
    { name: "PixelLabs", initial: "P" },
  ],
}

const tierConfig = {
  platinum: {
    label: "Platinum Partners",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-500/10 to-purple-500/10",
    borderColor: "border-violet-500/30",
    size: "lg",
  },
  gold: {
    label: "Gold Partners",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-500/30",
    size: "md",
  },
  silver: {
    label: "Silver Partners",
    gradient: "from-slate-400 to-slate-500",
    bgGradient: "from-slate-400/10 to-slate-500/10",
    borderColor: "border-slate-400/30",
    size: "sm",
  },
}

export function SponsorsSection() {
  return (
    <section id="sponsors" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-primary/10 to-chart-2/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            Our Supporters
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Backed by{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We&apos;re grateful to our amazing sponsors who make this event possible and help 
            empower the next generation of innovators.
          </p>
        </motion.div>

        {/* Sponsors by Tier */}
        <div className="space-y-16">
          {(Object.keys(sponsors) as Array<keyof typeof sponsors>).map((tier, tierIndex) => (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: tierIndex * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Tier Label */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className={`h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-${tier === 'platinum' ? 'violet' : tier === 'gold' ? 'amber' : 'slate'}-500/30`} />
                <div className="flex items-center gap-2">
                  <Star className={`w-4 h-4 ${tier === 'platinum' ? 'text-violet-500' : tier === 'gold' ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span className={`text-sm font-semibold uppercase tracking-wider ${tier === 'platinum' ? 'text-violet-500' : tier === 'gold' ? 'text-amber-500' : 'text-slate-400'}`}>
                    {tierConfig[tier].label}
                  </span>
                  <Star className={`w-4 h-4 ${tier === 'platinum' ? 'text-violet-500' : tier === 'gold' ? 'text-amber-500' : 'text-slate-400'}`} />
                </div>
                <div className={`h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-${tier === 'platinum' ? 'violet' : tier === 'gold' ? 'amber' : 'slate'}-500/30`} />
              </div>

              {/* Sponsors Grid */}
              <div className={`flex flex-wrap justify-center gap-6 ${tier === 'platinum' ? 'gap-8' : ''}`}>
                {sponsors[tier].map((sponsor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="group"
                  >
                    <div className={`
                      relative bg-card border-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden
                      ${tier === 'platinum' ? 'w-44 h-36 border-violet-500/20 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10' : ''}
                      ${tier === 'gold' ? 'w-36 h-28 border-amber-500/20 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10' : ''}
                      ${tier === 'silver' ? 'w-32 h-24 border-slate-500/20 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/5' : ''}
                    `}>
                      {/* Hover Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tierConfig[tier].bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <div className={`
                          rounded-xl flex items-center justify-center mb-2 transition-all duration-300
                          ${tier === 'platinum' ? 'w-14 h-14 bg-violet-500/10 group-hover:bg-violet-500/20' : ''}
                          ${tier === 'gold' ? 'w-11 h-11 bg-amber-500/10 group-hover:bg-amber-500/20' : ''}
                          ${tier === 'silver' ? 'w-9 h-9 bg-slate-500/10 group-hover:bg-slate-500/20' : ''}
                        `}>
                          <span className={`
                            font-bold transition-colors duration-300
                            ${tier === 'platinum' ? 'text-2xl text-violet-500' : ''}
                            ${tier === 'gold' ? 'text-xl text-amber-500' : ''}
                            ${tier === 'silver' ? 'text-lg text-slate-500' : ''}
                          `}>
                            {sponsor.initial}
                          </span>
                        </div>
                        <span className={`
                          font-medium text-muted-foreground group-hover:text-foreground transition-colors
                          ${tier === 'platinum' ? 'text-sm' : 'text-xs'}
                        `}>
                          {sponsor.name}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Become a Sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
            <div className="text-center sm:text-left">
              <p className="text-foreground font-semibold mb-1">Want to support innovation?</p>
              <p className="text-sm text-muted-foreground">Join our sponsors and make a difference</p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 transition-all duration-300 group rounded-xl px-6">
              Become a Sponsor
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
