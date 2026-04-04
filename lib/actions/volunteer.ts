"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getMyVolunteerRegistration() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const registration = await db.volunteerRegistration.findUnique({
      where: { userId: session.user.id },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    return registration;
  } catch (error) {
    console.error("Get volunteer registration error:", error);
    return null;
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

    const preFillData: Record<string, any> = {};

    // Extract relevant fields
    formResponse.answers.forEach((answer) => {
      const label = answer.question.label.toLowerCase();
      let value: any;
      
      try {
        value = JSON.parse(answer.value);
      } catch {
        value = answer.value;
      }

      // Store by label for matching
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

// Get pre-fill data for event registration from volunteer form
export async function getEventPreFillData() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    // Get data from volunteer registration if exists
    const volunteerRegistration = await db.volunteerRegistration.findUnique({
      where: { userId: session.user.id },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!volunteerRegistration) {
      return null;
    }

    const preFillData: Record<string, any> = {};

    // Extract relevant fields
    volunteerRegistration.answers.forEach((answer) => {
      const label = answer.question.label.toLowerCase();
      let value: any;
      
      try {
        value = JSON.parse(answer.value);
      } catch {
        value = answer.value;
      }

      // Store by label for matching
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
    console.error("Get event pre-fill data error:", error);
    return null;
  }
}
