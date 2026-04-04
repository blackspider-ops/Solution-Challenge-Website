/**
 * Public track detail page — /tracks/[slug]
 *
 * SECURITY MODEL:
 * - This is a Server Component. No content is ever sent to the client
 *   unless the server explicitly allows it.
 * - If track.visible === false AND the requester is not an admin,
 *   this page returns a 404 — the track content is never included
 *   in the HTML response, never in the JS bundle, never in the DOM.
 * - notFound() triggers Next.js's 404 handler before any JSX is rendered,
 *   so there is zero risk of content leaking through inspect/devtools.
 * - The page is marked `dynamic = "force-dynamic"` to prevent static
 *   generation — hidden tracks are never pre-rendered into public HTML.
 */

import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTrackBySlug } from "@/lib/tracks-data";
import { TrackDetailContent } from "@/components/tracks/track-detail-content";

// Never statically generate — visibility is dynamic and admin-controlled
export const dynamic = "force-dynamic";

// No generateStaticParams — we do NOT pre-render any track pages
// This ensures hidden tracks are never baked into the public build

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const staticData = getTrackBySlug(slug);
  if (!staticData) return { title: "Track Not Found" };
  return {
    title: `${staticData.name} | Solution Challenge — GDG Penn State`,
    description: staticData.description,
  };
}

export default async function TrackPage({ params }: Props) {
  const { slug } = await params;

  // 1. Validate slug against known tracks
  const staticData = getTrackBySlug(slug);
  if (!staticData) notFound();

  // 2. Fetch DB record for visibility state
  const track = await db.track.findUnique({ where: { slug } });
  if (!track) notFound();

  // 3. Check if the requester is an admin
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  // 4. GATE: if not visible and not admin → show "Track Hidden" message
  //    Instead of 404, we show a friendly message that the track is not yet available
  if (!track.visible && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Track Details Hidden</h1>
          <p className="text-muted-foreground mb-8">
            This track is not yet available for public viewing. Check back later or contact the organizers for more information.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </a>
            <a
              href="/#tracks"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border bg-background text-foreground font-medium hover:bg-muted transition-colors"
            >
              View All Tracks
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 5. Only reaches here if visible=true OR admin
  return (
    <TrackDetailContent
      track={track}
      staticData={staticData}
      isAdmin={isAdmin}
      isPreview={!track.visible && isAdmin}
    />
  );
}
