/**
 * Canonical track data for Solution Challenge @ GDG Penn State.
 * This is the single source of truth for all track content.
 * Seeded into the database via prisma/seed.ts.
 * The `visible` field is managed by admins in the database — this file
 * only defines the static content.
 */

export type TrackData = {
  slug: string;
  name: string;
  icon: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  bgGradient: string;
  order: number;
  /** Short summary shown on the public landing page track cards */
  description: string;
  /** Full detail shown on the track detail page (gated until visible=true or admin) */
  fullDescription: string;
  /** Challenge prompt / problem statement — released at event start */
  promptContent: string;
};

export const TRACKS: TrackData[] = [
  {
    slug: "health-wellbeing",
    name: "Health & Wellbeing",
    icon: "Heart",
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-500/10 to-pink-500/10",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-500",
    order: 0,
    description:
      "Create solutions that improve healthcare access, mental health support, and overall wellbeing for communities worldwide.",
    fullDescription:
      "The Health & Wellbeing track challenges you to build technology that makes healthcare more accessible, equitable, and effective. This includes solutions for mental health support, preventive care, chronic disease management, telehealth, health literacy, and community wellness. Your project should address a real gap in healthcare access or outcomes — especially for underserved populations.",
    promptContent:
      "🔒 Challenge prompt will be released at 8:00 PM on April 11 during the event kickoff.",
  },
  {
    slug: "climate-action",
    name: "Climate Action",
    icon: "Leaf",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    order: 1,
    description:
      "Build tools to combat climate change, promote sustainability, and protect our planet for future generations.",
    fullDescription:
      "The Climate Action track invites you to build technology that directly addresses the climate crisis. This includes tools for carbon tracking, renewable energy optimization, sustainable agriculture, waste reduction, climate education, environmental monitoring, and green supply chains. Your solution should create measurable environmental impact or empower individuals and organizations to make more sustainable choices.",
    promptContent:
      "🔒 Challenge prompt will be released at 8:00 PM on April 11 during the event kickoff.",
  },
  {
    slug: "quality-education",
    name: "Quality Education",
    icon: "GraduationCap",
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-500/10 to-indigo-500/10",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-500",
    order: 2,
    description:
      "Develop platforms that make education accessible, engaging, and effective for learners everywhere.",
    fullDescription:
      "The Quality Education track challenges you to reimagine how people learn. Build platforms, tools, or experiences that make education more accessible, personalized, and effective — for students of all ages and backgrounds. This includes adaptive learning systems, tools for educators, literacy platforms, vocational training, STEM education, and solutions that bridge the digital divide in education.",
    promptContent:
      "🔒 Challenge prompt will be released at 8:00 PM on April 11 during the event kickoff.",
  },
  {
    slug: "peace-justice",
    name: "Peace & Justice",
    icon: "ShieldCheck",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-500/10 to-purple-500/10",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500",
    order: 3,
    description:
      "Design systems that promote transparency, accountability, and access to justice for all people.",
    fullDescription:
      "The Peace & Justice track challenges you to build technology that strengthens democratic institutions, promotes human rights, and ensures equal access to justice. This includes tools for civic engagement, legal aid, anti-corruption, conflict resolution, community safety, freedom of information, and protecting vulnerable populations. Your solution should help create more just and peaceful communities.",
    promptContent:
      "🔒 Challenge prompt will be released at 8:00 PM on April 11 during the event kickoff.",
  },
  {
    slug: "reduced-inequalities",
    name: "Reduced Inequalities",
    icon: "Accessibility",
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/10 to-orange-500/10",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500",
    order: 4,
    description:
      "Create inclusive technology that bridges gaps and empowers underserved communities globally.",
    fullDescription:
      "The Reduced Inequalities track challenges you to build technology that closes gaps — economic, social, digital, and geographic. This includes solutions for financial inclusion, accessibility for people with disabilities, support for refugees and migrants, rural connectivity, gender equity, and tools that amplify the voices of marginalized communities. Your project should directly empower people who are currently left behind by existing systems.",
    promptContent:
      "🔒 Challenge prompt will be released at 8:00 PM on April 11 during the event kickoff.",
  },
  {
    slug: "innovation-infrastructure",
    name: "Innovation & Infrastructure",
    icon: "Zap",
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-500",
    order: 5,
    description:
      "Build foundational tools and systems that drive technological advancement and connectivity.",
    fullDescription:
      "The Innovation & Infrastructure track challenges you to build the foundational technology that enables progress across all other domains. This includes developer tools, open-source infrastructure, connectivity solutions for underserved areas, smart city technology, data platforms, API ecosystems, and tools that help other innovators build faster and better. Your solution should create leverage — enabling many other solutions to exist.",
    promptContent:
      "🔒 Challenge prompt will be released at 8:00 PM on April 11 during the event kickoff.",
  },
];

/** Look up a track by slug */
export function getTrackBySlug(slug: string): TrackData | undefined {
  return TRACKS.find((t) => t.slug === slug);
}
