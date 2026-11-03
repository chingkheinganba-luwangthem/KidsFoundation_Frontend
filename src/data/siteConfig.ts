
import { ContactInfo, FooterLink, SocialLink } from "@/types";

export const SITE_CONFIG = {
  name: "Kids' Foundation",
  location: "Imphal, Manipur",
  tagline: "Where curious minds find their foundation.",
  fullTitle: "Kids' Foundation | Inspiring Young Minds",
  metaDescription:
    "Discover Kids' Foundation, Imphal — a nurturing learning environment where curiosity, creativity and confidence grow.",

  hero: {
    badge: "KIDS' FOUNDATION • IMPHAL",
    headingLine1: "Where curious minds",
    headingLine2: "find their foundation.",
    description:
      "An engaging, values-led learning environment where children are encouraged to question, explore, create and grow with confidence.",
    primaryBtn: { label: "Discover Our School", href: "/about" },
    secondaryBtn: { label: "Admissions", href: "/admission" },
    scrollIndicator: "SCROLL TO DISCOVER",
  },

  about: {
    label: "WELCOME TO KIDS' FOUNDATION",
    heading: "Learning that goes beyond the classroom.",
    paragraph1:
      "At Kids' Foundation, we believe education is about developing the whole child. Our learning environment encourages students to question, explore, collaborate and discover their own strengths.",
    paragraph2:
      "From the early years through senior school, we create opportunities for children to grow intellectually, socially, physically and emotionally — building not only knowledge, but the confidence and curiosity to use it.",
    linkText: "Discover Our Story →",
    linkHref: "/about#our-story",
  },

  founder: {
    heading: "Message from the Founder,",
    paragraph1:
      "The world is changing faster than ever. At Kids' Foundation, we believe education should go beyond academics — nurturing curiosity, confidence, creativity and the cognitive, social, physical, emotional and aesthetic growth of every child.",
    paragraph2:
      "With a world-class curriculum and supportive environment, we prepare children not just for examinations, but for life — as happy, lifelong learners ready to grow, adapt and contribute to the world.",
    linkText: "Learn more →",
    linkHref: "/about#founder-message",
  },

  admissions: {
    label: "ADMISSIONS",
    heading: "Give your child the\nFoundation to go further.",
    description:
      "Discover a school where learning is joyful, curiosity is encouraged, and every child is given room to grow.",
    primaryBtn: { label: "Explore Admissions", href: "/admission" },
    secondaryBtn: { label: "Get in Touch", href: "/contact" },
  },

  contact: {
    address: "Airport Road, Ghari, Imphal-West, Manipur - 795001, India",
    mobile: ["+91 8974426944", "+91 8787302983"],
    phone: "0385-2456231",
    email: "kidsfoundationghari@gmail.com",
    cbseAffiliationNo: "1230049",
    estdYear: "2005",
  } satisfies ContactInfo,

  footer: {
    tagline:
      '"A strong foundation for curious, confident and capable learners." Estd. 2005.',
    cbseBadge: "CBSE Affiliation No: 1230049",
    copyright:
      "© 2026 Kids' Foundation School, Imphal. All rights reserved. Designed with care.",
    navigationLinks: [
      { label: "About Our School", href: "/about" },
      { label: "Learning & Classes", href: "/learning" },
      { label: "Campus Facilities", href: "/campus" },
      { label: "Clubs & Activities", href: "/clubs-and-activities" },
      { label: "Sports & Arts", href: "/about/sports-and-arts" },
      { label: "Admissions Info", href: "/admission" },
      { label: "Photo Gallery", href: "/gallery" },
      { label: "Contact Us", href: "/contact" },
    ] satisfies FooterLink[],
    disclosureLinks: [
      { label: "Mandatory Public Disclosure", href: "/mandatory-public-disclosure" },
      { label: "News and Updates", href: "/news" },
      { label: "Events", href: "/events" },
      { label: "Publications", href: "/news/publications" },
    ] satisfies FooterLink[],
    socialLinks: [
      {
        platform: "facebook",
        href: "https://facebook.com",
        label: "Facebook",
      },
      {
        platform: "instagram",
        href: "https://instagram.com",
        label: "Instagram",
      },
      {
        platform: "youtube",
        href: "https://youtube.com",
        label: "YouTube",
      },
    ] satisfies SocialLink[],
  },
};
