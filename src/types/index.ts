export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface HeaderAction {
  label: string;
  href: string;
  variant: "outline" | "solid";
}

export interface AcademicStage {
  id: string;
  tabNumber: string;
  tabLabel: string;
  subLabel: string;
  heading: string;
  description: string;
  tags: string[];
  linkText: string;
  linkHref: string;
  image: string;
  imageAlt: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "events" | "news";
  image: string;
  imageAlt: string;
  linkHref: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category?: string;
  image: string;
  imageAlt: string;
  position?: string;
}

export interface ContactInfo {
  address: string;
  mobile: string[];
  phone: string;
  email: string;
  cbseAffiliationNo: string;
  estdYear: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "youtube";
  href: string;
  label: string;
}
