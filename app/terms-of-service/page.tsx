import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | GDG PSU Solution Challenge",
  description: "Terms and conditions for participating in the GDG PSU Solution Challenge.",
};

export default function TermsOfServicePage() {
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
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Terms of Service</h1>
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
              Welcome to the Google Developer Groups at Penn State Solution Challenge. By registering for or 
              participating in this event, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>
          </section>

          {/* Acceptance */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground m-0">Acceptance of Terms</h2>
            </div>
            <p className="text-muted-foreground">
              By accessing our website, registering for the event, or participating in any capacity, you acknowledge 
              that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            <p className="text-muted-foreground">
              If you do not agree to these terms, you may not participate in the event.
            </p>
          </section>

          {/* Eligibility */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Eligibility</h2>
            <p className="text-muted-foreground mb-4">To participate in the Solution Challenge, you must:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Be at least 18 years old</li>
              <li>✓ Be a current Penn State student (any campus, any major)</li>
              <li>✓ Provide accurate registration information</li>
              <li>✓ Agree to abide by our Code of Conduct</li>
              <li>✓ Comply with all event rules and guidelines</li>
            </ul>
          </section>

          {/* Registration */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Registration and Account</h2>
            <p className="text-muted-foreground">
              When you register for the event:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• You must provide accurate and complete information</li>
              <li>• You are responsible for maintaining account security</li>
              <li>• You must notify us immediately of any unauthorized access</li>
              <li>• One registration per person</li>
              <li>• We reserve the right to refuse or cancel registrations</li>
            </ul>
          </section>

          {/* Event Rules */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground m-0">Event Rules and Guidelines</h2>
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Team Formation</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Teams may consist of 1-4 members</li>
              <li>• All team members must be registered participants</li>
              <li>• All team members must be checked in at the event to submit</li>
              <li>• Teams must book a hacking space before submitting</li>
              <li>• Team formation occurs at the designated time</li>
              <li>• Teams cannot be changed after formation deadline</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Workspace Requirements</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Teams must book and maintain a designated hacking space</li>
              <li>• Workspaces must be kept clean and organized at all times</li>
              <li>• Proper disposal of food and trash is required</li>
              <li>• Respect other teams' spaces and equipment</li>
              <li>• Failure to maintain workspace may result in warnings or disqualification</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Project Development</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Projects must be developed during the hackathon period</li>
              <li>• You may use existing libraries and frameworks</li>
              <li>• Pre-existing projects are allowed but must show significant progress during the event</li>
              <li>• All code must be your team's original work or properly attributed</li>
              <li>• Projects must align with one of the provided tracks</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Submissions</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Submissions must be completed by the deadline</li>
              <li>• Late submissions will not be accepted under any circumstances</li>
              <li>• Required: project description, demo, and repository link</li>
              <li>• One submission per team</li>
              <li>• All team members must be checked in to submit</li>
              <li>• Teams must have a booked hacking space to submit</li>
              <li>• All GitHub repositories will be forked by organizers at the edit deadline</li>
              <li>• After forking, no changes to the forked repository will be accepted</li>
              <li>• Judges will review the forked version, not your original repository</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Your Content</h3>
            <p className="text-muted-foreground">
              You retain all rights to your project and code. By submitting your project, you grant us a 
              non-exclusive license to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Display your project for judging purposes</li>
              <li>• Showcase your project in event materials and promotions</li>
              <li>• Share your project with sponsors and partners</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Our Content</h3>
            <p className="text-muted-foreground">
              All event materials, website content, and branding are owned by GDG PSU and protected by copyright. 
              You may not use our materials without permission.
            </p>
          </section>

          {/* Code of Conduct */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Code of Conduct</h2>
            <p className="text-muted-foreground">
              All participants must adhere to our{" "}
              <Link href="/code-of-conduct" className="text-primary hover:underline">
                Code of Conduct
              </Link>
              . Violations may result in:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Warning</li>
              <li>• Disqualification from judging</li>
              <li>• Removal from the event</li>
              <li>• Ban from future GDG PSU events</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-destructive" />
              <h2 className="text-2xl font-bold text-foreground m-0">Prohibited Activities</h2>
            </div>
            <p className="text-muted-foreground mb-4">You may not:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>✗ Plagiarize or submit others' work as your own</li>
              <li>✗ Engage in cheating or unfair practices</li>
              <li>✗ Harass, threaten, or discriminate against others</li>
              <li>✗ Damage or misuse event facilities or equipment</li>
              <li>✗ Violate any laws or regulations</li>
              <li>✗ Attempt to hack or compromise event systems</li>
              <li>✗ Share your account credentials</li>
              <li>✗ Interfere with other participants' projects</li>
              <li>✗ Leave workspace in an unclean or disorganized state</li>
              <li>✗ Submit without all team members being checked in</li>
              <li>✗ Submit without booking a hacking space</li>
              <li>✗ Modify forked repositories after the edit deadline</li>
            </ul>
          </section>

          {/* Prizes and Awards */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Prizes and Awards</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Prizes are awarded at organizers' discretion</li>
              <li>• Decisions of judges are final</li>
              <li>• Winners must comply with prize claim requirements</li>
              <li>• Prizes may be subject to taxes (winner's responsibility)</li>
              <li>• We reserve the right to substitute prizes of equal value</li>
            </ul>
          </section>

          {/* Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• We provide the event "as is" without warranties</li>
              <li>• We are not liable for any damages arising from participation</li>
              <li>• We are not responsible for lost or stolen property</li>
              <li>• We are not liable for technical issues or service interruptions</li>
              <li>• Participants assume all risks associated with participation</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless GDG PSU, Penn State, and their affiliates from any claims, 
              damages, or expenses arising from:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Your violation of these Terms</li>
              <li>• Your violation of any laws or third-party rights</li>
              <li>• Your project or submissions</li>
              <li>• Your conduct during the event</li>
            </ul>
          </section>

          {/* Media Release */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Media Release</h2>
            <p className="text-muted-foreground">
              By participating, you consent to:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Photography and videography during the event</li>
              <li>• Use of your name, likeness, and project in promotional materials</li>
              <li>• Publication of event photos and videos on our platforms</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              If you do not consent, please notify us in writing.
            </p>
          </section>

          {/* Modifications */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
              posting. Your continued participation constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your participation at any time, with or without notice, for:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Violation of these Terms</li>
              <li>• Violation of the Code of Conduct</li>
              <li>• Fraudulent or illegal activity</li>
              <li>• Any reason at our discretion</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of the Commonwealth of Pennsylvania, without regard to conflict 
              of law principles. Any disputes shall be resolved in the courts of Centre County, Pennsylvania.
            </p>
          </section>

          {/* Severability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain 
              in full force and effect.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Questions About These Terms?</h3>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service:
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
              <Link href="/privacy-policy">
                <Button variant="outline" className="gap-2">
                  Privacy Policy
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
