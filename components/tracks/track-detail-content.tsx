import Link from "next/link";
import { ArrowLeft, Lock, Eye } from "lucide-react";
import { Heart, Leaf, GraduationCap, ShieldCheck, Accessibility, Zap } from "lucide-react";
import type { TrackData } from "@/lib/tracks-data";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Leaf, GraduationCap, ShieldCheck, Accessibility, Zap,
};

interface Props {
  track: {
    id: string;
    slug: string;
    name: string;
    fullDescription: string;
    promptContent: string;
    visible: boolean;
  };
  staticData: TrackData;
  isAdmin: boolean;
  isPreview: boolean;
}

export function TrackDetailContent({ track, staticData, isAdmin, isPreview }: Props) {
  const Icon = ICON_MAP[staticData.icon] ?? Zap;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin preview banner */}
      {isPreview && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-amber-700">
            <Eye className="w-4 h-4 shrink-0" />
            <span>
              <strong>Admin preview</strong> — this track is currently hidden from public users.
              Go to{" "}
              <Link href="/admin/tracks" className="underline font-medium">
                Admin → Tracks
              </Link>{" "}
              to make it visible.
            </span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back link */}
        <Link
          href="/#tracks"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to tracks
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className={`w-20 h-20 rounded-3xl ${staticData.iconBg} flex items-center justify-center mb-6`}>
            <Icon className={`w-10 h-10 ${staticData.iconColor}`} />
          </div>

          <div className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r ${staticData.gradient} text-white mb-4`}>
            Challenge Track
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {track.name}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {staticData.description}
          </p>
        </div>

        {/* Divider */}
        <div className={`h-1 w-24 rounded-full bg-gradient-to-r ${staticData.gradient} mb-12`} />

        {/* Full description */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">About this track</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {track.fullDescription}
          </p>
        </section>

        {/* Challenge prompt */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Challenge Prompt</h2>
          <div className={`rounded-2xl border-2 p-6 ${
            track.promptContent.startsWith("🔒")
              ? "border-dashed border-border bg-muted/30"
              : `border-${staticData.iconColor.replace("text-", "")}/20 bg-gradient-to-br ${staticData.bgGradient}`
          }`}>
            {track.promptContent.startsWith("🔒") ? (
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Prompt not yet released</p>
                  <p className="text-sm text-muted-foreground">
                    The challenge prompt for this track will be released at{" "}
                    <strong>8:00 PM on April 11</strong> — one hour after the event kickoff.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {track.promptContent}
              </p>
            )}
          </div>
        </section>

        {/* What to build */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">What to build</h2>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            {[
              "Your solution must directly address the track theme",
              "Teams of up to 4 members",
              "Any technology stack is allowed",
              "Submit by 10:00 AM on April 12",
              "Judging begins at 12:00 PM on April 12",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${staticData.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r ${staticData.gradient} shadow-lg hover:scale-105 transition-all duration-300`}
          >
            Register for this track
          </Link>
          <Link
            href="/#tracks"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-muted-foreground border-2 border-border hover:border-foreground/30 hover:text-foreground transition-all duration-300"
          >
            View all tracks
          </Link>
        </div>
      </div>
    </div>
  );
}
