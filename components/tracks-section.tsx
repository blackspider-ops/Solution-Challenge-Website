"use client"

import { motion } from "framer-motion"
import { Heart, Leaf, GraduationCap, ShieldCheck, Accessibility, Zap, ArrowUpRight } from "lucide-react"

const tracks = [
  {
    icon: Heart,
    title: "Health & Wellbeing",
    description: "Create solutions that improve healthcare access, mental health support, and overall wellbeing for communities worldwide.",
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-500/10 to-pink-500/10",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-500",
  },
  {
    icon: Leaf,
    title: "Climate Action",
    description: "Build tools to combat climate change, promote sustainability, and protect our planet for future generations.",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
  },
  {
    icon: GraduationCap,
    title: "Quality Education",
    description: "Develop platforms that make education accessible, engaging, and effective for learners everywhere.",
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-500/10 to-indigo-500/10",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
  },
  {
    icon: ShieldCheck,
    title: "Peace & Justice",
    description: "Design systems that promote transparency, accountability, and access to justice for all people.",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/10 to-purple-500/10",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500",
  },
  {
    icon: Accessibility,
    title: "Reduced Inequalities",
    description: "Create inclusive technology that bridges gaps and empowers underserved communities globally.",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500",
  },
  {
    icon: Zap,
    title: "Innovation & Infrastructure",
    description: "Build foundational tools and systems that drive technological advancement and connectivity.",
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-500",
  },
]

export function TracksSection() {
  return (
    <section id="tracks" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 via-muted/30 to-background" />
      
      <div className="max-w-7xl mx-auto">
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
            Challenge Categories
          </motion.span>
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
          {tracks.map((track, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative h-full bg-card border-2 border-border rounded-3xl p-8 cursor-pointer hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${track.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${track.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <track.icon className={`w-8 h-8 ${track.iconColor}`} />
                  </div>

                  {/* Title with Arrow */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-foreground transition-colors pr-4">
                      {track.title}
                    </h3>
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${track.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0`}>
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {track.description}
                  </p>
                </div>

                {/* Bottom Gradient Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${track.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
