import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BackToTopButton } from "@/components/ui/BackToTopButton";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getHeaderData, getFooterData, getHomePageData } from "@/lib/strapi";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const instant = false;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kidsfoundation.globizsapp.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Kids' Foundation | Best School in Imphal, Manipur",
  description:
    "Kids' Foundation School, Imphal — Nurturing curious, confident, and capable learners in Manipur since 2005.",
  keywords: [
    "Kids Foundation",
    "Kids Foundation Imphal",
    "School in Imphal",
    "Best school in Manipur",
    "CBSE school Imphal",
    "Kids Foundation Ghari",
  ],
  authors: [{ name: "Kids' Foundation" }],
  openGraph: {
    title: "Kids' Foundation | Best School in Imphal, Manipur",
    description:
      "Kids' Foundation School, Imphal — Nurturing curious, confident, and capable learners in Manipur since 2005.",
    url: SITE_URL,
    siteName: "Kids' Foundation",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerData, footerData, homeData] = await Promise.all([
    getHeaderData(),
    getFooterData(),
    getHomePageData(),
  ]);

  return (
    <html lang="en" className={`${jakartaSans.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased text-[#17345F]" suppressHydrationWarning>
        <Header headerData={headerData} />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer
          footerData={footerData}
          admissionsData={homeData?.admissionsCta}
        />
        <BackToTopButton />
      </body>
    </html>
  );
}

