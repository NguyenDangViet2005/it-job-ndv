import { Metadata } from "next";

export interface MetadataOptions {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
}

const defaultKeywords = [
  "Tuyển dụng IT",
  "Tìm việc làm IT",
  "Việc làm lập trình viên",
  "Tuyển dụng ReactJS",
  "Tuyển dụng Node.js",
  "Việc làm Frontend",
  "Việc làm Backend",
  "Việc làm Fullstack",
  "Việc làm IT Hà Nội",
  "Việc làm IT TP.HCM",
  "IT Job Việt Nam",
];

const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }
  return "https://it-job-ndv.vercel.app";
};

export const getMetadata = (
  options: string | MetadataOptions,
  fallbackDesc?: string
): Metadata => {
  const opts: MetadataOptions =
    typeof options === "string"
      ? { title: options, description: fallbackDesc }
      : options;

  const siteUrl = getSiteUrl();
  const { title, description, image, path = "", noIndex = false, keywords } = opts;
  const desc = description || title;
  const pageKeywords = keywords && keywords.length > 0 ? keywords : defaultKeywords;
  
  const rawImage = image || "/media/open-graph.webp";
  const absoluteImageUrl = rawImage.startsWith("http")
    ? rawImage
    : `${siteUrl}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  const pageUrl = path ? `${siteUrl}${path.startsWith("/") ? path : `/${path}`}` : siteUrl;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description: desc,
    keywords: pageKeywords,
    alternates: {
      canonical: pageUrl,
    },
    icons: {
      icon: [
        { url: "/icons/icon.svg", sizes: "any" },
        { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
    },
    openGraph: {
      title,
      description: desc,
      url: pageUrl,
      siteName: "IT Job",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [absoluteImageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
};
