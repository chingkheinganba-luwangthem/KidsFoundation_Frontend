import {
  GlobalSettingData,
  HeaderData,
  FooterData,
  HomePageData,
  HeroSlide,
  ExcellenceBannerData,
  AcademicStageData,
  NewsArticleData,
  GalleryItemData,
  StrapiMedia,
  AboutPageData,
  LearningPageData,
  CampusPageData,
  GalleryCardItem,
  ActivityItemData,
  SportsArtsPageData,
  GalleryPageData,
  GalleryPageImageItem,
  AdmissionPageData,
  AdmissionFeeTable,
  AdmissionFeeRow,
  EventsPageData,
  EventItem,
  EventCardItemData,
  NewsPageData,
  NewsItemData,
  PublicationsPageData,
  Publication,
  ClubsPageData,
  Club,
  ContactPageData,
} from "@/types/strapi";

const RAW_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://admin.kidsfoundationimphal.com/api";

// Base domain without trailing /api or slash (e.g. "https://admin.kidsfoundationimphal.com")
const STRAPI_BASE_URL = RAW_STRAPI_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");

/**
 * Returns full URL for a Strapi API path
 */
export function getStrapiURL(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${STRAPI_BASE_URL}${cleanPath}`;
}

/**
 * Formats a Strapi media URL (prepends STRAPI_BASE_URL if it is a relative path)
 */
export function getStrapiMediaUrl(media?: any): string {
  if (!media) return "";
  if (typeof media === "string") {
    if (media.startsWith("http://") || media.startsWith("https://") || media.startsWith("//")) {
      return media;
    }
    return `${STRAPI_BASE_URL}${media.startsWith("/") ? media : `/${media}`}`;
  }

  // Handle arrays if multiple files returned
  const target = Array.isArray(media) ? media[0] : media;
  if (!target) return "";

  const url =
    target.url ||
    target.data?.attributes?.url ||
    target.data?.url ||
    target.attributes?.url ||
    "";

  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
    return url;
  }
  return `${STRAPI_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

/**
 * Generic fetcher for Strapi REST endpoints with ISR
 */
async function fetchStrapi<T>(endpoint: string, tags: string[] = []): Promise<T | null> {
  const url = getStrapiURL(`/api/${endpoint}`);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.STRAPI_API_TOKEN
          ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
          : {}),
      },
      next: {
        revalidate: 60,
        tags: tags.length > 0 ? tags : undefined,
      },
    });

    if (!res.ok) {
      console.warn(`[fetchStrapi] Non-OK response (${res.status} ${res.statusText}) for: ${url}`);
      return null;
    }

    const json = await res.json();
    if (!json?.data) return null;

    // Handle collection types (arrays)
    if (Array.isArray(json.data)) {
      return json.data.map((item: any) =>
        item.attributes ? { id: item.id, ...item.attributes } : item
      ) as T;
    }

    // Handle single types (objects)
    if (json.data.attributes) {
      return { id: json.data.id, ...json.data.attributes } as T;
    }

    return json.data as T;
  } catch (err) {
    // Strapi server unreachable in local dev or network failure: fail silently to local fallback
    console.warn(`[fetchStrapi] Network error for: ${url}`, err);
    return null;
  }
}

/**
 * Fetch Global Settings (Header, Footer, Branding, Contact Info)
 */
export async function getGlobalSettings(): Promise<GlobalSettingData | null> {
  return fetchStrapi<GlobalSettingData>("global-setting?populate=*", ["global-settings"]);
}

/**
 * Fetch Header Singleton Data (School Name, Logo, Nav Links, More Links, Action Buttons, Top Notice)
 */
export async function getHeaderData(): Promise<HeaderData | null> {
  return fetchStrapi<HeaderData>("header?populate=*", ["header"]);
}

/**
 * Fetch Footer Singleton Data (Tagline, CBSE, Logo, FooterBg, Quick Links, Important Links, Contacts, Socials)
 */
export async function getFooterData(): Promise<FooterData | null> {
  return fetchStrapi<FooterData>("footer?populate=*", ["footer"]);
}

/**
 * Fetch Home Page Singleton Data (Hero, Slider, Buttons, Excellence Banner)
 */
