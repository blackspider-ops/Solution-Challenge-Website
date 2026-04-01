"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Youtube } from "lucide-react"

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
    <footer className="bg-foreground text-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="#home" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">SC</span>
              </div>
              <span className="font-semibold text-lg text-background">Solution Challenge</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-6 max-w-sm">
              A global hackathon empowering innovators to build technology solutions 
              that address real-world challenges and create lasting impact.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5 text-background" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Event</h4>
            <ul className="space-y-3">
              {footerLinks.event.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            &copy; {new Date().getFullYear()} Solution Challenge. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-background/50 hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-background/50 hover:text-background transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
