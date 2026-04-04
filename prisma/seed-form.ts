import { db } from "../lib/db";

async function seedForm() {
  console.log("Seeding registration form...");

  // Clear existing form data
  await db.formAnswer.deleteMany();
  await db.formResponse.deleteMany();
  await db.formQuestion.deleteMany();
  await db.formSection.deleteMany();

  // Section 1: Basic Information
  const basicInfo = await db.formSection.create({
    data: {
      title: "Basic Information",
      description: "Tell us about yourself",
      order: 0,
      active: true,
    },
  });

  await db.formQuestion.createMany({
    data: [
      {
        sectionId: basicInfo.id,
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        order: 0,
        active: true,
      },
      {
        sectionId: basicInfo.id,
        type: "email",
        label: "Email Address",
        placeholder: "your.email@psu.edu",
        required: true,
        order: 1,
        active: true,
      },
      {
        sectionId: basicInfo.id,
        type: "text",
        label: "Preferred Pronouns",
        placeholder: "e.g., he/him, she/her, they/them",
        required: false,
        order: 2,
        active: true,
      },
      {
        sectionId: basicInfo.id,
        type: "text",
        label: "Major",
        placeholder: "Your field of study",
        required: true,
        order: 3,
        active: true,
      },
      {
        sectionId: basicInfo.id,
        type: "select",
        label: "Academic Year",
        required: true,
        options: JSON.stringify(["Freshman", "Sophomore", "Junior", "Senior", "Graduate", "Other"]),
        order: 4,
        active: true,
      },
    ],
  });

  // Section 2: Team Formation
  const teamFormation = await db.formSection.create({
    data: {
      title: "Team Formation",
      description: "Help us understand your experience and preferences",
      order: 1,
      active: true,
    },
  });

  const questions = await db.formQuestion.findMany({
    where: { sectionId: basicInfo.id },
  });

  await db.formQuestion.createMany({
    data: [
      {
        sectionId: teamFormation.id,
        type: "select",
        label: "What is your experience level with hackathons?",
        required: true,
        options: JSON.stringify([
          "First time",
          "1-2 hackathons",
          "3-5 hackathons",
          "5+ hackathons",
        ]),
        order: 0,
        active: true,
      },
      {
        sectionId: teamFormation.id,
        type: "radio",
        label: "Do you already have a team?",
        required: true,
        options: JSON.stringify(["Yes", "No, I need help finding teammates"]),
        order: 1,
        active: true,
      },
      {
        sectionId: teamFormation.id,
        type: "textarea",
        label: "If yes, please list your team members' names and emails",
        description: "Leave blank if you don't have a team yet",
        placeholder: "Name 1 (email1@psu.edu), Name 2 (email2@psu.edu)...",
        required: false,
        order: 2,
        active: true,
      },
      {
        sectionId: teamFormation.id,
        type: "checkbox",
        label: "What skills do you bring to a team? (Select all that apply)",
        required: true,
        options: JSON.stringify([
          "Frontend Development",
          "Backend Development",
          "Mobile Development",
          "UI/UX Design",
          "Data Science/ML",
          "Project Management",
          "Other",
        ]),
        order: 3,
        active: true,
      },
      {
        sectionId: teamFormation.id,
        type: "file",
        label: "Resume (Optional)",
        description: "Upload your resume if you'd like to share it with potential teammates",
        required: false,
        order: 4,
        active: true,
      },
    ],
  });

  // Section 3: Food & Dietary
  const foodDietary = await db.formSection.create({
    data: {
      title: "Food & Dietary",
      description: "Help us accommodate your dietary needs",
      order: 2,
      active: true,
    },
  });

  await db.formQuestion.createMany({
    data: [
      {
        sectionId: foodDietary.id,
        type: "checkbox",
        label: "Do you have any dietary restrictions?",
        required: false,
        options: JSON.stringify([
          "Vegetarian",
          "Vegan",
          "Gluten-free",
          "Halal",
          "Kosher",
          "Lactose intolerant",
          "None",
        ]),
        order: 0,
        active: true,
      },
      {
        sectionId: foodDietary.id,
        type: "textarea",
        label: "Please list any food allergies or additional dietary requirements",
        placeholder: "e.g., peanut allergy, shellfish allergy",
        required: false,
        order: 1,
        active: true,
      },
    ],
  });

  // Section 4: T-Shirt & Membership
  const tshirtMembership = await db.formSection.create({
    data: {
      title: "T-Shirt & Membership",
      description: "Event swag and community membership",
      order: 3,
      active: true,
    },
  });

  await db.formQuestion.createMany({
    data: [
      {
        sectionId: tshirtMembership.id,
        type: "radio",
        label: "Are you a GDG Penn State member?",
        description: "You count as an official member if you have joined us through DISCOVER",
        required: true,
        options: JSON.stringify(["Yes", "No"]),
        order: 0,
        active: true,
      },
      {
        sectionId: tshirtMembership.id,
        type: "select",
        label: "T-Shirt Size",
        required: true,
        options: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
        order: 1,
        active: true,
      },
    ],
  });

  // Section 5: Agreements
  const agreements = await db.formSection.create({
    data: {
      title: "Agreements & Accessibility",
      description: "Please review and agree to the following",
      order: 4,
      active: true,
    },
  });

  await db.formQuestion.createMany({
    data: [
      {
        sectionId: agreements.id,
        type: "checkbox",
        label: "I agree to the following",
        required: true,
        options: JSON.stringify([
          "I agree to the MLH Code of Conduct",
          "I authorize media consent for photos/videos taken during the event",
        ]),
        order: 0,
        active: true,
      },
      {
        sectionId: agreements.id,
        type: "textarea",
        label: "Do you require any accessibility accommodations?",
        description: "We want to ensure everyone can participate fully",
        placeholder: "Please describe any accommodations you need",
        required: false,
        order: 1,
        active: true,
      },
    ],
  });

  console.log("✓ Registration form seeded successfully!");
  console.log(`  - ${5} sections created`);
  console.log(`  - ${17} questions created`);
}

seedForm()
  .catch((e) => {
    console.error("Error seeding form:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
