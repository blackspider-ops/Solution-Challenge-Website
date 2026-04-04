"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Loader2, Send, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const CONTACT_EMAIL = "gdg@psu.edu";

export function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast.error(data.error || "Rate limit exceeded. Please try again later or use direct email.");
        } else {
          toast.error(data.error || "Failed to send message");
        }
        return;
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast.error("Network error. Please try again or use direct email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectEmail = () => {
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      formData.subject || "Solution Challenge Inquiry"
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">We're here to help</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight"
          >
            Get in{" "}
            <span className="bg-gradient-to-r from-primary via-chart-5 to-chart-2 bg-clip-text text-transparent">
              Touch
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Have questions about Solution Challenge? We'd love to hear from you.
          </motion.p>
        </div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 p-8 shadow-2xl shadow-foreground/5">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground text-center">
                      We've received your message and will get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name" className="text-foreground font-medium">
                          Name
                        </Label>
                        <Input
                          id="contact-name"
                          type="text"
                          placeholder="Your name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={isLoading}
                          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-email" className="text-foreground font-medium">
                          Email
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={isLoading}
                          className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-subject" className="text-foreground font-medium">
                        Subject
                      </Label>
                      <Input
                        id="contact-subject"
                        type="text"
                        placeholder="What's this about?"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        disabled={isLoading}
                        className="bg-background/50 border-border/50 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message" className="text-foreground font-medium">
                        Message
                      </Label>
                      <Textarea
                        id="contact-message"
                        placeholder="Tell us more..."
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        disabled={isLoading}
                        className="resize-none bg-background/50 border-border/50 focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDirectEmail}
                        disabled={isLoading}
                        className="sm:w-auto border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Open in Email App
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Info Card */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Quick Response</h3>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24-48 hours during business days.
              </p>
            </div>

            {/* Email Card */}
            <div className="rounded-2xl bg-gradient-to-br from-chart-2/10 via-chart-2/5 to-transparent border border-chart-2/20 p-6 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-chart-2" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Direct Email</h3>
              <a
                href="mailto:gdg@psu.edu"
                className="text-sm text-chart-2 hover:underline font-medium"
              >
                gdg@psu.edu
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Prefer email? Reach out directly.
              </p>
            </div>

            {/* Event Info Card */}
            <div className="rounded-2xl bg-gradient-to-br from-chart-5/10 via-chart-5/5 to-transparent border border-chart-5/20 p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-foreground mb-3">Event Details</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📅 April 11-12, 2026</p>
                <p>📍 ECoRE Building, Penn State</p>
                <p>🏆 Regional Finals Qualifier</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
