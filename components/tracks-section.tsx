"use client"

import { motion } from "framer-motion"
import { Heart, Leaf, GraduationCap, ShieldCheck, Accessibility, Zap } from "lucide-react"

const tracks = [
  {
    icon: Heart,
    title: "Health & Wellbeing",
    description: "Create solutions that improve healthcare access, mental health support, and overall wellbeing.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: Leaf,
    title: "Climate Action",
    description: "Build tools to combat climate change, promote sustainability, and protect our environment.",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: GraduationCap,
    title: "Quality Education",
    description: "Develop platforms that make education accessible, engaging, and effective for all learners.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: ShieldCheck,
    title: "Peace & Justice",
    description: "Design systems that promote transparency, accountability, and access to justice.",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    icon: Accessibility,
    title: "Reduced Inequalities",
    description: "Create inclusive technology that bridges gaps and empowers underserved communities.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: Zap,
    title: "Innovation & Infrastructure",
    description: "Build foundational tools and systems that drive technological advancement.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function TracksSection() {
  return (
    <section id="tracks" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Challenge Tracks</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose a track that aligns with your passion and build solutions that address the 
            United Nations Sustainable Development Goals.
          </p>
        </motion.div>

        {/* Tracks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${track.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <track.icon className={`w-7 h-7 ${track.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {track.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {track.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
