import { GalleryItem } from "@/types";
import { IMAGES } from "./images";

export const GALLERY_HEADER = {
  label: "GALLERY",
  heading: "Life at Kids' Foundation",
  description:
    "A glimpse into the moments, experiences and achievements that make school life memorable.",
  bottomLinkText: "View full gallery →",
  bottomLinkHref: "/gallery",
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-science-lab",
    title: "Hands-on Science & Laboratory Inquiry",
    category: "Academics",
    image: IMAGES.gallery.scienceLab,
    imageAlt: "Students performing chemistry and biology experiments in the science lab",
    position: "top-left",
  },
  {
    id: "gal-taekwondo",
    title: "Taekwondo & Martial Arts Discipline",
    category: "Sports",
    image: IMAGES.gallery.taekwondo,
    imageAlt: "Students practicing taekwondo martial arts in the green school campus",
    position: "bottom-left",
  },
  {
    id: "gal-dance",
    title: "Classical Manipuri Cultural Dance",
    category: "Culture",
    image: IMAGES.gallery.dance,
    imageAlt: "Student performing classical Manipuri cultural dance at annual literary meet",
    position: "center",
  },
  {
    id: "gal-exam-hall",
    title: "Academic Focus & Examination Hall",
    category: "Academics",
    image: IMAGES.gallery.examHall,
    imageAlt: "Students sitting attentively during examination in the school hall",
    position: "top-right",
  },
  {
    id: "gal-school-group",
    title: "Faculty, Staff & Student Community",
    category: "Campus Life",
    image: IMAGES.gallery.schoolGroup,
    imageAlt: "Kids' Foundation faculty members and students gathered in front of school building",
  },
  {
    id: "gal-campus-aerial",
    title: "Eco-Friendly Sprawling Campus",
    category: "Campus",
    image: IMAGES.aboutCampus,
    imageAlt: "Aerial view of Kids' Foundation circular modern school campus",
  },
];
