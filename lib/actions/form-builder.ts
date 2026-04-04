"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { QuestionType } from "@prisma/client";

// ─── Section Management ────────────────────────────────────────────────────

export async function createSection(data: {
  title: string;
  description?: string;
  order: number;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const section = await db.formSection.create({ data });
    revalidatePath("/admin/registration-form");
    return { data: section };
  } catch (error) {
    console.error("Create section error:", error);
    return { error: "Failed to create section" };
  }
}

export async function updateSection(
  id: string,
  data: { title?: string; description?: string; order?: number; active?: boolean }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const section = await db.formSection.update({ where: { id }, data });
    revalidatePath("/admin/registration-form");
    return { data: section };
  } catch (error) {
    console.error("Update section error:", error);
    return { error: "Failed to update section" };
  }
}

export async function deleteSection(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    await db.formSection.delete({ where: { id } });
    revalidatePath("/admin/registration-form");
    return { success: true };
  } catch (error) {
    console.error("Delete section error:", error);
    return { error: "Failed to delete section" };
  }
}

// ─── Question Management ───────────────────────────────────────────────────

export async function createQuestion(data: {
  sectionId: string;
  type: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  order: number;
  conditionalOn?: string;
  conditionalValue?: string;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const question = await db.formQuestion.create({
      data: {
        ...data,
        options: data.options ? JSON.stringify(data.options) : null,
      },
    });
    revalidatePath("/admin/registration-form");
    return { data: question };
  } catch (error) {
    console.error("Create question error:", error);
    return { error: "Failed to create question" };
  }
}

export async function updateQuestion(
  id: string,
  data: {
    type?: QuestionType;
    label?: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
    order?: number;
    active?: boolean;
    conditionalOn?: string;
    conditionalValue?: string;
  }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const question = await db.formQuestion.update({
      where: { id },
      data: {
        ...data,
        options: data.options ? JSON.stringify(data.options) : undefined,
      },
    });
    revalidatePath("/admin/registration-form");
    return { data: question };
  } catch (error) {
    console.error("Update question error:", error);
    return { error: "Failed to update question" };
  }
}

export async function deleteQuestion(id: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    await db.formQuestion.delete({ where: { id } });
    revalidatePath("/admin/registration-form");
    return { success: true };
  } catch (error) {
    console.error("Delete question error:", error);
    return { error: "Failed to delete question" };
  }
}

// ─── Form Response Management ──────────────────────────────────────────────

export async function saveFormResponse(answers: Record<string, any>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    // Get or create response
    let response = await db.formResponse.findUnique({
      where: { userId: session.user.id },
    });

    if (!response) {
      response = await db.formResponse.create({
        data: { userId: session.user.id, completed: false },
      });
    }

    // Save answers
    for (const [questionId, value] of Object.entries(answers)) {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      
      await db.formAnswer.upsert({
        where: {
          responseId_questionId: {
            responseId: response.id,
            questionId,
          },
        },
        create: {
          responseId: response.id,
          questionId,
          value: stringValue,
        },
        update: {
          value: stringValue,
        },
      });
    }

    revalidatePath("/dashboard");
    return { data: response };
  } catch (error) {
    console.error("Save form response error:", error);
    return { error: "Failed to save response" };
  }
}

export async function submitFormResponse() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const response = await db.formResponse.update({
      where: { userId: session.user.id },
      data: { completed: true },
    });

    // Send email notification to admin
    const { sendFormSubmissionNotification } = await import("@/lib/email");
    await sendFormSubmissionNotification(
      session.user.name || "Anonymous",
      session.user.email!,
      new Date()
    );

    revalidatePath("/dashboard");
    return { data: response };
  } catch (error) {
    console.error("Submit form response error:", error);
    return { error: "Failed to submit response" };
  }
}

export async function getMyFormResponse() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.formResponse.findUnique({
    where: { userId: session.user.id },
    include: {
      answers: {
        include: { question: true },
      },
    },
  });
}

// ─── Admin: View Responses ─────────────────────────────────────────────────

export async function getAllFormResponses() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const responses = await db.formResponse.findMany({
      where: { completed: true },
      include: {
        user: { select: { id: true, name: true, email: true } },
        answers: {
          include: { question: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: responses };
  } catch (error) {
    console.error("Get responses error:", error);
    return { error: "Failed to fetch responses" };
  }
}
