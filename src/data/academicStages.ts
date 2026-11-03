import { AcademicStage } from "@/types";
import { IMAGES } from "./images";

export const ACADEMIC_STAGES_HEADER = {
  label: "ACADEMIC STAGES",
  heading: "A journey that grows with them.",
  description:
    "From their first steps into school to senior secondary, each stage builds curiosity, confidence and independence.",
};

export const ACADEMIC_STAGES: AcademicStage[] = [
  {
    id: "early-years",
    tabNumber: "01.",
    tabLabel: "Foundational",
    subLabel: "PRE-NURSERY • NURSERY • LKG • UKG • AGES 3–5",
    heading: "Nurturing wonder & play",
    description:
      "In the early years, we lay the foundation for school life through play, exploration and meaningful experiences. Children develop curiosity, confidence and early social-emotional skills in a warm, welcoming environment.",
    tags: ["Curiosity & Play", "Music & Movement", "Storytelling"],
    linkText: "Explore Early Years →",
    linkHref: "/learning#pre-primary",
    image: IMAGES.academic.earlyYears,
    imageAlt: "Happy early years child in Kids' Foundation school uniform smiling in classroom",
  },
  {
    id: "primary",
    tabNumber: "02.",
    tabLabel: "Preparatory",
    subLabel: "CLASSES I – V • AGES 6–10",
    heading: "Building core skills & discovery",
    description:
      "Primary school deepens foundational literacy, numeracy, and scientific inquiry. Through experiential learning, interactive projects, and creative problem solving, students gain enthusiasm and lasting intellectual confidence.",
    tags: ["Experiential Learning", "Foundational Numeracy", "Creative Arts"],
    linkText: "Explore Primary School →",
    linkHref: "/learning#primary",
    image: IMAGES.academic.primary,
    imageAlt: "Primary students participating actively in group learning at Kids' Foundation",
  },
  {
    id: "middle",
    tabNumber: "03.",
    tabLabel: "Middle School",
    subLabel: "CLASSES VI – VIII • AGES 11–13",
    heading: "Expanding horizons & inquiry",
    description:
      "Middle school strengthens conceptual understanding and independent thinking. Students explore diverse subjects, collaborate on projects, and develop problem-solving skills in a supportive environment.",
    tags: ["Inquiry-Based Learning", "Collaboration", "Project Work"],
    linkText: "Explore Middle School →",
    linkHref: "/learning#middle",
    image: IMAGES.academic.secondary,
    imageAlt: "Middle school students learning at Kids' Foundation",
  },
  {
    id: "secondary",
    tabNumber: "04.",
    tabLabel: "Secondary",
    subLabel: "CLASSES VI – X • AGES 11–15",
    heading: "Fostering analytical thinking",
    description:
      "In the middle and secondary stages, students engage deeply with modern science, humanities, and technology. Rigorous academic frameworks combine with sports, arts, and leadership training to prepare students for real-world excellence.",
    tags: ["STEM Labs", "Critical Thinking", "Leadership & Sports"],
    linkText: "Explore Secondary School →",
    linkHref: "/learning#secondary",
    image: IMAGES.academic.secondary,
    imageAlt: "Secondary school students conducting experiments in Kids' Foundation science lab",
  },
  
];
