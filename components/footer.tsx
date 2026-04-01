"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Youtube, ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const footerLinks = {
  event: [
    { label: "About", href: "#" },
    { label: "Timeline", href: "#timeline" },
    { label: "Tracks", href: "#tracks" },
    { label: "Rules", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Workshops", href: "#" },
    { label: "Mentors", href: "#" },
    { label: "Past Winners", href: "#" },
  ],
  support: [
    { label: "FAQ", href: "#faq" },
    { label: "Contact Us", href: "#" },
    { label: "Sponsors", href: "#sponsors" },
    { label: "Code of Conduct", href: "#" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* CTA Banner */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl font-bold text-background mb-3">
                Ready to make an{" "}
                <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  impact
                </span>
                ?
              </h3>
              <p className="text-background/70 max-w-lg">
                Join thousands of innovators building solutions that matter. 
                Registration is free and open to everyone.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group px-8 py-6 text-base font-semibold rounded-xl"
            >
              Register Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="#home" className="flex items-center gap-3 mb-6 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <span className="text-primary-foreground font-bold text-lg">SC</span>
              </motion.div>
              <span className="font-semibold text-xl text-background group-hover:text-primary transition-colors">
                Solution Challenge
              </span>
            </Link>
            <p className="text-background/60 leading-relaxed mb-8 max-w-sm">
              A global hackathon empowering innovators to build technology solutions 
              that address real-world challenges and create lasting impact for communities worldwide.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="w-11 h-11 rounded-xl bg-background/10 hover:bg-primary flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5 text-background" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-background mb-6 text-sm uppercase tracking-wider">Event</h4>
            <ul className="space-y-4">
              {footerLinks.event.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-background/60 hover:text-primary transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-6 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-background/60 hover:text-primary transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-6 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-background/60 hover:text-primary transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> by the Solution Challenge Team
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-sm text-background/50 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-background/50 hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-sm text-background/50">
              &copy; {new Date().getFullYear()} Solution Challenge
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
