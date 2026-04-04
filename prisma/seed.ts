import { db } from "../lib/db";
import bcrypt from "bcryptjs";
import { TRACKS } from "../lib/tracks-data";
import { TIMELINE_STEPS } from "../lib/event-config";

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin account ────────────────────────────────────────────────────────
  // Credentials are hashed — never stored in plaintext
  const adminEmail = "rva5573@psu.edu";
  const adminPassword = "RajAwinashe@17";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await db.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin", password: hashedPassword },
    create: {
      email: adminEmail,
      name: "GDG Admin",
      role: "admin",
      password: hashedPassword,
    },
  });
  console.log(`  ✓ Admin account: ${adminEmail}`);

  // ── Tracks ───────────────────────────────────────────────────────────────
  for (const track of TRACKS) {
    await db.track.upsert({
      where: { slug: track.slug },
      update: {
        name: track.name,
        description: track.description,
        fullDescription: track.fullDescription,
        promptContent: track.promptContent,
        icon: track.icon,
        gradient: track.gradient,
        order: track.order,
        // visible stays as-is on update — admin controls this
      },
      create: {
        slug: track.slug,
        name: track.name,
        description: track.description,
        fullDescription: track.fullDescription,
        promptContent: track.promptContent,
        icon: track.icon,
        gradient: track.gradient,
        order: track.order,
        visible: false, // hidden by default
      },
    });
  }
  console.log(`  ✓ ${TRACKS.length} tracks (all hidden by default)`);

  // ── FAQs ─────────────────────────────────────────────────────────────────
  const faqs = [
    {
      question: "Who can participate in the Solution Challenge?",
      answer: "The challenge is open to Penn State students of all majors and skill levels. You can participate individually or as a team of up to 4 members. No prior hackathon experience is required.",
      order: 0,
    },
    {
      question: "What technologies can I use?",
      answer: "You can use any technology stack of your choice. We encourage the use of modern frameworks, cloud services, and AI/ML tools. The focus is on creating impactful solutions, not specific technologies.",
      order: 1,
    },
    {
      question: "Is there a registration fee?",
      answer: "No, participation in the Solution Challenge is completely free. We believe in making innovation accessible to everyone.",
      order: 2,
    },
    {
      question: "How are projects judged?",
      answer: "Projects are evaluated based on impact potential, technical implementation, user experience, scalability, and alignment with the UN Sustainable Development Goals. A panel of expert judges will review all submissions.",
      order: 3,
    },
    {
      question: "What do winners receive?",
      answer: "Winning teams advance to the North America regional round of the Google Solution Challenge, held by Google. This is a prestigious opportunity to compete at a global level and gain recognition from the Google Developer community.",
      order: 4,
    },
    {
      question: "When does team formation happen?",
      answer: "Team formation for new participants happens at 8:00 PM on April 11 — one hour after the event kickoff. At that same time, the challenge prompts are released and hacking officially begins.",
      order: 5,
    },
    {
      question: "When is the submission deadline?",
      answer: "All project submissions must be completed by 10:00 AM on April 12 — two hours before judging begins at 12:00 PM. Late submissions will not be accepted.",
      order: 6,
    },
    {
      question: "Can I work on an existing project?",
      answer: "Yes, you can continue developing an existing project, but you must clearly document the progress made during the hackathon period. New projects are also welcome.",
      order: 7,
    },
  ];

  await db.fAQ.deleteMany();
  await db.fAQ.createMany({ data: faqs });
  console.log(`  ✓ ${faqs.length} FAQs`);

  // ── Timeline ─────────────────────────────────────────────────────────────
  // Derived from lib/event-config.ts — single source of truth
  await db.timelineEvent.deleteMany();
  await db.timelineEvent.createMany({
    data: TIMELINE_STEPS.map(({ title, date, description, status, order }) => ({
      title, date, description, status, order,
    })),
  });
  console.log(`  ✓ ${TIMELINE_STEPS.length} timeline events`);

  // ── Sponsors ─────────────────────────────────────────────────────────────
  const sponsors = [
    { name: "Google",                 initial: "G", tier: "platinum" as const, order: 0 },
    { name: "Schreyer Honors College",initial: "S", tier: "gold"     as const, order: 1 },
    { name: "Utree",                  initial: "U", tier: "silver"   as const, order: 2 },
  ];

  await db.sponsor.deleteMany();
  await db.sponsor.createMany({ data: sponsors });
  console.log(`  ✓ ${sponsors.length} sponsors`);

  console.log("✅ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
