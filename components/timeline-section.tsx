"use client"

import { motion } from "framer-motion"
import { UserPlus, Users, Upload, Trophy, ArrowRight, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { TIMELINE_STEPS, SCHEDULE } from "@/lib/event-config"

const ICON_MAP: Record<string, LucideIcon> = {
  UserPlus, Zap, Users, Upload, Trophy,
}

export function TimelineSection() {
  return (
    <section id="timeline" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

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
            Event Schedule
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Your Journey to{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Innovation
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {SCHEDULE.eventStart.label} through {SCHEDULE.judgingStart.label} at the ECoRE Building, University Park, PA.
          </p>
        </motion.div>

        {/* Timeline grid */}
        <div className="relative">
          <div className="grid lg:grid-cols-5 gap-6">
            {TIMELINE_STEPS.map((step, index) => {
              const Icon = ICON_MAP[step.icon] ?? Zap
              return (
                <motion.div
                  key={step.order}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className={`relative bg-card border-2 rounded-3xl p-6 transition-all duration-500 group cursor-pointer h-full ${
                      step.status === "active"
                        ? "border-primary/40 shadow-xl shadow-primary/10"
                        : "border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                    }`}
                  >
                    {step.status === "active" && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl" />
                    )}

                    {/* Step number */}
                    <div className={`absolute -top-4 -right-4 w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg ${
                      step.status === "active"
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-primary/30"
                        : "bg-card border-2 border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-primary"
                    } transition-all duration-300`}>
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                      step.status === "active" ? "bg-primary/15" : "bg-muted group-hover:bg-primary/10"
                    }`}>
                      <Icon className={`w-6 h-6 transition-colors duration-300 ${
                        step.status === "active" ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                      }`} />
                    </div>

                    <h3 className="text-base font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className={`text-xs font-semibold mb-3 ${
                      step.status === "active" ? "text-primary" : "text-chart-2"
                    }`}>
                      {step.date}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>

                    {step.status === "active" && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-4 flex items-center text-primary text-xs font-medium"
                      >
                        Register Now <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Mobile connector */}
                  {index < TIMELINE_STEPS.length - 1 && (
                    <div className="lg:hidden flex justify-center py-3">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-primary/50 to-primary/20 rounded-full" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Key rules callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 p-5 rounded-2xl bg-primary/5 border border-primary/20 max-w-2xl mx-auto text-center"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Key rules:</span>{" "}
            Team formation and prompt release happen at{" "}
            <span className="text-primary font-medium">{SCHEDULE.teamFormation.label}</span> — 1 hour after kickoff.
            Submissions close at{" "}
            <span className="text-primary font-medium">{SCHEDULE.submissionDeadline.label}</span> — 2 hours before judging.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