export async function getHomePageData(): Promise<HomePageData | null> {
  const query = [
    "populate[Slider][fields][0]=url",
    "populate[Slider][fields][1]=alternativeText",
    "populate[button]=true",
  ].join("&");

  const raw = await fetchStrapi<any>(`home-page?${query}`, ["home-page"]);
  if (!raw) return null;

  // 1. Map Buttons
  const buttons: any[] = Array.isArray(raw.button) ? raw.button : [];
  const primaryBtn = buttons[0];
  const secondaryBtn = buttons[1];

  const primaryCta = primaryBtn
    ? {
        label: primaryBtn.text || "Discover Our School",
        href: primaryBtn.url || "/campus",
      }
    : {
        label: "Discover Our School",
        href: "/campus",
      };

  const secondaryCta = secondaryBtn
    ? {
        label: secondaryBtn.text || "Admission",
        href: secondaryBtn.url || "/admission",
      }
    : {
        label: "Admission",
        href: "/admission",
      };

  // 2. Map Slider
  const slides: HeroSlide[] = Array.isArray(raw.Slider)
    ? raw.Slider.map((s: any, idx: number) => ({
        id: s.id || idx + 1,
        media: {
          id: s.id,
          url: s.url,
          alternativeText: s.alternativeText,
        },
        alt: s.alternativeText || `Kids' Foundation Slide ${idx + 1}`,
      }))
    : [];

  // 3. Map Hero Section Data
  const hero = {
    badge: raw.eyebrow || "KIDS' FOUNDATION • IMPHAL",
    headingLine1: raw.heading || "Where curious minds find their foundation.",
    headingLine2: "",
    description:
      raw.description ||
      "An engaging, values-led learning environment where children are encouraged to question, explore, create and grow with confidence.",
    primaryCta,
    secondaryCta,
    scrollIndicator: "Scroll to Discover",
    slides,
  };

  // 4. Map Excellence Banner
  let yearsEmblem = "20+";
  let yearsLabel = "Years";
  if (raw.box) {
    const boxParts = raw.box.trim().split(/\s+/);
    if (boxParts.length > 0) {
      yearsEmblem = boxParts[0];
      yearsLabel = boxParts.slice(1).join(" ") || "Years";
    }
  }

  const excellenceBanner: ExcellenceBannerData = {
    yearsEmblem,
    yearsLabel,
    subtitle: "Excellence in Education",
    heading: raw.heading2 || "20+ Years of Academic Excellence",
    description:
      raw.description2 ||
      "Nurturing curious, confident, and capable learners in Manipur since 2005.",
  };

  return {
    ...raw,
    hero,
    excellenceBanner,
  };
}

/**
 * Fetch Academic Stages from Learning Page Singleton
 */
export async function getAcademicStages(): Promise<AcademicStageData[] | null> {
  const learningPage = await getLearningPageData();
  if (!learningPage?.stages) return null;
  return learningPage.stages.map((s, idx) => ({
    id: idx + 1,
    stageId: s.stageId,
    tabNumber: `0${idx + 1}.`,
    tabLabel: s.title.split("(")[0].trim(),
    subLabel: s.title,
    heading: s.title,
    description: Array.isArray(s.description) ? s.description.join(" ") : (s.description || s.boldIntro || ""),
    tags: s.activities || [],
    image: s.image,
    sortOrder: idx + 1,
    cta: {
      label: "Explore Stage →",
      href: `/learning#${s.stageId}`,
    },
  }));
}

/**
 * Fetch News Articles from News Page Singleton
 */
export async function getNewsArticles(): Promise<NewsArticleData[] | null> {
  const newsPage = await getNewsPageData();
  if (!newsPage?.articles) return null;
  return newsPage.articles.map((a, idx) => ({
    id: a.id || idx + 1,
    title: a.title,
    slug: a.newsId || `news-${a.id || idx}`,
    publishedDate: a.date,
    category: a.category === "events" ? "events" : "news",
    excerpt: a.subtitle || (a.fullContent ? a.fullContent[0] : ""),
    coverImage: a.noticeImage,
  }));
}

/**
 * Fetch Curated Gallery Items from Gallery Page Singleton
 */
export async function getGalleryItems(): Promise<GalleryItemData[] | null> {
  const galleryPage = await getGalleryPageData();
  if (!galleryPage?.images) return null;
  const sorted = [...galleryPage.images].sort(
    (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)
  );
  return sorted.slice(0, 6).map((img, idx) => ({
    id: typeof img.id === "number" ? img.id : idx + 1,
    title: img.title,
    category: (img.category || "Campus") as any,
    image: img.image,
    sortOrder: idx + 1,
    isFeaturedOnHome: true,
  }));
}

/**
 * Fetch About Page Singleton Data (Hero, Second Section, Mission/Vision, Founder's Section)
 * Uses the exact Strapi about-page endpoint & populates
 */
