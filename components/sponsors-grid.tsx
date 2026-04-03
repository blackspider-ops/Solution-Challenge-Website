"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

type Sponsor = {
  id: string
  name: string
  initial: string
  tier: "platinum" | "gold" | "silver"
  logoUrl: string | null
  websiteUrl: string | null
  order: number
}

type SponsorsGridProps = {
  sponsors: {
    platinum: Sponsor[]
    gold: Sponsor[]
    silver: Sponsor[]
  }
}

const tierConfig = {
  platinum: {
    label: "Platinum Partners",
    color: "violet",
    size: "lg",
  },
  gold: {
    label: "Gold Partners",
    color: "amber",
    size: "md",
  },
  silver: {
    label: "Silver Partners",
    color: "slate",
    size: "sm",
  },
}

export function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  return (
    <div className="space-y-16">
      {(Object.keys(sponsors) as Array<keyof typeof sponsors>).map((tier, tierIndex) => {
        const tierSponsors = sponsors[tier]
        if (tierSponsors.length === 0) return null
        
        const config = tierConfig[tier]
        
        return (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: tierIndex * 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Tier Label */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className={`h-px flex-1 max-w-20 ${
                tier === 'platinum' ? 'bg-gradient-to-r from-transparent to-violet-500/30' :
                tier === 'gold' ? 'bg-gradient-to-r from-transparent to-amber-500/30' :
                'bg-gradient-to-r from-transparent to-slate-500/30'
              }`} />
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${
                  tier === 'platinum' ? 'text-violet-500' :
                  tier === 'gold' ? 'text-amber-500' :
                  'text-slate-400'
                }`} />
                <span className={`text-sm font-semibold uppercase tracking-wider ${
                  tier === 'platinum' ? 'text-violet-500' :
                  tier === 'gold' ? 'text-amber-500' :
                  'text-slate-400'
                }`}>
                  {config.label}
                </span>
                <Star className={`w-4 h-4 ${
                  tier === 'platinum' ? 'text-violet-500' :
                  tier === 'gold' ? 'text-amber-500' :
                  'text-slate-400'
                }`} />
              </div>
              <div className={`h-px flex-1 max-w-20 ${
                tier === 'platinum' ? 'bg-gradient-to-l from-transparent to-violet-500/30' :
                tier === 'gold' ? 'bg-gradient-to-l from-transparent to-amber-500/30' :
                'bg-gradient-to-l from-transparent to-slate-500/30'
              }`} />
            </div>

            {/* Sponsors Grid */}
            <div className={`flex flex-wrap justify-center gap-6 ${tier === 'platinum' ? 'gap-8' : ''}`}>
              {tierSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="group"
                >
                  <a
                    href={sponsor.websiteUrl || undefined}
                    target={sponsor.websiteUrl ? "_blank" : undefined}
                    rel={sponsor.websiteUrl ? "noopener noreferrer" : undefined}
                    className={`
                      relative bg-card border-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden
                      ${tier === 'platinum' ? 'w-44 h-36 border-violet-500/20 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10' : ''}
                      ${tier === 'gold' ? 'w-36 h-28 border-amber-500/20 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10' : ''}
                      ${tier === 'silver' ? 'w-32 h-24 border-slate-500/20 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/5' : ''}
                      ${sponsor.websiteUrl ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    {/* Hover Gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      tier === 'platinum' ? 'bg-gradient-to-br from-violet-500/10 to-purple-500/10' :
                      tier === 'gold' ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10' :
                      'bg-gradient-to-br from-slate-400/10 to-slate-500/10'
                    }`} />
                    
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
                        font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center px-2
                        ${tier === 'platinum' ? 'text-sm' : 'text-xs'}
                      `}>
                        {sponsor.name}
                      </span>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
