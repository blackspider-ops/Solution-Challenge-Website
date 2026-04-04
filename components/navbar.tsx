"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RegisterDialog } from "@/components/auth/register-dialog"
import { LoginDialog } from "@/components/auth/login-dialog"
import { useSession } from "next-auth/react"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#timeline", label: "Timeline" },
  { href: "#tracks", label: "Tracks" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#faq", label: "FAQ" },
]

/** GDG PSU logo */
function GDGLogo({ className }: { className?: string }) {
  return (
    <img 
      src="https://www.gdgpsu.dev/api/media?path=1762291432641-c8uv057d7gi.png" 
      alt="GDG PSU" 
      className={className}
    />
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
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-foreground/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo — GDG at Penn State */}
          <Link href="#home" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 shrink-0"
            >
              <GDGLogo className="w-full h-full" />
            </motion.div>
            <div className="hidden sm:block min-w-0">
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
                <LoginDialog>
                  <Button variant="ghost" className="rounded-xl px-4 text-muted-foreground hover:text-foreground">
                    Sign in
                  </Button>
                </LoginDialog>
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
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
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
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-background/98 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
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
                    className="flex items-center text-foreground hover:text-primary transition-colors py-3 px-4 rounded-xl hover:bg-muted font-medium text-sm"
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
                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border" suppressHydrationWarning>
                  {status === "loading" ? (
                    <div className="h-12 bg-muted animate-pulse rounded-xl" />
                  ) : session ? (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground h-12 rounded-xl shadow-lg shadow-primary/25">
                        Dashboard
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <LoginDialog>
                        <Button variant="outline" className="w-full h-12 rounded-xl">Sign in</Button>
                      </LoginDialog>
                      <RegisterDialog>
                        <Button className="w-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground h-12 rounded-xl shadow-lg shadow-primary/25">
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
