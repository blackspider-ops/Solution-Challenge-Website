import "dotenv/config";
import { db } from "../lib/db";

async function seedVolunteerForm() {
  console.log("🌱 Seeding volunteer form...");

  // Clear existing volunteer form data
  await db.volunteerFormAnswer.deleteMany({});
  await db.volunteerFormQuestion.deleteMany({});
  await db.volunteerFormSection.deleteMany({});

  // Section 1: Basic Information
  const section1 = await db.volunteerFormSection.create({
    data: {
      title: "Basic Information",
      description: "Tell us about yourself",
      order: 0,
      active: true,
    },
  });

  await db.volunteerFormQuestion.createMany({
    data: [
      {
        sectionId: section1.id,
        type: "text",
        label: "Name",
        placeholder: "Enter your answer",
        required: true,
        order: 0,
        active: true,
      },
      {
        sectionId: section1.id,
        type: "text",
        label: "Pronouns",
        placeholder: "Enter your answer",
        required: false,
        order: 1,
        active: true,
      },
      {
        sectionId: section1.id,
        type: "email",
        label: "PSU mail",
        placeholder: "Enter your answer",
        required: true,
        order: 2,
        active: true,
      },
      {
        sectionId: section1.id,
        type: "text",
        label: "Major",
        placeholder: "Enter your answer",
        required: true,
        order: 3,
        active: true,
      },
    ],
  });

  // Section 2: Academic Information
  const section2 = await db.volunteerFormSection.create({
    data: {
      title: "Academic Information",
      description: "Your academic details",
      order: 1,
      active: true,
    },
  });

  await db.volunteerFormQuestion.create({
    data: {
      sectionId: section2.id,
      type: "radio",
      label: "Academic Year",
      required: true,
      options: JSON.stringify(["Freshman", "Sophomore", "Junior", "Senior"]),
      order: 0,
      active: true,
    },
  });

  // Section 3: Availability
  const section3 = await db.volunteerFormSection.create({
    data: {
      title: "Availability",
      description: "When can you volunteer?",
      order: 2,
      active: true,
    },
  });

  await db.volunteerFormQuestion.create({
    data: {
      sectionId: section3.id,
      type: "checkbox",
      label: "Please select the timeslots you will be available for volunteering",
      required: true,
      options: JSON.stringify([
        "5:30 PM - 7:30 PM, April 11",
        "7:30 PM - 9:30 PM, April 11",
        "9:30 PM - 11:30 PM, April 11",
        "12:30 AM - 4:00 AM, April 12",
        "4:00 AM - 7:00 AM, April 12",
        "7:00 AM - 9:00 AM, April 12",
        "9:00 AM - 12:00 PM, April 12",
      ]),
      order: 0,
      active: true,
    },
  });

  // Section 4: Volunteering Preferences
  const section4 = await db.volunteerFormSection.create({
    data: {
      title: "Volunteering Preferences",
      description: "What would you like to help with?",
      order: 3,
      active: true,
    },
  });

  await db.volunteerFormQuestion.create({
    data: {
      sectionId: section4.id,
      type: "checkbox",
      label: "Volunteering Preferences",
      required: true,
      options: JSON.stringify([
        "Registration / Check-in Desk",
        "Food & Logistics",
        "Participant Support",
        "Technical Mentor",
        "Photography / Social Media",
        "Runner (general help)",
        "Setup & Decorations",
        "Cleanup Crew",
      ]),
      order: 0,
      active: true,
    },
  });

  // Section 5: Communication
  const section5 = await db.volunteerFormSection.create({
    data: {
      title: "Communication Preferences",
      description: "How should we reach you?",
      order: 4,
      active: true,
    },
  });

  await db.volunteerFormQuestion.create({
    data: {
      sectionId: section5.id,
      type: "checkbox",
      label: "Preferred Mode of Communication",
      required: true,
      options: JSON.stringify([
        "Email",
        "WhatsApp",
        "Instagram",
        "Discord",
        "GroupMe",
        "SMS / iMessage",
      ]),
      order: 0,
      active: true,
    },
  });

  // Section 6: Confirmations
  const section6 = await db.volunteerFormSection.create({
    data: {
      title: "Confirmations",
      description: "Please confirm the following",
      order: 5,
      active: true,
    },
  });

  await db.volunteerFormQuestion.createMany({
    data: [
      {
        sectionId: section6.id,
        type: "radio",
        label: "Commitment Confirmation",
        required: true,
        options: JSON.stringify([
          "I understand that volunteering is a commitment and I will inform organizers if my availability changes.",
        ]),
        order: 0,
        active: true,
      },
      {
        sectionId: section6.id,
        type: "radio",
        label: "Media Consent",
        required: true,
        options: JSON.stringify([
          "I consent to photos/videos being taken during the event.",
        ]),
        order: 1,
        active: true,
      },
    ],
  });

  console.log("✅ Volunteer form seeded successfully!");
}

seedVolunteerForm()
  .catch((e) => {
    console.error("❌ Error seeding volunteer form:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
