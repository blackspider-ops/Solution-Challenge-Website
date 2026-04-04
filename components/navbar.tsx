"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RegisterDialog } from "@/components/auth/register-dialog"
import { useSession } from "next-auth/react"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#timeline", label: "Timeline" },
  { href: "#tracks", label: "Tracks" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#faq", label: "FAQ" },
]

/** Google Developer Groups "G" logo mark — inline SVG, no external dependency */
function GDGLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="white" />
      {/* Google-style four-color G */}
      <path d="M20 10.5C14.75 10.5 10.5 14.75 10.5 20C10.5 25.25 14.75 29.5 20 29.5C24.69 29.5 28.5 26.3 29.3 22H20V18H33.3C33.43 18.63 33.5 19.31 33.5 20C33.5 27.18 27.73 33 20 33C12.27 33 6 26.73 6 19C6 11.27 12.27 5 20 5C23.53 5 26.76 6.35 29.19 8.56L26.36 11.39C24.63 9.8 22.43 8.83 20 8.83C14.93 8.83 10.83 12.93 10.83 18C10.83 23.07 14.93 27.17 20 27.17C24.5 27.17 28.17 24.17 29 20H20V16.83H32.5C32.67 17.53 32.75 18.25 32.75 19C32.75 25.9 27.07 31.5 20 31.5C12.93 31.5 7.25 25.82 7.25 18.75C7.25 11.68 12.93 6 20 6C23.31 6 26.32 7.27 28.56 9.38L26.36 11.39" fill="none"/>
      {/* Simplified clean G shape */}
      <path d="M20.5 19.5H27.5V21.5C26.5 24.5 23.7 26.5 20.5 26.5C16.36 26.5 13 23.14 13 19C13 14.86 16.36 11.5 20.5 11.5C22.5 11.5 24.3 12.3 25.6 13.6L24.2 15C23.3 14.1 22 13.5 20.5 13.5C17.46 13.5 15 15.96 15 19C15 22.04 17.46 24.5 20.5 24.5C22.8 24.5 24.7 23.1 25.5 21.5H20.5V19.5Z" fill="#4285F4"/>
      <path d="M13 19C13 14.86 16.36 11.5 20.5 11.5V13.5C17.46 13.5 15 15.96 15 19H13Z" fill="#EA4335"/>
      <path d="M15 19C15 22.04 17.46 24.5 20.5 24.5V26.5C16.36 26.5 13 23.14 13 19H15Z" fill="#34A853"/>
      <path d="M20.5 11.5C22.5 11.5 24.3 12.3 25.6 13.6L24.2 15C23.3 14.1 22 13.5 20.5 13.5V11.5Z" fill="#FBBC05"/>
    </svg>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-foreground/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo — GDG at Penn State */}
          <Link href="#home" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 shrink-0"
            >
              <GDGLogo className="w-full h-full" />
            </motion.div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                Google Developer Groups
              </p>
              <p className="text-xs text-muted-foreground leading-tight">at Penn State</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute inset-x-4 -bottom-px h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2" suppressHydrationWarning>
            {status === "loading" ? (
              <div className="h-10 w-32 bg-muted animate-pulse rounded-xl" />
            ) : session ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 group rounded-xl px-6">
                  Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="rounded-xl px-4 text-muted-foreground hover:text-foreground">
                    Sign in
                  </Button>
                </Link>
                <RegisterDialog>
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 group rounded-xl px-6">
                    Register Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </RegisterDialog>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-background/98 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center text-foreground hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-muted font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex flex-col gap-2 mt-4" suppressHydrationWarning>
                  {status === "loading" ? (
                    <div className="h-12 bg-muted animate-pulse rounded-xl" />
                  ) : session ? (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-6 rounded-xl shadow-lg shadow-primary/25">
                        Dashboard
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl">Sign in</Button>
                      </Link>
                      <RegisterDialog>
                        <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-6 rounded-xl shadow-lg shadow-primary/25">
                          Register Now
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </RegisterDialog>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
