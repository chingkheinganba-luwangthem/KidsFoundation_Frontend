export interface SearchResultItem {
  id: string;
  title: string;
  category:
    | "Admission"
    | "About Us"
    | "Learning & Academics"
    | "Campus & Facilities"
    | "Sports & Arts"
    | "Mandatory Disclosure"
    | "News & Events"
    | "Contact";
  description: string;
  href: string;
  keywords: string[];
}

export const SEARCH_INDEX: SearchResultItem[] = [
  // ── 1. Admissions ──
  {
    id: "adm-enquiry",
    title: "Admission Enquiry & Procedures",
    category: "Admission",
    description:
      "Information on admission procedures, registration dates from 1st November, campus tours, entrance evaluations, and eligibility from Pre-Nursery to Class XII.",
    href: "/admission",
    keywords: [
      "admission",
      "enquiry",
      "procedure",
      "registration",
      "eligibility",
      "apply",
      "form",
      "pre-nursery",
      "nursery",
      "kg",
      "class",
    ],
  },
  {
    id: "adm-fees",
    title: "Fee Structure & Tuition Fees (2026–27)",
    category: "Admission",
    description:
      "Comprehensive breakdown of tuition fees, admission charges, lab fees, and payment schedule for Pre-Nursery to Class XII.",
    href: "/admission#fee-structure",
    keywords: [
      "fee",
      "fees",
      "tuition",
      "fee structure",
      "cost",
      "payment",
      "charges",
      "admission fee",
      "monthly fee",
    ],
  },
  {
    id: "adm-form",
    title: "Download Admission Application Form",
    category: "Admission",
    description:
      "Download official admission registration form, school prospectus, and document checklist for new student admissions.",
    href: "/admission",
    keywords: [
      "form",
      "download form",
      "application form",
      "prospectus",
      "registration form",
      "admission form",
    ],
  },

  // ── 2. About Us ──
  {
    id: "about-overview",
    title: "About Kids' Foundation School",
    category: "About Us",
    description:
      "Established in 2005 on a sprawling 2+ acre campus near Imphal International Airport. Offering holistic CBSE education from Pre-Nursery to tenth standard.",
    href: "/about",
    keywords: [
      "about",
      "about us",
      "history",
      "story",
      "foundation",
      "cbse",
      "established",
      "campus",
      "airport road",
      "ghari",
      "imphal",
    ],
  },
  {
    id: "about-values",
    title: "Our Core Values & Educational Philosophy",
    category: "About Us",
    description:
      "Guided by Holistic Learning, Values & Care, Curiosity, and Community. Nurturing confident, empathetic, and independent young learners.",
    href: "/about",
    keywords: [
      "values",
      "core values",
      "curiosity",
      "care",
      "community",
      "holistic learning",
      "philosophy",
      "mission",
    ],
  },

  // ── 3. Sports & Arts ──
  {
    id: "sports-arts-overview",
    title: "Sports & Physical Education Curricula",
    category: "Sports & Arts",
    description:
      "Physical Education (P.E.), sportsmanship, football field, basketball court, indoor chess, carrom, and athletic development for students.",
    href: "/about/sports-and-arts",
    keywords: [
      "sports",
      "football",
      "basketball",
      "chess",
      "carrom",
      "physical education",
      "pe",
      "fitness",
      "games",
      "outdoor",
    ],
  },
  {
    id: "sports-martial-arts",
    title: "Martial Arts & Self-Defence (Karate, Taekwondo, Judo)",
    category: "Sports & Arts",
    description:
      "Regular training courses in Karate, Taekwondo, and Judo focusing on self-defence, physical fitness, discipline, and mental agility.",
    href: "/about/sports-and-arts",
    keywords: [
      "martial arts",
      "karate",
      "taekwondo",
      "judo",
      "self defence",
      "combat",
      "training",
    ],
  },
  {
    id: "sports-yoga-aerobics",
    title: "Yoga, Aerobics & Movement",
    category: "Sports & Arts",
    description:
      "Daily yoga for breathing, mindfulness, and concentration. Aerobics and rhythmic movement developing gross and fine motor skills.",
    href: "/about/sports-and-arts",
    keywords: [
      "yoga",
      "aerobics",
      "meditation",
      "concentration",
      "breathing",
      "mindfulness",
      "rhythm",
    ],
  },
  {
    id: "sports-water-pool",
    title: "Swimming & Shallow Water-Pool Games",
    category: "Sports & Arts",
    description:
      "Child-safe shallow swimming pool constructed for elementary students to overcome fear of water, enjoy water games, and learn early swimming skills.",
    href: "/about/sports-and-arts",
    keywords: [
      "water pool",
      "pool",
      "swimming",
      "water games",
      "swim",
      "shallow pool",
    ],
  },
  {
    id: "arts-performing",
    title: "Fine Arts, Performing Arts, Music & Dance",
    category: "Sports & Arts",
    description:
      "Dedicated art teachers, innovative thinking classes, drama, music instruments, and traditional cultural dance performances.",
    href: "/about/sports-and-arts",
    keywords: [
      "fine arts",
      "arts",
      "music",
      "dance",
      "drama",
      "creative",
      "performing arts",
      "cultural",
      "drawing",
      "painting",
    ],
  },

  // ── 4. Learning & Academics ──
  {
    id: "learning-stages",
    title: "Academic Stages & Curriculum (Early Years to Secondary)",
    category: "Learning & Academics",
    description:
      "Structured learning for Early Years, Primary, Middle, and Secondary stages aligned with CBSE educational standards.",
    href: "/learning",
    keywords: [
      "learning",
      "classes",
      "academic stages",
      "curriculum",
      "primary",
      "secondary",
      "cbse curriculum",
      "education",
    ],
  },
  {
    id: "learning-methodology",
    title: "Inquiry-Based Teaching Methodology",
    category: "Learning & Academics",
    description:
      "Fostering critical thinking, purposeful research, conceptual clarity, and interactive project-based student learning.",
    href: "/learning",
    keywords: [
      "teaching",
      "methodology",
      "pedagogy",
      "teachers",
      "inquiry",
      "projects",
      "experiments",
    ],
  },

  // ── 5. Campus & Facilities ──
  {
    id: "campus-infra",
    title: "Campus Facilities & Infrastructure",
    category: "Campus & Facilities",
    description:
      "Sprawling 2+ acre green campus on Airport Road Ghari with modern circular architecture, spacious classrooms, and secure perimeter.",
    href: "/campus",
    keywords: [
      "campus",
      "facilities",
      "infrastructure",
      "building",
      "classrooms",
      "location",
      "ghari",
      "grounds",
    ],
  },
  {
    id: "campus-labs",
    title: "Science Laboratories & Computer Lab",
    category: "Campus & Facilities",
    description:
      "Fully equipped science labs for Physics, Chemistry, Biology and high-speed internet enabled Computer Laboratory.",
    href: "/campus",
    keywords: [
      "science lab",
      "computer lab",
      "laboratories",
      "computers",
      "internet",
      "experiments",
    ],
  },

  // ── 6. Mandatory Public Disclosure (SARAS) ──
  {
    id: "disc-saras",
    title: "CBSE Mandatory Public Disclosure (SARAS Compliance)",
    category: "Mandatory Disclosure",
    description:
      "Official institutional disclosure, certificates, academic outcomes, and infrastructure data under CBSE Affiliation No. 1230049.",
    href: "/mandatory-public-disclosure",
    keywords: [
      "mandatory disclosure",
      "disclosure",
      "saras",
      "cbse affiliation",
      "compliance",
      "affiliation no",
      "school code",
      "1230049",
      "13579",
    ],
  },
  {
    id: "disc-building-safety",
    title: "Building Safety Certificate (NBC Compliant)",
    category: "Mandatory Disclosure",
    description:
      "Official building structural safety and fitness certificate issued by PWD Engineering Wing, Government of Manipur.",
    href: "/mandatory-public-disclosure",
    keywords: [
      "building safety",
      "safety certificate",
      "pwd",
      "structural safety",
      "nbc",
    ],
  },
  {
    id: "disc-fire-safety",
    title: "Fire Safety Certificate & NOC",
    category: "Mandatory Disclosure",
    description:
      "Fire prevention and safety compliance certificate issued by Manipur Fire Service Department, Imphal.",
    href: "/mandatory-public-disclosure",
    keywords: [
      "fire safety",
      "fire noc",
      "fire service",
      "fire prevention",
    ],
  },
  {
    id: "disc-academic-calendar",
    title: "Annual Academic Calendar 2026–27",
    category: "Mandatory Disclosure",
    description:
      "Annual schedule of classes, examination windows, holiday list, parent-teacher meetings, and sports activities.",
    href: "/mandatory-public-disclosure",
    keywords: [
      "academic calendar",
      "calendar",
      "holidays",
      "exam dates",
      "session",
      "schedule",
    ],
  },
  {
    id: "disc-smc-pta",
    title: "School Management Committee (SMC) & PTA Members",
    category: "Mandatory Disclosure",
    description:
      "Official composition, member list, designations, and governance guidelines of the SMC and Parent-Teacher Association (PTA).",
    href: "/mandatory-public-disclosure",
    keywords: [
      "smc",
      "pta",
      "management committee",
      "parents teachers association",
      "governing body",
      "members",
    ],
  },
  {
    id: "disc-staff",
    title: "Teaching Staff Details & Qualifications",
    category: "Mandatory Disclosure",
    description:
      "Principal Ch. Sunitibala Devi, 38 trained educators, PGT, TGT, PRT teachers, counselor, and 1.5 : 1 teacher-section ratio.",
    href: "/mandatory-public-disclosure",
    keywords: [
      "staff",
      "teachers",
      "principal",
      "faculty",
      "pgt",
      "tgt",
      "prt",
      "qualifications",
      "ratio",
    ],
  },

  // ── 7. News & Events ──
  {
    id: "news-workshop",
    title: "Annual Teaching Faculty Workshop",
    category: "News & Events",
    description:
      "Professional development and modern pedagogical training sessions for Kids' Foundation educators.",
    href: "/news",
    keywords: ["news", "workshop", "training", "faculty", "updates", "events"],
  },
  {
    id: "news-scholarship",
    title: "Merit Scholarship Awards 2026",
    category: "News & Events",
    description:
      "Celebrating academic distinction and recognizing outstanding student excellence with merit scholarships.",
    href: "/news",
    keywords: ["scholarship", "awards", "merit", "student achievements"],
  },

  // ── 8. Gallery ──
  {
    id: "gallery-campus-life",
    title: "Photo Gallery & Student Life",
    category: "News & Events",
    description:
      "Visual moments of science exhibitions, martial arts demonstrations, cultural dances, sports meets, and classroom activities.",
    href: "/gallery",
    keywords: ["gallery", "photos", "pictures", "images", "campus life"],
  },

  // ── 9. Publications ──
  {
    id: "publications-budding-sprouts",
    title: "School Publications, Magazines & Handbooks",
    category: "News & Events",
    description:
      "Explore and download The Budding Sprouts school magazine, curriculum handbooks, Green Chronicle newsletter, and annual sports souvenirs.",
    href: "/news/publications",
    keywords: [
      "publication",
      "publications",
      "magazine",
      "budding sprouts",
      "newsletter",
      "handbook",
      "curriculum",
      "download",
      "pdf",
      "annual report",
    ],
  },

  // ── 10. Clubs & Activities ──
  {
    id: "clubs-and-activities",
    title: "Clubs & Activities (Robotics, Eco, Debate, Taekwondo, Arts)",
    category: "Sports & Arts",
    description:
      "Explore student societies at Kids' Foundation: Robotics & STEM Lab, Eco Warriors Nature Club, Literary & Debate Society, Tae-Kwon-Do Academy, Fine Arts, and Chess.",
    href: "/clubs-and-activities",
    keywords: [
      "clubs",
      "club",
      "activities",
      "robotics",
      "stem",
      "eco warriors",
      "debate",
      "model un",
      "taekwondo",
      "martial arts",
      "arts",
      "music",
      "chess",
    ],
  },

  // ── 11. Contact Us ──
  {
    id: "contact-school",
    title: "Contact Kids' Foundation & Campus Visit",
    category: "Contact",
    description:
      "Airport Road, Ghari, Imphal West, Manipur – 795001. Phone: 0385-2456231, Mobile: +91 8974426944 / +91 8787302983, Email: kidsfoundationghari@gmail.com.",
    href: "/contact",
    keywords: [
      "contact",
      "phone",
      "mobile",
      "email",
      "address",
      "location",
      "visit",
      "map",
      "hours",
      "appointment",
    ],
  },
];

export function searchSite(
  query: string,
  categoryFilter?: string
): SearchResultItem[] {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.toLowerCase().trim();
  const terms = cleanQuery.split(/\s+/).filter(Boolean);

  return SEARCH_INDEX.filter((item) => {
    if (
      categoryFilter &&
      categoryFilter !== "All" &&
      item.category !== categoryFilter
    ) {
      return false;
    }

    const title = item.title.toLowerCase();
    const desc = item.description.toLowerCase();
    const category = item.category.toLowerCase();
    const keywords = item.keywords.join(" ").toLowerCase();

    // Return true if every term matches title, description, category or keywords
    return terms.every(
      (term) =>
        title.includes(term) ||
        desc.includes(term) ||
        category.includes(term) ||
        keywords.includes(term)
    );
  });
}
