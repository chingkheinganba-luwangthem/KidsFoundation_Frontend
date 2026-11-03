import { NewsUpdateItem } from "@/types/strapi";

export function downloadNoticeDocument(item: NewsUpdateItem) {
  if (item.documentUrl) {
    const a = document.createElement("a");
    a.href = item.documentUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    if (item.documentName) {
      a.download = item.documentName;
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  if (item.noticeImage) {
    const a = document.createElement("a");
    a.href = item.noticeImage;
    a.download = item.documentName || "Kids_Foundation_Notice.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  const content = `================================================================================
KIDS' FOUNDATION SCHOOL, IMPHAL
Airport Road, Ghari, Imphal-West, Manipur - 795001, India
Affiliated to CBSE, New Delhi | Affiliation No: 1230049 | Estd. 2005
Website: https://kidsfoundation.edu.in | Email: kidsfoundationghari@gmail.com
================================================================================

OFFICIAL INSTITUTIONAL PUBLICATION

Title:          ${item.title}
Subtitle:       ${item.subtitle || "Official School Announcement"}
Date:           ${item.date}
Category:       ${item.category}
Document Name:  ${item.documentName || "Kids_Foundation_Document.pdf"}

--------------------------------------------------------------------------------
CONTENT & DETAILS:
--------------------------------------------------------------------------------
${(item.fullContent || [item.title]).map((para, i) => `\n[${i + 1}] ${para}`).join("\n")}

--------------------------------------------------------------------------------
This document is an authorized official publication of Kids' Foundation School.
For enquiries or clarification, please contact the administrative desk.

All Rights Reserved © ${new Date().getFullYear()} Kids' Foundation School.
================================================================================
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const fileName = item.documentName
    ? item.documentName.replace(/\.pdf$/i, ".txt")
    : `Kids_Foundation_${item.id}.txt`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
