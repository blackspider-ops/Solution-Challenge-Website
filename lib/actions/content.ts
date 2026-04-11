"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

// ─── Track Management ────────────────────────────────────────────────────────

export async function createTrack(data: {
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  promptContent: string;
  icon: string;
  gradient: string;
}) {
  try {
    await requireAdmin();

    // Get the highest order number
    const maxOrder = await db.track.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    await db.track.create({
      data: {
        ...data,
        order: (maxOrder?.order ?? 0) + 1,
        visible: true,
      },
    });

    revalidatePath("/admin/tracks");
    revalidatePath("/");
    revalidatePath("/tracks/[slug]", "page");

    return { success: true };
  } catch (error) {
    console.error("Create track error:", error);
    return { error: "Failed to create track" };
  }
}

export async function updateTrack(
  id: string,
  data: {
    name?: string;
    description?: string;
    fullDescription?: string;
    promptContent?: string;
    icon?: string;
    gradient?: string;
  }
) {
  try {
    await requireAdmin();

    const track = await db.track.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/tracks");
    revalidatePath("/admin/content");
    revalidatePath("/");
    revalidatePath(`/tracks/${track.slug}`);
    revalidatePath("/tracks/[slug]", "page");

    return { success: true };
  } catch (error) {
    console.error("Update track error:", error);
    return { error: "Failed to update track" };
  }
}

export async function deleteTrack(id: string) {
  try {
    await requireAdmin();

    await db.track.delete({
      where: { id },
    });

    revalidatePath("/admin/tracks");
    revalidatePath("/");
    revalidatePath("/tracks/[slug]", "page");

    return { success: true };
  } catch (error) {
    console.error("Delete track error:", error);
    return { error: "Failed to delete track" };
  }
}

// ─── Sponsor Management ──────────────────────────────────────────────────────

export async function createSponsor(data: {
  name: string;
  initial: string;
  tier: "platinum" | "gold" | "silver";
  logoUrl?: string;
  websiteUrl?: string;
  order: number;
}) {
  try {
    await requireAdmin();

    await db.sponsor.create({
      data: {
        ...data,
        active: true,
      },
    });

    revalidatePath("/admin/content");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Create sponsor error:", error);
    return { error: "Failed to create sponsor" };
  }
}

export async function updateSponsor(
  id: string,
  data: {
    name?: string;
    initial?: string;
    tier?: "platinum" | "gold" | "silver";
    logoUrl?: string;
    websiteUrl?: string;
    order?: number;
    active?: boolean;
  }
) {
  try {
    await requireAdmin();

    await db.sponsor.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/content");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update sponsor error:", error);
    return { error: "Failed to update sponsor" };
  }
}

export async function deleteSponsor(id: string) {
  try {
    await requireAdmin();

    await db.sponsor.delete({
      where: { id },
    });

    revalidatePath("/admin/content");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Delete sponsor error:", error);
    return { error: "Failed to delete sponsor" };
  }
}

// ─── FAQ Management ──────────────────────────────────────────────────────────

export async function createFAQ(data: {
  question: string;
  answer: string;
  order: number;
}) {
  try {
    await requireAdmin();

    await db.fAQ.create({
      data: {
        ...data,
        published: true,
      },
    });

    revalidatePath("/admin/content");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Create FAQ error:", error);
    return { error: "Failed to create FAQ" };
  }
}

export async function updateFAQ(
  id: string,
  data: {
    question?: string;
    answer?: string;
    order?: number;
    published?: boolean;
  }
) {
  try {
    await requireAdmin();

    await db.fAQ.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/content");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update FAQ error:", error);
    return { error: "Failed to update FAQ" };
  }
}

export async function deleteFAQ(id: string) {
  try {
    await requireAdmin();

    await db.fAQ.delete({
      where: { id },
    });

    revalidatePath("/admin/content");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Delete FAQ error:", error);
    return { error: "Failed to delete FAQ" };
  }
}

// ─── Timeline Management ─────────────────────────────────────────────────────

export async function updateTimelineEvent(
  id: string,
  data: {
    title?: string;
    date?: string;
    description?: string;
    status?: "active" | "upcoming" | "completed";
    order?: number;
  }
) {
  try {
    await requireAdmin();

    await db.timelineEvent.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/content");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update timeline error:", error);
    return { error: "Failed to update timeline event" };
  }
}
