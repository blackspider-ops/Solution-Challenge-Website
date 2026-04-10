"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type MealType = "dinner" | "midnight_snack" | "breakfast";

export type FoodDistributionResult =
  | { status: "success"; name: string | null; email: string; servingNumber: number; distributedAt: Date; mealType: string }
  | { status: "not_checked_in"; name: string | null; email: string }
  | { status: "invalid" }
  | { status: "unauthorized" }
  | { status: "unauthenticated" }
  | { status: "second_serving_disabled" };

/**
 * Distribute food to a participant by scanning their QR code
 */
export async function distributeFoodToParticipant(
  qrToken: string,
  mealType: MealType
): Promise<FoodDistributionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "unauthenticated" };
  }

  // Input validation
  if (!qrToken?.trim()) {
    return { status: "invalid" };
  }

  if (!["dinner", "midnight_snack", "breakfast"].includes(mealType)) {
    return { status: "invalid" };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin" && user?.role !== "volunteer") {
    return { status: "unauthorized" };
  }

  // Find the ticket
  const ticket = await db.ticket.findUnique({
    where: { qrToken: qrToken.trim() },
    include: {
      registration: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
      checkIn: true,
      foodDistributions: {
        where: { mealType },
        orderBy: { distributedAt: "desc" },
      },
    },
  });

  if (!ticket) {
    return { status: "invalid" };
  }

  // Check if participant is checked in
  if (!ticket.checkIn) {
    return {
      status: "not_checked_in",
      name: ticket.registration.user.name,
      email: ticket.registration.user.email,
    };
  }

  // Check existing distributions for this meal
  const existingDistributions = ticket.foodDistributions;
  const servingNumber = existingDistributions.length + 1;

  // If this is a second serving, check if it's allowed
  if (servingNumber > 1) {
    const settings = await db.eventSettings.findUnique({
      where: { id: "singleton" },
      select: { allowSecondServings: true },
    });

    if (!settings?.allowSecondServings) {
      return { status: "second_serving_disabled" };
    }
  }

  // Prevent more than 2 servings
  if (servingNumber > 2) {
    return { status: "second_serving_disabled" };
  }

  // Create food distribution record
  const distribution = await db.foodDistribution.create({
    data: {
      ticketId: ticket.id,
      mealType,
      servingNumber,
      performedBy: session.user.id,
    },
  });

  revalidatePath("/admin/food");
  revalidatePath("/volunteer/food");

  return {
    status: "success",
    name: ticket.registration.user.name,
    email: ticket.registration.user.email,
    servingNumber,
    distributedAt: distribution.distributedAt,
    mealType: getMealTypeLabel(mealType),
  };
}

/**
 * Get food distribution statistics
 */
export async function getFoodStats() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin" && user?.role !== "volunteer") {
    return { error: "Unauthorized" };
  }

  try {
    const [totalCheckedIn, dinnerCount, midnightCount, breakfastCount, settings] = await Promise.all([
      db.checkIn.count(),
      db.foodDistribution.count({ where: { mealType: "dinner" } }),
      db.foodDistribution.count({ where: { mealType: "midnight_snack" } }),
      db.foodDistribution.count({ where: { mealType: "breakfast" } }),
      db.eventSettings.findUnique({
        where: { id: "singleton" },
        select: { allowSecondServings: true },
      }),
    ]);

    // Get unique participants per meal
    const dinnerParticipants = await db.foodDistribution.groupBy({
      by: ["ticketId"],
      where: { mealType: "dinner" },
    });

    const midnightParticipants = await db.foodDistribution.groupBy({
      by: ["ticketId"],
      where: { mealType: "midnight_snack" },
    });

    const breakfastParticipants = await db.foodDistribution.groupBy({
      by: ["ticketId"],
      where: { mealType: "breakfast" },
    });

    return {
      data: {
        totalCheckedIn,
        dinner: {
          total: dinnerCount,
          unique: dinnerParticipants.length,
        },
        midnightSnack: {
          total: midnightCount,
          unique: midnightParticipants.length,
        },
        breakfast: {
          total: breakfastCount,
          unique: breakfastParticipants.length,
        },
        allowSecondServings: settings?.allowSecondServings ?? false,
      },
    };
  } catch (error) {
    console.error("Get food stats error:", error);
    return { error: "Failed to fetch food statistics" };
  }
}

/**
 * Get recent food distributions
 */
export async function getRecentFoodDistributions(mealType?: MealType, limit = 20) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin" && user?.role !== "volunteer") {
    return { error: "Unauthorized" };
  }

  try {
    // Validate limit
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const distributions = await db.foodDistribution.findMany({
      take: safeLimit,
      where: mealType ? { mealType } : undefined,
      orderBy: { distributedAt: "desc" },
      include: {
        ticket: {
          include: {
            registration: {
              include: {
                user: {
                  select: { name: true, email: true, image: true },
                },
              },
            },
          },
        },
        performer: {
          select: { name: true, email: true },
        },
      },
    });

    return { data: distributions };
  } catch (error) {
    console.error("Get recent food distributions error:", error);
    return { error: "Failed to fetch recent distributions" };
  }
}

/**
 * Toggle second servings setting
 */
export async function toggleSecondServings(enabled: boolean) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    await db.eventSettings.upsert({
      where: { id: "singleton" },
      update: { allowSecondServings: enabled },
      create: { id: "singleton", allowSecondServings: enabled },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/food");
    revalidatePath("/volunteer/food");
    return { success: true };
  } catch (error) {
    console.error("Toggle second servings error:", error);
    return { error: "Failed to update settings" };
  }
}

function getMealTypeLabel(mealType: MealType): string {
  switch (mealType) {
    case "dinner":
      return "Dinner";
    case "midnight_snack":
      return "Midnight Snack";
    case "breakfast":
      return "Breakfast";
  }
}
