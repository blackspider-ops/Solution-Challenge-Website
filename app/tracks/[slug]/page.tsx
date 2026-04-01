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

  // 4. GATE: if not visible and not admin → 404
  //    notFound() is called BEFORE any content is assembled.
  //    Nothing from staticData or track is ever sent to the client.
  if (!track.visible && !isAdmin) {
    notFound();
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
