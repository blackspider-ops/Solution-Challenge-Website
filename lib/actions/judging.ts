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
    // Input validation
    if (!data.name?.trim() || !data.description?.trim()) {
      return { error: "Name and description are required" };
    }

    if (typeof data.maxScore !== "number" || data.maxScore < 1 || data.maxScore > 100) {
      return { error: "Max score must be between 1 and 100" };
    }

    if (typeof data.weight !== "number" || data.weight < 0 || data.weight > 10) {
      return { error: "Weight must be between 0 and 10" };
    }

    // Sanitize inputs
    const sanitizedName = data.name.trim().slice(0, 100);
    const sanitizedDescription = data.description.trim().slice(0, 500);

    const maxOrder = await db.judgingCriteria.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const criteria = await db.judgingCriteria.create({
      data: {
        name: sanitizedName,
        description: sanitizedDescription,
        maxScore: Math.floor(data.maxScore),
        weight: data.weight,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/judging-criteria");
    revalidatePath("/judge");
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
    // Input validation
    if (!id) {
      return { error: "Criteria ID is required" };
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      const trimmed = data.name.trim();
      if (!trimmed) {
        return { error: "Name cannot be empty" };
      }
      updateData.name = trimmed.slice(0, 100);
    }

    if (data.description !== undefined) {
      const trimmed = data.description.trim();
      if (!trimmed) {
        return { error: "Description cannot be empty" };
      }
      updateData.description = trimmed.slice(0, 500);
    }

    if (data.maxScore !== undefined) {
      if (typeof data.maxScore !== "number" || data.maxScore < 1 || data.maxScore > 100) {
        return { error: "Max score must be between 1 and 100" };
      }
      updateData.maxScore = Math.floor(data.maxScore);
    }

    if (data.weight !== undefined) {
      if (typeof data.weight !== "number" || data.weight < 0 || data.weight > 10) {
        return { error: "Weight must be between 0 and 10" };
      }
      updateData.weight = data.weight;
    }

    if (data.active !== undefined) {
      updateData.active = Boolean(data.active);
    }

    const criteria = await db.judgingCriteria.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/judging-criteria");
    revalidatePath("/judge");
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
    // Input validation
    if (!id) {
      return { error: "Criteria ID is required" };
    }

    // Check if criteria has existing scores
    const scoresCount = await db.judgingScore.count({
      where: { criteriaId: id },
    });

    if (scoresCount > 0) {
      return { error: `Cannot delete criteria with ${scoresCount} existing scores. Deactivate it instead.` };
    }

    await db.judgingCriteria.delete({
      where: { id },
    });

    revalidatePath("/admin/judging-criteria");
    revalidatePath("/judge");
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
    // Input validation
    if (!data.submissionId || !data.criteriaId) {
      return { error: "Missing required fields" };
    }

    if (typeof data.score !== "number" || !Number.isFinite(data.score)) {
      return { error: "Invalid score value" };
    }

    // Sanitize comment to prevent XSS
    const sanitizedComment = data.comment?.trim().slice(0, 1000);

    // Verify criteria exists and get maxScore
    const criteria = await db.judgingCriteria.findUnique({
      where: { id: data.criteriaId },
    });

    if (!criteria) {
      return { error: "Criteria not found" };
    }

    if (!criteria.active) {
      return { error: "This criteria is no longer active" };
    }

    if (data.score < 0 || data.score > criteria.maxScore) {
      return { error: `Score must be between 0 and ${criteria.maxScore}` };
    }

    // Verify submission exists and is submitted
    const submission = await db.submission.findUnique({
      where: { id: data.submissionId },
      select: { status: true },
    });

    if (!submission) {
      return { error: "Submission not found" };
    }

    if (submission.status !== "submitted") {
      return { error: "Can only score submitted projects" };
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
        comment: sanitizedComment,
      },
      update: {
        score: data.score,
        comment: sanitizedComment,
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
    // Input validation
    if (!submissionId) {
      return { error: "Submission ID is required" };
    }

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
