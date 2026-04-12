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
              <li>• All team members must be checked in at the event to submit</li>
              <li>• Teams are formed after the kickoff event</li>
              <li>• Solo participants are welcome</li>
              <li>• Teams cannot be changed after the formation deadline</li>
              <li>• All teams must book a hacking space before submitting their project</li>
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
              <li>• Projects must be functional and demonstrable</li>
              <li>• Use of AI tools (ChatGPT, Copilot, etc.) is allowed but must be disclosed</li>
              <li>• Plagiarism or copying other teams' work will result in immediate disqualification</li>
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
              <li>• Late submissions will not be accepted under any circumstances</li>
              <li>• Required: project description, demo video/link, and repository link</li>
              <li>• One submission per team</li>
              <li>• Code must be accessible to judges (public repo or shared access)</li>
              <li>• All GitHub repositories will be forked by organizers at the edit deadline</li>
              <li>• After the edit deadline, no changes to forked repositories will be accepted</li>
              <li>• Judges will review the forked version, not your original repository</li>
              <li>• Teams must keep their workspace clean and organized throughout the event</li>
              <li>• Demo videos must be under 5 minutes in length</li>
              <li>• Submissions must include a README with setup instructions</li>
            </ul>
          </section>

          {/* Event Rules & Conduct */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Event Rules & Conduct</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Participants must remain in their assigned hacking space</li>
              <li>• Workspaces must be kept clean and organized at all times</li>
              <li>• Food and drinks are allowed but must be properly disposed of</li>
              <li>• Respect other teams' workspaces and equipment</li>
              <li>• Noise levels must be kept reasonable to not disturb other teams</li>
              <li>• Participants must wear their event badge at all times</li>
              <li>• Leaving the venue requires checking out with volunteers</li>
              <li>• No sleeping in hacking spaces - use designated rest areas</li>
              <li>• Follow all venue rules and fire safety regulations</li>
              <li>• Harassment, discrimination, or disruptive behavior will result in removal</li>
            </ul>
          </section>

          {/* Technical Requirements */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Technical Requirements</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Bring your own laptop and charger</li>
              <li>• Ensure your device is charged and functional before arriving</li>
              <li>• WiFi will be provided but have backup internet if possible</li>
              <li>• Power outlets are limited - bring power strips if needed</li>
              <li>• Back up your code frequently to prevent data loss</li>
              <li>• Test your project before the submission deadline</li>
              <li>• Organizers are not responsible for lost or damaged equipment</li>
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
            <p className="text-muted-foreground mt-2 text-sm">
              Teams must be present for judging. Failure to attend judging will result in disqualification.
            </p>
          </section>

          {/* Prizes & Disqualification */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Prizes & Disqualification</h2>
            </div>
            <p className="text-muted-foreground mb-3">Grounds for disqualification include:</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Violating the Code of Conduct</li>
              <li>• Submitting plagiarized or stolen work</li>
              <li>• Missing the submission deadline</li>
              <li>• Not having all team members checked in</li>
              <li>• Not booking a hacking space</li>
              <li>• Providing false information during registration</li>
              <li>• Disruptive or unsafe behavior</li>
              <li>• Failure to attend judging session</li>
            </ul>
            <p className="text-muted-foreground mt-4 text-sm">
              Prize eligibility requires compliance with all rules. Organizers reserve the right to disqualify any team at their discretion.
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
