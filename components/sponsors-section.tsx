"use client"

import { motion } from "framer-motion"

const sponsors = [
  { name: "TechCorp", tier: "platinum" },
  { name: "InnovateLabs", tier: "platinum" },
  { name: "CloudSync", tier: "gold" },
  { name: "DataFlow", tier: "gold" },
  { name: "DevStudio", tier: "gold" },
  { name: "CodeBase", tier: "silver" },
  { name: "AppWorks", tier: "silver" },
  { name: "ByteShift", tier: "silver" },
]

export function SponsorsSection() {
  return (
    <section id="sponsors" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Sponsors</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;re grateful to our amazing sponsors who make this event possible and help 
            empower the next generation of innovators.
          </p>
        </motion.div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div className="aspect-[3/2] bg-card border border-border rounded-xl flex items-center justify-center p-6 grayscale hover:grayscale-0 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="text-xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {sponsor.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {sponsor.name}
                  </span>
                  <div className="mt-1">
                    <span className={`text-xs capitalize ${
                      sponsor.tier === "platinum" ? "text-primary" :
                      sponsor.tier === "gold" ? "text-chart-3" :
                      "text-muted-foreground"
                    }`}>
                      {sponsor.tier}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Become a Sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Interested in sponsoring?</p>
          <a
            href="#"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Become a Sponsor
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
