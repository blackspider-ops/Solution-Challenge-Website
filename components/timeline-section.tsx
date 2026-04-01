"use client"

import { motion } from "framer-motion"
import { UserPlus, Users, Upload, Trophy, ArrowRight } from "lucide-react"

const timelineSteps = [
  {
    icon: UserPlus,
    title: "Registration",
    date: "Jan 15 - Feb 28",
    description: "Sign up individually or as a team. All skill levels are welcome to participate.",
    status: "active",
  },
  {
    icon: Users,
    title: "Team Formation",
    date: "Mar 1 - Mar 15",
    description: "Connect with teammates, brainstorm ideas, and prepare your winning strategy.",
    status: "upcoming",
  },
  {
    icon: Upload,
    title: "Submission",
    date: "Mar 16 - Apr 30",
    description: "Build your solution with the best tools and submit your project for review.",
    status: "upcoming",
  },
  {
    icon: Trophy,
    title: "Awards Ceremony",
    date: "May 15",
    description: "Top projects are evaluated by experts and winners are announced globally.",
    status: "upcoming",
  },
]

export function TimelineSection() {
  return (
    <section id="timeline" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
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
            Follow these key milestones to participate in the challenge and make your mark 
            on the future of technology.
          </p>
        </motion.div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-1 -translate-y-1/2">
            <div className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full" />
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 0.25 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-primary to-chart-2 rounded-full origin-left"
            />
          </div>

          <div className="grid lg:grid-cols-4 gap-8 lg:gap-6">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Card */}
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`relative bg-card border-2 rounded-3xl p-8 transition-all duration-500 group cursor-pointer ${
                    step.status === "active" 
                      ? "border-primary/40 shadow-xl shadow-primary/10" 
                      : "border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                  }`}
                >
                  {/* Active Indicator Glow */}
                  {step.status === "active" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl" />
                  )}

                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 -right-4 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg ${
                    step.status === "active"
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-primary/30"
                      : "bg-card border-2 border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-primary"
                  } transition-all duration-300`}>
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    step.status === "active"
                      ? "bg-primary/15"
                      : "bg-muted group-hover:bg-primary/10"
                  }`}>
                    <step.icon className={`w-8 h-8 transition-colors duration-300 ${
                      step.status === "active" ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    }`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className={`text-sm font-semibold mb-3 ${
                    step.status === "active" ? "text-primary" : "text-chart-2"
                  }`}>
                    {step.date}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>

                  {/* Arrow for Active */}
                  {step.status === "active" && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mt-6 flex items-center text-primary text-sm font-medium"
                    >
                      Register Now <ArrowRight className="ml-2 w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Mobile Connection Line */}
                {index < timelineSteps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-primary/20 rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
