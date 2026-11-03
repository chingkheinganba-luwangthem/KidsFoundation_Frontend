import { NewsItemData, NewsUpdateItem } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

/**
 * Robust date parser for news circulars:
 * Supports standard dates ("October 25, 2026", "2026-10-25")
 * as well as slash/hyphen formats ("25/10/26", "25/10/2026", "25-10-2026").
 */
export function parseNoticeDate(dateStr?: string, fallbackIndex = 0): number {
  if (!dateStr) return fallbackIndex ? -fallbackIndex : 0;

  const trimmed = dateStr.trim();

  // 1. Try standard Date parsing (e.g., "October 25, 2026", "2026-10-25")
  const standardTime = new Date(trimmed).getTime();
  if (!isNaN(standardTime) && standardTime > 0) {
    return standardTime;
  }

  // 2. Try DD/MM/YYYY or DD/MM/YY (e.g., "25/10/26", "25/10/2026", "25-10-2026")
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    let year = parseInt(dmyMatch[3], 10);
    if (year < 100) {
      year = year < 50 ? 2000 + year : 1900 + year;
    }
    const dmyTime = new Date(year, month, day).getTime();
    if (!isNaN(dmyTime) && dmyTime > 0) {
      return dmyTime;
    }
  }

  return fallbackIndex ? -fallbackIndex : 0;
}

/**
 * Formats YYYY-MM-DD from Strapi's datepicker to human-readable "Month DD, YYYY"
 */
export function formatDisplayDate(dateStr?: string): string {
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
 * Format and sort articles from Strapi news-page:
 * - Computes dynamic `isLatest` based on 14-day threshold (or configurable latestDaysThreshold).
 * - Sorts newest upload / latest date to appear at the very top.
 * - Extracts attachments, PDF URLs, and metadata.
 */
export function formatAndSortNewsArticles(
  rawArticles?: NewsItemData[],
  defaultThresholdDays: number = 14,
  currentTimestamp?: number
): NewsUpdateItem[] {
  if (!rawArticles || rawArticles.length === 0) {
    return [];
  }

  // Avoid unstable Date.now() evaluation during server prerender of Client Components
  const now =
    currentTimestamp ??
    (typeof window !== "undefined" ? Date.now() : undefined);

  const formatted: NewsUpdateItem[] = rawArticles.map((item, idx) => {
    const sortId = typeof item.id === "number" ? item.id : idx;
    const pdfUrl = item.documentUrl || getStrapiMediaUrl(item.noticePdf);
    const docName =
      item.documentName ||
      item.noticePdf?.name ||
      (pdfUrl ? "Download Notice Document.pdf" : undefined);
    const docSize =
      item.documentSize ||
      (item.noticePdf?.size
        ? `${Math.round(item.noticePdf.size)} KB`
        : undefined);
    const hasDocument = Boolean(
      item.hasDocument || pdfUrl || item.documentName
    );

    const timestamp = parseNoticeDate(item.date, idx);
    const itemDaysThreshold = item.daysToShowLatest ?? defaultThresholdDays;

    let isLatest = item.isLatest !== false;
    if (now !== undefined && timestamp > 0) {
      const diffMs = now - timestamp;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      // Dynamic 14-day rule:
      // Notice shows "• LATEST" if within `itemDaysThreshold` days (and not explicitly false)
      // Once diffDays > itemDaysThreshold, the latest mark disappears automatically.
      const isWithinDays = diffDays <= itemDaysThreshold && diffDays >= 0;
      isLatest = isLatest && isWithinDays;
    }
    return {
      id: item.newsId || `news-${item.id || idx}`,
      sortId,
      title: item.title,
      subtitle: item.subtitle || undefined,
      date: formatDisplayDate(item.date),
      timestamp,
      category: (item.category || "Circulars & Notices") as NewsUpdateItem["category"],
      hasDocument,
      documentName: docName,
      documentSize: docSize,
      documentType: item.documentType || (pdfUrl ? "PDF" : undefined),
      documentUrl: pdfUrl || undefined,
      fullContent: item.fullContent || undefined,
      noticeImage:
        item.noticeImageUrl ||
        getStrapiMediaUrl(item.noticeImage) ||
        undefined,
      isLatest,
    };
  });

  // Sort latest on top:
  // 1. Primary: timestamp descending (latest posted date at top)
  // 2. Secondary: sortId descending (most recently uploaded on top if same date)
  return formatted.sort((a, b) => {
    if (b.timestamp !== a.timestamp) {
      return b.timestamp - a.timestamp;
    }
    return (b.sortId ?? 0) - (a.sortId ?? 0);
  });
}
