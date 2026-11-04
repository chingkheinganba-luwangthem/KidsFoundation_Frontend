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
  LearningContentBlock,
  CampusPageData,
  GalleryCardItem,
  ActivityItemData,
  SportsArtsPageData,
  GalleryPageData,
  GalleryPageImageItem,
  AdmissionPageData,
  AdmissionDownloadButton,
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
  ContactItemData,
  StrapiContactPageRaw,
  MandatoryDisclosurePageData,
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
      cache: "no-store",
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
  const query = [
    "populate[logo][fields][0]=url",
    "populate[logo][fields][1]=alternativeText",
    "populate[menu_item][populate][children]=true",
  ].join("&");

  return fetchStrapi<HeaderData>(`header?${query}`, ["header"]);
}

/**
 * Fetch Footer Singleton Data (Tagline, CBSE, Logo, FooterBg, Quick Links, Important Links, Contacts, Socials)
 */
export async function getFooterData(): Promise<FooterData | null> {
  const query = [
    "populate[button]=true",
    "populate[Footer_card][populate][logo][fields][0]=url",
    "populate[Footer_card][populate][logo][fields][1]=alternativeText",
    "populate[Footer_card][populate][social_link][populate][icon][fields][0]=url",
    "populate[Footer_card][populate][social_link][populate][icon][fields][1]=alternativeText",
    "populate[Footer_card][populate][Links][populate][Name_url]=true",
    "populate[Footer_card][populate][Contact_us][populate][heading_desc]=true",
    "populate[Background_image][fields][0]=url",
    "populate[Background_image][fields][1]=alternativeText",
  ].join("&");

  return fetchStrapi<FooterData>(`footer?${query}`, ["footer"]);
}

/**
 * Fetch Home Page Singleton Data (Hero, Slider, Buttons, Excellence Banner)
 */
export async function getHomePageData(): Promise<HomePageData | null> {
  const query = [
    "populate[Slider][fields][0]=url",
    "populate[Slider][fields][1]=alternativeText",
    "populate[button]=true",
    "populate[Twenty_Years][populate][image1][fields][0]=url",
    "populate[Twenty_Years][populate][image1][fields][1]=alternativeText",
    "populate[Twenty_Years][populate][image2][fields][0]=url",
    "populate[Twenty_Years][populate][image2][fields][1]=alternativeText",
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

  // 4. Map Twenty_Years / Excellence Banner
  const ty = raw.Twenty_Years;
  const bgImg = ty?.image1 ? getStrapiMediaUrl(ty.image1) : "";
  const fillImg = ty?.image2 ? getStrapiMediaUrl(ty.image2) : "";

  const excellenceBanner: ExcellenceBannerData = {
    eyebrow: ty?.eyebrow || "A LEGACY OF LEARNING AND EXCELLENCE",
    subtitle: ty?.eyebrow || "A LEGACY OF LEARNING AND EXCELLENCE",
    heading: ty?.heading || "Years of Academic Excellence.",
    description:
      ty?.description ||
      "For over two decades, we've nurtured curiosity, inspired confidence, and helped young minds discover their potential.",
    image1: ty?.image1 || null,
    image2: ty?.image2 || null,
    bgImageUrl: bgImg,
    fillImageUrl: fillImg,
    emblemImageUrl: fillImg,
    yearsEmblem: "20+",
    yearsLabel: "Years",
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
  
  // Intelligent parser for founder message containing paragraphs, bullet points, and closing statement
  const parseFounderDesc = (text: string) => {
    if (!text) {
      return {
        welcome: "",
        paragraphs: [] as string[],
        commitmentsHeading: "",
        commitments: [] as string[],
        closing: "",
      };
    }

    const lines = text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const paragraphs: string[] = [];
    let currentPara: string[] = [];
    let commitmentsHeading = "";
    const commitments: string[] = [];
    const closingLines: string[] = [];
    let inBullets = false;
    let inClosing = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.toLowerCase().startsWith("as we look to the future")) {
        if (currentPara.length) {
          paragraphs.push(currentPara.join(" "));
          currentPara = [];
        }
        commitmentsHeading = line;
        inBullets = true;
        continue;
      }

      if (inBullets) {
        if (
          line.toLowerCase().startsWith("to our prospective") ||
          line.toLowerCase().startsWith("together, let us")
        ) {
          inBullets = false;
          inClosing = true;
          closingLines.push(line);
        } else {
          commitments.push(line.replace(/^[•\-\*]\s*/, ""));
        }
        continue;
      }

      if (inClosing) {
        closingLines.push(line);
        continue;
      }

      const isNewParaStart =
        line.startsWith("At Kids' Foundation") ||
        line.startsWith("At Kids Foundation") ||
        line.startsWith("Our CBSE-affiliated") ||
        line.startsWith("Our CBSE affiliated") ||
        line.startsWith("Our school's core values") ||
        line.startsWith("Our school core values");

      if (isNewParaStart && currentPara.length > 0) {
        paragraphs.push(currentPara.join(" "));
        currentPara = [line];
      } else {
        currentPara.push(line);
      }
    }

    if (currentPara.length) {
      paragraphs.push(currentPara.join(" "));
    }

    const welcome = paragraphs.length > 0 ? paragraphs[0] : "";
    const remainingParas = paragraphs.slice(1);

    return {
      welcome,
      paragraphs: remainingParas,
      commitmentsHeading:
        commitmentsHeading || "As we look to the future, we remain committed to:",
      commitments,
      closing: closingLines.join(" "),
    };
  };

  const parsedFounder = parseFounderDesc(founderDesc);

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
    founderHeading: founderDetails?.heading || "Message From The Founder",
    founderWelcome: parsedFounder.welcome,
    founderParagraphs: parsedFounder.paragraphs,
    founderQuote: "",
    founderCommitmentsHeading: parsedFounder.commitmentsHeading,
    founderCommitments: parsedFounder.commitments,
    founderClosing: parsedFounder.closing,
    founderName: founderSec?.name || "",
    founderRole: founderSec?.designation || "",
    founderInstitution: founderSec?.description || "",
    founderImage: founderDetails?.image,
  };
}