export async function getAboutPageData(): Promise<AboutPageData | null> {
  const query = [
    "populate[hero][populate][hero_background][fields][0]=url",
    "populate[hero][populate][hero_background][fields][1]=alternativeText",
    "populate[second_sectioin][populate][image][fields][0]=url",
    "populate[second_sectioin][populate][image][fields][1]=alternativeText",
    "populate[mission_vison]=true",
    "populate[founder_section][populate][founder_details][populate][image][fields][0]=url",
    "populate[founder_section][populate][founder_details][populate][image][fields][1]=alternativeText",
  ].join("&");

  const raw = await fetchStrapi<any>(`about-page?${query}`, ["about-page"]);
  if (!raw) return null;

  // Process description paragraphs from second_sectioin (or second_section)
  const secondSection = raw.second_sectioin || raw.second_section;
  const secondSectionDesc = secondSection?.description || "";
  const storyParas = secondSectionDesc
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  const storyTopParagraphs = storyParas.slice(0, 2);
  const storyBottomParagraphs = storyParas.slice(2);

  // Process founder_section and founder_details
  const founderSec = raw.founder_section;
  const founderDetails = founderSec?.founder_details;
  const founderDesc = founderDetails?.description || "";
  const founderParas = founderDesc
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  let founderWelcome = "";
  let founderQuote = "";
  let founderClosing = "";
  const bodyParas: string[] = [];

  for (let i = 0; i < founderParas.length; i++) {
    const p = founderParas[i];
    if (i === 0 && (p.toLowerCase().startsWith("welcome") || founderParas.length > 2)) {
      founderWelcome = p;
    } else if (
      p.startsWith('"') ||
      p.startsWith('“') ||
      (p.endsWith('"') && p.includes('"')) ||
      (p.endsWith('”') && p.includes('“'))
    ) {
      founderQuote = p;
    } else if (i === founderParas.length - 1 && founderParas.length > 3) {
      founderClosing = p;
    } else {
      bodyParas.push(p);
    }
  }

  // Format pillars from mission_vison
  const missionVisionList = raw.mission_vison || [];
  const pillars = missionVisionList.map((item: any, idx: number) => ({
    id: item.id ? String(item.id) : `pillar-${idx}`,
    title: item.heading || "",
    description: item.description || "",
  }));

  return {
    ...raw,
    hero: raw.hero,
    second_sectioin: secondSection,
    mission_vison: missionVisionList,
    founder_section: founderSec,

    // Mapped convenience fields for about page and homepage
    pageTitle: raw.hero?.title || "About Us",
    breadcrumb: raw.hero?.Breadcrumbs || ["About"],
    storyLabel: secondSection?.eyebrow || "",
    storyHeading: secondSection?.heading || "",
    storyTopParagraphs,
    storyImage: secondSection?.image,
    storyImageAlt: secondSection?.image?.alternativeText || secondSection?.heading || "",
    storyBottomParagraphs,
    pillars,
    founderTag: founderDetails?.eyebrow || "",
    founderHeading: founderDetails?.heading || "",
    founderWelcome,
    founderParagraphs: bodyParas,
    founderQuote,
    founderClosing,
    founderName: founderSec?.name || "",
    founderRole: founderSec?.designation || "",
    founderInstitution: founderSec?.description || "",
    founderImage: founderDetails?.image,
  };
}

/**
 * Helper to parse a stage's description text into structured boldIntro, paragraphs, activities, and bottomText
 */
function parseStageContent(rawDesc: string) {
  const paras = rawDesc.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  let boldIntro: string | undefined = undefined;
  const description: string[] = [];
  const activities: string[] = [];
  let bottomText: string | undefined = undefined;

  let startIndex = 0;
  if (paras.length > 1 && paras[0].length < 120 && !paras[0].endsWith(":")) {
    if (paras[0].length <= 80 || paras[0].endsWith(".")) {
      boldIntro = paras[0];
      startIndex = 1;
    }
  }

  for (let i = startIndex; i < paras.length; i++) {
    const p = paras[i];
    const sublines = p.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const hasActivities = sublines.some(
      (l) => l.length > 2 && l.length < 50 && l === l.toUpperCase() && !l.includes(".")
    );

    if (hasActivities) {
      for (const line of sublines) {
        if (line.length > 2 && line.length < 50 && line === line.toUpperCase() && !line.includes(".")) {
          activities.push(line);
        } else if (
          line.toLowerCase().includes("these activities are included") ||
          line.toLowerCase().includes("in sync with nature")
        ) {
          bottomText = line;
        } else if (activities.length === 0) {
          description.push(line);
        } else {
          bottomText = (bottomText ? `${bottomText} ` : "") + line;
        }
      }
    } else if (activities.length > 0) {
      bottomText = (bottomText ? `${bottomText}\n\n` : "") + p;
    } else {
      description.push(p);
    }
  }

  return { boldIntro, description, activities, bottomText };
}

/**
 * Fetch Learning Page Singleton Data (Hero, Intro Approach, Academic Stages)
 */
