"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const footerLinks = {
  event: [
    { label: "About",    href: "#" },
    { label: "Timeline", href: "#timeline" },
    { label: "Tracks",   href: "#tracks" },
    { label: "Rules",    href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Workshops",     href: "#" },
    { label: "Mentors",       href: "#" },
  ],
  support: [
    { label: "FAQ",            href: "#faq" },
    { label: "Contact Us",     href: "#contact" },
    { label: "Sponsors",       href: "#sponsors" },
    { label: "Code of Conduct",href: "#" },
  ],
}

// Social icon SVGs (lucide deprecated these; using inline SVGs instead)
const socialLinks = [
  {
    label: "Twitter / X",
    href: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/gdgpennstate",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/gdgpennstate",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/company/gdgpennstate",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com/@gdgpennstate",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
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
                Join innovators building solutions that matter. Registration is free and open to all Penn State students.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group px-8 py-6 text-base font-semibold rounded-xl"
              asChild
            >
              <Link href="/register">
                Register Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
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
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <GoogleG className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold text-sm text-background group-hover:text-primary transition-colors leading-tight">
                  Google Developer Groups
                </p>
                <p className="text-xs text-background/60 leading-tight">at Penn State</p>
              </div>
            </Link>
            <p className="text-background/60 leading-relaxed mb-4 max-w-sm">
              Solution Challenge is a two-day hackathon organized by Google Developer Groups On Campus at Penn State.
              Winners advance to the North America regional round held by Google.
            </p>
            <p className="text-background/50 text-sm mb-8">
              📍 ECoRE Building, University Park, PA · April 11–12
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="w-11 h-11 rounded-xl bg-background/10 hover:bg-primary flex items-center justify-center transition-colors duration-300 text-background"
                >
                  {social.svg}
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
                  <Link href={link.href} className="text-background/60 hover:text-primary transition-colors duration-300 flex items-center group">
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
                  <Link href={link.href} className="text-background/60 hover:text-primary transition-colors duration-300 flex items-center group">
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
                  <Link href={link.href} className="text-background/60 hover:text-primary transition-colors duration-300 flex items-center group">
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
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Google Developer Groups at Penn State · Solution Challenge
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-sm text-background/50 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-background/50 hover:text-primary transition-colors">Terms of Service</Link>
            <a href="mailto:gdg@psu.edu" className="text-sm text-background/50 hover:text-primary transition-colors">gdg@psu.edu</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
