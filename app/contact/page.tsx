"use client";

import { ContactForm } from "@/components/contact/contact-form";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Sparkles } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-5/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">We're here to help</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-primary via-chart-5 to-chart-2 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions about Solution Challenge? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Info Cards - Takes 1 column */}
          <div className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}
