"use client"

import { motion } from "framer-motion"
import { UserPlus, Users, Upload, Trophy } from "lucide-react"

const timelineSteps = [
  {
    icon: UserPlus,
    title: "Registration",
    date: "Jan 15 - Feb 28",
    description: "Sign up individually or as a team. All skill levels welcome.",
  },
  {
    icon: Users,
    title: "Team Formation",
    date: "Mar 1 - Mar 15",
    description: "Find teammates, brainstorm ideas, and prepare your strategy.",
  },
  {
    icon: Upload,
    title: "Submission",
    date: "Mar 16 - Apr 30",
    description: "Build your solution and submit your project for review.",
  },
  {
    icon: Trophy,
    title: "Judging & Awards",
    date: "May 15",
    description: "Top projects are evaluated and winners are announced.",
  },
]

export function TimelineSection() {
  return (
    <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Event Timeline</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mark your calendars and follow these key milestones to participate in the challenge.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2" />

          <div className="grid md:grid-cols-4 gap-8">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Card */}
                <div className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm font-medium text-primary mb-2">{step.date}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                {/* Mobile Connection Line */}
                {index < timelineSteps.length - 1 && (
                  <div className="md:hidden absolute left-1/2 bottom-0 w-0.5 h-8 bg-primary/30 translate-y-full -translate-x-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
