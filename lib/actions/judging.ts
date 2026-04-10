"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Check if user is admin or judge
 */
async function requireAdminOrJudge() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin" && user?.role !== "judge") {
    throw new Error("Unauthorized - Admin or Judge access required");
  }

  return session;
}

/**
 * Get all judging criteria
 */
export async function getJudgingCriteria() {
  try {
    const criteria = await db.judgingCriteria.findMany({
      orderBy: { order: "asc" },
    });
    return { data: criteria };
  } catch (error) {
    console.error("Get judging criteria error:", error);
    return { error: "Failed to fetch judging criteria" };
  }
}

/**
 * Create judging criteria (admin only)
 */
export async function createJudgingCriteria(data: {
  name: string;
  description: string;
  maxScore: number;
  weight: number;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const maxOrder = await db.judgingCriteria.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const criteria = await db.judgingCriteria.create({
      data: {
        ...data,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/judging-criteria");
    return { data: criteria };
  } catch (error) {
    console.error("Create judging criteria error:", error);
    return { error: "Failed to create judging criteria" };
  }
}

/**
 * Update judging criteria (admin only)
 */
export async function updateJudgingCriteria(
  id: string,
  data: {
    name?: string;
    description?: string;
    maxScore?: number;
    weight?: number;
    active?: boolean;
  }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const criteria = await db.judgingCriteria.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/judging-criteria");
    return { data: criteria };
  } catch (error) {
    console.error("Update judging criteria error:", error);
    return { error: "Failed to update judging criteria" };
  }
}

/**
 * Delete judging criteria (admin only)
 */
export async function deleteJudgingCriteria(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    await db.judgingCriteria.delete({
      where: { id },
    });

    revalidatePath("/admin/judging-criteria");
    return { success: true };
  } catch (error) {
    console.error("Delete judging criteria error:", error);
    return { error: "Failed to delete judging criteria" };
  }
}

/**
 * Get all submissions for judging
 */
export async function getSubmissionsForJudging() {
  await requireAdminOrJudge();

  try {
    const submissions = await db.submission.findMany({
      where: { status: "submitted" },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
            leader: {
              select: { name: true, email: true },
            },
          },
        },
        track: true,
        scores: {
          include: {
            judge: {
              select: { name: true, email: true },
            },
            criteria: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: submissions };
  } catch (error) {
    console.error("Get submissions for judging error:", error);
    return { error: "Failed to fetch submissions" };
  }
}

/**
 * Submit or update a score for a submission
 */
export async function submitJudgingScore(data: {
  submissionId: string;
  criteriaId: string;
  score: number;
  comment?: string;
}) {
  const session = await requireAdminOrJudge();

  try {
    // Verify criteria exists and get maxScore
    const criteria = await db.judgingCriteria.findUnique({
      where: { id: data.criteriaId },
    });

    if (!criteria) {
      return { error: "Criteria not found" };
    }

    if (data.score < 0 || data.score > criteria.maxScore) {
      return { error: `Score must be between 0 and ${criteria.maxScore}` };
    }

    // Upsert the score
    const score = await db.judgingScore.upsert({
      where: {
        submissionId_judgeId_criteriaId: {
          submissionId: data.submissionId,
          judgeId: session.user.id!,
          criteriaId: data.criteriaId,
        },
      },
      create: {
        submissionId: data.submissionId,
        judgeId: session.user.id!,
        criteriaId: data.criteriaId,
        score: data.score,
        comment: data.comment,
      },
      update: {
        score: data.score,
        comment: data.comment,
      },
    });

    revalidatePath("/judge");
    revalidatePath("/admin/submissions");
    return { data: score };
  } catch (error) {
    console.error("Submit judging score error:", error);
    return { error: "Failed to submit score" };
  }
}

/**
 * Get judging scores for a specific submission
 */
export async function getSubmissionScores(submissionId: string) {
  await requireAdminOrJudge();

  try {
    const scores = await db.judgingScore.findMany({
      where: { submissionId },
      include: {
        judge: {
          select: { name: true, email: true },
        },
        criteria: true,
      },
    });

    return { data: scores };
  } catch (error) {
    console.error("Get submission scores error:", error);
    return { error: "Failed to fetch scores" };
  }
}

/**
 * Get judging statistics
 */
export async function getJudgingStats() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const [totalSubmissions, judgedSubmissions, totalJudges, activeCriteria] = await Promise.all([
      db.submission.count({ where: { status: "submitted" } }),
      db.submission.count({
        where: {
          status: "submitted",
          scores: { some: {} },
        },
      }),
      db.user.count({ where: { role: "judge" } }),
      db.judgingCriteria.count({ where: { active: true } }),
    ]);

    return {
      data: {
        totalSubmissions,
        judgedSubmissions,
        unjudgedSubmissions: totalSubmissions - judgedSubmissions,
        totalJudges,
        activeCriteria,
      },
    };
  } catch (error) {
    console.error("Get judging stats error:", error);
    return { error: "Failed to fetch judging statistics" };
  }
}
