/**
 * Centralized Image Configuration for Kids' Foundation Website
 * All images are located in the /public directory and mapped cleanly here.
 * This makes it effortless to integrate with Strapi CMS media library in the future.
 */

export const IMAGES = {
  // Brand & Decorative
  logo: "/images/logo.png",
  founder: "/images/founder.png",
  grassHill: "/images/grass-hill.png",
  footerLandscape: "/images/grass-hill.png",
  footerBg: "/images/grass-hill.png",
  subtleWaveBg: "/images/subtle-wave-bg.png",
  heroBg: "/images/hero-bg.jpg",


  // About Section
  aboutCampus: "/images/campus-aerial.jpg",

  // Academic Stages
  academic: {
    earlyYears: "/images/academic-early-years.jpg",
    primary: "/images/academic-primary.jpg",
    secondary: "/images/academic-secondary.jpg",
    seniorSecondary: "/images/academic-senior-secondary.jpg",
  },

  // News and Updates
  news: {
    workshop: "/images/news-teaching-workshop.jpg",
    culturalMeet: "/images/news-cultural-meet.jpg",
    scholarship: "/images/news-scholarship.jpg",
  },

  // Gallery
  gallery: {
    scienceLab: "/images/gallery-science-lab.jpg",
    taekwondo: "/images/gallery-taekwondo.jpg",
    dance: "/images/gallery-dance.jpg",
    examHall: "/images/gallery-exam-hall.jpg",
    schoolGroup: "/images/gallery-school-group.jpg",
  },
} as const;

export default IMAGES;
