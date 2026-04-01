"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Animated Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
        
        {/* Floating Gradient Orbs with Animation */}
        <motion.div 
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/25 to-primary/5 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-chart-2/25 to-chart-2/5 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 20, 0],
            y: [0, 40, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-chart-3/20 to-chart-3/5 rounded-full blur-[80px]" 
        />

        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top Gradient Fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-chart-2/10 border border-primary/20 mb-10 backdrop-blur-sm shadow-lg shadow-primary/5"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-sm font-semibold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Solution Challenge 2026 is Live
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold text-foreground mb-8 tracking-tight"
        >
          <span className="block text-balance">Build Solutions</span>
          <span className="block mt-2">
            <span className="bg-gradient-to-r from-primary via-chart-5 to-chart-2 bg-clip-text text-transparent">
              That Matter
            </span>
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-pretty"
        >
          Join a global community of innovators using technology to address the 
          world&apos;s most pressing challenges. Build with purpose. Create lasting impact.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 group px-8 py-6 text-base font-semibold rounded-xl"
          >
            <span className="relative z-10 flex items-center">
              Register Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group px-8 py-6 text-base font-medium rounded-xl backdrop-blur-sm"
          >
            <Play className="mr-2 w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            Watch Video
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-3xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-6 md:p-10 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/5">
            {[
              { value: "10K+", label: "Global Participants", accent: "primary" },
              { value: "150+", label: "Countries Represented", accent: "chart-2" },
              { value: "$100K", label: "Total Prize Pool", accent: "chart-3" },
              { value: "48h", label: "Of Innovation", accent: "chart-5" },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group cursor-default"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-br from-${stat.accent} to-${stat.accent}/70 bg-clip-text text-transparent mb-2`}>
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
