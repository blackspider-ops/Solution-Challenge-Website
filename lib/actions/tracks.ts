"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function setTrackVisibility(
  trackId: string,
  visible: boolean
): Promise<{ error: string } | { data: true }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const track = await db.track.findUnique({ where: { id: trackId } });
  if (!track) return { error: "Track not found" };

  await db.track.update({ where: { id: trackId }, data: { visible } });
  return { data: true };
}

export async function setAllTracksVisibility(
  visible: boolean
): Promise<{ error: string } | { data: { count: number } }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  if (session.user.role !== "admin") return { error: "Unauthorized" };

  const result = await db.track.updateMany({ data: { visible } });
  return { data: { count: result.count } };
}

export async function getVisibleTracks() {
  const tracks = await db.track.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      icon: true,
      gradient: true,
      iconBg: true,
      iconColor: true,
      bgGradient: true,
      description: true,
    },
  });
  return tracks;
}
