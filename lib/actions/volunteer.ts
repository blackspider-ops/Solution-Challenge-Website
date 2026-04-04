"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type VolunteerFormData = {
  name: string;
  pronouns?: string;
  psuEmail: string;
  major: string;
  academicYear: string;
  availableTimeslots: string[];
  volunteerPreferences: string[];
  communicationMethods: string[];
  commitmentConfirmed: boolean;
  mediaConsent: boolean;
};

export async function submitVolunteerRegistration(data: VolunteerFormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }

    // Check if already submitted
    const existing = await db.volunteerRegistration.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      return { error: "You have already submitted a volunteer registration" };
    }

    // Create volunteer registration
    await db.volunteerRegistration.create({
      data: {
        userId: session.user.id,
        name: data.name,
        pronouns: data.pronouns || null,
        psuEmail: data.psuEmail,
        major: data.major,
        academicYear: data.academicYear,
        availableTimeslots: JSON.stringify(data.availableTimeslots),
        volunteerPreferences: JSON.stringify(data.volunteerPreferences),
        communicationMethods: JSON.stringify(data.communicationMethods),
        commitmentConfirmed: data.commitmentConfirmed,
        mediaConsent: data.mediaConsent,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Submit volunteer registration error:", error);
    return { error: "Failed to submit volunteer registration" };
  }
}

export async function getMyVolunteerRegistration() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const registration = await db.volunteerRegistration.findUnique({
      where: { userId: session.user.id },
    });

    return registration;
  } catch (error) {
    console.error("Get volunteer registration error:", error);
    return null;
  }
}

export async function getAllVolunteerRegistrations() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const registrations = await db.volunteerRegistration.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { registrations };
  } catch (error) {
    console.error("Get all volunteer registrations error:", error);
    return { error: "Failed to fetch volunteer registrations" };
  }
}

// Get pre-fill data from event registration if exists
export async function getVolunteerPreFillData() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    // Get data from form response if exists
    const formResponse = await db.formResponse.findUnique({
      where: { userId: session.user.id },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!formResponse) {
      return null;
    }

    const preFillData: Partial<VolunteerFormData> = {};

    // Extract relevant fields
    formResponse.answers.forEach((answer) => {
      const label = answer.question.label.toLowerCase();
      let value: any;
      
      try {
        value = JSON.parse(answer.value);
      } catch {
        value = answer.value;
      }

      if (label.includes("full name") || label === "name") {
        preFillData.name = value;
      } else if (label.includes("pronoun")) {
        preFillData.pronouns = value;
      } else if (label.includes("major")) {
        preFillData.major = value;
      } else if (label.includes("academic year") || label.includes("year")) {
        preFillData.academicYear = value;
      }
    });

    return preFillData;
  } catch (error) {
    console.error("Get volunteer pre-fill data error:", error);
    return null;
  }
}