export async function getLearningPageData(): Promise<LearningPageData | null> {
  const query = [
    "populate[learning_hero][populate][hero_background][fields][0]=url",
    "populate[learning_hero][populate][hero_background][fields][1]=alternativeText",
    "populate[common_content][populate][image][fields][0]=url",
    "populate[common_content][populate][image][fields][1]=alternativeText",
  ].join("&");

  const raw = await fetchStrapi<any>(`learning-page?${query}`, ["learning-page"]);
  if (!raw) return null;

  const hero = raw.learning_hero;
  const commonContent: any[] = raw.common_content || [];

  // Identify intro block (typically the first item, or one with eyebrow)
  const introBlock = commonContent.find((item) => item.eyebrow) || commonContent[0];
  const stageBlocks = commonContent.filter((item) => item !== introBlock);

  const stages = stageBlocks.map((st, idx) => {
    const parsed = parseStageContent(st.description || "");
    const heading = st.heading || `Stage ${idx + 1}`;
    const stageId = heading
      .toLowerCase()
      .replace(/learning/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return {
      id: st.id || idx + 1,
      stageId: stageId || `stage-${idx + 1}`,
      title: heading,
      boldIntro: parsed.boldIntro,
      description: parsed.description,
      activities: parsed.activities.length > 0 ? parsed.activities : undefined,
      bottomText: parsed.bottomText,
      image: st.image,
      imageAlt: st.image?.alternativeText || heading,
    };
  });

  return {
    ...raw,
    learning_hero: hero,
    common_content: commonContent,

    // Mapped convenience fields
    pageTitle: hero?.title || "Learning",
    breadcrumb: hero?.Breadcrumbs || ["Learning"],
    introLabel: introBlock?.eyebrow || "OUR APPROACH",
    introHeading: introBlock?.heading || "Building the right foundation through learning",
    introText: introBlock?.description || "",
    stages,
  };
}

/**
 * Fetch Campus Page Singleton Data (Hero, Campus Intro & Points, Gallery, Virtual Tour)
 */
export async function getCampusPageData(): Promise<CampusPageData | null> {
  const query = [
    "populate[Campus_hero][populate][hero_background][fields][0]=url",
    "populate[Campus_hero][populate][hero_background][fields][1]=alternativeText",
    "populate[CAMPUS][populate][points]=true",
    "populate[Campus_Gallery][populate][images][populate][image][fields][0]=url",
    "populate[Campus_Gallery][populate][images][populate][image][fields][1]=alternativeText",
    "populate[Campus_Virtual_Tour]=true",
  ].join("&");

  const raw = await fetchStrapi<any>(`campus-page?${query}`, ["campus-page"]);
  if (!raw) return null;

  const hero = raw.Campus_hero;
  const campusSection = raw.CAMPUS;
  const gallerySection = raw.Campus_Gallery;
  const tourSection = raw.Campus_Virtual_Tour;

  // Extract facilities from CAMPUS.points
  const facilities = (campusSection?.points || [])
    .map((p: any) => p.text?.trim())
    .filter(Boolean);

  // Extract gallery images
  const galleryImages: GalleryCardItem[] = (gallerySection?.images || []).map(
    (item: any, idx: number) => ({
      id: item.id || idx + 1,
      image: item.image,
      imageUrl: getStrapiMediaUrl(item.image),
      alt: item.image?.alternativeText || `Kids' Foundation Campus Image ${idx + 1}`,
    })
  );

  // Extract youtube ID from tour url
  const tourUrl = tourSection?.url || "";
  const youtubeMatch = tourUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  const youtubeId = youtubeMatch ? youtubeMatch[1] : tourUrl.replace(/[^a-zA-Z0-9_-]/g, "");

  return {
    ...raw,
    Campus_hero: hero,
    CAMPUS: campusSection,
    Campus_Gallery: gallerySection,
    Campus_Virtual_Tour: tourSection,

    // Mapped convenience fields
    pageTitle: hero?.title || "Campus",
    breadcrumb: hero?.Breadcrumbs || ["Campus"],
    introHeading: campusSection?.eyebrow || "CAMPUS",
    introTitle: campusSection?.heading || "Our campus at a glance",
    introDescription: campusSection?.designation || campusSection?.description || "",
    facilities,
    galleryImages,
    videoTitle: tourSection?.heading || "School Campus",
    youtubeId,
    videoDescription: tourSection?.caption || "",
  };
}

/**
 * Helper to parse sports & arts description into introLead, activities, and facilitiesCallout
 */
function parseSportsArtsContent(rawDesc: string) {
  const paras = rawDesc.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  let introLead = "";
  const activities: ActivityItemData[] = [];
  const facilitiesCallout: string[] = [];

  for (let i = 0; i < paras.length; i++) {
    const p = paras[i];
    const colonIndex = p.indexOf(":");
    if (colonIndex > 0 && colonIndex < 30) {
      const name = p.slice(0, colonIndex).trim();
      const desc = p.slice(colonIndex + 1).trim();
      activities.push({ id: i + 1, name, description: desc });
    } else if (activities.length === 0) {
      introLead = (introLead ? `${introLead}\n\n` : "") + p;
    } else {
      facilitiesCallout.push(p);
    }
  }

  return { introLead, activities, facilitiesCallout };
}

/**
 * Fetch Sports & Arts Page Singleton Data (Hero, Intro Lead, Activities, Facilities Callout, Gallery Cards)
 */
export async function getSportsArtsPageData(): Promise<SportsArtsPageData | null> {
  const query = [
    "populate[Sports_hero][populate][hero_background][fields][0]=url",
    "populate[Sports_hero][populate][hero_background][fields][1]=alternativeText",
    "populate[SPORTS_ARTS][populate][image][fields][0]=url",
    "populate[SPORTS_ARTS][populate][image][fields][1]=alternativeText",
    "populate[image][populate][image][fields][0]=url",
    "populate[image][populate][image][fields][1]=alternativeText",
  ].join("&");

  const raw = await fetchStrapi<any>(`sports-and-arts-page?${query}`, ["sports-and-arts-page"]);
  if (!raw) return null;

  const hero = raw.Sports_hero;
  const sportsSection = raw.SPORTS_ARTS;
  const imageCards: any[] = raw.image || [];

  const parsed = parseSportsArtsContent(sportsSection?.description || "");

  const gallery: GalleryCardItem[] = imageCards.map((item, idx) => ({
    id: item.id || idx + 1,
    title: item.heading || "Activity",
    category: item.subheading || "Sports",
    image: item.image,
    imageUrl: getStrapiMediaUrl(item.image),
    alt: item.image?.alternativeText || item.heading || "Sports & Arts Activity",
  }));

  return {
    ...raw,
    Sports_hero: hero,
    SPORTS_ARTS: sportsSection,
    image: imageCards,

    // Mapped convenience fields
    pageTitle: hero?.title || "Sports & Arts",
    breadcrumb: hero?.Breadcrumbs || ["About", "Sports & Arts"],
    introLabel: sportsSection?.eyebrow || "SPORTS & ARTS",
    introTitle: sportsSection?.heading || "Sports & Arts",
    introLead: parsed.introLead,
    activities: parsed.activities,
    facilitiesCallout: parsed.facilitiesCallout,
    gallery,
  };
}

/**
 * Fetch Gallery Page Singleton Data (Hero, Moments & Memories, Image Cards)
 */
export async function getGalleryPageData(): Promise<GalleryPageData | null> {
  const query = [
    "populate[gallery_hero][populate][hero_background][fields][0]=url",
    "populate[gallery_hero][populate][hero_background][fields][1]=alternativeText",
    "populate[MOMENTS_MEMORIES][populate][image][fields][0]=url",
    "populate[MOMENTS_MEMORIES][populate][image][fields][1]=alternativeText",
    "populate[image][populate][image][fields][0]=url",
    "populate[image][populate][image][fields][1]=alternativeText",
  ].join("&");

  const raw = await fetchStrapi<any>(`gallery-page?${query}`, ["gallery-page"]);
  if (!raw) return null;

  const hero = raw.gallery_hero;
  const moments = raw.MOMENTS_MEMORIES;
  const imageList: any[] = raw.image || [];

  const images: GalleryPageImageItem[] = imageList.map((item, idx) => {
    const category = item.Category || item.category || "Campus";
    const title = item.heading || "Gallery photo";
    return {
      id: item.id || `gal-${idx + 1}`,
      title,
      category,
      image: item.image,
      imageUrl: getStrapiMediaUrl(item.image),
      alt: item.image?.alternativeText || title,
    };
  });

  // Dynamically derive unique categories from the images
  const uniqueCategories = Array.from(
    new Set(images.map((img) => img.category).filter(Boolean))
  );
  const categories = ["All", ...uniqueCategories];

  return {
    ...raw,
    gallery_hero: hero,
    MOMENTS_MEMORIES: moments,
    image: imageList,

    // Mapped convenience fields
    bannerTitle: hero?.title || "Photo Gallery",
    bannerImage: getStrapiMediaUrl(hero?.hero_background) || "",
    breadcrumb: hero?.Breadcrumbs || ["Gallery"],
    sectionLabel: moments?.eyebrow || "MOMENTS & MEMORIES",
    sectionHeading: moments?.heading || "Life at Kids' Foundation",
    sectionDescription: moments?.description || "",
    categories,
    images,
  };
}

/**
 * Fetch Admission Page Singleton Data (Hero, Enquiry, Guidelines, Fee Structure Tables)
 */
export async function getAdmissionPageData(): Promise<AdmissionPageData | null> {
  const query = [
    "populate[Admissioin_hero][populate][hero_background][fields][0]=url",
    "populate[Admissioin_hero][populate][hero_background][fields][1]=alternativeText",
    "populate[Admission][populate][admissionbutton][populate][download][fields][0]=url",
    "populate[Admission][populate][admissionbutton][populate][download][fields][1]=name",
    "populate[Admission][populate][admissionbutton][populate][download][fields][2]=mime",
    "populate[Guidelines]=true",
    "populate[Fee_Details][populate][Fee_Table][populate][Row]=true",
  ].join("&");

  const raw = await fetchStrapi<any>(`admission-page?${query}`, ["admission-page"]);
  if (!raw) return null;

  const hero = raw.Admissioin_hero;
  const admission = raw.Admission;
  const guidelines = raw.Guidelines;
  const feeDetails = raw.Fee_Details;

  const downloadFile = admission?.admissionbutton?.download;
  const downloadUrl = downloadFile ? getStrapiMediaUrl(downloadFile) : "";
  const downloadLabel = admission?.admissionbutton?.text || "Download Admission Form";

  const feeTables: AdmissionFeeTable[] = (feeDetails?.Fee_Table || []).map((table: any, idx: number) => {
    const title = table.TUITION_FEES || (idx === 0 ? "TUITION FEES" : "Admission Fees");
    const headerBg = idx === 0 ? "bg-[#D97706]" : "bg-[#17345F]";
    const rows: AdmissionFeeRow[] = (table.Row || []).map((r: any) => ({
      id: r.id,
      level: r.heading || "",
      description: r.description || "",
      amount: r.Rupees || "",
    }));
    return {
      id: table.id || idx + 1,
      title,
      headerBg,
      rows,
    };
  });

  const tuitionTable = feeTables[0];
  const admissionTable = feeTables[1];

  return {
    ...raw,
    Admissioin_hero: hero,
    Admission: admission,
    Guidelines: guidelines,
    Fee_Details: feeDetails,

    // Mapped convenience fields
    bannerTitle: hero?.title || "Admission",
    bannerImage: getStrapiMediaUrl(hero?.hero_background) || "",
    breadcrumb: hero?.Breadcrumbs || ["Home", "Admission"],

    enquiry: {
      label: admission?.eyebrow || "ADMISSIONS",
      heading: admission?.heading || "Admission Enquiry",
      description: admission?.description || "",
      email: admission?.email || "kidsfoundationghari@gmail.com",
      phone: admission?.Phone_number || admission?.phone || "0385-2456231",
      downloadLabel,
      downloadHref: downloadUrl || "#",
    },

    procedures: {
      label: guidelines?.eyebrow || "GUIDELINES",
      heading: guidelines?.heading || "Admission Procedures",
      registrationTitle: guidelines?.label_1 || "Registration for Admission:",
      registrationDescription: guidelines?.description || "",
      testsTitle: guidelines?.label2 || "Admission Tests and Interviews:",
      testsDescription: guidelines?.description2 || "",
    },

    feeStructure: {
      label: feeDetails?.eyebrow || "FEE DETAILS",
      heading: feeDetails?.heading || "Admission Fee Structure",
      tables: feeTables,
      tuitionFeesTitle: tuitionTable?.title || "TUITION FEES",
      tuitionFees: tuitionTable?.rows,
      admissionFeesTitle: admissionTable?.title || "Admission Fees",
      admissionFees: admissionTable?.rows,
    },
  };
}

/**
 * Helper to format Strapi time (e.g. "09:15:00.000") to 12-hour AM/PM format
 */
function formatEventTime(timeStr?: string): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  return timeStr;
}

