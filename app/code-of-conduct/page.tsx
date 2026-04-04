import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Heart, Users, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Code of Conduct | GDG PSU Solution Challenge",
  description: "Our commitment to creating a safe, inclusive, and respectful environment for all participants.",
};

export default function CodeOfConductPage() {
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
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Code of Conduct</h1>
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
              Google Developer Groups at Penn State is committed to providing a safe, inclusive, and respectful 
              environment for all participants. This Code of Conduct outlines our expectations for behavior and 
              the consequences for unacceptable conduct.
            </p>
          </section>

          {/* Our Pledge */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground m-0">Our Pledge</h2>
            </div>
            <p className="text-muted-foreground">
              We pledge to make participation in our community a harassment-free experience for everyone, 
              regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, 
              gender identity and expression, level of experience, education, socio-economic status, nationality, 
              personal appearance, race, religion, or sexual identity and orientation.
            </p>
            <p className="text-muted-foreground">
              We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, 
              and healthy community.
            </p>
          </section>

          {/* Expected Behavior */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground m-0">Expected Behavior</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Be respectful and considerate in your speech and actions</li>
              <li>✓ Attempt collaboration before conflict</li>
              <li>✓ Refrain from demeaning, discriminatory, or harassing behavior and speech</li>
              <li>✓ Be mindful of your surroundings and fellow participants</li>
              <li>✓ Alert event organizers if you notice violations of this Code of Conduct</li>
              <li>✓ Respect the privacy and personal information of others</li>
              <li>✓ Give credit where credit is due</li>
              <li>✓ Be open to constructive criticism and feedback</li>
            </ul>
          </section>

          {/* Unacceptable Behavior */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <h2 className="text-2xl font-bold text-foreground m-0">Unacceptable Behavior</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              The following behaviors are considered harassment and are unacceptable:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>✗ Violence, threats of violence, or violent language</li>
              <li>✗ Sexist, racist, homophobic, transphobic, ableist, or otherwise discriminatory jokes and language</li>
              <li>✗ Posting or displaying sexually explicit or violent material</li>
              <li>✗ Personal insults or attacks</li>
              <li>✗ Inappropriate physical contact or unwelcome sexual attention</li>
              <li>✗ Deliberate intimidation, stalking, or following</li>
              <li>✗ Advocating for or encouraging any of the above behavior</li>
              <li>✗ Sustained disruption of community events</li>
              <li>✗ Publishing others' private information without explicit permission</li>
              <li>✗ Other conduct which could reasonably be considered inappropriate in a professional setting</li>
            </ul>
          </section>

          {/* Consequences */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Consequences of Unacceptable Behavior</h2>
            <p className="text-muted-foreground">
              Unacceptable behavior will not be tolerated. Anyone asked to stop unacceptable behavior is expected 
              to comply immediately.
            </p>
            <p className="text-muted-foreground">
              If a participant engages in unacceptable behavior, the event organizers may take any action they 
              deem appropriate, including:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Warning the offender</li>
              <li>• Expulsion from the event without refund (if applicable)</li>
              <li>• Temporary or permanent ban from future GDG PSU events</li>
              <li>• Reporting to Penn State authorities or law enforcement</li>
            </ul>
          </section>

          {/* Reporting */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Reporting Guidelines</h2>
            <p className="text-muted-foreground">
              If you are subject to or witness unacceptable behavior, or have any other concerns, please notify 
              an event organizer as soon as possible.
            </p>
            <div className="bg-muted/50 border border-border rounded-lg p-6 my-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">How to Report</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>📧 Email: <a href="mailto:gdg@psu.edu" className="text-primary hover:underline">gdg@psu.edu</a></li>
                <li>👤 In-person: Speak to any event organizer wearing a staff badge</li>
                <li>📱 During event: Use the emergency contact provided at registration</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                All reports will be handled with discretion and confidentiality.
              </p>
            </div>
          </section>

          {/* Scope */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Scope</h2>
            <p className="text-muted-foreground">
              This Code of Conduct applies to all GDG PSU community spaces, including:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• In-person events and hackathons</li>
              <li>• Online platforms (Discord, Slack, social media)</li>
              <li>• Email communications</li>
              <li>• Project repositories and collaboration spaces</li>
              <li>• Any other community-related activities</li>
            </ul>
          </section>

          {/* Attribution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Attribution</h2>
            <p className="text-muted-foreground text-sm">
              This Code of Conduct is adapted from the{" "}
              <a href="https://www.contributor-covenant.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Contributor Covenant
              </a>
              , version 2.1, and the{" "}
              <a href="https://developers.google.com/community-guidelines" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Google Developer Community Guidelines
              </a>
              .
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Questions or Concerns?</h3>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Code of Conduct or need to report an incident, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact">
                <Button className="gap-2">
                  Contact Us
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </Link>
              <a href="mailto:gdg@psu.edu">
                <Button variant="outline" className="gap-2">
                  Email: gdg@psu.edu
                </Button>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
