"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { QuestionType } from "@prisma/client";

// ─── Section Actions ───────────────────────────────────────────────────────

export async function createVolunteerSection(data: {
  title: string;
  description?: string;
  order?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const section = await db.volunteerFormSection.create({
      data: {
        title: data.title,
        description: data.description || null,
        order: data.order || 0,
      },
      include: { questions: true },
    });

    revalidatePath("/admin/volunteer-form");
    return { data: section };
  } catch (error) {
    console.error("Create volunteer section error:", error);
    return { error: "Failed to create section" };
  }
}

export async function updateVolunteerSection(
  id: string,
  data: Partial<{ title: string; description: string; order: number; active: boolean }>
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const section = await db.volunteerFormSection.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/volunteer-form");
    return { data: section };
  } catch (error) {
    console.error("Update volunteer section error:", error);
    return { error: "Failed to update section" };
  }
}

export async function deleteVolunteerSection(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    await db.volunteerFormSection.delete({ where: { id } });

    revalidatePath("/admin/volunteer-form");
    return { data: true };
  } catch (error) {
    console.error("Delete volunteer section error:", error);
    return { error: "Failed to delete section" };
  }
}

// ─── Question Actions ──────────────────────────────────────────────────────

export async function createVolunteerQuestion(data: {
  sectionId: string;
  type: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  order?: number;
  conditionalOn?: string;
  conditionalValue?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const question = await db.volunteerFormQuestion.create({
      data: {
        sectionId: data.sectionId,
        type: data.type,
        label: data.label,
        description: data.description || null,
        placeholder: data.placeholder || null,
        required: data.required || false,
        options: data.options ? JSON.stringify(data.options) : null,
        order: data.order || 0,
        conditionalOn: data.conditionalOn || null,
        conditionalValue: data.conditionalValue || null,
      },
    });

    revalidatePath("/admin/volunteer-form");
    return { data: question };
  } catch (error) {
    console.error("Create volunteer question error:", error);
    return { error: "Failed to create question" };
  }
}

export async function updateVolunteerQuestion(
  id: string,
  data: Partial<{
    type: QuestionType;
    label: string;
    description: string;
    placeholder: string;
    required: boolean;
    options: string[];
    order: number;
    active: boolean;
    conditionalOn: string;
    conditionalValue: string;
  }>
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const updateData: any = { ...data };
    if (data.options) {
      updateData.options = JSON.stringify(data.options);
    }

    const question = await db.volunteerFormQuestion.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/volunteer-form");
    return { data: question };
  } catch (error) {
    console.error("Update volunteer question error:", error);
    return { error: "Failed to update question" };
  }
}

export async function deleteVolunteerQuestion(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    await db.volunteerFormQuestion.delete({ where: { id } });

    revalidatePath("/admin/volunteer-form");
    return { data: true };
  } catch (error) {
    console.error("Delete volunteer question error:", error);
    return { error: "Failed to delete question" };
  }
}

// ─── Response Actions ──────────────────────────────────────────────────────

export async function saveVolunteerFormResponse(answers: Record<string, any>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }

    // Get or create response
    let response = await db.volunteerRegistration.findUnique({
      where: { userId: session.user.id },
    });

    if (!response) {
      response = await db.volunteerRegistration.create({
        data: { userId: session.user.id },
      });
    }

    // Save answers
    for (const [questionId, value] of Object.entries(answers)) {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);

      await db.volunteerFormAnswer.upsert({
        where: {
          registrationId_questionId: {
            registrationId: response.id,
            questionId,
          },
        },
        create: {
          registrationId: response.id,
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
    console.error("Save volunteer form response error:", error);
    return { error: "Failed to save response" };
  }
}

export async function submitVolunteerFormResponse() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }

    const response = await db.volunteerRegistration.findUnique({
      where: { userId: session.user.id },
    });

    if (!response) {
      return { error: "No response found" };
    }

    // Update registration as completed
    await db.volunteerRegistration.update({
      where: { id: response.id },
      data: { completed: true },
    });

    // Update user role to volunteer if they're currently a participant
    await db.user.update({
      where: { id: session.user.id },
      data: { role: "volunteer" },
    });

    revalidatePath("/dashboard");
    return { data: true };
  } catch (error) {
    console.error("Submit volunteer form response error:", error);
    return { error: "Failed to submit response" };
  }
}

export async function getMyVolunteerFormResponse() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const response = await db.volunteerRegistration.findUnique({
      where: { userId: session.user.id },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error("Get volunteer form response error:", error);
    return null;
  }
}

export async function getAllVolunteerFormResponses() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const responses = await db.volunteerRegistration.findMany({
      where: { completed: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { data: responses };
  } catch (error) {
    console.error("Get all volunteer form responses error:", error);
    return { error: "Failed to fetch responses" };
  }
}
