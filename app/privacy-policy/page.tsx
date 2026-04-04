import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | GDG PSU Solution Challenge",
  description: "How we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Privacy Policy</h1>
              <p className="text-muted-foreground mt-1">Last updated: April 4, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Google Developer Groups at Penn State ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              participate in the Solution Challenge or use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground m-0">Information We Collect</h2>
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Personal Information</h3>
            <p className="text-muted-foreground">
              When you register for the Solution Challenge, we collect:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Full name</li>
              <li>• Email address</li>
              <li>• Penn State affiliation and academic information</li>
              <li>• Dietary restrictions and accessibility needs</li>
              <li>• Resume (optional)</li>
              <li>• Team information</li>
              <li>• Project submissions</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Authentication Data</h3>
            <p className="text-muted-foreground">
              When you sign in using OAuth providers (Google, GitHub, Microsoft), we receive:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Profile information (name, email, profile picture)</li>
              <li>• Account identifiers</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Automatically Collected Information</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• IP address and device information</li>
              <li>• Browser type and version</li>
              <li>• Usage data and analytics</li>
              <li>• Cookies and similar tracking technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground m-0">How We Use Your Information</h2>
            </div>
            <p className="text-muted-foreground mb-4">We use your information to:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Process your registration and manage your participation</li>
              <li>✓ Communicate event updates and announcements</li>
              <li>✓ Facilitate team formation and collaboration</li>
              <li>✓ Evaluate project submissions</li>
              <li>✓ Provide dietary accommodations and accessibility support</li>
              <li>✓ Generate QR code tickets for check-in</li>
              <li>✓ Send event-related emails and notifications</li>
              <li>✓ Improve our services and user experience</li>
              <li>✓ Comply with legal obligations</li>
              <li>✓ Prevent fraud and ensure security</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground m-0">How We Share Your Information</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Service Providers</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Vercel (hosting and deployment)</li>
              <li>• Neon (database services)</li>
              <li>• Resend (email delivery)</li>
              <li>• Google, GitHub, Microsoft (authentication)</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Event Partners</h3>
            <p className="text-muted-foreground">
              We may share aggregated, non-identifiable data with sponsors and partners for reporting purposes.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Legal Requirements</h3>
            <p className="text-muted-foreground">
              We may disclose your information if required by law or to protect our rights and safety.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground m-0">Data Security</h2>
            </div>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• SSL/TLS encryption for data transmission</li>
              <li>• Bcrypt password hashing (12 rounds)</li>
              <li>• Secure database connections with SSL</li>
              <li>• Regular security audits and updates</li>
              <li>• Access controls and authentication</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Access your personal information</li>
              <li>• Correct inaccurate data</li>
              <li>• Request deletion of your data</li>
              <li>• Opt-out of marketing communications</li>
              <li>• Export your data</li>
              <li>• Withdraw consent</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, contact us at{" "}
              <a href="mailto:gdg@psu.edu" className="text-primary hover:underline">gdg@psu.edu</a>
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Fulfill the purposes outlined in this policy</li>
              <li>• Comply with legal obligations</li>
              <li>• Resolve disputes and enforce agreements</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Event data is typically retained for 2 years after the event concludes.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Maintain your session</li>
              <li>• Remember your preferences</li>
              <li>• Analyze site usage</li>
              <li>• Improve functionality</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Links</h2>
            <p className="text-muted-foreground">
              Our website may contain links to third-party sites. We are not responsible for their privacy practices. 
              Please review their privacy policies before providing any information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are intended for individuals 18 years or older. We do not knowingly collect information 
              from children under 18. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Posting the new policy on this page</li>
              <li>• Updating the "Last updated" date</li>
              <li>• Sending an email notification (for material changes)</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Contact Us</h3>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy or our data practices:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>📧 Email: <a href="mailto:gdg@psu.edu" className="text-primary hover:underline">gdg@psu.edu</a></p>
              <p>📍 Address: Google Developer Groups at Penn State, University Park, PA 16802</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link href="/contact">
                <Button className="gap-2">
                  Contact Us
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
