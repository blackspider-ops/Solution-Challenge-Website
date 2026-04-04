import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, Code, Trophy, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Rules | GDG PSU Solution Challenge",
  description: "Official rules and guidelines for the Solution Challenge hackathon.",
};

export default function RulesPage() {
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
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Hackathon Rules</h1>
              <p className="text-muted-foreground mt-1">Last updated: April 4, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Eligibility */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Eligibility</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Must be a current Penn State student (any campus, any major)</li>
              <li>• Must be 18 years or older</li>
              <li>• Must register and RSVP on the GDG website</li>
              <li>• Must agree to the Code of Conduct</li>
            </ul>
          </section>

          {/* Team Formation */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Team Formation</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Teams can have 1-4 members</li>
              <li>• All team members must be registered participants</li>
              <li>• Teams are formed after the kickoff event</li>
              <li>• Solo participants are welcome</li>
              <li>• Teams cannot be changed after the formation deadline</li>
            </ul>
          </section>

          {/* Project Requirements */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Project Requirements</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Projects must be developed during the hackathon (April 11-12)</li>
              <li>• You may use existing libraries, frameworks, and APIs</li>
              <li>• Pre-existing projects are allowed but must show significant progress during the event</li>
              <li>• All code must be your team's original work or properly attributed</li>
              <li>• Projects must align with one of the six challenge tracks</li>
              <li>• Must address a real-world problem with technology</li>
            </ul>
          </section>

          {/* Submission Guidelines */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Submission Guidelines</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Submissions must be completed by April 12 at 10:00 AM</li>
              <li>• Late submissions will not be accepted</li>
              <li>• Required: project description, demo video/link, and repository link</li>
              <li>• One submission per team</li>
              <li>• Code must be accessible to judges (public repo or shared access)</li>
            </ul>
          </section>

          {/* Judging Criteria */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Judging Criteria</h2>
            </div>
            <p className="text-muted-foreground mb-3">Projects will be evaluated on:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Impact: Does it solve a real problem?</li>
              <li>• Innovation: Is it creative and original?</li>
              <li>• Technical Implementation: Is it well-built?</li>
              <li>• Presentation: Is it clearly explained?</li>
              <li>• Feasibility: Can it be realistically implemented?</li>
            </ul>
            <p className="text-muted-foreground mt-4 text-sm">
              Judges' decisions are final. Winners advance to the North America regional round held by Google.
            </p>
          </section>

          {/* Code of Conduct */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Code of Conduct</h3>
            <p className="text-muted-foreground mb-4">
              All participants must follow our Code of Conduct. Violations may result in disqualification.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/code-of-conduct">
                <Button className="gap-2">
                  Read Code of Conduct
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </Link>
              <Link href="/terms-of-service">
                <Button variant="outline" className="gap-2">
                  Terms of Service
                </Button>
              </Link>
            </div>
          </section>

          {/* Contact */}
          <section className="text-center pt-8 border-t border-border">
            <p className="text-muted-foreground mb-4">
              Questions about the rules?
            </p>
            <Link href="/contact">
              <Button variant="outline">Contact Us</Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
