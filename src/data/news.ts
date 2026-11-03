import { NewsItem } from "@/types";
import { IMAGES } from "./images";

export const NEWS_HEADER = {
  label: "NEWS AND UPDATES",
  heading: "What's new at Kids' Foundation",
  description:
    "Stay up to date with important announcements, student achievements, school activities and events at Kids' Foundation.",
  tabs: [
    { id: "events", number: "01.", label: "Events" },
    { id: "news", number: "02.", label: "News & Updates" },
  ],
  bottomLinkText: "View all events →",
  bottomLinkHref: "/events",
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "event-1",
    date: "August 18, 2026",
    title: "Inspiring better teaching, together",
    description:
      "An inspiring workshop blended experience with modern teaching practices, offering fresh perspectives and practical strategies for creating stronger, more effective classrooms.",
    category: "events",
    image: IMAGES.news.workshop,
    imageAlt: "Teachers participating in professional workshop at Kids' Foundation",
    linkHref: "#",
  },
  {
    id: "event-2",
    date: "July 30, 2026",
    title: "Celebrating culture, creativity & expression",
    description:
      "Students came together for the Cultural and Literary Meet, celebrating creativity, language, culture and the confidence to express themselves.",
    category: "events",
    image: IMAGES.news.culturalMeet,
    imageAlt: "Students dressed in traditional Manipuri attire at Cultural Meet",
    linkHref: "#",
  },
  {
    id: "event-3",
    date: "July 15, 2026",
    title: "Celebrating Our Scholarship Awardees",
    description:
      "We are proud to celebrate our scholarship awardees and their commitment to learning. May this achievement inspire them to keep reaching higher.",
    category: "events",
    image: IMAGES.news.scholarship,
    imageAlt: "Scholarship awardee student receiving certificate at Kids' Foundation",
    linkHref: "#",
  },
  {
    id: "news-1",
    date: "August 18, 2026",
    title: "New Academic Year 2026–27 Orientation Seminar",
    description:
      "Registration is now officially open for Pre-Nursery through Grade XI. Explore our holistic values-led curriculum and modern campus facilities.",
    category: "news",
    image: IMAGES.aboutCampus,
    imageAlt: "Kids' Foundation school building and campus grounds",
    linkHref: "#",
  },
  {
    id: "news-2",
    date: "August 18, 2026",
    title: "Class XI Final Examination Timetable",
    description:
      "The final examination timetable for Class XI has been released. Students are advised to check the schedule and prepare accordingly.",
    category: "news",
    image: IMAGES.gallery.examHall,
    imageAlt: "Students focused during academic examinations",
    linkHref: "#",
  },
  {
    id: "news-3",
    date: "August 18, 2026",
    title: "Class X Examination Results",
    description:
      "Kids' Foundation students once again recorded 100% pass results with remarkable distinctions and subject toppers in the CBSE Board exams.",
    category: "news",
    image: IMAGES.gallery.examHall,
    imageAlt: "Students focused during academic examinations",
    linkHref: "#",
  },
  {
    id: "news-4",
    date: "August 18, 2026",
    title: "Scholarship Awardees — Session 2023–24",
    description:
      "We are proud to celebrate our scholarship awardees and their commitment to learning. May this achievement inspire them to keep reaching higher.",
    category: "news",
    image: IMAGES.news.scholarship,
    imageAlt: "Scholarship awardee student receiving certificate at Kids' Foundation",
    linkHref: "#",
  },
  {
    id: "news-5",
    date: "August 18, 2026",
    title: "School Prospectus for the Academic Year 2025–26",
    description:
      "The updated school prospectus for the upcoming academic year is now available for download. Parents and guardians are encouraged to review the curriculum highlights.",
    category: "news",
    image: IMAGES.aboutCampus,
    imageAlt: "Kids' Foundation school prospectus and campus overview",
    linkHref: "#",
  },
  {
    id: "news-6",
    date: "August 18, 2026",
    title: "Teacher Development Workshop: Strengthening Teaching & Learning",
    description:
      "A professional development workshop was conducted for all teaching staff to enhance pedagogical skills and integrate modern teaching methodologies.",
    category: "news",
    image: IMAGES.news.workshop,
    imageAlt: "Teachers attending professional development workshop",
    linkHref: "#",
  },
  {
    id: "news-7",
    date: "July 30, 2026",
    title: "Annual Sports Day — Schedule & Guidelines",
    description:
      "The annual sports day schedule has been published. Students are encouraged to participate in various track and field events.",
    category: "news",
    image: IMAGES.aboutCampus,
    imageAlt: "Students participating in sports activities",
    linkHref: "#",
  },
  {
    id: "news-8",
    date: "July 15, 2026",
    title: "Parent-Teacher Meeting for Mid-Term Review",
    description:
      "Parents are invited to attend the mid-term review meeting to discuss student progress, academic performance, and areas for improvement.",
    category: "news",
    image: IMAGES.aboutCampus,
    imageAlt: "Parent-teacher meeting at Kids' Foundation",
    linkHref: "#",
  },
];
