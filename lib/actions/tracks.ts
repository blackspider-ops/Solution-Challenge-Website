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

export async function getAllTracks() {
  const tracks = await db.track.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      icon: true,
      gradient: true,
      description: true,
    },
  });
  
  // Map to include computed styling fields from the icon/gradient
  return tracks.map(track => {
    // Derive styling from gradient
    const gradientMap: Record<string, { iconBg: string; iconColor: string; bgGradient: string }> = {
      "from-rose-500 to-pink-500": {
        iconBg: "bg-rose-500/15",
        iconColor: "text-rose-500",
        bgGradient: "from-rose-500/10 to-pink-500/10"
      },
      "from-emerald-500 to-teal-500": {
        iconBg: "bg-emerald-500/15",
        iconColor: "text-emerald-500",
        bgGradient: "from-emerald-500/10 to-teal-500/10"
      },
      "from-blue-500 to-indigo-500": {
        iconBg: "bg-blue-500/15",
        iconColor: "text-blue-500",
        bgGradient: "from-blue-500/10 to-indigo-500/10"
      },
      "from-violet-500 to-purple-500": {
        iconBg: "bg-violet-500/15",
        iconColor: "text-violet-500",
        bgGradient: "from-violet-500/10 to-purple-500/10"
      },
      "from-amber-500 to-orange-500": {
        iconBg: "bg-amber-500/15",
        iconColor: "text-amber-500",
        bgGradient: "from-amber-500/10 to-orange-500/10"
      },
      "from-cyan-500 to-blue-500": {
        iconBg: "bg-cyan-500/15",
        iconColor: "text-cyan-500",
        bgGradient: "from-cyan-500/10 to-blue-500/10"
      },
    };
    
    const styling = gradientMap[track.gradient] || {
      iconBg: "bg-primary/15",
      iconColor: "text-primary",
      bgGradient: "from-primary/10 to-primary/10"
    };
    
    return {
      ...track,
      ...styling,
    };
  });
}
