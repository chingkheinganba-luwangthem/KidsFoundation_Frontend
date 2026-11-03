import { Publication } from "@/types/strapi";

export function downloadPublicationFile(pub: Publication) {
  const fileUrl = pub.pdfUrl || (pub.downloadFileName ? `/documents/publications/${pub.downloadFileName}` : "");
  if (!fileUrl) return;
  const a = document.createElement("a");
  a.href = fileUrl;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  if (pub.downloadFileName) {
    a.download = pub.downloadFileName;
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