/**
 * Helper to parse a stage's description text into structured blocks (paragraphs, lead-ins, bullet lists)
 */
function parseStageContent(rawDesc: string) {
  if (!rawDesc) {
    return {
      blocks: [] as LearningContentBlock[],
      boldIntro: undefined,
      description: [] as string[],
      activities: [] as string[],
      bottomText: undefined,
    };
  }

  const lines = rawDesc
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const isLeadIn = (l: string) => {
    const low = l.toLowerCase();
    return (
      low.includes("caters to the following developments") ||
      low.startsWith("these learning activities are based on") ||
      low.startsWith("this stage focuses on preparing the child") ||
      low.startsWith("the outcome of these") ||
      low.startsWith("the evaluation and assessment of this stage") ||
      low.startsWith("the key obectives are to form") ||
      low.startsWith("the key objectives are to form")
    );
  };

  const isBulletStart = (l: string) => {
    const low = l.toLowerCase();
    return (
      low.startsWith("develops cognitive") ||
      low.startsWith("enhances language") ||
      low.startsWith("encourages exploration") ||
      low.startsWith("builds foundational") ||
      low.startsWith("integrates art,") ||
      low.startsWith("emphasizes social and") ||
      low.startsWith("confident, curious,") ||
      low.startsWith("provide strong foundation") ||
      low.startsWith("develop social skills") ||
      low.startsWith("assessment is done in a continuous") ||
      low.startsWith("consolidates reading") ||
      low.startsWith("introduces basic concepts") ||
      low.startsWith("develops critical thinking") ||
      low.startsWith("encourages creativity,") ||
      low.startsWith("fosters social and emotional") ||
      low.startsWith("emphasizes experiential") ||
      low.startsWith("confident, expressive,") ||
      low.startsWith("strong foundation in core") ||
      low.startsWith("a developed critical thinking") ||
      low.startsWith("multidisciplinary education") ||
      low.startsWith("critical thinking and problem-solving") ||
      low.startsWith("confident, informed,") ||
      low.startsWith("strong foundation for secondary") ||
      low.startsWith("developed critical thinking and life")
    );
  };

  const isParagraphStart = (l: string) => {
    const low = l.toLowerCase();
    return (
      low.startsWith("the foundational stage") ||
      low.startsWith("in kids' foundation") ||
      low.startsWith("in kids foundation") ||
      low.startsWith("this stage sets the foundation") ||
      low.startsWith("the preparatory stage") ||
      low.startsWith("the middle stage") ||
      low.startsWith("the assessment of the students") ||
      low.startsWith("this stage prepares students") ||
      low.startsWith("at kids' foundation") ||
      low.startsWith("at kids foundation") ||
      low.startsWith("beyond academics") ||
      low.startsWith("our supportive environment") ||
      low.startsWith("assessment is done continuously") ||
      low.startsWith("join kids' foundation") ||
      low.startsWith("join kids foundation") ||
      low.startsWith("our school proudly offers")
    );
  };

  const blocks: LearningContentBlock[] = [];
  let currentBullets: string[] = [];
  let currentPara: string[] = [];

  const flushBullets = () => {
    if (currentBullets.length) {
      blocks.push({ type: "bullets", items: currentBullets });
      currentBullets = [];
    }
  };

  const flushPara = () => {
    if (currentPara.length) {
      blocks.push({ type: "paragraph", text: currentPara.join(" ") });
      currentPara = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (
      line.toLowerCase().startsWith("these learning activities are based on") &&
      i + 1 < lines.length &&
      lines[i + 1].toLowerCase().includes("caters to the following developments")
    ) {
      flushBullets();
      flushPara();
      blocks.push({
        type: "lead_in",
        text: "These learning activities are based on playway method of teaching and caters to the following developments-",
      });
      i++;
      continue;
    }

    if (isLeadIn(line)) {
      flushBullets();
      flushPara();
      const clean = line.replace(/[-:]\s*$/, "").trim();
      blocks.push({ type: "lead_in", text: `${clean} -` });
      continue;
    }

    if (isBulletStart(line)) {
      flushPara();
      currentBullets.push(line);
      continue;
    }

    if (isParagraphStart(line)) {
      flushBullets();
      flushPara();
      currentPara.push(line);
      continue;
    }

    if (currentBullets.length > 0) {
      currentBullets[currentBullets.length - 1] += ` ${line}`;
    } else {
      currentPara.push(line);
    }
  }

  flushBullets();
  flushPara();

  const description: string[] = [];
  const activities: string[] = [];
  let boldIntro: string | undefined = undefined;
  let bottomText: string | undefined = undefined;

  for (const block of blocks) {
    if (block.type === "paragraph" && block.text) {
      if (!boldIntro && block.text.length < 120 && (block.text.length < 80 || block.text.endsWith("."))) {
        boldIntro = block.text;
      } else {
        description.push(block.text);
      }
    } else if (block.type === "bullets" && block.items) {
      activities.push(...block.items);
    }
  }

  return { blocks, boldIntro, description, activities, bottomText };
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

  // Identify intro block: the first item in common_content
  const introBlock = commonContent.length > 0 ? commonContent[0] : null;
  const stageBlocks = commonContent.length > 1 ? commonContent.slice(1) : [];

  const stages = stageBlocks.map((st, idx) => {
    const parsed = parseStageContent(st.description || "");
    let heading = (st.heading || "").trim();
    if (!heading) {
      if (st.description?.toLowerCase().includes("middle stage") || st.eyebrow?.includes("6-8")) {
        heading = "Middle Stage";
      } else if (idx === 0) {
        heading = "Foundational Stage";
      } else if (idx === 1) {
        heading = "Preparatory Stage";
      } else if (idx === 2) {
        heading = "Middle Stage";
      } else if (idx === 3) {
        heading = "Secondary Stage";
      } else {
        heading = `Stage ${idx + 1}`;
      }
    }

    const eyebrow = (st.eyebrow || "").trim();
    const stageId = heading
      ? heading
          .toLowerCase()
          .replace(/learning/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      : `stage-${idx + 1}`;

    return {
      id: st.id || idx + 1,
      stageId: stageId || `stage-${idx + 1}`,
      title: heading,
      eyebrow,
      subLabel: eyebrow,
      blocks: parsed.blocks,
      boldIntro: parsed.boldIntro,
      description: parsed.description,
      activities: parsed.activities.length > 0 ? parsed.activities : undefined,
      bottomText: parsed.bottomText,
      image: st.image,
      imageAlt: st.image?.alternativeText || heading,
    };
  });

  const cleanIntroText = (introBlock?.description || "")
    .replace(/\r\n/g, "\n")
    .replace(/([^\n])\n([^\n])/g, "$1 $2")
    .trim();

  return {
    ...raw,
    learning_hero: hero,
    common_content: commonContent,

    // Mapped convenience fields strictly from Strapi
    pageTitle: hero?.title || "Learning",
    breadcrumb: hero?.Breadcrumbs || ["Learning"],
    introLabel: (introBlock?.eyebrow || "").trim(),
    introHeading: (introBlock?.heading || "").trim(),
    introText: cleanIntroText,
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

  const rawButtons: any[] = Array.isArray(admission?.admissionbutton)
    ? admission.admissionbutton
    : admission?.admissionbutton
    ? [admission.admissionbutton]
    : [];

  const downloadButtons: AdmissionDownloadButton[] = rawButtons
    .map((btn: any) => {
      const file = btn?.download;
      const href = file ? getStrapiMediaUrl(file) : "";
      const label = btn?.text?.trim() || "Download Admission Form";
      return {
        id: btn?.id,
        label,
        href,
      };
    })
    .filter((b) => Boolean(b.href) && b.href !== "#");

  const primaryDownload = downloadButtons[0];
  const downloadUrl = primaryDownload?.href || "";
  const downloadLabel = primaryDownload?.label || "Download Admission Form";

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
      downloadButtons,
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
  if (!dateStr || !dateStr.trim()) {
    return { month: "", day: "", year: "", formatted: "" };
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
    const parts = dateStr.trim().split(" ");
    return {
      month: parts[0]?.slice(0, 3) ?? "",
      day: parts[1]?.replace(",", "") ?? "",
      year: parts[2] ?? "",
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

    const imagesRaw = Array.isArray(card.image)
      ? card.image
      : card.image
      ? [card.image]
      : [];
    const imagesList: string[] = imagesRaw
      .map((img: any) => getStrapiMediaUrl(img) || "")
      .filter(Boolean);
    const imageUrl = imagesList[0] || getStrapiMediaUrl(card.image) || "";
    const imageAlt =
      imagesRaw[0]?.alternativeText || card.heading || "Event image";

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
      images: imagesList.length > 0 ? imagesList : imageUrl ? [imageUrl] : [],
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
    const category = (card.Category || card.category || "").trim() || "Activities";
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
    clubs_description: raw.clubs_description || "",
    description: raw.clubs_description || "",
    categories,
    clubs,
  };
}

/**
 * Helper to extract src from an iframe HTML string, or return the string as is if already a URL
 */
function extractIframeSrc(input?: string | null): string {
  if (!input) return "";
  const match = input.match(/src=["'](.*?)["']/);
  return match ? match[1] : input.trim();
}

/**
  * Fetch Contact Page Singleton Data (Banner, Contact Items, Form info, Map)
  */
export async function getContactPageData(): Promise<ContactPageData | null> {
  const query = [
    "populate[contact_hero][populate][hero_background][fields][0]=url",
    "populate[contact_hero][populate][hero_background][fields][1]=alternativeText",
    "populate[get_in_Touch]=true",
    "populate[send_message]=true",
    "populate[visit]=true",
  ].join("&");

  const raw = await fetchStrapi<StrapiContactPageRaw>(`contact-page?${query}`, ["contact-page"]);
  if (!raw) return null;

  const hero = raw.contact_hero;
  const git = raw.get_in_Touch;
  const smList = Array.isArray(raw.send_message)
    ? raw.send_message
    : raw.send_message
    ? [raw.send_message]
    : [];
  const sm = smList[0];
  const visit = raw.visit;

  const contactItems: ContactItemData[] = [];
  if (git?.address_desc) {
    contactItems.push({
      icon: "map-pin",
      label: git.address || "Address",
      value: git.address_desc,
    });
  }
  if (git?.mobile_input) {
    contactItems.push({
      icon: "smartphone",
      label: git.Mobile || "Mobile",
      value: git.mobile_input,
    });
  }
  if (git?.phone_input) {
    contactItems.push({
      icon: "phone",
      label: git.phone || "Phone",
      value: git.phone_input,
    });
  }
  if (git?.email_input) {
    contactItems.push({
      icon: "mail",
      label: git.email || "Email",
      value: git.email_input,
    });
  }
  if (git?.time) {
    contactItems.push({
      icon: "clock",
      label: git.OfiiceHr || "Office Hours",
      value: git.time,
    });
  }

  return {
    id: raw.id,
    documentId: raw.documentId,
    bannerTitle: hero?.title || "Contact Us",
    breadcrumb:
      hero?.Breadcrumbs && hero.Breadcrumbs.length > 0
        ? hero.Breadcrumbs
        : ["Home", "Contact"],
    bannerImage: hero?.hero_background,
    bannerImageUrl: getStrapiMediaUrl(hero?.hero_background) || undefined,
    getInTouchLabel: git?.eyebrow || undefined,
    getInTouchHeading: git?.heading || undefined,
    getInTouchDescription: git?.description || undefined,
    contactItems,
    formEyebrow: sm?.eyebrow || undefined,
    formHeading: sm?.heading || undefined,
    formDescription: sm?.description || undefined,
    mapLabel: visit?.eyebrow || undefined,
    mapHeading: visit?.heading || undefined,
    mapAddress: visit?.description || undefined,
    mapEmbedUrl: extractIframeSrc(visit?.mapEmbedUrl),
    mapDirectUrl: visit?.mapLink || undefined,
    mapTitle: visit?.heading ? `${visit.heading} Location` : undefined,
  };
}

/**
 * Fetch Mandatory Public Disclosure Page Singleton Data
 */
export async function getMandatoryDisclosurePageData(): Promise<MandatoryDisclosurePageData | null> {
  const query = [
    "populate[Hero][populate][hero_background][fields][0]=url",
    "populate[Hero][populate][hero_background][fields][1]=alternativeText",
    "populate[Table][populate][Row_heading][populate][row_data][populate][download][fields][0]=url",
    "populate[Table][populate][Row_heading][populate][row_data][populate][download][fields][1]=name",
    "populate[Table][populate][Row_heading][populate][row_data][populate][download][fields][2]=mime",
    "populate[Result][populate][Result][populate][ResultTableRowData]=true",
  ].join("&");

  return fetchStrapi<MandatoryDisclosurePageData>(`mandatory-public-disclosure?${query}`, ["mandatory-public-disclosure"]);
}



