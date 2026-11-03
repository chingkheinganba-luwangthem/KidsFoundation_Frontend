import { NavItem, HeaderAction } from "@/types";

export const NAVIGATION_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Learning", href: "/learning" },
  { label: "Campus", href: "/campus" },
  { label: "Student life", href: "/gallery" },
  { label: "Admissions", href: "/admission" },
];

export const MORE_LINKS: NavItem[] = [
  { label: "Clubs & Activities", href: "/clubs-and-activities" },
  { label: "Publications", href: "/news/publications" },
  { label: "Mandatory Public Disclosure", href: "/mandatory-public-disclosure" },
  { label: "Contact Us", href: "/contact" },
];

export const ALL_NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Learning", href: "/learning" },
  { label: "Campus", href: "/campus" },
  { label: "Student life", href: "/gallery" },
  { label: "Admissions", href: "/admission" },
  { label: "Clubs & Activities", href: "/clubs-and-activities" },
  { label: "Publications", href: "/news/publications" },
  { label: "Contact", href: "/contact" },
];

export const HEADER_ACTIONS: HeaderAction[] = [
  { label: "Get in Touch", href: "/contact", variant: "outline" },
  { label: "Enquire Now", href: "/admission", variant: "solid" },
];