/**
 * Helper to parse and format event dates
 */
function parseEventDate(dateStr?: string) {
  if (!dateStr) {
    return { month: "Jan", day: "01", year: "2026", formatted: "" };
  }
  const ymdMatch = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const monthIdx = parseInt(ymdMatch[2], 10) - 1;
    const dayNum = parseInt(ymdMatch[3], 10);
    const d = new Date(year, monthIdx, dayNum);
    return {
      month: d.toLocaleString("en-US", { month: "short" }),
      day: String(dayNum).padStart(2, "0"),
      year: String(year),
      formatted: d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    const parts = dateStr.split(" ");
    return {
      month: parts[0]?.slice(0, 3) ?? "Jan",
      day: parts[1]?.replace(",", "") ?? "01",
      year: parts[2] ?? "2026",
      formatted: dateStr,
    };
  }
  return {
    month: d.toLocaleString("en-US", { month: "short" }),
    day: String(d.getDate()).padStart(2, "0"),
    year: String(d.getFullYear()),
    formatted: d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

/**
 * Fetch Events Page Singleton Data (Hero, Event Cards, Media)
 */
export async function getEventsPageData(): Promise<EventsPageData | null> {
  const query = [
    "populate[event_hero][populate][hero_background][fields][0]=url",
    "populate[event_hero][populate][hero_background][fields][1]=alternativeText",
    "populate[event_card][populate][image][fields][0]=url",
    "populate[event_card][populate][image][fields][1]=alternativeText",
  ].join("&");

  const raw = await fetchStrapi<any>(`events-page?${query}`, ["events-page"]);
  if (!raw) return null;

  const hero = raw.event_hero;
  const cardsRaw = raw.event_card;
  const cards: EventCardItemData[] = Array.isArray(cardsRaw)
    ? cardsRaw
    : cardsRaw
    ? [cardsRaw]
    : [];

  const events: EventItem[] = cards.map((card, idx) => {
    const rawDate = card.date || "";
    const { month, day, year, formatted } = parseEventDate(rawDate);
    const typeStr = (card.Type || "").trim().toLowerCase();
    const tag: "upcoming" | "past" = typeStr === "past" ? "past" : "upcoming";

    const startTime = formatEventTime(card.start_time);
    const endTime = formatEventTime(card.end_time);
    const time =
      startTime && endTime
        ? `${startTime} - ${endTime}`
        : startTime || endTime || undefined;

    const rawDesc = (card.description || "").trim();
    const paragraphs = rawDesc
      ? rawDesc
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

    const imageUrl = getStrapiMediaUrl(card.image) || "";
    const imageAlt =
      card.image?.alternativeText || card.heading || "Event image";

    return {
      id: `event-${card.id || idx + 1}`,
      rawId: card.id || idx + 1,
      rawDate,
      date: formatted || rawDate,
      month,
      day,
      year,
      title: card.heading || "School Event",
      description: rawDesc,
      category: card.Category?.trim() || "School Events",
      image: imageUrl,
      imageAlt,
      time,
      venue: card.venue || undefined,
      tag,
      paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
    };
  });

  events.sort((a, b) => {
    // 1. Upcoming events on top
    const aIsUpcoming = a.tag === "upcoming" ? 1 : 0;
    const bIsUpcoming = b.tag === "upcoming" ? 1 : 0;
    if (bIsUpcoming !== aIsUpcoming) {
      return bIsUpcoming - aIsUpcoming;
    }
    // 2. Latest upload on top
    const idDiff = (b.rawId ?? 0) - (a.rawId ?? 0);
    if (idDiff !== 0) return idDiff;
    // 3. Date descending
    const aTime = a.rawDate ? new Date(a.rawDate).getTime() : 0;
    const bTime = b.rawDate ? new Date(b.rawDate).getTime() : 0;
    return bTime - aTime;
  });

  const uniqueCategories = Array.from(
    new Set(events.map((e) => e.category).filter(Boolean))
  );
  const filterOptions = ["All", "Upcoming", "Past", ...uniqueCategories];

  return {
    ...raw,
    event_hero: hero,
    event_card: cards,

    // Mapped convenience fields
    bannerTitle: hero?.title || "Events",
    bannerImage: getStrapiMediaUrl(hero?.hero_background) || "",
    breadcrumb: hero?.Breadcrumbs || ["Home", "Events"],
    sectionLabel: raw.eyebrow || "ALL EVENTS",
    sectionHeading: raw.heading || "What's happening at Kids' Foundation",
    filterOptions,
    events,
  };
}

/**
 * Fetch News and Updates Page Singleton Data (Hero, News Update Cards, Attachments)
 */
export async function getNewsPageData(): Promise<NewsPageData | null> {
  const query = [
    "populate[news_hero][populate][hero_background][fields][0]=url",
    "populate[news_hero][populate][hero_background][fields][1]=alternativeText",
    "populate[news_update_card][populate][file][fields][0]=url",
    "populate[news_update_card][populate][file][fields][1]=name",
    "populate[news_update_card][populate][file][fields][2]=mime",
    "populate[news_update_card][populate][file][fields][3]=alternativeText",
  ].join("&");

  const raw = await fetchStrapi<any>(`news-page?${query}`, ["news-page"]);
  if (!raw) return null;

  const hero = raw.news_hero;
  const cards: any[] = raw.news_update_card || [];

  const articles: NewsItemData[] = cards.map((card, idx) => {
    const rawDesc = (card.description || "").trim();
    const paragraphs = rawDesc
      ? rawDesc
          .split(/\n\s*\n/)
          .map((p: string) => p.trim())
          .filter(Boolean)
      : [];
    const subtitle = paragraphs.length > 0 ? paragraphs[0] : undefined;
    const fullContent =
      paragraphs.length > 1 ? paragraphs.slice(1) : undefined;

    const file = card.file;
    const fileUrl = file ? getStrapiMediaUrl(file) : undefined;
    const fileName =
      file?.name || (fileUrl ? "Notice Document.pdf" : undefined);
    const mime = file?.mime || "";
    const fileType = mime.includes("pdf")
      ? "PDF"
      : mime.toUpperCase() || (fileUrl ? "DOCUMENT" : undefined);

    return {
      id: card.id || idx + 1,
      newsId: `news-${card.id || idx + 1}`,
      title: card.heading || "News & Updates",
      subtitle,
      fullContent,
      date: card.date || "",
      category: card.category?.trim() || "Circulars & Notices",
      hasDocument: Boolean(fileUrl),
      documentName: fileName,
      documentType: fileType,
      documentUrl: fileUrl,
    };
  });

  const uniqueCategories = Array.from(
    new Set(articles.map((a) => a.category).filter(Boolean))
  );
  const categories = ["All", ...uniqueCategories];

  return {
    ...raw,
    news_hero: hero,
    news_update_card: cards,

    // Mapped convenience fields
    bannerTitle: hero?.title || "News & Updates",
    bannerImage: getStrapiMediaUrl(hero?.hero_background) || "",
    breadcrumb: hero?.Breadcrumbs || [
      "Home",
      "News and Events",
      "News and Updates",
    ],
    sectionLabel: "Official Announcements & Institutional Circulars",
    sectionHeading: "School Notices, Academic Bulletins & News",
    categories,
    articles,
  };
}

/**
 * Helper to format ISO date YYYY-MM-DD to human readable string
 */
function formatIsoDate(dateStr?: string): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  return dateStr;
}

/**
 * Fetch Publications Page Singleton Data (Hero, Publication Cards, Media & Documents)
 */
export async function getPublicationsPageData(): Promise<PublicationsPageData | null> {
  const query = [
    "populate[publication_hero][populate][hero_background][fields][0]=url",
    "populate[publication_hero][populate][hero_background][fields][1]=alternativeText",
    "populate[publication_card][populate][image][fields][0]=url",
    "populate[publication_card][populate][image][fields][1]=alternativeText",
    "populate[publication_card][populate][document][fields][0]=url",
    "populate[publication_card][populate][document][fields][1]=name",
    "populate[publication_card][populate][document][fields][2]=mime",
  ].join("&");

  const raw = await fetchStrapi<any>(`publications-page?${query}`, ["publications-page"]);
  if (!raw) return null;

  const hero = raw.publication_hero;
  const cards: any[] = raw.publication_card || [];

  const publications: Publication[] = cards.map((card, idx) => {
    const title = card.heading || "School Publication";
    const category = card.category?.trim() || "Publications";
    const date = formatIsoDate(card.publish_date) || card.publish_date || "";
    const coverUrl = getStrapiMediaUrl(card.image) || "";
    const docUrl = getStrapiMediaUrl(card.document) || "";
    const docName = card.document?.name || `${title.replace(/\s+/g, "_")}.pdf`;

    return {
      id: `pub-${card.id || idx + 1}`,
      title,
      category,
      edition: "",
      publishedDate: date,
      academicYear: "",
      pages: 0,
      fileSize: card.document?.mime ? "PDF Document" : "1 MB",
      format: "PDF",
      language: "English",
      description: title,
      highlights: [],
      coverImage: coverUrl,
      pdfUrl: docUrl || undefined,
      downloadFileName: docName,
      editorOrAuthor: "",
      featured: false,
    };
  });

  const uniqueCategories = Array.from(
    new Set(publications.map((p) => p.category).filter(Boolean))
  );
  const categories = ["All", ...uniqueCategories];

  return {
    ...raw,
    publication_hero: hero,
    publication_card: cards,

    // Mapped convenience fields
    bannerTitle: hero?.title || "Publications",
    bannerImage: getStrapiMediaUrl(hero?.hero_background) || "",
    breadcrumb: hero?.Breadcrumbs || ["Home", "News and Events", "Publications"],
    categories,
    publications,
  };
}

/**
 * Fetch Clubs & Activities Page Singleton Data (Hero, Clubs List)
 */
export async function getClubsPageData(): Promise<ClubsPageData | null> {
  const query = [
    "populate[Clubs_Activities_Card][populate][hero_background][fields][0]=url",
    "populate[Clubs_Activities_Card][populate][hero_background][fields][1]=alternativeText",
    "populate[Clubs_Card][populate][image][fields][0]=url",
    "populate[Clubs_Card][populate][image][fields][1]=alternativeText",
  ].join("&");

  const raw = await fetchStrapi<any>(`clubs-page?${query}`, ["clubs-page"]);
  if (!raw) return null;

  const hero = raw.Clubs_Activities_Card;
  const cards: any[] = raw.Clubs_Card || [];

  const clubs: Club[] = cards.map((card, idx) => {
    const title = card.heading || "Student Club";
    const category = card.category?.trim() || "Activities";
    const desc = card.description || "";
    const imageUrl = getStrapiMediaUrl(card.image) || "/images/banner_images/banner.jpg";

    return {
      id: `club-${card.id || idx + 1}`,
      name: title,
      category,
      description: desc,
      image: imageUrl,
      meetingSchedule: "",
      location: "",
      mentor: "",
      mentorRole: "",
      membersCount: 0,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      accentGradient: "from-blue-600 to-indigo-700",
      recentHighlight: "",
    };
  });

  const uniqueCategories = Array.from(
    new Set(clubs.map((c) => c.category).filter(Boolean))
  );
  const categories = ["All", ...uniqueCategories];

  return {
    ...raw,
    Clubs_Activities_Card: hero,
    Clubs_Card: cards,

    // Mapped convenience fields
    bannerTitle: hero?.title || "Clubs & Activities",
    bannerImage: getStrapiMediaUrl(hero?.hero_background) || "",
    breadcrumb: hero?.Breadcrumbs || ["Home", "Clubs & Activities"],
    overviewHeading: "Beyond the Textbook: Cultivating Curiosity, Leadership & Passion",
    overviewDescription: "At Kids' Foundation School, learning extends far beyond academic syllabi. Our vibrant clubs and student societies provide every learner the space to discover hidden talents, collaborate with peers across grades, compete in state and national arenas, and build lifelong self-confidence.",
    categories,
    clubs,
  };
}

/**
  * Fetch Contact Page Singleton Data (Banner, Contact Items, Form info, Map)
  */
export async function getContactPageData(): Promise<ContactPageData | null> {
  const query = "populate[contactItems]=true";
  return fetchStrapi<ContactPageData>(`contact-page?${query}`, ["contact-page"]);
}



